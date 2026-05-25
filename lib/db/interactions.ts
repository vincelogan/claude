import { createClient } from "@/lib/supabase/server";
import type { Interaction } from "@/lib/types";
import type { InteractionInput } from "@/lib/validation";

export async function listInteractions(contactId: string): Promise<Interaction[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("interactions")
    .select("*")
    .eq("contact_id", contactId)
    .order("occurred_at", { ascending: false });
  return (data ?? []) as Interaction[];
}

export async function createInteraction(input: InteractionInput) {
  const supabase = createClient();
  const { error } = await supabase.from("interactions").insert({
    ...input,
    follow_up_at: input.follow_up_at || null,
  });
  if (error) throw error;
}

export async function markFollowUpDone(id: string) {
  const supabase = createClient();
  await supabase.from("interactions").update({ follow_up_done: true }).eq("id", id);
}

export async function listUpcomingFollowUps(limit?: number) {
  const supabase = createClient();
  let q = supabase
    .from("interactions")
    .select("*, contacts(id, name, kind)")
    .eq("follow_up_done", false)
    .not("follow_up_at", "is", null)
    .order("follow_up_at", { ascending: true });
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return (data ?? []) as (Interaction & { contacts: { id: string; name: string; kind: string } })[];
}
