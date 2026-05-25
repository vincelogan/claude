"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AcaoResultado =
  | { ok: true }
  | { ok: false; mensagem: string };

/**
 * Atualiza o `calendarId` padrão da integração Google do usuário logado.
 * Aceita "primary" ou um id de calendário ao qual o usuário tem acesso.
 */
export async function atualizarCalendarioPadrao(
  calendarId: string,
): Promise<AcaoResultado> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, mensagem: "Sessão expirada. Faça login novamente." };
  }

  const id = calendarId?.trim();
  if (!id) {
    return { ok: false, mensagem: "Calendário inválido." };
  }

  const integracao = await prisma.integracaoGoogle.findUnique({
    where: { usuarioId: session.user.id },
    select: { id: true, ativa: true },
  });

  if (!integracao || !integracao.ativa) {
    return {
      ok: false,
      mensagem: "Conecte sua conta Google antes de escolher um calendário.",
    };
  }

  try {
    await prisma.integracaoGoogle.update({
      where: { usuarioId: session.user.id },
      data: { calendarId: id },
    });
    revalidatePath("/integracoes");
    return { ok: true };
  } catch (err) {
    console.error(
      "[integracoes/_actions] atualizarCalendarioPadrao falhou:",
      err instanceof Error ? err.message : "erro desconhecido",
    );
    return {
      ok: false,
      mensagem: "Não foi possível atualizar o calendário padrão.",
    };
  }
}
