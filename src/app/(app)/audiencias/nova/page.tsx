import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

import { AudienciaForm } from "../_components/audiencia-form";

export default async function NovaAudienciaPage() {
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
          <Link href="/audiencias">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Nova audiência</h1>
          <p className="text-sm text-muted-foreground">
            Agende uma nova audiência vinculada a um processo.
          </p>
        </div>
      </div>

      <AudienciaForm modo="criar" processos={processos} usuarios={usuarios} />
    </div>
  );
}
