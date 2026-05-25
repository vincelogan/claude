import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

import { PrazoForm } from "../_components/prazo-form";

export default async function NovoPrazoPage() {
  const session = await auth();

  const [processos, usuarios] = await Promise.all([
    prisma.processo.findMany({
      where: { status: { in: ["ATIVO", "SUSPENSO"] } },
      orderBy: { numeroCnj: "asc" },
      select: { id: true, numeroCnj: true, classeProcessual: true },
      take: 500,
    }),
    prisma.usuario.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, email: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/prazos">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Novo prazo</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre um novo prazo processual ou administrativo.
          </p>
        </div>
      </div>

      <PrazoForm
        modo="criar"
        processos={processos}
        usuarios={usuarios}
        responsavelPadraoId={session?.user?.id}
      />
    </div>
  );
}
