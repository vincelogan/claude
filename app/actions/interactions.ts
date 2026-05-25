"use server";
import { revalidatePath } from "next/cache";
import { createInteraction, markFollowUpDone } from "@/lib/db/interactions";
import { interactionInputSchema } from "@/lib/validation";

export async function createInteractionAction(formData: FormData) {
  const input = interactionInputSchema.parse({
    contact_id: formData.get("contact_id"),
    occurred_at: formData.get("occurred_at") || new Date().toISOString(),
    channel: formData.get("channel"),
    summary: formData.get("summary"),
    follow_up_at: formData.get("follow_up_at") || null,
  });
  await createInteraction(input);
  revalidatePath(`/contatos/${input.contact_id}`);
  revalidatePath("/agenda");
  revalidatePath("/");
}

export async function markFollowUpDoneAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  const contactId = formData.get("contact_id")?.toString();
  if (!id) return;
  await markFollowUpDone(id);
  revalidatePath("/agenda");
  if (contactId) revalidatePath(`/contatos/${contactId}`);
  revalidatePath("/");
}
