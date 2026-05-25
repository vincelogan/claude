import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExternalLink, Plus, Video } from "lucide-react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Prisma,
  StatusAudiencia,
  TipoAudiencia,
} from "@prisma/client";

import { AudienciaRowActions } from "./_components/audiencia-row-actions";

type SearchParams = {
  status?: string;
  responsavelId?: string;
  periodo?: string;
  aba?: string;
};

const STATUS_VALIDOS: StatusAudiencia[] = [
  "AGENDADA",
  "REALIZADA",
  "ADIADA",
  "CANCELADA",
];

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

function statusVariant(
  status: StatusAudiencia,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "REALIZADA":
      return "secondary";
    case "CANCELADA":
      return "destructive";
    case "ADIADA":
      return "outline";
    default:
      return "default";
  }
}

function intervaloPeriodo(periodo: string | undefined): {
  gte?: Date;
  lte?: Date;
} {
  const agora = new Date();
  switch (periodo) {
    case "hoje": {
      const ini = new Date(agora);
      ini.setHours(0, 0, 0, 0);
      const fim = new Date(agora);
      fim.setHours(23, 59, 59, 999);
      return { gte: ini, lte: fim };
    }
    case "semana": {
      const ini = new Date(agora);
      ini.setHours(0, 0, 0, 0);
      const lte = new Date(ini);
      lte.setDate(lte.getDate() + 7);
      lte.setHours(23, 59, 59, 999);
      return { gte: ini, lte };
    }
    case "mes": {
      const ini = new Date(agora);
      ini.setHours(0, 0, 0, 0);
      const lte = new Date(ini);
      lte.setMonth(lte.getMonth() + 1);
      lte.setHours(23, 59, 59, 999);
      return { gte: ini, lte };
    }
    case "todos":
      return {};
    default:
      return {};
  }
}

function montarQuerystring(params: Record<string, string | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, v);
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export default async function AudienciasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const aba = sp.aba === "realizadas" || sp.aba === "todas" ? sp.aba : "proximas";
  const periodo = sp.periodo;
  const statusFiltro =
    sp.status && STATUS_VALIDOS.includes(sp.status as StatusAudiencia)
      ? (sp.status as StatusAudiencia)
      : undefined;
  const responsavelFiltro = sp.responsavelId || undefined;

  const where: Prisma.AudienciaWhereInput = {};
  let orderBy: Prisma.AudienciaOrderByWithRelationInput = { dataHora: "asc" };

  if (aba === "proximas") {
    where.status = statusFiltro ?? "AGENDADA";
    where.dataHora = { gte: new Date() };
  } else if (aba === "realizadas") {
    where.status = statusFiltro ?? "REALIZADA";
    orderBy = { dataHora: "desc" };
  } else {
    if (statusFiltro) where.status = statusFiltro;
    orderBy = { dataHora: "desc" };
  }

  if (responsavelFiltro) {
    where.responsavelId = responsavelFiltro;
  }

  const intervalo = intervaloPeriodo(periodo);
  if (intervalo.gte || intervalo.lte) {
    where.dataHora = {
      ...(where.dataHora as Prisma.DateTimeFilter | undefined),
      ...(intervalo.gte ? { gte: intervalo.gte } : {}),
      ...(intervalo.lte ? { lte: intervalo.lte } : {}),
    };
  }

  const [audiencias, usuarios] = await Promise.all([
    prisma.audiencia.findMany({
      where,
      orderBy,
      include: {
        processo: { select: { id: true, numeroCnj: true } },
        responsavel: { select: { id: true, nome: true } },
      },
      take: 200,
    }),
    prisma.usuario.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
  ]);

  const baseParams = {
    status: statusFiltro,
    responsavelId: responsavelFiltro,
    periodo,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Audiências</h1>
          <p className="text-sm text-muted-foreground">
            Agenda de audiências vinculadas aos processos.
          </p>
        </div>
        <Button asChild>
          <Link href="/audiencias/nova">
            <Plus className="mr-2 h-4 w-4" /> Nova audiência
          </Link>
        </Button>
      </div>

      <Tabs value={aba}>
        <TabsList>
          <TabsTrigger value="proximas" asChild>
            <Link href={`/audiencias${montarQuerystring({ ...baseParams, aba: "proximas" })}`}>
              Próximas
            </Link>
          </TabsTrigger>
          <TabsTrigger value="realizadas" asChild>
            <Link href={`/audiencias${montarQuerystring({ ...baseParams, aba: "realizadas" })}`}>
              Realizadas
            </Link>
          </TabsTrigger>
          <TabsTrigger value="todas" asChild>
            <Link href={`/audiencias${montarQuerystring({ ...baseParams, aba: "todas" })}`}>
              Todas
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Use os filtros abaixo para refinar a listagem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-wrap items-end gap-3" method="get">
            <input type="hidden" name="aba" value={aba} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Status
              </label>
              <select
                name="status"
                defaultValue={statusFiltro ?? ""}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value="">Padrão da aba</option>
                {STATUS_VALIDOS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Período
              </label>
              <select
                name="periodo"
                defaultValue={periodo ?? ""}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value="">Todos</option>
                <option value="hoje">Hoje</option>
                <option value="semana">Próxima semana</option>
                <option value="mes">Próximo mês</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Responsável
              </label>
              <select
                name="responsavelId"
                defaultValue={responsavelFiltro ?? ""}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value="">Todos</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="outline" size="sm">
              Aplicar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audiencias.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Nenhuma audiência encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                audiencias.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <Link
                        href={`/audiencias/${a.id}`}
                        className="font-medium hover:underline"
                      >
                        {format(a.dataHora, "dd/MM/yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {format(a.dataHora, "EEEE", { locale: ptBR })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{TIPO_LABEL[a.tipo]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/processos/${a.processo.id}`}
                        className="text-sm hover:underline"
                      >
                        {a.processo.numeroCnj}
                      </Link>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {a.virtual ? (
                        a.linkVirtual ? (
                          <a
                            href={a.linkVirtual}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <Video className="h-3 w-3" /> Virtual
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-sm">
                            <Video className="h-3 w-3" /> Virtual
                          </span>
                        )
                      ) : (
                        <span className="line-clamp-2 text-sm">
                          {a.local ?? "—"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {a.responsavel?.nome ?? (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(a.status)}>
                        {STATUS_LABEL[a.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <AudienciaRowActions
                        id={a.id}
                        acionavel={a.status === "AGENDADA"}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
