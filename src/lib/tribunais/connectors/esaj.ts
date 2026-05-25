/**
 * ESajConnector — STUB.
 *
 * O eSAJ é o sistema da Softplan adotado por diversos TJs (TJSP é o caso
 * mais expressivo). Diferentemente do PJe, **o eSAJ NÃO expõe API REST/SOAP
 * pública** para terceiros — toda automação precisa ser feita por scraping
 * do portal web.
 *
 * Caminho de implementação real:
 *
 * 1) **Headless browser**: Playwright (preferido pela API moderna) ou
 *    Puppeteer. Rodar em modo headless com `chromium`, persistindo
 *    `storageState` (cookies) por sessão de usuário.
 *
 * 2) **Autenticação**:
 *      - Login com **certificado digital A1** (PKCS#12) carregado no
 *        contexto via `browser.newContext({ clientCertificates: [...] })`.
 *      - Alternativa A3: requer hardware (token/cartão) — inviável em
 *        servidor. Decisão: SÓ suportar A1 (campo `certificadoBase64` +
 *        `pinCertificado` em `Credenciais`).
 *      - URL típica: `https://esaj.tjsp.jus.br/sajcas/login?service=...`
 *
 * 3) **Navegação no painel do advogado**:
 *      - Após login, ir em "Push" ou "Consulta processual".
 *      - URL típica para painel: `/cpopg/open.do` (1º grau) e
 *        `/cposg/open.do` (2º grau).
 *      - Para um processo específico: form `consultar.do` recebendo
 *        `dadosConsulta.valorConsultaNuUnificado=<cnj>`.
 *
 * 4) **Parsing**:
 *      - HTML estruturado mas frágil — usar seletores específicos e
 *        snapshot tests para detectar mudanças do tribunal.
 *      - Movimentações em `<table id="tabelaUltimasMovimentacoes">`,
 *        com colunas data / descrição.
 *      - Partes em `<table id="tableTodasPartes">`.
 *
 * 5) **Sessão / Cookies**:
 *      - Persistir `storageState` por integração para evitar relogin a
 *        cada consulta. Cookie `JSESSIONID` expira em ~30min.
 *      - Em caso de 302 para login, refazer autenticação.
 *
 * 6) **Boas práticas**:
 *      - Respeitar rate limit (~1 req/s por sessão).
 *      - Cache HTTP de páginas estáticas.
 *      - Headers `User-Agent` realistas; o eSAJ bloqueia UAs default.
 *
 * 7) **Tribunais que usam eSAJ** (parcial):
 *      - TJSP, TJAL, TJAM, TJBA, TJCE, TJMS, TJPE, TJSC, TJES, TJAC,
 *        TJMT, TJMA, TJPB, TJRN, TJPI, TJRO, TJSE, TJTO.
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
  "ESajConnector: implementação real pendente — scraping headless com Playwright + certificado A1 em desenvolvimento";

export class ESajConnector implements TribunalConnector {
  readonly sistema: SistemaTribunal = "ESAJ";
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
