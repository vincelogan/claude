/**
 * MockConnector — Implementação de desenvolvimento.
 *
 * Mock para desenvolvimento; substitua por implementações reais
 * (PJE via REST/SOAP do CNJ DataJud, eSAJ via scraping headless com
 * Playwright/Puppeteer, Projudi via scraping, eProc via WebService SOAP).
 *
 * Gera dados determinísticos a partir do `numeroCnj`, permitindo que
 * testes manuais e a sincronização em desenvolvimento sejam estáveis
 * (a mesma entrada produz sempre o mesmo conjunto de movimentações).
 */

import { createHash } from "node:crypto";

import type {
  Credenciais,
  DadosProcesso,
  ResultadoSync,
  SistemaTribunal,
  TribunalConnector,
} from "../types";

/** Latência simulada (ms). */
const DELAY_MIN = 300;
const DELAY_MAX = 500;

function sha256(...partes: string[]): string {
  return createHash("sha256").update(partes.join("|"), "utf8").digest("hex");
}

function intDeterministico(seed: string, min: number, max: number): number {
  const h = sha256(seed);
  // Pega os 8 primeiros nibbles -> uint32
  const n = parseInt(h.slice(0, 8), 16);
  return min + (n % (max - min + 1));
}

export class MockConnector implements TribunalConnector {
  readonly sistema: SistemaTribunal;
  readonly tribunalSigla: string;

  constructor(
    tribunalSigla: string,
    // Credenciais não são usadas pelo mock, mas mantemos a assinatura
    // homogênea entre conectores.
    _credenciais: Credenciais,
    sistema: SistemaTribunal = "MOCK",
  ) {
    this.sistema = sistema;
    this.tribunalSigla = tribunalSigla;
  }

  async consultarProcesso(numeroCnj: string): Promise<ResultadoSync> {
    const delay = intDeterministico(`delay:${numeroCnj}`, DELAY_MIN, DELAY_MAX);
    await new Promise((r) => setTimeout(r, delay));

    const qtdMovs = intDeterministico(`qtd:${numeroCnj}`, 3, 6);
    const hoje = new Date();
    const movimentacoes: NonNullable<DadosProcesso["movimentacoes"]> = [];

    for (let i = 0; i < qtdMovs; i++) {
      const data = new Date(hoje);
      // Escalonadas para trás: i*7 dias atrás (aprox.).
      data.setDate(data.getDate() - i * 7);
      data.setHours(9, 0, 0, 0);

      const descricoes = [
        "Juntada de petição",
        "Despacho proferido",
        "Conclusos para decisão",
        "Publicação no Diário Oficial",
        "Intimação eletrônica expedida",
        "Decisão interlocutória",
      ];
      const tipos = ["JUNTADA", "DESPACHO", "PUBLICACAO", "DECISAO"];
      const descricao = descricoes[i % descricoes.length] ?? "Movimentação";
      const tipo = tipos[i % tipos.length];

      movimentacoes.push({
        data,
        descricao,
        tipo,
        hash: sha256(numeroCnj, String(i), descricao, data.toISOString()),
      });
    }

    const processo: DadosProcesso = {
      numeroCnj,
      classeProcessual: "Procedimento Comum Cível",
      valorCausa: intDeterministico(`valor:${numeroCnj}`, 5000, 250000),
      vara: `${intDeterministico(`vara:${numeroCnj}`, 1, 30)}ª Vara Cível`,
      comarca: this.tribunalSigla,
      partes: [
        {
          nome: "Autor Fictício da Silva",
          cpfCnpj: "000.000.000-00",
          polo: "ATIVO",
        },
        {
          nome: "Réu Fictício Ltda.",
          cpfCnpj: "00.000.000/0001-00",
          polo: "PASSIVO",
        },
      ],
      movimentacoes,
    };

    return { ok: true, processo };
  }

  async listarProcessosDoAdvogado(): Promise<DadosProcesso[]> {
    // Mock: devolve uma lista curta com numeração fictícia.
    await new Promise((r) => setTimeout(r, DELAY_MIN));
    return [];
  }
}
