/**
 * Helpers para autenticação OAuth2 com Google APIs.
 *
 * Usa `googleapis` v144. Os tokens são cifrados via `@/lib/crypto` antes de
 * serem persistidos em `IntegracaoGoogle` e decifrados ao serem carregados.
 *
 * O cliente devolvido por `clienteAutenticado` já vem com auto-refresh:
 * sempre que o `access_token` é renovado pelo googleapis, o novo valor
 * (e a nova expiração) são re-cifrados e gravados no banco.
 */

import { google } from "googleapis";
import type { Credentials, OAuth2Client } from "google-auth-library";

import { prisma } from "@/lib/prisma";
import { decrypt, encrypt } from "@/lib/crypto";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.email",
];

function envObrigatoria(nome: string): string {
  const valor = process.env[nome];
  if (!valor || valor.trim().length === 0) {
    throw new Error(`Variável de ambiente ${nome} não definida.`);
  }
  return valor;
}

/**
 * Cria um novo OAuth2 client configurado com as credenciais do app
 * (sem tokens de usuário). Use este para iniciar o fluxo de consent.
 */
export function criarOAuthClient(): OAuth2Client {
  const clientId = envObrigatoria("GOOGLE_OAUTH_CLIENT_ID");
  const clientSecret = envObrigatoria("GOOGLE_OAUTH_CLIENT_SECRET");
  const redirectUri = envObrigatoria("GOOGLE_OAUTH_REDIRECT_URI");

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Gera a URL de consent da Google para iniciar o fluxo OAuth.
 * `state` é repassado ao callback e deve ser validado lá (CSRF).
 */
export function urlAutorizacao(state: string): string {
  const client = criarOAuthClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
    state,
    include_granted_scopes: true,
  });
}

export type TokensTrocados = {
  accessToken: string;
  refreshToken: string;
  expiryDate: Date;
};

/**
 * Troca o `code` retornado pelo Google por tokens de acesso/refresh.
 * Lança erro se o Google não devolver refresh_token (usuário precisaria
 * revogar o app em https://myaccount.google.com/permissions e reconectar).
 */
export async function trocarCodePorTokens(code: string): Promise<TokensTrocados> {
  const client = criarOAuthClient();
  const { tokens } = await client.getToken(code);

  if (!tokens.access_token) {
    throw new Error("Google não retornou access_token.");
  }
  if (!tokens.refresh_token) {
    throw new Error(
      "Google não retornou refresh_token. Revogue o acesso em myaccount.google.com/permissions e tente novamente.",
    );
  }

  const expiryDate = tokens.expiry_date
    ? new Date(tokens.expiry_date)
    : new Date(Date.now() + 60 * 60 * 1000); // fallback 1h

  return {
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiryDate,
  };
}

/**
 * Erro específico para indicar que a integração do usuário foi revogada/expirou
 * e precisa ser reconectada. As funções de calendar capturam erros 4xx do
 * Google e lançam esta classe após limpar a integração no banco.
 */
export class IntegracaoGoogleRevogadaError extends Error {
  constructor(usuarioId: string) {
    super(
      `Integração com Google revogada ou expirada para o usuário ${usuarioId}. Reconecte em /integracoes.`,
    );
    this.name = "IntegracaoGoogleRevogadaError";
  }
}

/**
 * Marca a IntegracaoGoogle como inativa e limpa tokens — usado quando o
 * Google devolve invalid_grant / token revogado.
 */
export async function marcarIntegracaoInvalida(usuarioId: string): Promise<void> {
  await prisma.integracaoGoogle
    .update({
      where: { usuarioId },
      data: { ativa: false },
    })
    .catch(() => {
      /* registro pode já ter sido removido — ignora */
    });
}

/**
 * Retorna um OAuth2Client autenticado para o `usuarioId` informado.
 * - Decifra access/refresh tokens da IntegracaoGoogle.
 * - Liga um listener que re-cifra e persiste novos tokens quando o
 *   googleapis fizer refresh automático.
 *
 * Lança `IntegracaoGoogleRevogadaError` se não houver integração ativa.
 */
export async function clienteAutenticado(
  usuarioId: string,
): Promise<OAuth2Client> {
  const integracao = await prisma.integracaoGoogle.findUnique({
    where: { usuarioId },
  });

  if (!integracao || !integracao.ativa) {
    throw new IntegracaoGoogleRevogadaError(usuarioId);
  }

  let accessToken: string;
  let refreshToken: string;
  try {
    accessToken = decrypt(integracao.accessTokenCif);
    refreshToken = decrypt(integracao.refreshTokenCif);
  } catch {
    // Tokens corrompidos ou chave trocada — força reconexão.
    await marcarIntegracaoInvalida(usuarioId);
    throw new IntegracaoGoogleRevogadaError(usuarioId);
  }

  const client = criarOAuthClient();
  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    expiry_date: integracao.expiraEm
      ? integracao.expiraEm.getTime()
      : undefined,
  });

  // Auto-refresh: googleapis emite 'tokens' quando faz refresh do access_token.
  client.on("tokens", (novos: Credentials) => {
    // Persiste de forma assíncrona — não bloqueia a chamada atual.
    void persistirTokensAtualizados(usuarioId, novos, refreshToken);
  });

  return client;
}

/**
 * Persiste tokens recebidos via evento 'tokens' do OAuth2Client.
 * Mantém o refresh_token antigo se o Google não enviar um novo.
 */
async function persistirTokensAtualizados(
  usuarioId: string,
  novos: Credentials,
  refreshTokenAtual: string,
): Promise<void> {
  try {
    const data: {
      accessTokenCif?: string;
      refreshTokenCif?: string;
      expiraEm?: Date;
    } = {};

    if (novos.access_token) {
      data.accessTokenCif = encrypt(novos.access_token);
    }
    // refresh_token só vem em casos específicos — mantém o antigo se ausente.
    const novoRefresh = novos.refresh_token ?? refreshTokenAtual;
    if (novos.refresh_token) {
      data.refreshTokenCif = encrypt(novoRefresh);
    }
    if (novos.expiry_date) {
      data.expiraEm = new Date(novos.expiry_date);
    }

    if (Object.keys(data).length === 0) return;

    await prisma.integracaoGoogle.update({
      where: { usuarioId },
      data,
    });
  } catch (err) {
    // Nunca logue tokens. Apenas o tipo de erro.
    console.error(
      "[google/oauth] falha ao persistir tokens atualizados:",
      err instanceof Error ? err.message : "erro desconhecido",
    );
  }
}
