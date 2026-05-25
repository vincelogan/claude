/**
 * Sincronização de Prazos e Audiências com o Google Calendar.
 *
 * Regras gerais:
 * - Se o responsável não tem `IntegracaoGoogle` ativa, retorna silenciosamente
 *   (apenas loga). Não é erro — usuário simplesmente não conectou ainda.
 * - O `googleEventId` resultante é persistido no próprio registro.
 * - `removerSync*` apaga o evento no Google e zera o `googleEventId` local.
 */

import { prisma } from "@/lib/prisma";

import {
  criarOuAtualizarEvento,
  removerEvento,
} from "@/lib/google/calendar";
import { IntegracaoGoogleRevogadaError } from "@/lib/google/oauth";

function urlApp(path: string): string {
  const base = (process.env.APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

async function temIntegracaoAtiva(usuarioId: string): Promise<boolean> {
  const integ = await prisma.integracaoGoogle.findUnique({
    where: { usuarioId },
    select: { ativa: true },
  });
  return Boolean(integ?.ativa);
}

function tratarErroSync(contexto: string, err: unknown): void {
  if (err instanceof IntegracaoGoogleRevogadaError) {
    console.warn(`[google/sync] ${contexto}: integração revogada — ignorando.`);
    return;
  }
  console.error(
    `[google/sync] ${contexto} falhou:`,
    err instanceof Error ? err.message : "erro desconhecido",
  );
}

// ---------------------------------------------------------------------------
// PRAZOS
// ---------------------------------------------------------------------------

/**
 * Sincroniza um Prazo com o Google Calendar do responsável.
 * O evento começa 30 min antes do vencimento e termina no vencimento.
 */
export async function sincronizarPrazoNoGoogle(
  prazoId: string,
): Promise<void> {
  const prazo = await prisma.prazo.findUnique({
    where: { id: prazoId },
    include: { responsavel: true, processo: true },
  });

  if (!prazo) {
    console.warn(`[google/sync] prazo ${prazoId} não encontrado.`);
    return;
  }

  if (!(await temIntegracaoAtiva(prazo.responsavelId))) {
    console.info(
      `[google/sync] responsável ${prazo.responsavelId} sem integração ativa — prazo ${prazoId} não sincronizado.`,
    );
    return;
  }

  const fim = prazo.dataVencimento;
  const inicio = new Date(fim.getTime() - 30 * 60 * 1000);

  const linhasDescricao = [
    prazo.descricao ?? null,
    prazo.processo?.numeroCnj
      ? `Processo: ${prazo.processo.numeroCnj}`
      : null,
    prazo.fatal ? "PRAZO FATAL (preclusivo)" : null,
    `Detalhes: ${urlApp(`/prazos/${prazo.id}`)}`,
  ].filter((l): l is string => Boolean(l));

  try {
    const eventId = await criarOuAtualizarEvento(prazo.responsavelId, {
      eventId: prazo.googleEventId ?? undefined,
      summary: `PRAZO: ${prazo.titulo}`,
      description: linhasDescricao.join("\n"),
      start: inicio,
      end: fim,
    });

    if (eventId !== prazo.googleEventId) {
      await prisma.prazo.update({
        where: { id: prazo.id },
        data: { googleEventId: eventId },
      });
    }
  } catch (err) {
    tratarErroSync(`sincronizarPrazoNoGoogle(${prazoId})`, err);
  }
}

/**
 * Remove o evento Google associado a um Prazo e zera o `googleEventId`.
 */
export async function removerSyncPrazo(prazoId: string): Promise<void> {
  const prazo = await prisma.prazo.findUnique({
    where: { id: prazoId },
    select: { id: true, googleEventId: true, responsavelId: true },
  });

  if (!prazo) return;
  if (!prazo.googleEventId) return;

  if (await temIntegracaoAtiva(prazo.responsavelId)) {
    try {
      await removerEvento(prazo.responsavelId, prazo.googleEventId);
    } catch (err) {
      tratarErroSync(`removerSyncPrazo(${prazoId})`, err);
    }
  }

  await prisma.prazo.update({
    where: { id: prazo.id },
    data: { googleEventId: null },
  });
}

// ---------------------------------------------------------------------------
// AUDIÊNCIAS
// ---------------------------------------------------------------------------

/**
 * Sincroniza uma Audiência com o Google Calendar do responsável.
 * Duração padrão: 1h. Location preferencial = local físico, senão linkVirtual.
 */
export async function sincronizarAudienciaNoGoogle(
  audienciaId: string,
): Promise<void> {
  const audiencia = await prisma.audiencia.findUnique({
    where: { id: audienciaId },
    include: { responsavel: true, processo: true },
  });

  if (!audiencia) {
    console.warn(`[google/sync] audiência ${audienciaId} não encontrada.`);
    return;
  }

  if (!audiencia.responsavelId) {
    console.info(
      `[google/sync] audiência ${audienciaId} sem responsável — nada a sincronizar.`,
    );
    return;
  }

  if (!(await temIntegracaoAtiva(audiencia.responsavelId))) {
    console.info(
      `[google/sync] responsável ${audiencia.responsavelId} sem integração ativa — audiência ${audienciaId} não sincronizada.`,
    );
    return;
  }

  const inicio = audiencia.dataHora;
  const fim = new Date(inicio.getTime() + 60 * 60 * 1000);

  const location = audiencia.local ?? audiencia.linkVirtual ?? undefined;

  const linhasDescricao = [
    `Processo: ${audiencia.processo.numeroCnj}`,
    audiencia.virtual ? "Audiência virtual" : null,
    audiencia.linkVirtual ? `Link: ${audiencia.linkVirtual}` : null,
    audiencia.observacoes ?? null,
    `Detalhes: ${urlApp(`/audiencias/${audiencia.id}`)}`,
  ].filter((l): l is string => Boolean(l));

  try {
    const eventId = await criarOuAtualizarEvento(audiencia.responsavelId, {
      eventId: audiencia.googleEventId ?? undefined,
      summary: `AUDIÊNCIA: ${audiencia.tipo}`,
      description: linhasDescricao.join("\n"),
      start: inicio,
      end: fim,
      location,
      conferenceLink: audiencia.linkVirtual ?? undefined,
    });

    if (eventId !== audiencia.googleEventId) {
      await prisma.audiencia.update({
        where: { id: audiencia.id },
        data: { googleEventId: eventId },
      });
    }
  } catch (err) {
    tratarErroSync(`sincronizarAudienciaNoGoogle(${audienciaId})`, err);
  }
}

/**
 * Remove o evento Google associado a uma Audiência e zera o `googleEventId`.
 */
export async function removerSyncAudiencia(
  audienciaId: string,
): Promise<void> {
  const audiencia = await prisma.audiencia.findUnique({
    where: { id: audienciaId },
    select: { id: true, googleEventId: true, responsavelId: true },
  });

  if (!audiencia) return;
  if (!audiencia.googleEventId) return;
  if (!audiencia.responsavelId) return;

  if (await temIntegracaoAtiva(audiencia.responsavelId)) {
    try {
      await removerEvento(audiencia.responsavelId, audiencia.googleEventId);
    } catch (err) {
      tratarErroSync(`removerSyncAudiencia(${audienciaId})`, err);
    }
  }

  await prisma.audiencia.update({
    where: { id: audiencia.id },
    data: { googleEventId: null },
  });
}
