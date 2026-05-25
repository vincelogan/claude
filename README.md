# CRM Pessoal

Sistema single-user de organização de contatos (pessoas e empresas) segmentados por
**esferas de relacionamento** — Jurídico, Investimentos, CriaAtva e Geral.

> Esta é uma ferramenta de **organização e networking**. Não dá conselho financeiro.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + lucide-react
- Supabase (Postgres + Auth + RLS)
- Zod / date-fns

## Setup

```bash
npm install
cp .env.local.example .env.local
# preencher NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

# No Supabase Studio (SQL Editor):
# 1) rodar supabase/migrations/0001_init.sql
# 2) criar seu usuário em Authentication > Users
# 3) logar pela primeira vez e em /config clicar "Carregar seeds padrão"
#    (popula segments e search_providers para o seu owner_id)

npm run dev
```

## Funcionalidades

- Login Supabase (senha ou link mágico). Middleware protege todas as rotas.
- CRUD de contatos com múltiplas esferas; **segmento obrigatório** para Investimentos.
- Busca global por nome, empresa, email, cidade e notas.
- Filtros combináveis (esfera, segmento, tag, UF, favorito), persistidos no querystring.
- Painel **"Buscar na web"** — gera links de Google/LinkedIn/Instagram/RocketReach/JusBrasil
  em nova aba. Cola o link encontrado e o sistema detecta o campo (LinkedIn, Instagram,
  website) e salva.
- Provedores de busca configuráveis em `/config` com placeholders `{nome}`, `{empresa}`,
  `{cidade}`, `{uf}`, `{cnpj}`.
- Interações com timeline e follow-ups em `/agenda` (atrasados em vermelho).
- Import CSV / vCard com prévia + deduplicação por email/telefone.
- Export CSV, JSON (backup completo) e vCard.

## Restrições deliberadas

- Single-user. Sem multiusuário, equipes, compartilhamento.
- Sem scraping de LinkedIn/Instagram/RocketReach — só monta a busca, você cola o resultado.
- Não calcula nem recomenda investimentos.

## Estrutura

```
app/
  (app)/            # rotas protegidas (sidebar + busca global)
    page.tsx        # dashboard
    contatos/
    agenda/
    config/
  login/
  api/{export,import}/
  auth/callback/    # magic link
  actions/          # server actions
components/         # UI (sidebar, contact-form, search-panel, ...)
lib/
  db/               # camada de dados Supabase
  supabase/         # clients server/browser/middleware
  validation.ts     # zod
  search-providers.ts
  csv.ts / vcard.ts
supabase/migrations/0001_init.sql
```
