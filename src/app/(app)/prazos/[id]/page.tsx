import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, ChevronLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { PrazoForm } from "../_components/prazo-form";
import { descreverPrazo } from "../_lib/dias";

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  CUMPRIDO: "Cumprido",
  PRORROGADO: "Prorrogado",
  PERDIDO: "Perdido",
  CANCELADO: "Cancelado",
};

function toDateInput(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function PrazoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [prazo, processos, usuarios] = await Promise.all([
    prisma.prazo.findUnique({
      where: { id },
      include: {
        processo: { select: { id: true, numeroCnj: true } },
        responsavel: { select: { id: true, nome: true } },
      },
    }),
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

  if (!prazo) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/prazos">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{prazo.titulo}</h1>
            {prazo.fatal ? (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" /> FATAL
              </Badge>
            ) : null}
            <Badge variant="outline">
              {STATUS_LABEL[prazo.status] ?? prazo.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Vencimento em{" "}
            {format(prazo.dataVencimento, "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}{" "}
            ({descreverPrazo(prazo.dataVencimento)}).
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
          <CardDescription>Informações atuais do prazo.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <div className="text-xs text-muted-foreground">Processo</div>
            <div>
              {prazo.processo ? (
                <Link
                  href={`/processos/${prazo.processo.id}`}
                  className="hover:underline"
                >
                  {prazo.processo.numeroCnj}
                </Link>
              ) : (
                <span className="text-muted-foreground">Administrativo</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Responsável</div>
            <div>{prazo.responsavel.nome}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Data de início</div>
            <div>
              {format(prazo.dataInicio, "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Contagem</div>
            <div>{prazo.diasCorridos ? "Dias corridos" : "Dias úteis (CPC)"}</div>
          </div>
          {prazo.cumpridoEm ? (
            <div>
              <div className="text-xs text-muted-foreground">Cumprido em</div>
              <div>
                {format(prazo.cumpridoEm, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-medium">Editar prazo</h2>
        <PrazoForm
          modo="editar"
          processos={processos}
          usuarios={usuarios}
          defaultValues={{
            id: prazo.id,
            titulo: prazo.titulo,
            descricao: prazo.descricao ?? "",
            processoId: prazo.processoId ?? "",
            dataInicio: toDateInput(prazo.dataInicio),
            dataVencimento: toDateInput(prazo.dataVencimento),
            fatal: prazo.fatal,
            diasCorridos: prazo.diasCorridos,
            responsavelId: prazo.responsavelId,
            observacoes: prazo.observacoes ?? "",
          }}
        />
      </div>
    </div>
  );
}
