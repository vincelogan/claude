import Link from "next/link";
import { notFound } from "next/navigation";

import type {
  FaseProcesso,
  PoloParte,
  StatusProcesso,
  TipoMovimentacao,
  TipoParte,
  TipoProcesso,
} from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";

import { MovimentacaoFormDialog } from "../_components/movimentacao-form-dialog";
import { ParteFormDialog } from "../_components/parte-form-dialog";
import { ResponsavelFormDialog } from "../_components/responsavel-form-dialog";
import { formatarCnj } from "../_lib/cnj";

const STATUS_BADGE: Record<StatusProcesso, string> = {
  ATIVO: "bg-green-100 text-green-800 border-green-200",
  SUSPENSO: "bg-yellow-100 text-yellow-800 border-yellow-200",
  ARQUIVADO: "bg-gray-100 text-gray-700 border-gray-200",
  BAIXADO: "bg-gray-100 text-gray-700 border-gray-200",
  ENCERRADO: "bg-blue-100 text-blue-800 border-blue-200",
};
const STATUS_LABEL: Record<StatusProcesso, string> = {
  ATIVO: "Ativo",
  SUSPENSO: "Suspenso",
  ARQUIVADO: "Arquivado",
  BAIXADO: "Baixado",
  ENCERRADO: "Encerrado",
};
const TIPO_LABEL: Record<TipoProcesso, string> = {
  JUDICIAL: "Judicial",
  ADMINISTRATIVO: "Administrativo",
  EXTRAJUDICIAL: "Extrajudicial",
};
const FASE_LABEL: Record<FaseProcesso, string> = {
  PRE_PROCESSUAL: "Pré-processual",
  CONHECIMENTO: "Conhecimento",
  RECURSAL: "Recursal",
  EXECUCAO: "Execução",
  CUMPRIMENTO_SENTENCA: "Cumprimento de sentença",
  ARQUIVADO: "Arquivado",
};
const POLO_LABEL: Record<PoloParte, string> = {
  ATIVO: "Polo ativo",
  PASSIVO: "Polo passivo",
  TERCEIRO: "Terceiro",
  OUTRO: "Outro",
};
const TIPO_PARTE_LABEL: Record<TipoParte, string> = {
  PARTE_PRINCIPAL: "Parte principal",
  ADVOGADO_CONTRARIO: "Advogado contrário",
  TERCEIRO_INTERESSADO: "Terceiro interessado",
  TESTEMUNHA: "Testemunha",
  PERITO: "Perito",
};
const TIPO_MOV_LABEL: Record<TipoMovimentacao, string> = {
  MANUAL: "Manual",
  PUBLICACAO: "Publicação",
  DESPACHO: "Despacho",
  DECISAO: "Decisão",
  SENTENCA: "Sentença",
  ACORDAO: "Acórdão",
  PETICAO: "Petição",
  JUNTADA: "Juntada",
  OUTRO: "Outro",
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

function formatarDataHora(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleString("pt-BR");
}

export default async function ProcessoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const processo = await prisma.processo.findUnique({
    where: { id },
    include: {
      tribunal: true,
      vara: true,
      assunto: true,
      partes: { include: { cliente: true } },
      movimentacoes: {
        orderBy: { data: "desc" },
        include: { criadaPor: { select: { nome: true } } },
      },
      responsaveis: {
        include: {
          usuario: { select: { id: true, nome: true, perfil: true, oab: true } },
        },
        orderBy: { desde: "asc" },
      },
    },
  });

  if (!processo) notFound();

  const [clientes, usuarios] = await Promise.all([
    prisma.cliente.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, cpfCnpj: true },
    }),
    prisma.usuario.findMany({
      where: { perfil: { in: ["ADVOGADO", "ADMIN"] }, ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, oab: true, perfil: true },
    }),
  ]);

  const responsaveisIds = new Set(processo.responsaveis.map((r) => r.usuarioId));
  const usuariosDisponiveis = usuarios.filter((u) => !responsaveisIds.has(u.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight font-mono">
              {formatarCnj(processo.numeroCnj)}
            </h1>
            <Badge variant="outline" className={STATUS_BADGE[processo.status]}>
              {STATUS_LABEL[processo.status]}
            </Badge>
            {processo.sigiloso && (
              <Badge variant="outline" className="border-red-300 text-red-700">
                Sigiloso
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {processo.classeProcessual ?? "—"} ·{" "}
            {processo.tribunal?.sigla ?? "Sem tribunal"} ·{" "}
            <span className="font-medium">
              {formatarMoeda(processo.valorCausa)}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/processos">Voltar</Link>
          </Button>
          <Button asChild>
            <Link href={`/processos/${processo.id}/editar`}>Editar</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dados" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="partes">
            Partes ({processo.partes.length})
          </TabsTrigger>
          <TabsTrigger value="movimentacoes">
            Movimentações ({processo.movimentacoes.length})
          </TabsTrigger>
          <TabsTrigger value="responsaveis">
            Responsáveis ({processo.responsaveis.length})
          </TabsTrigger>
        </TabsList>

        {/* ---------------- Dados ---------------- */}
        <TabsContent value="dados">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Informações do processo</CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link href={`/processos/${processo.id}/editar`}>Editar</Link>
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <Campo label="Nº CNJ" value={formatarCnj(processo.numeroCnj)} />
              <Campo label="Nº antigo" value={processo.numeroAntigo ?? "—"} />
              <Campo
                label="Classe processual"
                value={processo.classeProcessual ?? "—"}
              />
              <Campo label="Tipo" value={TIPO_LABEL[processo.tipo]} />
              <Campo label="Fase" value={FASE_LABEL[processo.fase]} />
              <Campo label="Status" value={STATUS_LABEL[processo.status]} />
              <Campo
                label="Tribunal"
                value={
                  processo.tribunal
                    ? `${processo.tribunal.sigla} — ${processo.tribunal.nome}`
                    : "—"
                }
              />
              <Campo label="Vara" value={processo.vara?.nome ?? "—"} />
              <Campo label="Assunto" value={processo.assunto?.nome ?? "—"} />
              <Campo
                label="Valor da causa"
                value={formatarMoeda(processo.valorCausa)}
              />
              <Campo label="Sigiloso" value={processo.sigiloso ? "Sim" : "Não"} />
              <Campo
                label="Última sincronização"
                value={formatarDataHora(processo.ultimaSincronizacao)}
              />
              <div className="md:col-span-2">
                <Separator className="my-2" />
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Observações
                </div>
                <div className="whitespace-pre-wrap text-sm">
                  {processo.observacoes ?? "—"}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- Partes ---------------- */}
        <TabsContent value="partes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Partes do processo</CardTitle>
              <ParteFormDialog
                processoId={processo.id}
                clientes={clientes}
                trigger={<Button size="sm">Adicionar parte</Button>}
              />
            </CardHeader>
            <CardContent className="space-y-2">
              {processo.partes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma parte cadastrada ainda.
                </p>
              )}
              {processo.partes.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {p.cliente ? (
                          <Link
                            href={`/clientes/${p.cliente.id}`}
                            className="hover:underline"
                          >
                            {p.cliente.nome}
                          </Link>
                        ) : (
                          p.nome
                        )}
                      </span>
                      <Badge
                        variant="outline"
                        className={
                          p.polo === "ATIVO"
                            ? "border-green-300 text-green-800"
                            : p.polo === "PASSIVO"
                              ? "border-red-300 text-red-800"
                              : ""
                        }
                      >
                        {POLO_LABEL[p.polo]}
                      </Badge>
                      {p.cliente && (
                        <Badge variant="secondary">Cliente</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {TIPO_PARTE_LABEL[p.tipoParte]}
                      {p.cpfCnpj ? ` · ${p.cpfCnpj}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- Movimentações ---------------- */}
        <TabsContent value="movimentacoes">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Histórico de movimentações</CardTitle>
              <MovimentacaoFormDialog
                processoId={processo.id}
                trigger={<Button size="sm">Nova movimentação</Button>}
              />
            </CardHeader>
            <CardContent>
              {processo.movimentacoes.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma movimentação registrada.
                </p>
              )}
              <ol className="relative border-l ml-3 space-y-4">
                {processo.movimentacoes.map((m) => (
                  <li key={m.id} className="ml-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-background bg-primary" />
                    <div className="flex flex-wrap items-center gap-2">
                      <time className="text-xs font-medium text-muted-foreground">
                        {formatarData(m.data)}
                      </time>
                      <Badge variant="outline">{TIPO_MOV_LABEL[m.tipo]}</Badge>
                      {m.origemTribunal && (
                        <Badge
                          variant="outline"
                          className="border-blue-300 text-blue-800"
                        >
                          Tribunal
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm whitespace-pre-wrap">
                      {m.descricao}
                    </p>
                    {m.criadaPor && (
                      <p className="text-xs text-muted-foreground mt-1">
                        por {m.criadaPor.nome}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- Responsáveis ---------------- */}
        <TabsContent value="responsaveis">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Advogados responsáveis</CardTitle>
              <ResponsavelFormDialog
                processoId={processo.id}
                usuarios={usuariosDisponiveis}
                trigger={<Button size="sm">Adicionar responsável</Button>}
              />
            </CardHeader>
            <CardContent className="space-y-2">
              {processo.responsaveis.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum responsável atribuído.
                </p>
              )}
              {processo.responsaveis.map((r) => (
                <div
                  key={r.usuarioId}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border p-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{r.usuario.nome}</span>
                      {r.principal && (
                        <Badge className="bg-amber-100 text-amber-900 border-amber-200">
                          Principal
                        </Badge>
                      )}
                      <Badge variant="secondary">{r.usuario.perfil}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.usuario.oab ? `OAB ${r.usuario.oab}` : ""} · desde{" "}
                      {formatarData(r.desde)}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Campo({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );
}
