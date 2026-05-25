/**
 * GET /api/integracoes/google/callback
 *
 * Callback do OAuth2 do Google. Valida `state` (CSRF), troca o `code` por
 * tokens, cifra-os e faz upsert da `IntegracaoGoogle` do usuário logado.
 */

import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";
import { trocarCodePorTokens } from "@/lib/google/oauth";
import { GOOGLE_OAUTH_STATE_COOKIE } from "../conectar/route";

export const dynamic = "force-dynamic";

function urlInterna(path: string): URL {
  return new URL(path, process.env.APP_URL ?? "http://localhost:3000");
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(urlInterna("/login"));
  }

  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const stateRecebido = searchParams.get("state");
  const erroGoogle = searchParams.get("error");

  const respostaErro = NextResponse.redirect(
    urlInterna("/integracoes?google=erro"),
  );
  respostaErro.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);

  if (erroGoogle) {
    console.warn("[google/callback] usuário cancelou ou erro Google:", erroGoogle);
    return respostaErro;
  }

  if (!code || !stateRecebido) {
    console.warn("[google/callback] parâmetros code/state ausentes.");
    return respostaErro;
  }

  const stateCookie = req.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
  if (!stateCookie || stateCookie !== stateRecebido) {
    console.warn("[google/callback] state inválido (possível CSRF).");
    return respostaErro;
  }

  try {
    const tokens = await trocarCodePorTokens(code);

    const accessTokenCif = encrypt(tokens.accessToken);
    const refreshTokenCif = encrypt(tokens.refreshToken);

    // Mantém o calendarId já escolhido pelo usuário (se houver) na reconexão.
    const existente = await prisma.integracaoGoogle.findUnique({
      where: { usuarioId: session.user.id },
      select: { calendarId: true },
    });

    await prisma.integracaoGoogle.upsert({
      where: { usuarioId: session.user.id },
      create: {
        usuarioId: session.user.id,
        accessTokenCif,
        refreshTokenCif,
        expiraEm: tokens.expiryDate,
        calendarId: "primary",
        ativa: true,
      },
      update: {
        accessTokenCif,
        refreshTokenCif,
        expiraEm: tokens.expiryDate,
        calendarId: existente?.calendarId ?? "primary",
        ativa: true,
      },
    });

    const ok = NextResponse.redirect(
      urlInterna("/integracoes?google=conectado"),
    );
    ok.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
    return ok;
  } catch (err) {
    console.error(
      "[google/callback] falha ao trocar code por tokens:",
      err instanceof Error ? err.message : "erro desconhecido",
    );
    return respostaErro;
  }
}
