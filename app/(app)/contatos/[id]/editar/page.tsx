import { notFound } from "next/navigation";
import { listSegments } from "@/lib/db/segments";
import { getContact } from "@/lib/db/contacts";
import { ContactForm } from "@/components/contact-form";
import { updateContactAction } from "@/app/actions/contacts";

export const dynamic = "force-dynamic";

export default async function EditContactPage({ params }: { params: { id: string } }) {
  const [contact, segments] = await Promise.all([getContact(params.id), listSegments()]);
  if (!contact) notFound();
  const action = updateContactAction.bind(null, contact.id);
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Editar contato</h1>
      <ContactForm segments={segments} initial={contact} action={action} />
    </div>
  );
}
