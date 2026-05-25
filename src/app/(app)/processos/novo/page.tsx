import Link from "next/link";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { ProcessoForm } from "../_components/processo-form";

export default async function NovoProcessoPage() {
  const [tribunais, varas, assuntos] = await Promise.all([
    prisma.tribunal.findMany({ orderBy: { sigla: "asc" } }),
    prisma.vara.findMany({ orderBy: { nome: "asc" } }),
    prisma.assunto.findMany({ orderBy: { nome: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Novo processo
        </h1>
        <Button asChild variant="ghost">
          <Link href="/processos">Voltar</Link>
        </Button>
      </div>

      <ProcessoForm
        tribunais={tribunais.map((t) => ({
          id: t.id,
          sigla: t.sigla,
          nome: t.nome,
        }))}
        varas={varas.map((v) => ({
          id: v.id,
          nome: v.nome,
          tribunalId: v.tribunalId,
        }))}
        assuntos={assuntos.map((a) => ({ id: a.id, nome: a.nome }))}
      />
    </div>
  );
}
