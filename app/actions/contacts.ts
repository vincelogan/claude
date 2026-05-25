"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createContact, deleteContact, toggleFavorite, updateContact } from "@/lib/db/contacts";
import { contactInputSchema } from "@/lib/validation";
import { createClient } from "@/lib/supabase/server";
import { detectFieldFromUrl } from "@/lib/search-providers";

function parseSpheres(formData: FormData) {
  // spheres encoded as JSON in field "spheres_json"
  const raw = formData.get("spheres_json")?.toString() || "[]";
  try { return JSON.parse(raw); } catch { return []; }
}
function parseTags(formData: FormData) {
  const raw = formData.get("tags")?.toString() ?? "";
  return raw.split(",").map((t) => t.trim()).filter(Boolean);
}

function buildInput(formData: FormData) {
  return contactInputSchema.parse({
    kind: formData.get("kind"),
    name: formData.get("name"),
    company_name: formData.get("company_name") || null,
    role: formData.get("role") || null,
    email: formData.get("email") || null,
    phone: formData.get("phone") || null,
    whatsapp: formData.get("whatsapp") || null,
    linkedin: formData.get("linkedin") || null,
    instagram: formData.get("instagram") || null,
    website: formData.get("website") || null,
    city: formData.get("city") || null,
    state: (formData.get("state") || "").toString().toUpperCase() || null,
    oab: formData.get("oab") || null,
    cnpj: formData.get("cnpj") || null,
    notes: formData.get("notes") || null,
    is_favorite: formData.get("is_favorite") === "on",
    spheres: parseSpheres(formData),
    tags: parseTags(formData),
  });
}

export async function createContactAction(formData: FormData) {
  const input = buildInput(formData);
  const id = await createContact(input);
  revalidatePath("/contatos");
  redirect(`/contatos/${id}`);
}

export async function updateContactAction(id: string, formData: FormData) {
  const input = buildInput(formData);
  await updateContact(id, input);
  revalidatePath(`/contatos/${id}`);
  redirect(`/contatos/${id}`);
}

export async function deleteContactAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) return;
  await deleteContact(id);
  revalidatePath("/contatos");
  redirect("/contatos");
}

export async function toggleFavoriteAction(formData: FormData) {
  const id = formData.get("id")?.toString();
  const value = formData.get("value")?.toString() === "true";
  if (!id) return;
  await toggleFavorite(id, value);
  revalidatePath(`/contatos/${id}`);
  revalidatePath("/contatos");
}

export async function pasteLinkAction(id: string, url: string) {
  const field = detectFieldFromUrl(url);
  if (!field) return { ok: false as const, message: "URL inválida" };
  const supabase = createClient();
  await supabase.from("contacts").update({ [field]: url }).eq("id", id);
  revalidatePath(`/contatos/${id}`);
  return { ok: true as const, field };
}
