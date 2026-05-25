import { createClient } from "@/lib/supabase/server";
import type { Tag } from "@/lib/types";

export async function listTags(): Promise<Tag[]> {
  const supabase = createClient();
  const { data } = await supabase.from("tags").select("*").order("name");
  return (data ?? []) as Tag[];
}

export async function deleteTag(id: string) {
  const supabase = createClient();
  await supabase.from("tags").delete().eq("id", id);
}
