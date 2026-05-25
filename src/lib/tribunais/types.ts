/**
 * Tipos compartilhados pela camada de integração com tribunais.
 *
 * Toda implementação concreta (PJe, eSAJ, Projudi, eProc, Mock, ...)
 * conforma-se à interface `TribunalConnector`. A camada de aplicação
 * fala apenas com a interface — o `registry` resolve a implementação.
 */

/**
 * Identificador do sistema processual.
 *
 * O enum do Prisma (`SistemaTribunal`) tem `OUTRO` em vez de `MOCK`;
 * usamos `MOCK` aqui apenas como sentinel da implementação de
 * desenvolvimento. A camada de persistência converte conforme
 * necessário.
 */
export type SistemaTribunal = "PJE" | "ESAJ" | "PROJUDI" | "EPROC" | "MOCK";

/**
 * Credenciais de acesso ao sistema do tribunal.
 *
 * O formato real depende do conector:
 *  - PJe/Projudi: normalmente usuário + senha (ou certificado A1/A3)
 *  - eSAJ: certificado digital A1 (PKCS#12 em base64) + PIN
 *  - eProc: usuário + senha ou certificado
 *
 * Estrutura intencionalmente aberta — novos campos podem ser
 * adicionados sem quebrar o contrato.
 */
export interface Credenciais {
  usuario?: string;
  senha?: string;
  /** Conteúdo binário do certificado A1 (PKCS#12), codificado em base64. */
  certificadoBase64?: string;
  /** PIN/senha do certificado digital. */
  pinCertificado?: string;
  /** Espaço para extensões futuras (tokens OAuth, chaves API, etc.). */
  [extra: string]: string | undefined;
}

/**
 * Polo da parte. Espelha `PoloParte` do Prisma (subset relevante).
 */
export type PoloDados = "ATIVO" | "PASSIVO" | "TERCEIRO";

/**
 * "Snapshot" dos dados de um processo retornado pelo tribunal.
 *
 * Mapeado para o modelo `Processo` + `Parte` + `Movimentacao` pelo
 * serviço de sincronização.
 */
export interface DadosProcesso {
  numeroCnj: string;
  classeProcessual?: string;
  valorCausa?: number;
  vara?: string;
  comarca?: string;
  partes?: Array<{
    nome: string;
    cpfCnpj?: string;
    polo: PoloDados;
  }>;
  movimentacoes?: Array<{
    data: Date;
    descricao: string;
    tipo?: string;
    /** Hash determinístico para deduplicação (unique com processoId). */
    hash: string;
  }>;
}

/**
 * Resultado de uma consulta ou sincronização individual.
 */
export interface ResultadoSync {
  ok: boolean;
  processo?: DadosProcesso;
  erro?: string;
}

/**
 * Contrato implementado por todos os conectores de tribunal.
 *
 * Implementações DEVEM ser instanciadas pelo `registry`, recebendo
 * `tribunalSigla` e as `Credenciais` já decifradas.
 */
export interface TribunalConnector {
  readonly sistema: SistemaTribunal;
  readonly tribunalSigla: string;

  /**
   * Consulta um processo pelo número CNJ e retorna o snapshot.
   * Não deve lançar para erros esperados — preferir `{ ok: false, erro }`.
   */
  consultarProcesso(numeroCnj: string): Promise<ResultadoSync>;

  /**
   * Lista todos os processos vinculados ao advogado autenticado.
   * Opcional: nem todo sistema expõe essa funcionalidade.
   */
  listarProcessosDoAdvogado?(): Promise<DadosProcesso[]>;
}
