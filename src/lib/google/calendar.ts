/**
 * Wrapper de alto nível sobre a Google Calendar API (v3).
 *
 * Todas as funções:
 * - obtêm um `OAuth2Client` autenticado via `clienteAutenticado`;
 * - usam o `calendarId` salvo em `IntegracaoGoogle.calendarId` ou "primary";
 * - capturam erros 401/403/invalid_grant, marcando a integração como inativa
 *   e relançando `IntegracaoGoogleRevogadaError`.
 */

import { google } from "googleapis";
import type { GaxiosError } from "gaxios";

import { prisma } from "@/lib/prisma";
import {
  IntegracaoGoogleRevogadaError,
  clienteAutenticado,
  marcarIntegracaoInvalida,
} from "@/lib/google/oauth";

export type CalendarioResumo = {
  id: string;
  summary: string;
  primary: boolean;
};

export type EventoOpts = {
  eventId?: string;
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  location?: string;
  conferenceLink?: string;
};

function ehErroDeAutenticacao(err: unknown): boolean {
  const e = err as GaxiosError | undefined;
  const status = e?.response?.status;
  if (status === 401 || status === 403) return true;
  const msg = (e?.message ?? "").toLowerCase();
  return (
    msg.includes("invalid_grant") ||
    msg.includes("token has been expired or revoked") ||
    msg.includes("invalid_token")
  );
}

async function tratarErroAuth(usuarioId: string, err: unknown): Promise<never> {
  if (ehErroDeAutenticacao(err)) {
    await marcarIntegracaoInvalida(usuarioId);
    throw new IntegracaoGoogleRevogadaError(usuarioId);
  }
  throw err;
}

async function calendarIdDoUsuario(usuarioId: string): Promise<string> {
  const integracao = await prisma.integracaoGoogle.findUnique({
    where: { usuarioId },
    select: { calendarId: true },
  });
  return integracao?.calendarId ?? "primary";
}

/**
 * Lista os calendários acessíveis pelo usuário.
 */
export async function listarCalendarios(
  usuarioId: string,
): Promise<CalendarioResumo[]> {
  const auth = await clienteAutenticado(usuarioId);
  const calendar = google.calendar({ version: "v3", auth });

  try {
    const { data } = await calendar.calendarList.list({ maxResults: 250 });
    const items = data.items ?? [];
    return items
      .filter((c) => !!c.id)
      .map((c) => ({
        id: c.id as string,
        summary: c.summary ?? c.id ?? "(sem nome)",
        primary: Boolean(c.primary),
      }));
  } catch (err) {
    return tratarErroAuth(usuarioId, err);
  }
}

/**
 * Cria (sem `eventId`) ou atualiza (com `eventId`) um evento no calendário
 * configurado para o usuário. Retorna o `eventId` resultante.
 */
export async function criarOuAtualizarEvento(
  usuarioId: string,
  opts: EventoOpts,
): Promise<string> {
  const auth = await clienteAutenticado(usuarioId);
  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = await calendarIdDoUsuario(usuarioId);

  const requestBody = {
    summary: opts.summary,
    description:
      opts.description ??
      (opts.conferenceLink
        ? `Link da videoconferência: ${opts.conferenceLink}`
        : undefined),
    location: opts.location,
    start: { dateTime: opts.start.toISOString() },
    end: { dateTime: opts.end.toISOString() },
  };

  try {
    if (opts.eventId) {
      const { data } = await calendar.events.update({
        calendarId,
        eventId: opts.eventId,
        requestBody,
      });
      if (!data.id) {
        throw new Error("Google não retornou eventId no update.");
      }
      return data.id;
    }

    const { data } = await calendar.events.insert({
      calendarId,
      requestBody,
    });
    if (!data.id) {
      throw new Error("Google não retornou eventId no insert.");
    }
    return data.id;
  } catch (err) {
    // Se o evento foi excluído no Google, devolve 404 ao atualizar — recria.
    const status = (err as GaxiosError)?.response?.status;
    if (opts.eventId && status === 404) {
      try {
        const { data } = await calendar.events.insert({
          calendarId,
          requestBody,
        });
        if (!data.id) {
          throw new Error("Google não retornou eventId no insert.");
        }
        return data.id;
      } catch (err2) {
        return tratarErroAuth(usuarioId, err2);
      }
    }
    return tratarErroAuth(usuarioId, err);
  }
}

/**
 * Remove um evento do calendário do usuário. Ignora silenciosamente 404/410
 * (evento já não existe no Google).
 */
export async function removerEvento(
  usuarioId: string,
  eventId: string,
): Promise<void> {
  const auth = await clienteAutenticado(usuarioId);
  const calendar = google.calendar({ version: "v3", auth });
  const calendarId = await calendarIdDoUsuario(usuarioId);

  try {
    await calendar.events.delete({ calendarId, eventId });
  } catch (err) {
    const status = (err as GaxiosError)?.response?.status;
    if (status === 404 || status === 410) {
      return; // já não existe — ok
    }
    return tratarErroAuth(usuarioId, err);
  }
}
