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

> A aplicação Next.js ainda não foi inicializada. Os comandos abaixo refletem o fluxo
> esperado assim que a base do projeto for criada.

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com DATABASE_URL, NEXTAUTH_SECRET, chaves de cifragem, etc.

# 3. Aplicar migrações do banco
npx prisma migrate dev

# 4. (Opcional) Popular dados iniciais
npx prisma db seed

# 5. Rodar em modo desenvolvimento
npm run dev
```

Pré-requisitos:

- Node.js 20+
- PostgreSQL 15+ (local ou em container)
- Conta Google Cloud com OAuth Client configurado (a partir da v2)

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
