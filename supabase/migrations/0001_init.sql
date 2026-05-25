-- CRM Pessoal — schema inicial
-- Single-user, RLS por auth.uid()

create extension if not exists "pgcrypto";

-- =========================
-- Esferas
-- =========================
create table if not exists public.spheres (
  slug        text primary key,
  name        text not null,
  color       text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

insert into public.spheres (slug, name, color, sort_order) values
  ('juridico',      'Jurídico',                '#1B2A4A', 1),
  ('investimentos', 'Investimentos',           '#1F7A4D', 2),
  ('criativa',      'CriaAtva (Cenografia)',   '#C4612F', 3),
  ('geral',         'Geral',                   '#5B6470', 4)
on conflict (slug) do nothing;

-- =========================
-- Segmentos (subsegmentos de uma esfera)
-- =========================
create table if not exists public.segments (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid(),
  sphere_slug text not null references public.spheres(slug) on delete cascade,
  name        text not null,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (owner_id, sphere_slug, name)
);

-- Seed default — investimentos (obrigatório) e seeds enxutos para as outras.
-- O insert é por owner; deixamos um helper que pode ser invocado após signup.
-- Para uso single-user, basta rodar manualmente no SQL editor já autenticado.
create or replace function public.seed_default_segments() returns void
language plpgsql security definer as $$
begin
  insert into public.segments (sphere_slug, name, sort_order, owner_id) values
    ('investimentos', 'Renda Fixa',              1, auth.uid()),
    ('investimentos', 'Renda Variável',          2, auth.uid()),
    ('investimentos', 'Venture / Startups',      3, auth.uid()),
    ('investimentos', 'Fundos Imobiliários (FII)', 4, auth.uid()),
    ('investimentos', 'Imobiliário (direto)',    5, auth.uid()),
    ('investimentos', 'Cripto / Web3',           6, auth.uid()),
    ('investimentos', 'Private Equity',          7, auth.uid()),
    ('investimentos', 'Gestores / Assessores',   8, auth.uid()),
    ('investimentos', 'Outros',                  9, auth.uid()),
    ('juridico',      'Cliente',                 1, auth.uid()),
    ('juridico',      'Colega',                  2, auth.uid()),
    ('juridico',      'Magistrado',              3, auth.uid()),
    ('juridico',      'Fornecedor',              4, auth.uid()),
    ('criativa',      'Produtor',                1, auth.uid()),
    ('criativa',      'Fornecedor',              2, auth.uid()),
    ('criativa',      'Artista',                 3, auth.uid()),
    ('criativa',      'Cliente',                 4, auth.uid())
  on conflict do nothing;
end $$;

-- =========================
-- Contatos
-- =========================
do $$ begin
  create type public.contact_kind as enum ('person', 'company');
exception when duplicate_object then null; end $$;

create table if not exists public.contacts (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null default auth.uid(),
  kind          public.contact_kind not null default 'person',
  name          text not null,
  company_name  text,
  role          text,
  email         text,
  phone         text,
  whatsapp      text,
  linkedin      text,
  instagram     text,
  website       text,
  city          text,
  state         text,
  oab           text,
  cnpj          text,
  notes         text,
  is_favorite   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists contacts_owner_idx     on public.contacts(owner_id);
create index if not exists contacts_name_trgm_idx on public.contacts using gin (name gin_trgm_ops);
create extension if not exists pg_trgm;

-- =========================
-- Vínculo Contato <-> Esfera (com segmento opcional)
-- =========================
create table if not exists public.contact_spheres (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null default auth.uid(),
  contact_id  uuid not null references public.contacts(id) on delete cascade,
  sphere_slug text not null references public.spheres(slug) on delete cascade,
  segment_id  uuid references public.segments(id) on delete set null,
  created_at  timestamptz not null default now(),
  unique (contact_id, sphere_slug)
);

create index if not exists contact_spheres_contact_idx on public.contact_spheres(contact_id);
create index if not exists contact_spheres_sphere_idx  on public.contact_spheres(sphere_slug);

-- =========================
-- Tags
-- =========================
create table if not exists public.tags (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid not null default auth.uid(),
  name       text not null,
  created_at timestamptz not null default now(),
  unique (owner_id, name)
);

create table if not exists public.contact_tags (
  contact_id uuid not null references public.contacts(id) on delete cascade,
  tag_id     uuid not null references public.tags(id) on delete cascade,
  owner_id   uuid not null default auth.uid(),
  primary key (contact_id, tag_id)
);

-- =========================
-- Interações
-- =========================
do $$ begin
  create type public.interaction_channel as enum ('meeting','call','message','email','event','other');
exception when duplicate_object then null; end $$;

create table if not exists public.interactions (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null default auth.uid(),
  contact_id    uuid not null references public.contacts(id) on delete cascade,
  occurred_at   timestamptz not null default now(),
  channel       public.interaction_channel not null default 'other',
  summary       text not null,
  follow_up_at  timestamptz,
  follow_up_done boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists interactions_contact_idx   on public.interactions(contact_id);
create index if not exists interactions_followup_idx  on public.interactions(follow_up_at) where follow_up_at is not null and follow_up_done = false;

-- =========================
-- Provedores de busca (configuráveis em /config)
-- =========================
create table if not exists public.search_providers (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null default auth.uid(),
  label         text not null,
  url_template  text not null,           -- pode conter {nome} {empresa} {cidade} {uf} {cnpj}
  applies_to    text not null default 'both', -- 'person' | 'company' | 'both'
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now()
);

create or replace function public.seed_default_search_providers() returns void
language plpgsql security definer as $$
begin
  insert into public.search_providers (owner_id, label, url_template, applies_to, sort_order) values
    (auth.uid(), 'Google',              'https://www.google.com/search?q=%22{nome}%22+{empresa}',                 'person',  1),
    (auth.uid(), 'LinkedIn (Google)',   'https://www.google.com/search?q=site%3Alinkedin.com%2Fin+%22{nome}%22+{empresa}', 'person', 2),
    (auth.uid(), 'Instagram (Google)',  'https://www.google.com/search?q=site%3Ainstagram.com+%22{nome}%22',     'person',  3),
    (auth.uid(), 'RocketReach',         'https://rocketreach.co/search?query={nome}',                            'person',  4),
    (auth.uid(), 'JusBrasil',           'https://www.jusbrasil.com.br/busca?q={nome}',                           'person',  5),
    (auth.uid(), 'Google Empresa',      'https://www.google.com/search?q=%22{empresa}%22+{cidade}',              'company', 1),
    (auth.uid(), 'LinkedIn Empresa',    'https://www.google.com/search?q=site%3Alinkedin.com%2Fcompany+%22{empresa}%22', 'company', 2),
    (auth.uid(), 'Instagram Empresa',   'https://www.google.com/search?q=site%3Ainstagram.com+%22{empresa}%22',  'company', 3),
    (auth.uid(), 'Consulta CNPJ',       'https://casadosdados.com.br/solucao/cnpj/{cnpj}',                       'company', 4),
    (auth.uid(), 'Reclame Aqui',        'https://www.reclameaqui.com.br/busca/?q={empresa}',                     'company', 5)
  on conflict do nothing;
end $$;

-- =========================
-- updated_at trigger
-- =========================
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

do $$ begin
  create trigger trg_contacts_touch     before update on public.contacts     for each row execute function public.touch_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
  create trigger trg_segments_touch     before update on public.segments     for each row execute function public.touch_updated_at();
exception when duplicate_object then null; end $$;
do $$ begin
  create trigger trg_interactions_touch before update on public.interactions for each row execute function public.touch_updated_at();
exception when duplicate_object then null; end $$;

-- =========================
-- RLS
-- =========================
alter table public.spheres         enable row level security;
alter table public.segments        enable row level security;
alter table public.contacts        enable row level security;
alter table public.contact_spheres enable row level security;
alter table public.tags            enable row level security;
alter table public.contact_tags    enable row level security;
alter table public.interactions    enable row level security;
alter table public.search_providers enable row level security;

-- Spheres: leitura aberta a qualquer autenticado (catálogo compartilhado), escrita só admin via SQL.
do $$ begin
  create policy spheres_read on public.spheres for select to authenticated using (true);
exception when duplicate_object then null; end $$;

-- Demais: dono só vê o que é dele.
do $$ begin
  create policy segments_all        on public.segments        for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy contacts_all        on public.contacts        for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy contact_spheres_all on public.contact_spheres for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy tags_all            on public.tags            for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy contact_tags_all    on public.contact_tags    for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy interactions_all    on public.interactions    for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy search_providers_all on public.search_providers for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
exception when duplicate_object then null; end $$;
