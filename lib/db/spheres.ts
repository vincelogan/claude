import { createClient } from "@/lib/supabase/server";
import type { Sphere } from "@/lib/types";

export async function listSpheres(): Promise<Sphere[]> {
  const supabase = createClient();
  const { data } = await supabase.from("spheres").select("*").order("sort_order");
  return (data ?? []) as Sphere[];
}
