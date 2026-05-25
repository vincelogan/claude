"use server";
import { revalidatePath } from "next/cache";
import { createSegment, deleteSegment } from "@/lib/db/segments";
import { createProvider, deleteProvider } from "@/lib/db/providers";
import { deleteTag } from "@/lib/db/tags";
import type { SphereSlug } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export async function addSegmentAction(formData: FormData) {
  const sphere = formData.get("sphere") as SphereSlug;
  const name = (formData.get("name") || "").toString();
  if (name) await createSegment(sphere, name);
  revalidatePath("/config");
}

export async function removeSegmentAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (id) await deleteSegment(id);
  revalidatePath("/config");
}

export async function addProviderAction(formData: FormData) {
  const label = (formData.get("label") || "").toString();
  const url_template = (formData.get("url_template") || "").toString();
  const applies_to = (formData.get("applies_to") || "both").toString() as "person" | "company" | "both";
  if (label && url_template) {
    await createProvider({ label, url_template, applies_to, sort_order: 99 });
  }
  revalidatePath("/config");
}

export async function removeProviderAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (id) await deleteProvider(id);
  revalidatePath("/config");
}

export async function removeTagAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (id) await deleteTag(id);
  revalidatePath("/config");
}

export async function seedDefaultsAction() {
  const supabase = createClient();
  await supabase.rpc("seed_default_segments");
  await supabase.rpc("seed_default_search_providers");
  revalidatePath("/config");
}
