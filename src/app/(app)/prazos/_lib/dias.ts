/**
 * Helpers de cálculo de prazos.
 *
 * Regra CPC (art. 219): prazos processuais em dias úteis. A funcionalidade
 * leva em conta apenas sábados e domingos por enquanto. Feriados (nacionais,
 * estaduais, forenses) serão tratados em outra iteração.
 */

const UM_DIA_MS = 1000 * 60 * 60 * 24;

function inicioDoDia(data: Date): Date {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

function ehDiaUtil(data: Date): boolean {
  const dia = data.getDay();
  // 0 = domingo, 6 = sábado
  // TODO: considerar feriados nacionais/estaduais/forenses (ex.: holidays-br)
  return dia !== 0 && dia !== 6;
}

/**
 * Calcula a data de vencimento somando `dias` à data de início.
 *
 * - Se `diasCorridos` for true, soma dias corridos.
 * - Se for false (regra CPC), conta apenas dias úteis, pulando sábados e
 *   domingos. O dia de início NÃO é contado (o termo "a quo" é o próximo).
 */
export function calcularVencimento(
  inicio: Date,
  dias: number,
  diasCorridos: boolean,
): Date {
  if (diasCorridos) {
    const venc = new Date(inicio);
    venc.setDate(venc.getDate() + dias);
    return venc;
  }

  let restante = dias;
  const cursor = new Date(inicio);
  while (restante > 0) {
    cursor.setDate(cursor.getDate() + 1);
    if (ehDiaUtil(cursor)) {
      restante -= 1;
    }
  }
  return cursor;
}

/**
 * Quantidade de dias (corridos) entre hoje e a data de vencimento.
 * Negativo quando o prazo já venceu, zero quando vence hoje.
 */
export function diasAteVencimento(vencimento: Date): number {
  const hoje = inicioDoDia(new Date());
  const venc = inicioDoDia(vencimento);
  return Math.round((venc.getTime() - hoje.getTime()) / UM_DIA_MS);
}

export type Urgencia =
  | "vencido"
  | "hoje"
  | "urgente"
  | "proximo"
  | "normal";

/**
 * Classifica a urgência do prazo:
 * - vencido: data já passou
 * - hoje: vence hoje
 * - urgente: vence em até 3 dias
 * - proximo: vence em até 7 dias
 * - normal: vence em mais de 7 dias
 */
export function classificarUrgencia(vencimento: Date): Urgencia {
  const dias = diasAteVencimento(vencimento);
  if (dias < 0) return "vencido";
  if (dias === 0) return "hoje";
  if (dias <= 3) return "urgente";
  if (dias <= 7) return "proximo";
  return "normal";
}

/**
 * Texto humanizado em pt-BR (ex.: "vence hoje", "em 3 dias", "há 5 dias").
 */
export function descreverPrazo(vencimento: Date): string {
  const dias = diasAteVencimento(vencimento);
  if (dias === 0) return "vence hoje";
  if (dias === 1) return "vence amanhã";
  if (dias === -1) return "venceu ontem";
  if (dias > 0) return `em ${dias} dias`;
  return `há ${Math.abs(dias)} dias`;
}
