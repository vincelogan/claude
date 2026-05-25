/**
 * GET /api/integracoes/google/conectar
 *
 * Inicia o fluxo OAuth2 do Google. Gera um `state` aleatório (CSRF),
 * grava num cookie httpOnly e redireciona para a tela de consent da Google.
 */

import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { urlAutorizacao } from "@/lib/google/oauth";

export const dynamic = "force-dynamic";

export const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(
      new URL("/login", process.env.APP_URL ?? "http://localhost:3000"),
    );
  }

  const state = randomBytes(32).toString("base64url");

  let url: string;
  try {
    url = urlAutorizacao(state);
  } catch (err) {
    console.error(
      "[google/conectar] falha ao gerar URL de autorização:",
      err instanceof Error ? err.message : "erro desconhecido",
    );
    const redirectErro = new URL(
      "/integracoes?google=erro",
      process.env.APP_URL ?? "http://localhost:3000",
    );
    return NextResponse.redirect(redirectErro);
  }

  const response = NextResponse.redirect(url);
  response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60, // 10 minutos para concluir o fluxo
  });
  return response;
}
