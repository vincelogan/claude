import Link from "next/link";

import type { FaseProcesso, Prisma, StatusProcesso } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

import { formatarCnj } from "./_lib/cnj";

const PAGE_SIZE = 50;

const STATUS_BADGE: Record<StatusProcesso, string> = {
  ATIVO: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
  SUSPENSO:
    "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
  ARQUIVADO: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
  BAIXADO: "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200",
  ENCERRADO: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
};

const STATUS_LABEL: Record<StatusProcesso, string> = {
  ATIVO: "Ativo",
  SUSPENSO: "Suspenso",
  ARQUIVADO: "Arquivado",
  BAIXADO: "Baixado",
  ENCERRADO: "Encerrado",
};

const FASE_LABEL: Record<FaseProcesso, string> = {
  PRE_PROCESSUAL: "Pré-processual",
  CONHECIMENTO: "Conhecimento",
  RECURSAL: "Recursal",
  EXECUCAO: "Execução",
  CUMPRIMENTO_SENTENCA: "Cumprimento de sentença",
  ARQUIVADO: "Arquivado",
};

function formatarMoeda(valor: unknown): string {
  if (valor == null) return "—";
  const num =
    typeof valor === "number"
      ? valor
      : typeof valor === "string"
        ? Number(valor)
        : Number((valor as { toString: () => string }).toString());
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatarData(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR");
}

type SearchParams = Promise<{
  q?: string;
  status?: string;
  fase?: string;
  tribunalId?: string;
  responsavelId?: string;
  page?: string;
}>;

export default async function ProcessosPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const status = (sp.status ?? "ATIVO") as StatusProcesso | "TODOS";
  const fase = sp.fase as FaseProcesso | undefined;
  const tribunalId = sp.tribunalId || undefined;
  const responsavelId = sp.responsavelId || undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.ProcessoWhereInput = {};

  if (status && status !== "TODOS") where.status = status as StatusProcesso;
  if (fase) where.fase = fase;
  if (tribunalId) where.tribunalId = tribunalId;
  if (responsavelId) {
    where.responsaveis = { some: { usuarioId: responsavelId } };
  }
  if (q) {
    where.OR = [
      { numeroCnj: { contains: q.replace(/\D+/g, ""), mode: "insensitive" } },
      { numeroAntigo: { contains: q, mode: "insensitive" } },
      {
        partes: {
          some: { nome: { contains: q, mode: "insensitive" } },
        },
      },
    ];
  }

  const [processos, total, tribunais, advogados] = await Promise.all([
    prisma.processo.findMany({
      where,
      include: {
        tribunal: true,
        vara: true,
        partes: { include: { cliente: true } },
        movimentacoes: { take: 1, orderBy: { data: "desc" } },
      },
      orderBy: { atualizadoEm: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.processo.count({ where }),
    prisma.tribunal.findMany({ orderBy: { sigla: "asc" } }),
    prisma.usuario.findMany({
      where: { perfil: { in: ["ADVOGADO", "ADMIN"] }, ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true },
    }),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Processos</h1>
          <p className="text-sm text-muted-foreground">
            {total} processo{total === 1 ? "" : "s"} encontrado
            {total === 1 ? "" : "s"}
          </p>
        </div>
        <Button asChild>
          <Link href="/processos/novo">Novo processo</Link>
        </Button>
      </div>

      <form
        method="get"
        className="flex flex-wrap items-end gap-3 rounded-md border bg-card p-4"
      >
        <div className="flex-1 min-w-[220px]">
          <label className="text-xs font-medium text-muted-foreground">
            Busca
          </label>
          <Input
            name="q"
            defaultValue={q}
            placeholder="Nº CNJ, nº antigo ou nome da parte"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Status
          </label>
          <select
            name="status"
            defaultValue={status}
            className="block h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="ATIVO">Ativo</option>
            <option value="SUSPENSO">Suspenso</option>
            <option value="ARQUIVADO">Arquivado</option>
            <option value="BAIXADO">Baixado</option>
            <option value="ENCERRADO">Encerrado</option>
            <option value="TODOS">Todos</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Fase
          </label>
          <select
            name="fase"
            defaultValue={fase ?? ""}
            className="block h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Todas</option>
            {Object.entries(FASE_LABEL).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Tribunal
          </label>
          <select
            name="tribunalId"
            defaultValue={tribunalId ?? ""}
            className="block h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Todos</option>
            {tribunais.map((t) => (
              <option key={t.id} value={t.id}>
                {t.sigla}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Responsável
          </label>
          <select
            name="responsavelId"
            defaultValue={responsavelId ?? ""}
            className="block h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Todos</option>
            {advogados.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº CNJ</TableHead>
              <TableHead>Classe</TableHead>
              <TableHead>Tribunal / Vara</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última mov.</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processos.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-sm text-muted-foreground py-8"
                >
                  Nenhum processo encontrado.
                </TableCell>
              </TableRow>
            )}
            {processos.map((p) => {
              const clienteParte = p.partes.find((pt) => pt.clienteId);
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">
                    {formatarCnj(p.numeroCnj)}
                  </TableCell>
                  <TableCell>{p.classeProcessual ?? "—"}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {p.tribunal?.sigla ?? "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.vara?.nome ?? ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    {clienteParte ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {clienteParte.cliente?.nome ?? clienteParte.nome}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            clienteParte.polo === "ATIVO"
                              ? "border-green-300 text-green-800"
                              : "border-red-300 text-red-800"
                          }
                        >
                          {clienteParte.polo}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>{formatarMoeda(p.valorCausa)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={STATUS_BADGE[p.status]}
                    >
                      {STATUS_LABEL[p.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatarData(p.movimentacoes[0]?.data)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/processos/${p.id}`}>Ver</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Página {page} de {totalPaginas}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={{
                    pathname: "/processos",
                    query: { ...sp, page: page - 1 },
                  }}
                >
                  Anterior
                </Link>
              </Button>
            )}
            {page < totalPaginas && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={{
                    pathname: "/processos",
                    query: { ...sp, page: page + 1 },
                  }}
                >
                  Próxima
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
