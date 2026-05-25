/**
 * Serviço de sincronização de processos com os tribunais.
 *
 * Orquestra: Processo -> IntegracaoTribunal do responsável principal
 * -> Connector -> upsert de movimentações (deduplicadas por hash).
 */

import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";

import { criarConnector } from "./registry";
import type { Credenciais, SistemaTribunal } from "./types";

/** Resultado de uma sincronização individual. */
export interface ResultadoSincronizacao {
  ok: boolean;
  novasMovimentacoes: number;
  erro?: string;
}

/**
 * Tipos do Prisma para `SistemaTribunal` incluem `OUTRO`, que não é
 * suportado pelos connectors. Converte/valida.
 */
function mapSistemaPrismaParaConnector(
  sistema: string,
): SistemaTribunal | null {
  switch (sistema) {
    case "PJE":
    case "ESAJ":
    case "PROJUDI":
    case "EPROC":
      return sistema;
    default:
      return null;
  }
}

function parseCredenciais(plain: string): Credenciais {
  try {
    const obj = JSON.parse(plain) as unknown;
    if (obj && typeof obj === "object") {
      return obj as Credenciais;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Sincroniza um processo: localiza a integração ativa do responsável
 * principal no sistema correto, consulta o tribunal, faz upsert das
 * movimentações por (processoId, hashTribunal) e atualiza timestamps.
 */
export async function sincronizarProcesso(
  processoId: string,
): Promise<ResultadoSincronizacao> {
  const processo = await prisma.processo.findUnique({
    where: { id: processoId },
    include: {
      tribunal: true,
      responsaveis: {
        where: { principal: true },
        take: 1,
      },
    },
  });

  if (!processo) {
    return { ok: false, novasMovimentacoes: 0, erro: "Processo não encontrado." };
  }
  if (!processo.tribunal) {
    return {
      ok: false,
      novasMovimentacoes: 0,
      erro: "Processo sem tribunal associado.",
    };
  }

  const responsavel = processo.responsaveis[0];
  if (!responsavel) {
    return {
      ok: false,
      novasMovimentacoes: 0,
      erro: "Processo sem responsável principal definido.",
    };
  }

  const sistemaConnector = mapSistemaPrismaParaConnector(
    processo.tribunal.sistema,
  );
  if (!sistemaConnector) {
    return {
      ok: false,
      novasMovimentacoes: 0,
      erro: `Sistema "${processo.tribunal.sistema}" não suportado pelos conectores.`,
    };
  }

  const integracao = await prisma.integracaoTribunal.findUnique({
    where: {
      usuarioId_sistema_tribunalSigla: {
        usuarioId: responsavel.usuarioId,
        sistema: processo.tribunal.sistema,
        tribunalSigla: processo.tribunal.sigla,
      },
    },
  });

  if (!integracao || !integracao.ativa) {
    return {
      ok: false,
      novasMovimentacoes: 0,
      erro:
        "Nenhuma integração ativa do responsável principal para este tribunal.",
    };
  }

  let credenciais: Credenciais;
  try {
    credenciais = parseCredenciais(decrypt(integracao.credencialCifrada));
  } catch (err) {
    return {
      ok: false,
      novasMovimentacoes: 0,
      erro: `Falha ao decifrar credenciais: ${(err as Error).message}`,
    };
  }

  const connector = criarConnector(
    sistemaConnector,
    processo.tribunal.sigla,
    credenciais,
  );

  let resultado;
  try {
    resultado = await connector.consultarProcesso(processo.numeroCnj);
  } catch (err) {
    return {
      ok: false,
      novasMovimentacoes: 0,
      erro: `Erro do conector: ${(err as Error).message}`,
    };
  }

  if (!resultado.ok || !resultado.processo) {
    return {
      ok: false,
      novasMovimentacoes: 0,
      erro: resultado.erro ?? "Conector não retornou dados.",
    };
  }

  const movs = resultado.processo.movimentacoes ?? [];
  let novas = 0;

  for (const mov of movs) {
    // Upsert por (processoId, hashTribunal). O índice `@@unique` no
    // schema garante a chave composta.
    const upsert = await prisma.movimentacao.upsert({
      where: {
        processoId_hashTribunal: {
          processoId: processo.id,
          hashTribunal: mov.hash,
        },
      },
      create: {
        processoId: processo.id,
        data: mov.data,
        descricao: mov.descricao,
        tipo: "OUTRO",
        origemTribunal: true,
        hashTribunal: mov.hash,
      },
      update: {
        // Idempotente: nada a atualizar em movimentações importadas.
        // Mantemos `descricao` por enquanto para corrigir grafias.
        descricao: mov.descricao,
      },
      select: { criadaEm: true },
    });

    // Critério para "nova": criada nos últimos 5 segundos.
    if (Date.now() - upsert.criadaEm.getTime() < 5000) {
      novas++;
    }
  }

  const agora = new Date();
  await prisma.$transaction([
    prisma.processo.update({
      where: { id: processo.id },
      data: { ultimaSincronizacao: agora },
    }),
    prisma.integracaoTribunal.update({
      where: { id: integracao.id },
      data: { ultimoSync: agora },
    }),
  ]);

  return { ok: true, novasMovimentacoes: novas };
}

/**
 * Sincroniza todos os processos em que o usuário é responsável
 * (principal ou não). Executa em série para não saturar conectores
 * e respeitar rate limits dos tribunais.
 */
export async function sincronizarTodosProcessosDoUsuario(
  usuarioId: string,
): Promise<{
  total: number;
  sucesso: number;
  falha: number;
  totalNovasMovimentacoes: number;
}> {
  const vinculos = await prisma.processoResponsavel.findMany({
    where: { usuarioId },
    select: { processoId: true },
  });

  let sucesso = 0;
  let falha = 0;
  let totalNovasMovimentacoes = 0;

  for (const { processoId } of vinculos) {
    const r = await sincronizarProcesso(processoId);
    if (r.ok) {
      sucesso++;
      totalNovasMovimentacoes += r.novasMovimentacoes;
    } else {
      falha++;
    }
  }

  return {
    total: vinculos.length,
    sucesso,
    falha,
    totalNovasMovimentacoes,
  };
}
