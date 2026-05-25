/**
 * EProcConnector — STUB.
 *
 * O eProc é o sistema desenvolvido pelo TRF4 e adotado por vários
 * tribunais (TRF4, TJRS, TJSC parcialmente, alguns TRTs). Diferente do
 * eSAJ/Projudi, **alguns tribunais expõem um WebService SOAP** para
 * advogados autenticados, o que dispensa scraping na maior parte das
 * operações.
 *
 * Caminho de implementação real:
 *
 * 1) **WebService SOAP (preferido quando disponível)**:
 *      - WSDL típico: `https://eproc.<tribunal>.jus.br/eproc/wsdl/intercomunicacao-2.2.2.wsdl`
 *      - Padrão "Modelo Nacional de Interoperabilidade do Poder Judiciário"
 *        (MNI 2.2.2) — definido pelo CNJ/Justiça Federal.
 *      - Operações principais:
 *           - `consultarProcesso(numeroProcesso)` -> dadosBasicos, partes,
 *             movimentos, documentos
 *           - `entregarManifestacaoProcessual(...)` (peticionamento)
 *           - `consultarAvisosPendentes(...)`
 *      - Autenticação: certificado digital A1 (mTLS) + assinatura XMLDSig
 *        no envelope SOAP. Usar `node-soap` + `xml-crypto`.
 *
 * 2) **Fallback REST (alguns tribunais)**:
 *      - TRF4 expõe `https://eproc.trf4.jus.br/eproc2trf4/api/v1/processos/{cnj}`
 *        com token Bearer obtido via login OAuth-like.
 *      - Resposta JSON com estrutura próxima ao MNI.
 *
 * 3) **Scraping (último recurso)**:
 *      - Só onde nem SOAP nem REST estão disponíveis (ex.: instâncias
 *        antigas). Mesmo padrão do eSAJ — Playwright + storageState.
 *
 * 4) **Mapeamento MNI -> DadosProcesso**:
 *      - `dadosBasicos.classeProcessual.nome`  -> classeProcessual
 *      - `dadosBasicos.valorCausa`             -> valorCausa
 *      - `dadosBasicos.orgaoJulgador.nome`     -> vara
 *      - `polo[].parte[]`                      -> partes
 *      - `movimento[]`                         -> movimentacoes
 *           - `dataHora` (xsd:dateTime) -> data
 *           - `movimentoLocal.descricao` ou `movimentoNacional.descricao` -> descricao
 *           - `movimentoLocal.codigoPaiNacional` ou
 *             `movimentoNacional.codigoNacional` -> tipo (TPU)
 *
 * 5) **Tribunais que usam eProc** (parcial):
 *      - TRF4, TRF2, TJRS, TJSC, TJTO, TJDFT (parcial), alguns TRTs.
 *
 * IMPLEMENTAÇÃO PENDENTE.
 */

import type {
  Credenciais,
  DadosProcesso,
  ResultadoSync,
  SistemaTribunal,
  TribunalConnector,
} from "../types";

const MSG =
  "EProcConnector: implementação real pendente — cliente SOAP MNI 2.2.2 (com fallback REST) em desenvolvimento";

export class EProcConnector implements TribunalConnector {
  readonly sistema: SistemaTribunal = "EPROC";
  readonly tribunalSigla: string;

  constructor(tribunalSigla: string, _credenciais: Credenciais) {
    this.tribunalSigla = tribunalSigla;
  }

  async consultarProcesso(_numeroCnj: string): Promise<ResultadoSync> {
    throw new Error(MSG);
  }

  async listarProcessosDoAdvogado(): Promise<DadosProcesso[]> {
    throw new Error(MSG);
  }
}
