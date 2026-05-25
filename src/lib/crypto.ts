/**
 * Helpers de cifragem simétrica para credenciais de integrações (OAuth tokens, etc).
 *
 * Algoritmo: AES-256-GCM.
 *
 * Chave: a variável de ambiente `ENCRYPTION_KEY` deve conter 32 bytes de
 * material aleatório, codificados em **base64** (recomendado, 44 chars com
 * padding) ou **hex** (64 chars). Gere com:
 *
 *   openssl rand -base64 32
 *   # ou
 *   openssl rand -hex 32
 *
 * Formato da saída de `encrypt`: `${ivBase64}:${authTagBase64}:${cipherBase64}`.
 * Cada chamada gera um IV de 12 bytes novo (recomendado para GCM).
 *
 * Atenção: a perda da `ENCRYPTION_KEY` torna os tokens cifrados irrecuperáveis.
 */

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits — recomendado para GCM
const KEY_LENGTH = 32; // 256 bits
const AUTH_TAG_LENGTH = 16;

let cachedKey: Buffer | null = null;

function carregarChave(): Buffer {
  if (cachedKey) return cachedKey;

  const raw = process.env.ENCRYPTION_KEY;
  if (!raw || raw.trim().length === 0) {
    throw new Error(
      "ENCRYPTION_KEY não definida. Configure 32 bytes em base64 ou hex no .env.",
    );
  }

  const valor = raw.trim();
  let buffer: Buffer | null = null;

  // Tenta base64 primeiro (44 chars com padding, ou 43 sem).
  if (/^[A-Za-z0-9+/=_-]+$/.test(valor)) {
    try {
      const tentativa = Buffer.from(valor, "base64");
      if (tentativa.length === KEY_LENGTH) {
        buffer = tentativa;
      }
    } catch {
      // ignora — tentamos hex em seguida
    }
  }

  // Fallback: hex (64 chars).
  if (!buffer && /^[0-9a-fA-F]+$/.test(valor) && valor.length === 64) {
    buffer = Buffer.from(valor, "hex");
  }

  if (!buffer || buffer.length !== KEY_LENGTH) {
    throw new Error(
      `ENCRYPTION_KEY inválida. Esperado 32 bytes em base64 (44 chars) ou hex (64 chars).`,
    );
  }

  // Sanity check timing-safe contra um buffer de zeros (alerta dev de chave fraca).
  const zeros = Buffer.alloc(KEY_LENGTH, 0);
  if (timingSafeEqual(buffer, zeros)) {
    throw new Error("ENCRYPTION_KEY não pode ser composta apenas de zeros.");
  }

  cachedKey = buffer;
  return cachedKey;
}

/**
 * Cifra `plaintext` (UTF-8) e retorna string no formato
 * `${ivBase64}:${authTagBase64}:${cipherBase64}`.
 */
export function encrypt(plaintext: string): string {
  if (typeof plaintext !== "string") {
    throw new TypeError("encrypt: plaintext deve ser string.");
  }
  const key = carregarChave();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGO, key, iv);
  const cifrado = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    cifrado.toString("base64"),
  ].join(":");
}

/**
 * Decifra string produzida por `encrypt`. Lança erro se o formato for inválido
 * ou se a autenticação falhar (tampering, chave errada).
 */
export function decrypt(ciphertext: string): string {
  if (typeof ciphertext !== "string") {
    throw new TypeError("decrypt: ciphertext deve ser string.");
  }
  const partes = ciphertext.split(":");
  if (partes.length !== 3) {
    throw new Error(
      "decrypt: formato inválido. Esperado 'iv:authTag:cipher' (base64).",
    );
  }
  const [ivB64, tagB64, cipherB64] = partes;
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const cifrado = Buffer.from(cipherB64, "base64");

  if (iv.length !== IV_LENGTH) {
    throw new Error("decrypt: IV com tamanho inesperado.");
  }
  if (authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error("decrypt: authTag com tamanho inesperado.");
  }

  const key = carregarChave();
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);

  try {
    const claro = Buffer.concat([
      decipher.update(cifrado),
      decipher.final(),
    ]);
    return claro.toString("utf8");
  } catch {
    throw new Error(
      "decrypt: falha de autenticação — dado corrompido ou chave incorreta.",
    );
  }
}
