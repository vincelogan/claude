# SMILES Flight Search — ferramenta pessoal e privada

Plataforma **de uso pessoal** para pesquisar passagens em milhas no programa
**SMILES (Gol)**. O objetivo é estudar disponibilidade e preço em milhas de
forma programática, para você mesmo, sem ficar clicando manualmente no site.

> ⚠️ **Uso pessoal.** Isto consulta a mesma API que o próprio site do SMILES
> usa no seu navegador, replicando exatamente a requisição que ele faria.
> Use com parcimônia (poucas buscas, com pausas), só para você. Não é um
> serviço público, não redistribua os dados, e respeite os Termos de Uso do
> SMILES. Nada aqui burla login, paywall ou autenticação — usa a mesma chave
> pública que o front-end embute no JavaScript da página.

---

## 1. Como o SMILES funciona por dentro (a "dinâmica e sistemática")

Quando você abre uma busca no site, a URL é algo assim (a que você mandou):

```
https://www.smiles.com.br/mfe/emissao-passagem/?adults=2&cabin=ALL&children=0
  &departureDate=1809658800000&infants=0&returnDate=1810566000000
  &searchType=g3&segments=1&tripType=1
  &originAirport=RIO&originAirportIsAny=true
  &destinationAirport=NYC&destinAirportIsAny=true
  &novo-resultado-voos=true
```

### 1.1. A URL do front-end (o que você vê)

`/mfe/emissao-passagem/` é um **micro front-end** (MFE) — um app React separado
que cuida da emissão/busca de passagens. Os parâmetros da URL só alimentam esse
app React; **eles não são a busca em si**. Decodificando os da sua URL:

| Parâmetro                | Valor         | Significado |
|--------------------------|---------------|-------------|
| `adults`                 | `2`           | adultos |
| `children`               | `0`           | crianças (2–11 anos) |
| `infants`                | `0`           | bebês de colo (<2 anos) |
| `cabin`                  | `ALL`         | cabine: `ALL`, `ECONOMIC`, `PREMIUM_ECONOMIC`, `BUSINESS` |
| `departureDate`          | `1809658800000` | data de ida, **epoch em milissegundos** → **07/05/2027** |
| `returnDate`             | `1810566000000` | data de volta, epoch ms → **17/05/2027** |
| `tripType`               | `1`           | `1` = ida e volta, `2` = só ida |
| `segments`               | `1`           | nº de trechos (multi-trecho > 1) |
| `searchType`             | `g3`          | fluxo integrado Gol (G3 é o código IATA da Gol) |
| `originAirport`          | `RIO`         | origem — `RIO` é o **código de metrópole** (GIG + SDU) |
| `originAirportIsAny`     | `true`        | "qualquer aeroporto" da metrópole (expande RIO→GIG,SDU) |
| `destinationAirport`     | `NYC`         | destino — metrópole de Nova York (JFK + EWR + LGA) |
| `destinAirportIsAny`     | `true`        | expande NYC→JFK,EWR,LGA |
| `novo-resultado-voos`    | `true`        | feature flag da tela nova de resultados |

**Dica de datas:** o SMILES usa **epoch em milissegundos, à meia-noite no
horário de Brasília**. Para gerar: `int(datetime(2027,5,7).timestamp())*1000`.

### 1.2. A API por trás (o que realmente busca os voos — o "modus operandi")

O app React, ao carregar, dispara uma chamada **XHR/fetch** para um host de
API separado. Historicamente:

```
GET https://api-air-flightsearch-prd.smiles.com.br/v1/airlines/search?<params>
```

(Os hosts do SMILES seguem o padrão `api-*-prd.smiles.com.br`, ex.
`api-prd-airlines-carousel.smiles.com.br`. O nome exato do host e do path
**mudam** com o tempo — por isso a ferramenta os captura, não os chuta.)

Pontos-chave da requisição:

- **Header `x-api-key`** — obrigatório. É uma chave **pública** que o próprio
  bundle JavaScript do site embute (não é segredo/senha; é o identificador do
  cliente web). A Gol **rotaciona** essa chave de tempos em tempos → qualquer
  ferramenta que a chumba no código quebra sozinha. **Por isso capturamos.**
- Headers de navegador: `Origin: https://www.smiles.com.br`,
  `Referer: https://www.smiles.com.br/`, `User-Agent`, `Accept: application/json`.
- Parâmetros da **API** (nomes diferentes dos da URL do front-end): usam
  `originAirportCode` / `destinationAirportCode`, `cabinType`, `departureDate`
  (epoch ms), `returnDate`, `adults`, `children`, `infants`, `forceCongener`,
  `r`/`region`, `memberNumber` (opcional, se logado, para tarifas de clube).

A resposta é um JSON com a lista de voos, cada um com companhia, número do voo,
horários, duração, nº de conexões, **assentos disponíveis** e uma `fareList`
com o preço em milhas por tipo de tarifa (SMILES, Clube SMILES, SMILES+Money…).

### 1.3. Por que "capturar" em vez de "chutar" a chave

Como a `x-api-key` e os nomes exatos de host/params **mudam**, a estratégia
robusta (a mesma que os sites de milhas usam de fato) é:

1. Abrir a **própria página do SMILES** num navegador headless (Chromium).
2. **Interceptar** a chamada `.../airlines/search` que o site faz sozinho.
3. Guardar o **host + path + a `x-api-key` + o formato exato dos params**.
4. **Replicar** essa chamada quantas vezes você precisar, trocando só origem,
   destino e datas.

Isso se auto-adapta quando a Gol muda a chave: é só rodar `capture` de novo.

---

## 2. Sites/ferramentas que já fazem isso (para estudo)

Estilos de "modus operandi" no mercado, do mais leve ao mais pesado:

- **Melhores Destinos / Passageiro de Primeira / Mestre das Milhas** — portais
  de conteúdo + alertas de promoção; não expõem API, monitoram por dentro.
- **seats.aero** — agregador de disponibilidade de award internacional (foco em
  programas estrangeiros), modelo assinatura + API própria.
- **MaxMilhas / 123Milhas / HotMilhas** — marketplaces que consultam programas
  (inclusive SMILES) e revendem; usam integrações/scraping em escala.
- **Projetos open source (referência de técnica):**
  - `github.com/evictorero/smiles` — consulta a API do SMILES por milhas (Node).
  - `github.com/sergioasouza/api-milhas` — estima custo em milhas (Latam/Smiles/Azul).
  - Actors da **Apify** e serviços tipo **Parse.bot / RealDataAPI** vendem a
    "Smiles API" como scraping-as-a-service (bom para ver o **shape** da resposta:
    `flightList`, `fareList`, `availableSeats`, tipos de tarifa).

O padrão comum de todos: **replicar a chamada interna `airlines/search`** com a
`x-api-key` do front-end — exatamente o que esta ferramenta faz, mas local e só
para você.

---

## 3. Como usar

### Instalação

```bash
cd smiles-search
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
# (opcional, para o modo de captura automática da chave)
python -m playwright install chromium   # neste ambiente já vem instalado
```

### Passo 1 — capturar a chave e o endpoint reais (uma vez, e a cada rotação)

```bash
python search.py capture
```

Abre o Chromium, faz uma busca de exemplo no próprio site do SMILES, intercepta
a chamada `airlines/search` e salva host/path/`x-api-key`/params em
`config.json`. Rode de novo sempre que as buscas começarem a dar 401/403.

### Passo 2 — pesquisar

```bash
# RIO -> NYC, ida 07/05/2027, volta 17/05/2027, 2 adultos
python search.py search \
  --origin RIO --dest NYC \
  --out 2027-05-07 --ret 2027-05-17 \
  --adults 2 --cabin ALL
```

Saída: tabela com voos, conexões, horários, **assentos** e **milhas por tarifa**,
ordenada pela tarifa mais barata. Use `--json` para o JSON cru.

### Config manual (alternativa à captura)

Se preferir capturar a chave você mesmo pelo **DevTools** (F12 → aba **Network**
→ filtre por `search` → clique na requisição → copie o header `x-api-key` e a
**Request URL**), cole em `config.json` (veja `config.example.json`).

---

## 4. Estrutura

```
smiles-search/
├── README.md              # este estudo + instruções
├── requirements.txt
├── config.example.json    # modelo de config (host/path/x-api-key)
├── search.py              # CLI: capture | search
└── smiles/
    ├── __init__.py
    ├── config.py          # carrega/salva config.json
    ├── capture.py         # Playwright: sniff da x-api-key + endpoint
    ├── client.py          # replica a chamada airlines/search
    └── parser.py          # normaliza a resposta em voos legíveis
```

## 5. Notas de responsabilidade

- **Só para você.** Não publique um serviço em cima disso nem redistribua dados.
- **Devagar.** Poucas buscas, com pausas — não martele o servidor da Gol.
- A `x-api-key` é pública (front-end), mas trate `config.json` como privado
  (está no `.gitignore`) — pode conter a chave da sua sessão.
- Nada aqui contorna login, pagamento ou proteção de conta.
