import { ImportClient } from "@/components/import-client";
import { listSegments } from "@/lib/db/segments";

export const dynamic = "force-dynamic";

export default async function ImportarPage() {
  const segments = await listSegments();
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Importar contatos</h1>
      <p className="text-sm text-neutral-500">
        Cole CSV (com headers <code>name, email, phone, company_name, ...</code>) ou conteúdo vCard (.vcf).
        Você verá uma prévia antes de gravar. Deduplicação por email/telefone.
      </p>
      <ImportClient segments={segments} />
    </div>
  );
}
