/**
 * PJeConnector — STUB.
 *
 * O PJe (Processo Judicial eletrônico) é o sistema mantido pelo CNJ e
 * usado pela maior parte da Justiça do Trabalho, Justiça Federal e
 * tribunais estaduais que aderiram. Existem duas abordagens viáveis:
 *
 * 1) **API pública do CNJ DataJud** (RECOMENDADA, sem credencial pessoal):
 *
 *    Base URL: https://api-publica.datajud.cnj.jus.br/
 *
 *    O DataJud expõe um cluster Elasticsearch público com um índice por
 *    tribunal. Cada índice tem o nome `api_publica_<sigla>`. Exemplos:
 *
 *      - api_publica_tjsp  (TJSP)
 *      - api_publica_tjrj  (TJRJ)
 *      - api_publica_tjmg  (TJMG)
 *      - api_publica_trf3  (TRF3)
 *      - api_publica_trt2  (TRT 2ª Região)
 *      - api_publica_stj   (STJ)
 *      - api_publica_tst   (TST)
 *      - ... (um por tribunal cadastrado no CNJ)
 *
 *    Autenticação: token público fixo no header
 *      `Authorization: APIKey <chave-publica-divulgada-pelo-CNJ>`
 *
 *    Endpoint de busca (Elasticsearch DSL):
 *      POST /api_publica_tjsp/_search
 *      body: { "query": { "match": { "numeroProcesso": "<cnj>" } } }
 *
 *    Paginação: usar `search_after` ou `scroll` (recomenda-se `search_after`
 *    com `pit`/`sort` por `dataAjuizamento` para coleta incremental).
 *
 *    Mapeamento de campos -> DadosProcesso:
 *      - `numeroProcesso`           -> numeroCnj
 *      - `classe.nome`              -> classeProcessual
 *      - `orgaoJulgador.nome`       -> vara
 *      - `assuntos[].nome`          -> (usar para enriquecer `Assunto`)
 *      - `movimentos[]`             -> movimentacoes
 *           - `dataHora` -> data
 *           - `nome`     -> descricao
 *           - `codigo`   -> tipo (tabela TPU/CNJ)
 *
 *    Vantagens: sem credencial do usuário, dados públicos, padrão CNJ.
 *    Limitações: latência (Elastic público), processos sigilosos ficam
 *    fora do índice — para sigilosos precisamos da abordagem (2).
 *
 * 2) **API REST autenticada do PJe** (por tribunal):
 *
 *    Cada instância do PJe expõe `/pje-comum-api/api/processos/...` com
 *    autenticação por certificado digital A1/A3 (mTLS) ou usuário/senha.
 *    Necessária para acessar processos sigilosos do advogado autenticado.
 *
 *    Exemplo (TRT2):
 *      GET https://pje.trt2.jus.br/pje-comum-api/api/processos/{cnj}
 *      headers: Authorization: Bearer <token> + Cert client
 *
 *    Cada tribunal pode ter pequenas variações de path/host — o
 *    `PJeConnector` real precisará de um mapa `tribunalSigla -> baseUrl`.
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
  "PJeConnector: implementação real pendente — usando interface CNJ DataJud em desenvolvimento";

export class PJeConnector implements TribunalConnector {
  readonly sistema: SistemaTribunal = "PJE";
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
