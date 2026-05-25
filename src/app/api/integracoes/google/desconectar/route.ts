/**
 * POST /api/integracoes/google/desconectar
 *
 * Remove a IntegracaoGoogle do usuário logado e limpa todos os
 * `googleEventId` de Prazos e Audiências em que ele é responsável.
 *
 * TODO: opcionalmente revogar o refresh_token via
 * https://oauth2.googleapis.com/revoke e/ou apagar os eventos do calendar
 * antes de descartar os tokens. Hoje só limpa o vínculo local.
 */

import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function urlInterna(path: string): URL {
  return new URL(path, process.env.APP_URL ?? "http://localhost:3000");
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(urlInterna("/login"), { status: 303 });
  }

  const usuarioId = session.user.id;

  try {
    await prisma.$transaction([
      prisma.prazo.updateMany({
        where: { responsavelId: usuarioId, googleEventId: { not: null } },
        data: { googleEventId: null },
      }),
      prisma.audiencia.updateMany({
        where: { responsavelId: usuarioId, googleEventId: { not: null } },
        data: { googleEventId: null },
      }),
      prisma.integracaoGoogle.deleteMany({
        where: { usuarioId },
      }),
    ]);

    return NextResponse.redirect(
      urlInterna("/integracoes?google=desconectado"),
      { status: 303 },
    );
  } catch (err) {
    console.error(
      "[google/desconectar] falha ao desconectar:",
      err instanceof Error ? err.message : "erro desconhecido",
    );
    return NextResponse.redirect(urlInterna("/integracoes?google=erro"), {
      status: 303,
    });
  }
}
