import { createClient } from "@/lib/supabase/server";
import type { Segment, SphereSlug } from "@/lib/types";

export async function listSegments(sphere?: SphereSlug): Promise<Segment[]> {
  const supabase = createClient();
  let q = supabase.from("segments").select("*").order("sort_order");
  if (sphere) q = q.eq("sphere_slug", sphere);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Segment[];
}

export async function createSegment(sphere_slug: SphereSlug, name: string) {
  const supabase = createClient();
  const { error } = await supabase.from("segments").insert({ sphere_slug, name });
  if (error) throw error;
}

export async function deleteSegment(id: string) {
  const supabase = createClient();
  await supabase.from("segments").delete().eq("id", id);
}
