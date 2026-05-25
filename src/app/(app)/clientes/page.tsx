import Link from "next/link";
import type { Prisma, TipoPessoa } from "@prisma/client";

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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AlternarAtivoButton } from "./_components/alternar-ativo-button";
import { formatarCpfCnpj } from "./_lib/cpf-cnpj";

type StatusFiltro = "ativos" | "inativos" | "todos";

type SearchParams = {
  q?: string;
  tipo?: string;
  status?: string;
  page?: string;
};

const PAGE_SIZE = 50;

function normalizarStatus(valor: string | undefined): StatusFiltro {
  if (valor === "inativos" || valor === "todos") return valor;
  return "ativos";
}

function normalizarTipo(valor: string | undefined): TipoPessoa | undefined {
  if (valor === "PF" || valor === "PJ") return valor;
  return undefined;
}

function normalizarPagina(valor: string | undefined): number {
  const n = Number(valor);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

function montarHref(
  base: Partial<SearchParams>,
  overrides: Partial<SearchParams>,
): string {
  const params = new URLSearchParams();
  const merged = { ...base, ...overrides };
  for (const [chave, valor] of Object.entries(merged)) {
    if (valor !== undefined && valor !== "") {
      params.set(chave, String(valor));
    }
  }
  const qs = params.toString();
  return qs ? `/clientes?${qs}` : "/clientes";
}

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const tipo = normalizarTipo(sp.tipo);
  const status = normalizarStatus(sp.status);
  const page = normalizarPagina(sp.page);

  const where: Prisma.ClienteWhereInput = {};

  if (tipo) {
    where.tipoPessoa = tipo;
  }

  if (status === "ativos") {
    where.ativo = true;
  } else if (status === "inativos") {
    where.ativo = false;
  }

  if (q) {
    const qDigitos = q.replace(/\D+/g, "");
    where.OR = [
      { nome: { contains: q, mode: "insensitive" } },
      ...(qDigitos.length > 0
        ? [{ cpfCnpj: { contains: qDigitos } as const }]
        : []),
    ];
  }

  const [total, clientes] = await Promise.all([
    prisma.cliente.count({ where }),
    prisma.cliente.findMany({
      where,
      orderBy: [{ nome: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        nome: true,
        tipoPessoa: true,
        cpfCnpj: true,
        telefone: true,
        email: true,
        cidade: true,
        uf: true,
        ativo: true,
        _count: { select: { partes: true } },
      },
    }),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const baseFiltros: Partial<SearchParams> = {
    q: q || undefined,
    tipo: tipo,
    status: status === "ativos" ? undefined : status,
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Cadastro de pessoas físicas e jurídicas vinculadas aos processos.
          </p>
        </div>
        <Button asChild>
          <Link href="/clientes/novo">Novo cliente</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="gap-2">
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Busque por nome, CPF ou CNPJ e refine por tipo de pessoa ou
            situação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            method="GET"
            action="/clientes"
            className="flex flex-wrap items-end gap-3"
          >
            <div className="flex min-w-[240px] flex-1 flex-col gap-1">
              <label
                htmlFor="q"
                className="text-xs font-medium text-muted-foreground"
              >
                Buscar
              </label>
              <Input
                id="q"
                name="q"
                placeholder="Nome ou CPF/CNPJ"
                defaultValue={q}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Tipo
              </span>
              <div className="flex gap-1">
                {(
                  [
                    { valor: "", rotulo: "Todos" },
                    { valor: "PF", rotulo: "PF" },
                    { valor: "PJ", rotulo: "PJ" },
                  ] as const
                ).map((opt) => {
                  const ativo = (tipo ?? "") === opt.valor;
                  return (
                    <Button
                      key={opt.rotulo}
                      asChild
                      type="button"
                      size="sm"
                      variant={ativo ? "default" : "outline"}
                    >
                      <Link
                        href={montarHref(baseFiltros, {
                          tipo: (opt.valor || undefined) as
                            | "PF"
                            | "PJ"
                            | undefined,
                          page: undefined,
                        })}
                      >
                        {opt.rotulo}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                Situação
              </span>
              <div className="flex gap-1">
                {(
                  [
                    { valor: "ativos", rotulo: "Ativos" },
                    { valor: "inativos", rotulo: "Inativos" },
                    { valor: "todos", rotulo: "Todos" },
                  ] as const
                ).map((opt) => {
                  const ativo = status === opt.valor;
                  return (
                    <Button
                      key={opt.valor}
                      asChild
                      type="button"
                      size="sm"
                      variant={ativo ? "default" : "outline"}
                    >
                      <Link
                        href={montarHref(baseFiltros, {
                          status:
                            opt.valor === "ativos" ? undefined : opt.valor,
                          page: undefined,
                        })}
                      >
                        {opt.rotulo}
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>

            {tipo ? (
              <input type="hidden" name="tipo" value={tipo} />
            ) : null}
            {status !== "ativos" ? (
              <input type="hidden" name="status" value={status} />
            ) : null}

            <Button type="submit" variant="secondary">
              Aplicar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {total} {total === 1 ? "cliente encontrado" : "clientes encontrados"}
            </CardTitle>
            <CardDescription>
              Página {page} de {totalPaginas}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {clientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
              <p className="text-base font-medium">
                Nenhum cliente encontrado.
              </p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {q || tipo || status !== "ativos"
                  ? "Tente ajustar os filtros ou limpe a busca."
                  : "Comece cadastrando o primeiro cliente do escritório."}
              </p>
              <Button asChild className="mt-2">
                <Link href="/clientes/novo">Cadastrar cliente</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Cidade/UF</TableHead>
                    <TableHead className="text-center">Processos</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/clientes/${cliente.id}`}
                          className="hover:underline"
                        >
                          {cliente.nome}
                        </Link>
                        {!cliente.ativo ? (
                          <Badge variant="outline" className="ml-2">
                            Inativo
                          </Badge>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cliente.tipoPessoa === "PJ"
                              ? "secondary"
                              : "default"
                          }
                        >
                          {cliente.tipoPessoa}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {formatarCpfCnpj(cliente.cpfCnpj, cliente.tipoPessoa)}
                      </TableCell>
                      <TableCell>{cliente.telefone ?? "—"}</TableCell>
                      <TableCell>{cliente.email ?? "—"}</TableCell>
                      <TableCell>
                        {cliente.cidade
                          ? `${cliente.cidade}${
                              cliente.uf ? `/${cliente.uf}` : ""
                            }`
                          : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {cliente._count.partes}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/clientes/${cliente.id}`}>
                              Editar
                            </Link>
                          </Button>
                          <AlternarAtivoButton
                            id={cliente.id}
                            ativo={cliente.ativo}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPaginas > 1 ? (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} de {total}
          </p>
          <div className="flex gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={page <= 1}
            >
              <Link
                href={montarHref(baseFiltros, {
                  page: page > 1 ? String(page - 1) : undefined,
                })}
              >
                Anterior
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={page >= totalPaginas}
            >
              <Link
                href={montarHref(baseFiltros, {
                  page:
                    page < totalPaginas ? String(page + 1) : String(page),
                })}
              >
                Próxima
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
