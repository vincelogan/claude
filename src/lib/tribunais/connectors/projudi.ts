/**
 * ProjudiConnector — STUB.
 *
 * O Projudi é o sistema processual usado historicamente em TJs como
 * TJPR, TJBA (em parte), TJAC, TJAM e tribunais militares estaduais.
 * Sua interface é antiga (Struts/JSP) e, como o eSAJ, NÃO oferece API
 * pública — toda automação se dá por scraping headless.
 *
 * Caminho de implementação real:
 *
 * 1) **Headless browser**: Playwright (preferido). Persistir
 *    `storageState` por usuário para reaproveitar sessão.
 *
 * 2) **Autenticação**:
 *      - Login por usuário + senha em `https://projudi.<tribunal>.jus.br/`
 *      - Alguns tribunais exigem certificado A1/A3; idem eSAJ — só
 *        suportaremos A1 (PKCS#12 base64 + PIN).
 *      - Captcha ocasional em sessões longas — tratar com retry
 *        manual / fila de re-autenticação se detectado.
 *
 * 3) **Navegação**:
 *      - Path típico: `/projudi/processo/buscaProcesso.do?actionType=...`
 *      - Painel do advogado: `/projudi/listagens/DadosAdvogado.do`
 *      - Consulta por CNJ: form com `numeroProcesso=<cnj>`
 *
 * 4) **Parsing**:
 *      - HTML pesado em tabelas aninhadas; mapear por id/class.
 *      - Movimentações geralmente em `table.resultTable` com colunas
 *        Evento | Descrição | Data/Hora | Usuário.
 *
 * 5) **Rate limit**:
 *      - Limite informal de ~30 req/min por sessão. Backoff exponencial
 *        em 403/429.
 *
 * 6) **Cookies**:
 *      - `JSESSIONID` + cookies `projudiAuth` específicos. Sessão
 *        expira em ~20min ocioso.
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
  "ProjudiConnector: implementação real pendente — scraping headless do portal Projudi em desenvolvimento";

export class ProjudiConnector implements TribunalConnector {
  readonly sistema: SistemaTribunal = "PROJUDI";
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
