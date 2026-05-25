import { createClient } from "@/lib/supabase/server";
import type { Contact, ContactWithRelations, SphereSlug, Tag } from "@/lib/types";
import type { ContactInput } from "@/lib/validation";

export type ContactsFilter = {
  q?: string;
  sphere?: SphereSlug;
  segment_id?: string;
  tag?: string;
  state?: string;
  favorite?: boolean;
  kind?: "person" | "company";
};

export async function listContacts(filter: ContactsFilter = {}) {
  const supabase = createClient();
  let query = supabase
    .from("contacts")
    .select("*, contact_spheres(sphere_slug, segment_id), contact_tags(tag_id, tags(name))")
    .order("name", { ascending: true });

  if (filter.q) {
    const q = filter.q.replace(/[,()]/g, " ").trim();
    query = query.or(
      `name.ilike.%${q}%,company_name.ilike.%${q}%,email.ilike.%${q}%,city.ilike.%${q}%,notes.ilike.%${q}%`,
    );
  }
  if (filter.kind) query = query.eq("kind", filter.kind);
  if (filter.state) query = query.eq("state", filter.state.toUpperCase());
  if (filter.favorite) query = query.eq("is_favorite", true);

  const { data, error } = await query;
  if (error) throw error;
  let rows = (data ?? []) as any[];

  if (filter.sphere) {
    rows = rows.filter((r) =>
      r.contact_spheres?.some((cs: any) =>
        cs.sphere_slug === filter.sphere && (!filter.segment_id || cs.segment_id === filter.segment_id),
      ),
    );
  }
  if (filter.tag) {
    rows = rows.filter((r) => r.contact_tags?.some((ct: any) => ct.tags?.name === filter.tag));
  }

  return rows.map((r) => ({
    ...(r as Contact),
    spheres: (r.contact_spheres ?? []).map((cs: any) => ({
      sphere_slug: cs.sphere_slug,
      segment_id: cs.segment_id,
    })),
    tags: (r.contact_tags ?? []).map((ct: any) => ({ id: ct.tag_id, name: ct.tags?.name })),
  })) as ContactWithRelations[];
}

export async function getContact(id: string): Promise<ContactWithRelations | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*, contact_spheres(sphere_slug, segment_id, segments(name)), contact_tags(tag_id, tags(name))")
    .eq("id", id)
    .single();
  if (error) return null;
  return {
    ...(data as Contact),
    spheres: (data.contact_spheres ?? []).map((cs: any) => ({
      sphere_slug: cs.sphere_slug,
      segment_id: cs.segment_id,
      segment_name: cs.segments?.name ?? null,
    })),
    tags: (data.contact_tags ?? []).map((ct: any) => ({ id: ct.tag_id, name: ct.tags?.name })),
  } as ContactWithRelations;
}

async function syncTags(contactId: string, tagNames: string[]) {
  const supabase = createClient();
  const names = Array.from(new Set(tagNames.map((t) => t.trim()).filter(Boolean)));
  // upsert tag rows
  const existingTags: Tag[] = [];
  for (const name of names) {
    const { data, error } = await supabase
      .from("tags")
      .upsert({ name }, { onConflict: "owner_id,name" })
      .select("id,name")
      .single();
    if (!error && data) existingTags.push(data as Tag);
  }
  await supabase.from("contact_tags").delete().eq("contact_id", contactId);
  if (existingTags.length) {
    await supabase.from("contact_tags").insert(
      existingTags.map((t) => ({ contact_id: contactId, tag_id: t.id })),
    );
  }
}

async function syncSpheres(contactId: string, spheres: ContactInput["spheres"]) {
  const supabase = createClient();
  await supabase.from("contact_spheres").delete().eq("contact_id", contactId);
  if (spheres.length) {
    await supabase.from("contact_spheres").insert(
      spheres.map((s) => ({
        contact_id: contactId,
        sphere_slug: s.sphere_slug,
        segment_id: s.segment_id ?? null,
      })),
    );
  }
}

export async function createContact(input: ContactInput): Promise<string> {
  const supabase = createClient();
  const { spheres, tags, ...rest } = input;
  const { data, error } = await supabase
    .from("contacts")
    .insert({ ...rest, email: rest.email || null })
    .select("id")
    .single();
  if (error) throw error;
  await syncSpheres(data.id, spheres);
  await syncTags(data.id, tags);
  return data.id;
}

export async function updateContact(id: string, input: ContactInput) {
  const supabase = createClient();
  const { spheres, tags, ...rest } = input;
  const { error } = await supabase
    .from("contacts")
    .update({ ...rest, email: rest.email || null })
    .eq("id", id);
  if (error) throw error;
  await syncSpheres(id, spheres);
  await syncTags(id, tags);
}

export async function deleteContact(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleFavorite(id: string, value: boolean) {
  const supabase = createClient();
  await supabase.from("contacts").update({ is_favorite: value }).eq("id", id);
}

export async function countBySphere() {
  const supabase = createClient();
  const { data } = await supabase
    .from("contact_spheres")
    .select("sphere_slug, contact_id");
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as any[]) {
    counts[row.sphere_slug] = (counts[row.sphere_slug] ?? 0) + 1;
  }
  return counts;
}
