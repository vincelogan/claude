/**
 * Utilitários para manipulação do número CNJ (Conselho Nacional de Justiça).
 *
 * Formato canônico: NNNNNNN-DD.AAAA.J.TR.OOOO (20 dígitos).
 *   NNNNNNN — número sequencial (7)
 *   DD      — dígito verificador (2)
 *   AAAA    — ano (4)
 *   J       — segmento do Poder Judiciário (1)
 *   TR      — tribunal (2)
 *   OOOO    — unidade de origem (4)
 */

const CNJ_REGEX_FORMATADO = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/;

/** Remove tudo que não for dígito. */
export function limparCnj(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/\D+/g, "");
}

/**
 * Formata um número CNJ (aceita 20 dígitos ou já formatado).
 * Retorna a string original caso não atinja 20 dígitos.
 */
export function formatarCnj(s: string | null | undefined): string {
  if (!s) return "";
  const digits = limparCnj(s);
  if (digits.length !== 20) return s;
  return `${digits.slice(0, 7)}-${digits.slice(7, 9)}.${digits.slice(9, 13)}.${digits.slice(13, 14)}.${digits.slice(14, 16)}.${digits.slice(16, 20)}`;
}

/**
 * Validação do número CNJ. Por ora valida apenas o formato:
 * aceita 20 dígitos puros OU a forma canônica formatada.
 * O cálculo de dígito verificador (módulo 97) é stub para implementação futura.
 */
export function validarCnj(s: string | null | undefined): boolean {
  if (!s) return false;
  if (CNJ_REGEX_FORMATADO.test(s)) return true;
  const digits = limparCnj(s);
  return digits.length === 20;
}
