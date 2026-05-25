import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ExternalLink, Video } from "lucide-react";

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
import type { StatusAudiencia, TipoAudiencia } from "@prisma/client";

import { AudienciaForm } from "../_components/audiencia-form";

const STATUS_LABEL: Record<StatusAudiencia, string> = {
  AGENDADA: "Agendada",
  REALIZADA: "Realizada",
  ADIADA: "Adiada",
  CANCELADA: "Cancelada",
};

const TIPO_LABEL: Record<TipoAudiencia, string> = {
  CONCILIACAO: "Conciliação",
  INSTRUCAO: "Instrução",
  JULGAMENTO: "Julgamento",
  UNA: "Una",
  CUSTODIA: "Custódia",
  ARBITRAL: "Arbitral",
  OUTRA: "Outra",
};

function toDateTimeLocal(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

export default async function AudienciaDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [audiencia, processos, usuarios] = await Promise.all([
    prisma.audiencia.findUnique({
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

  if (!audiencia) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/audiencias">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">
              Audiência de {TIPO_LABEL[audiencia.tipo]}
            </h1>
            <Badge variant="outline">{STATUS_LABEL[audiencia.status]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {format(
              audiencia.dataHora,
              "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm",
              { locale: ptBR },
            )}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resumo</CardTitle>
          <CardDescription>Informações atuais da audiência.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <div className="text-xs text-muted-foreground">Processo</div>
            <div>
              <Link
                href={`/processos/${audiencia.processo.id}`}
                className="hover:underline"
              >
                {audiencia.processo.numeroCnj}
              </Link>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Responsável</div>
            <div>
              {audiencia.responsavel?.nome ?? (
                <span className="text-muted-foreground">Não definido</span>
              )}
            </div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs text-muted-foreground">
              {audiencia.virtual ? "Link da audiência" : "Local"}
            </div>
            <div>
              {audiencia.virtual ? (
                audiencia.linkVirtual ? (
                  <a
                    href={audiencia.linkVirtual}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <Video className="h-3 w-3" /> {audiencia.linkVirtual}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-muted-foreground">
                    Link não informado
                  </span>
                )
              ) : (
                (audiencia.local ?? "—")
              )}
            </div>
          </div>
          {audiencia.resultado ? (
            <div className="sm:col-span-2">
              <div className="text-xs text-muted-foreground">Resultado</div>
              <div className="whitespace-pre-wrap">{audiencia.resultado}</div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-medium">Editar audiência</h2>
        <AudienciaForm
          modo="editar"
          processos={processos}
          usuarios={usuarios}
          defaultValues={{
            id: audiencia.id,
            processoId: audiencia.processoId,
            tipo: audiencia.tipo,
            dataHora: toDateTimeLocal(audiencia.dataHora),
            virtual: audiencia.virtual,
            local: audiencia.local ?? "",
            linkVirtual: audiencia.linkVirtual ?? "",
            responsavelId: audiencia.responsavelId ?? "",
            observacoes: audiencia.observacoes ?? "",
          }}
        />
      </div>
    </div>
  );
}
