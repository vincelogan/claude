import { createClient } from "@/lib/supabase/server";
import type { SearchProvider } from "@/lib/types";

export async function listProviders(): Promise<SearchProvider[]> {
  const supabase = createClient();
  const { data } = await supabase.from("search_providers").select("*").order("sort_order");
  return (data ?? []) as SearchProvider[];
}

export async function createProvider(p: Omit<SearchProvider, "id">) {
  const supabase = createClient();
  await supabase.from("search_providers").insert(p);
}

export async function deleteProvider(id: string) {
  const supabase = createClient();
  await supabase.from("search_providers").delete().eq("id", id);
}
