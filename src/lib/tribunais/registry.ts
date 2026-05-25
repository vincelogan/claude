/**
 * Registry de conectores de tribunais.
 *
 * A camada de aplicação NUNCA instancia um conector diretamente — chama
 * `criarConnector(...)` e recebe algo conforme `TribunalConnector`.
 * Isto permite trocar implementações (mock -> real) sem mexer no
 * código que consome.
 */

import type { Credenciais, SistemaTribunal, TribunalConnector } from "./types";
import { MockConnector } from "./connectors/mock";

// Imports dos stubs reais — referenciados aqui para que o TypeScript
// detecte mudanças na assinatura quando substituirmos pelo real.
import { PJeConnector } from "./connectors/pje";
import { ESajConnector } from "./connectors/esaj";
import { ProjudiConnector } from "./connectors/projudi";
import { EProcConnector } from "./connectors/eproc";

/**
 * Metadados de um sistema processual suportado.
 *
 * `status`:
 *  - `stub`     : conector existe mas é placeholder; uso real lança erro
 *  - `beta`     : implementação parcial, validada em poucos tribunais
 *  - `producao` : implementação completa e validada
 */
export interface SistemaInfo {
  sistema: SistemaTribunal;
  label: string;
  status: "stub" | "beta" | "producao";
}

const SISTEMAS: SistemaInfo[] = [
  { sistema: "PJE", label: "PJe (CNJ)", status: "stub" },
  { sistema: "ESAJ", label: "eSAJ (TJSP/outros)", status: "stub" },
  { sistema: "PROJUDI", label: "Projudi", status: "stub" },
  { sistema: "EPROC", label: "eProc", status: "stub" },
];

/**
 * Retorna a lista de sistemas suportados pela plataforma com seu
 * estágio de implementação. Usado pela UI para informar o usuário.
 */
export function listarSistemasSuportados(): SistemaInfo[] {
  return SISTEMAS.slice();
}

/**
 * Factory: dado o sistema processual, a sigla do tribunal e credenciais
 * decifradas, devolve a implementação concreta de `TribunalConnector`.
 *
 * TODO: substituir o fallback para `MockConnector` quando cada conector
 * real estiver pronto. Cada `case` abaixo deverá passar a retornar a
 * implementação concreta correspondente.
 */
export function criarConnector(
  sistema: SistemaTribunal,
  tribunalSigla: string,
  credenciais: Credenciais,
): TribunalConnector {
  switch (sistema) {
    case "PJE":
      // TODO: trocar por `new PJeConnector(tribunalSigla, credenciais)`
      // assim que a integração com CNJ DataJud estiver pronta.
      void PJeConnector;
      return new MockConnector(tribunalSigla, credenciais, "PJE");

    case "ESAJ":
      // TODO: trocar por `new ESajConnector(tribunalSigla, credenciais)`
      // assim que o scraping headless estiver pronto.
      void ESajConnector;
      return new MockConnector(tribunalSigla, credenciais, "ESAJ");

    case "PROJUDI":
      // TODO: trocar por `new ProjudiConnector(tribunalSigla, credenciais)`.
      void ProjudiConnector;
      return new MockConnector(tribunalSigla, credenciais, "PROJUDI");

    case "EPROC":
      // TODO: trocar por `new EProcConnector(tribunalSigla, credenciais)`
      // assim que o cliente SOAP/REST estiver pronto.
      void EProcConnector;
      return new MockConnector(tribunalSigla, credenciais, "EPROC");

    case "MOCK":
      return new MockConnector(tribunalSigla, credenciais, "MOCK");

    default: {
      // Garante exaustividade em tempo de compilação.
      const _exhaustive: never = sistema;
      throw new Error(`Sistema não suportado: ${String(_exhaustive)}`);
    }
  }
}
