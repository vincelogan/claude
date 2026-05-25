import { listSegments } from "@/lib/db/segments";
import { ContactForm } from "@/components/contact-form";
import { createContactAction } from "@/app/actions/contacts";

export const dynamic = "force-dynamic";

export default async function NewContactPage() {
  const segments = await listSegments();
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Novo contato</h1>
      <ContactForm segments={segments} action={createContactAction} />
    </div>
  );
}
