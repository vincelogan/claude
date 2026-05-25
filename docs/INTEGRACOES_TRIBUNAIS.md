# Integrações com Tribunais

Arquitetura de conectores que abstrai PJe, eSAJ, Projudi e eProc por
trás de uma interface única, permitindo trocar implementações sem
mexer no código que consome.

## Visão geral

```
+--------------------+     +-----------------+     +--------------------+
| Server Actions /   |---->|  registry       |---->|  TribunalConnector |
| API /sincronizar   |     |  criarConnector |     |  (impl. concreta)  |
+--------------------+     +-----------------+     +--------------------+
        |                                                |
        v                                                v
+--------------------+                          +--------------------+
|  sync.ts           |                          |  Mock / PJe /      |
|  sincronizarProc.  |<-------------------------|  eSAJ / Projudi /  |
|  upsert mov.       |       DadosProcesso       |  eProc             |
+--------------------+                          +--------------------+
```

### Componentes

- **`src/lib/tribunais/types.ts`** — contratos compartilhados
  (`TribunalConnector`, `Credenciais`, `DadosProcesso`,
  `ResultadoSync`).
- **`src/lib/tribunais/registry.ts`** — factory `criarConnector(sistema,
  sigla, credenciais)` e `listarSistemasSuportados()`. Hoje devolve
  `MockConnector` para qualquer combinação.
- **`src/lib/tribunais/connectors/*.ts`** — uma classe por sistema
  processual.
- **`src/lib/tribunais/sync.ts`** — `sincronizarProcesso(processoId)`
  e `sincronizarTodosProcessosDoUsuario(usuarioId)`. Resolve a
  integração do responsável principal, decifra credenciais, chama o
  connector e faz upsert das movimentações deduplicadas por hash.
- **`src/app/(app)/integracoes/_components/tribunais-section.tsx`** —
  UI para gerenciar credenciais.
- **`src/app/(app)/integracoes/_actions-tribunais.ts`** — server
  actions de salvar / remover / sincronizar.
- **`src/app/api/integracoes/tribunais/sincronizar/route.ts`** —
  endpoint POST para disparar sync individual ou em lote.

## Estado de cada conector

| Sistema  | Estado | Caminho previsto |
|----------|--------|------------------|
| Mock     | Funcional. Gera dados determinísticos baseados no `numeroCnj`. Usado por padrão. | — |
| PJe      | **Stub** — lança erro em todos os métodos. | API pública do CNJ DataJud (Elasticsearch público) + REST autenticada por tribunal para processos sigilosos. |
| eSAJ     | **Stub** — lança erro em todos os métodos. | Scraping headless com Playwright + login por certificado digital A1. |
| Projudi  | **Stub** — lança erro em todos os métodos. | Scraping headless com Playwright + usuário/senha (ou A1). |
| eProc    | **Stub** — lança erro em todos os métodos. | WebService SOAP MNI 2.2.2 (autenticado com A1 + assinatura XMLDSig); REST de fallback no TRF4. |

Os stubs trazem docstrings extensas com endpoints, exemplos de payload
e considerações operacionais — leia o cabeçalho de cada arquivo em
`src/lib/tribunais/connectors/` antes de implementar.

## Próximos passos

### PJe (próximo)
1. Adicionar dependência: `@elastic/elasticsearch` (cliente oficial).
2. Mapear `tribunalSigla` -> `api_publica_<sigla>`.
3. Implementar `consultarProcesso(cnj)` com `_search` + paginação
   `search_after`.
4. Mapear `movimentos[]` para `DadosProcesso.movimentacoes` e gerar
   `hash = sha256(cnj|codigoNacional|dataHora|nome)`.
5. Para sigilosos: cliente HTTP por tribunal com mTLS + token Bearer.

### eSAJ
1. Adicionar `playwright` (devDependency e runtime).
2. Provisionar `chromium` no ambiente (Docker layer).
3. Implementar `login(certificadoBase64, pin)` + cache de
   `storageState` por integração.
4. Implementar `consultarProcesso(cnj)` por scraping de
   `/cpopg/show.do?processo.numero=<cnj>`.
5. Testes de snapshot do HTML.

### Projudi
1. Reutilizar a infra de Playwright do eSAJ.
2. Login com usuário/senha (alguns tribunais com A1).
3. Scraping de `/projudi/processo/buscaProcesso.do`.

### eProc
1. Adicionar `soap` (`node-soap`) e `xml-crypto`.
2. Carregar WSDL do tribunal alvo.
3. Implementar `consultarProcesso(cnj)` chamando a operação
   `consultarProcesso` do MNI.
4. Mapear `movimento[]` -> `DadosProcesso.movimentacoes`.

## Como adicionar um novo conector

1. Crie `src/lib/tribunais/connectors/<sistema>.ts` exportando uma
   classe que implemente `TribunalConnector`.
2. Adicione o sistema em `SistemaTribunal` (em `types.ts`) caso ainda
   não exista, e no enum Prisma `SistemaTribunal`.
3. Registre o sistema em `SISTEMAS` e em `criarConnector` no
   `registry.ts`.
4. Garanta que o cabeçalho do arquivo descreva, no mínimo:
   - Forma de autenticação (usuário/senha, A1, OAuth, mTLS).
   - Endpoints / URLs alvo.
   - Padrão de paginação e rate limit.
   - Mapeamento de campos para `DadosProcesso`.

## Modelo de segurança

- **Cifragem em repouso**: o campo `IntegracaoTribunal.credencialCifrada`
  armazena `encrypt(JSON.stringify(credenciais))` usando AES-256-GCM
  com IV aleatório por chamada (`src/lib/crypto.ts`).
- **Chave**: variável de ambiente `ENCRYPTION_KEY` — 32 bytes em
  base64 (44 chars) ou hex (64 chars). Gere com
  `openssl rand -base64 32`. A perda da chave torna as credenciais
  irrecuperáveis.
- **Sessão**: server actions e o endpoint REST exigem `auth()`.
  Remoção e leitura de credenciais conferem ownership por
  `usuarioId`.
- **Logs**: nunca logar `credencialCifrada` decifrada nem o
  resultado bruto de `decrypt`. Em desenvolvimento, redacionar
  `usuario`/`senha`/`pinCertificado`.
- **Decisão A1 vs A3**: apenas A1 (PKCS#12) é suportado — A3 exige
  hardware (token/cartão) inviável em ambiente de servidor.
