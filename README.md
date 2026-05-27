# Donnici Advogados — Plataforma de Processos

Plataforma interna de gestão de processos jurídicos do escritório Donnici Advogados.
O objetivo é centralizar o cadastro de clientes, processos, prazos e audiências em um
único sistema, substituindo planilhas e agendas dispersas e reduzindo o risco de perda
de prazos fatais.

A plataforma é dimensionada para uso de uma equipe pequena (2 a 5 pessoas) — sócios,
advogados associados, estagiários e secretaria. O foco da v1 é o controle operacional
do dia a dia (cadastros e agenda de prazos). Em versões seguintes serão incorporadas
integrações com os principais sistemas de tribunais brasileiros (PJe, eSAJ, Projudi,
eProc) e sincronização com Google Calendar.

O design prioriza um modelo de dados sólido — descrito em detalhes na documentação —
antes da camada de aplicação, de modo que a evolução para automações e integrações
não exija refatoração estrutural.

## Stack técnica

- **Next.js** (App Router) — frontend e backend (API routes / server actions)
- **Prisma ORM** — modelagem e acesso ao banco
- **PostgreSQL** — banco de dados relacional
- **TypeScript** — em todo o código de aplicação
- **NextAuth** (planejado) — autenticação dos usuários internos
- **Google Calendar API** — integração de agenda (v2/v3)
- Integrações HTTP com **PJe**, **eSAJ**, **Projudi**, **eProc** (v2)

## Estrutura de pastas planejada

```
.
├── prisma/
│   ├── schema.prisma         # modelo de dados (em construção)
│   └── migrations/
├── src/
│   ├── app/                  # rotas Next.js (App Router)
│   ├── components/           # componentes de UI
│   ├── lib/                  # helpers, clientes (prisma, auth, crypto)
│   ├── server/               # casos de uso, serviços de domínio
│   └── integrations/         # adapters de tribunais e Google
├── docs/
│   └── MODELO_DADOS.md       # documentação do modelo de domínio
├── public/
├── package.json
└── README.md
```

## Como começar

### Opção A — GitHub Codespaces (preview público, zero setup)

1. Abra o repositório no GitHub
2. Clique em **Code → Codespaces → Create codespace on `claude/loving-hopper-A0EOi`**
3. Aguarde o `postCreate` rodar (instala deps, sobe Postgres, aplica migrations, semeia dados)
4. No terminal do Codespace: `npm run dev`
5. O GitHub expõe a porta 3000 como URL pública `*.app.github.dev`

Login de teste já populado: **`donnici@donnici.adv.br`** / **`donnici`**

### Opção B — Local com Docker

```bash
# 1. Subir o banco
docker compose up -d

# 2. Instalar deps + aplicar schema + popular tribunais e usuário admin
npm install
npm run db:migrate
ADMIN_EMAIL=donnici@donnici.adv.br ADMIN_PASSWORD=donnici npm run db:seed

# 3. Rodar em desenvolvimento
npm run dev
```

Acesso: http://localhost:3000 — login `donnici@donnici.adv.br` / `donnici`

### Opção C — Local com PostgreSQL nativo

Mesmo fluxo da Opção B, mas com o Postgres do sistema. Ajuste a `DATABASE_URL`
em `.env.local`. Pré-requisitos: Node.js 20+, PostgreSQL 15+.

### Opção D — Deploy em AWS Amplify (produção / preview na web)

O projeto já contém `amplify.yml` com a build spec.

**1. Provisione um PostgreSQL gerenciado.** Opções recomendadas:
- **[Neon](https://neon.tech)** (free tier, mais simples — copia uma `connection string`)
- **Aurora Serverless v2 PostgreSQL** (AWS, paga por uso ~US$ 0,06/h mínimo)
- **RDS PostgreSQL** `db.t4g.micro` (free tier 12 meses)

**2. No console AWS Amplify:**
- *Hosting → New app → Host web app*
- Conecte o repositório `vincelogan/claude`, branch `claude/loving-hopper-A0EOi`
- Framework será detectado como **Next.js (SSR)** automaticamente
- Aceite o `amplify.yml` versionado no repo

**3. Configure as variáveis de ambiente** (App settings → Environment variables):

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/donnici?sslmode=require` |
| `AUTH_SECRET` | gerar com `openssl rand -base64 32` |
| `AUTH_URL` | `https://main.dXXXXXXX.amplifyapp.com` (URL final do Amplify) |
| `AUTH_TRUST_HOST` | `true` |
| `ENCRYPTION_KEY` | gerar com `openssl rand -base64 32` (32 bytes) |
| `ADMIN_EMAIL` | `donnici@donnici.adv.br` (rodar seed depois) |
| `ADMIN_PASSWORD` | escolher senha forte |
| `GOOGLE_OAUTH_CLIENT_ID` | (opcional, para v2) |
| `GOOGLE_OAUTH_CLIENT_SECRET` | (opcional, para v2) |
| `GOOGLE_OAUTH_REDIRECT_URI` | `https://<URL-Amplify>/api/integracoes/google/callback` |

**4. Após o primeiro build**, rode o seed uma única vez para criar o usuário admin e popular tribunais. No console Amplify, vá em *Hosting → Redeploy this version* depois de adicionar as envs, ou conecte-se ao banco e rode `npm run db:seed` localmente apontando para a `DATABASE_URL` do Neon/RDS.

**5. Trigger automático:** todo push para a branch conectada dispara um novo build.

## Roadmap

### v1 — Cadastros e prazos (em desenvolvimento)

- Cadastro de usuários do escritório, com perfis e OAB
- Cadastro de clientes (PF e PJ)
- Cadastro manual de processos, partes e responsáveis
- Lançamento manual de movimentações
- Controle de prazos (com marcação de prazo fatal e contagem em dias úteis)
- Agenda de audiências
- Visão consolidada por advogado responsável

### v2 — Integração com tribunais

- Conector unificado para PJe, eSAJ, Projudi e eProc
- Sincronização automática de movimentações com deduplicação
- Cadastro de credenciais por usuário (cifradas na aplicação)
- Sincronização bidirecional com Google Calendar (audiências e prazos)
- Notificações de novos andamentos

### v3 — Documentos e financeiro

- Repositório de documentos do processo (petições, decisões, contratos)
- Geração de peças a partir de templates
- Controle de honorários (fixos, êxito, sucumbência)
- Contas a receber e a pagar vinculadas a processos
- Relatórios gerenciais

## Documentação

- [Modelo de Dados](./docs/MODELO_DADOS.md) — entidades, relações e decisões de design
