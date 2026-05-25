import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, Plus } from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
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
import type { Prisma, StatusPrazo } from "@prisma/client";

import {
  classificarUrgencia,
  descreverPrazo,
  type Urgencia,
} from "./_lib/dias";
import { PrazoRowActions } from "./_components/prazo-row-actions";

type SearchParams = {
  status?: string;
  responsavelId?: string;
  periodo?: string;
  escopo?: string;
};

const STATUS_VALIDOS: StatusPrazo[] = [
  "PENDENTE",
  "CUMPRIDO",
  "PRORROGADO",
  "PERDIDO",
  "CANCELADO",
];

const STATUS_LABEL: Record<StatusPrazo, string> = {
  PENDENTE: "Pendente",
  CUMPRIDO: "Cumprido",
  PRORROGADO: "Prorrogado",
  PERDIDO: "Perdido",
  CANCELADO: "Cancelado",
};

function statusVariant(
  status: StatusPrazo,
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "CUMPRIDO":
      return "secondary";
    case "PERDIDO":
      return "destructive";
    case "CANCELADO":
      return "outline";
    case "PRORROGADO":
      return "outline";
    default:
      return "default";
  }
}

const URGENCIA_ROW: Record<Urgencia, string> = {
  vencido: "bg-destructive/10",
  hoje: "bg-orange-100/60 dark:bg-orange-950/30",
  urgente: "bg-yellow-100/60 dark:bg-yellow-950/30",
  proximo: "",
  normal: "",
};

const URGENCIA_TEXTO: Record<Urgencia, string> = {
  vencido: "text-destructive font-medium",
  hoje: "text-orange-700 dark:text-orange-300 font-medium",
  urgente: "text-yellow-800 dark:text-yellow-300 font-medium",
  proximo: "text-foreground",
  normal: "text-muted-foreground",
};

function intervaloPeriodo(periodo: string | undefined): {
  gte?: Date;
  lte?: Date;
} {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const fim = new Date(hoje);
  fim.setHours(23, 59, 59, 999);

  switch (periodo) {
    case "hoje":
      return { gte: hoje, lte: fim };
    case "semana": {
      const lte = new Date(hoje);
      lte.setDate(lte.getDate() + 7);
      lte.setHours(23, 59, 59, 999);
      return { gte: hoje, lte };
    }
    case "mes": {
      const lte = new Date(hoje);
      lte.setMonth(lte.getMonth() + 1);
      lte.setHours(23, 59, 59, 999);
      return { gte: hoje, lte };
    }
    case "todos":
      return {};
    default: {
      // proximos30 (padrão): inclui vencidos + próximos 30 dias
      const lte = new Date(hoje);
      lte.setDate(lte.getDate() + 30);
      lte.setHours(23, 59, 59, 999);
      return { lte };
    }
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

export default async function PrazosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  const sp = await searchParams;
  const usuarioId = session?.user?.id ?? "";

  const escopo = sp.escopo === "todos" ? "todos" : "meus";
  const periodo = sp.periodo ?? "proximos30";
  const statusFiltro =
    sp.status && STATUS_VALIDOS.includes(sp.status as StatusPrazo)
      ? (sp.status as StatusPrazo)
      : undefined;
  const responsavelFiltro = sp.responsavelId || undefined;

  const intervalo = intervaloPeriodo(periodo);

  const where: Prisma.PrazoWhereInput = {};
  if (statusFiltro) {
    where.status = statusFiltro;
  } else {
    where.status = "PENDENTE";
  }

  if (escopo === "meus" && usuarioId) {
    where.responsavelId = usuarioId;
  } else if (responsavelFiltro) {
    where.responsavelId = responsavelFiltro;
  }

  if (intervalo.gte || intervalo.lte) {
    where.dataVencimento = {};
    if (intervalo.gte) where.dataVencimento.gte = intervalo.gte;
    if (intervalo.lte) where.dataVencimento.lte = intervalo.lte;
  }

  const [prazos, usuarios] = await Promise.all([
    prisma.prazo.findMany({
      where,
      orderBy: { dataVencimento: "asc" },
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
    responsavelId: escopo === "meus" ? undefined : responsavelFiltro,
    periodo,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Prazos</h1>
          <p className="text-sm text-muted-foreground">
            Controle de prazos processuais e administrativos.
          </p>
        </div>
        <Button asChild>
          <Link href="/prazos/novo">
            <Plus className="mr-2 h-4 w-4" /> Novo prazo
          </Link>
        </Button>
      </div>

      <Tabs value={escopo}>
        <TabsList>
          <TabsTrigger value="meus" asChild>
            <Link href={`/prazos${montarQuerystring({ ...baseParams, escopo: "meus" })}`}>
              Meus prazos
            </Link>
          </TabsTrigger>
          <TabsTrigger value="todos" asChild>
            <Link href={`/prazos${montarQuerystring({ ...baseParams, escopo: "todos" })}`}>
              Todos
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
            <input type="hidden" name="escopo" value={escopo} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Status
              </label>
              <select
                name="status"
                defaultValue={statusFiltro ?? ""}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value="">Pendentes (padrão)</option>
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
                defaultValue={periodo}
                className="h-9 rounded-md border bg-background px-2 text-sm"
              >
                <option value="proximos30">Próximos 30 dias</option>
                <option value="hoje">Hoje</option>
                <option value="semana">Próxima semana</option>
                <option value="mes">Próximo mês</option>
                <option value="todos">Todos</option>
              </select>
            </div>
            {escopo === "todos" ? (
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
            ) : null}
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
                <TableHead>Título</TableHead>
                <TableHead>Processo</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prazos.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    Nenhum prazo encontrado com os filtros atuais.
                  </TableCell>
                </TableRow>
              ) : (
                prazos.map((p) => {
                  const urgencia =
                    p.status === "PENDENTE"
                      ? classificarUrgencia(p.dataVencimento)
                      : "normal";
                  return (
                    <TableRow key={p.id} className={cn(URGENCIA_ROW[urgencia])}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/prazos/${p.id}`}
                            className="font-medium hover:underline"
                          >
                            {p.titulo}
                          </Link>
                          {p.fatal ? (
                            <Badge
                              variant="destructive"
                              className="gap-1"
                              title="Prazo fatal (preclusivo)"
                            >
                              <AlertTriangle className="h-3 w-3" /> FATAL
                            </Badge>
                          ) : null}
                        </div>
                        {p.descricao ? (
                          <div className="line-clamp-1 text-xs text-muted-foreground">
                            {p.descricao}
                          </div>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {p.processo ? (
                          <Link
                            href={`/processos/${p.processo.id}`}
                            className="text-sm hover:underline"
                          >
                            {p.processo.numeroCnj}
                          </Link>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Administrativo
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {format(p.dataVencimento, "dd 'de' MMM 'de' yyyy", {
                              locale: ptBR,
                            })}
                          </span>
                          {p.status === "PENDENTE" ? (
                            <span
                              className={cn("text-xs", URGENCIA_TEXTO[urgencia])}
                            >
                              {descreverPrazo(p.dataVencimento)}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.responsavel.nome}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(p.status)}>
                          {STATUS_LABEL[p.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <PrazoRowActions
                          id={p.id}
                          cumprivel={
                            p.status === "PENDENTE" || p.status === "PRORROGADO"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
