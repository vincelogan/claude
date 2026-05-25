import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

import { ProcessoForm } from "../../_components/processo-form";

export default async function EditarProcessoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [processo, tribunais, varas, assuntos] = await Promise.all([
    prisma.processo.findUnique({ where: { id } }),
    prisma.tribunal.findMany({ orderBy: { sigla: "asc" } }),
    prisma.vara.findMany({ orderBy: { nome: "asc" } }),
    prisma.assunto.findMany({ orderBy: { nome: "asc" } }),
  ]);

  if (!processo) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Editar processo
        </h1>
        <Button asChild variant="ghost">
          <Link href={`/processos/${id}`}>Voltar</Link>
        </Button>
      </div>

      <ProcessoForm
        processo={{
          id: processo.id,
          numeroCnj: processo.numeroCnj,
          numeroAntigo: processo.numeroAntigo,
          classeProcessual: processo.classeProcessual ?? "",
          tipo: processo.tipo,
          fase: processo.fase,
          status: processo.status,
          sigiloso: processo.sigiloso,
          valorCausa: processo.valorCausa
            ? processo.valorCausa.toString()
            : "",
          tribunalId: processo.tribunalId,
          varaId: processo.varaId,
          assuntoId: processo.assuntoId,
          observacoes: processo.observacoes,
        }}
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
