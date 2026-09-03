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

## 0. Fidelidade dos números (leia antes de confiar em qualquer milhagem)

A plataforma segue quatro regras para nunca mostrar uma milhagem que não
corresponde ao que o SMILES cobra. Todas estão travadas em
`tests/test_fidelidade.py` (`python tests/test_fidelidade.py`).

1. **Ida e volta são trechos separados.** O SMILES devolve um segmento por
   trecho. Eles aparecem em seções próprias (Ida / Volta), cada uma com o seu
   menor preço, e o **total da viagem** é a soma dos dois — nunca o preço de
   um trecho só apresentado como se fosse o da viagem.
2. **Tarifa do Clube nunca substitui a padrão.** `SMILES` é o que qualquer
   pessoa paga; `SMILES_CLUB` exige a assinatura mensal do Clube Smiles. O
   número em destaque é o **padrão**, com o do Clube exibido ao lado e
   rotulado "exige assinatura". A caixa **"Assino o Clube"** inverte a
   referência — e aí todos os números (cards, resumo e total) mudam juntos.
3. **Milhas+dinheiro não entram no preço "só milhas".** As tarifas com
   `MONEY` são outro produto: aparecem listadas, mas não viram o preço de
   referência em milhas.
4. **Nada é estimado.** Campo ausente vira `—`. O total da viagem só aparece
   se **todos** os trechos exibidos tiverem preço; somar trecho incompleto
   daria um número falso.

### Chave automática (nenhuma configuração necessária)

A `x-api-key` **não é segredo** — o site do SMILES a embute no JavaScript
público que todo visitante baixa. A plataforma faz o que o navegador faria:
busca a página, lê os bundles JS e extrai a chave, por HTTP puro (sem
navegador, então funciona no Vercel). Quando a Gol rotaciona a chave, um
`401/403` dispara a redescoberta e a busca é repetida automaticamente.

- **Não precisa definir `SMILES_API_KEY`.** Se você definir, ela tem
  precedência (útil caso a descoberta falhe).
- Confira na sua máquina: `python search.py autokey`
- Cache de 6h para a chave achada, e de 5min após falha (não martela o site).
- Se a descoberta falhar, a plataforma **diz o motivo na tela** e cai em modo
  demo — nunca mostra número inventado sem avisar.

> ⚠️ **Modo demo.** Sem chave configurada, a plataforma gera voos
> **sintéticos** e avisa com uma faixa laranja no topo, o selo `MODO DEMO` e
> o chip `DADOS DEMO`. Esses números **são inventados** e não servem para
> decidir viagem.

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

**Dica de datas:** o SMILES usa **epoch em milissegundos** e indexa a busca
pelo **dia** — o horário dentro do dia não muda o resultado. A URL real que
serviu de referência usava meia-noite de Brasília na ida e meio-dia na volta;
a ferramenta padroniza em **meio-dia de Brasília** (15h UTC), que reproduz
exatamente o `returnDate` observado e dá 12h de folga de cada lado da virada
do dia, imune a fuso.

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

### Quando o SMILES responde HTTP 406 (protecao anti-bot)

O site fica atras do Akamai. A requisicao HTTP direta — mesmo com todos os
headers de Chrome — pode ser recusada com **HTTP 406** antes de chegar na API.
Isso nao e chave errada (chave errada da 401/403): a protecao olha alem dos
headers, principalmente reputacao do IP e a impressao digital do handshake
TLS/HTTP2. **De IP de datacenter (Vercel e afins) o 406 e a regra.**

Este projeto **nao** tenta falsificar esses sinais. A saida e nao ter o que
falsificar: o **modo navegador** faz a busca dentro de um Chromium de verdade,
abrindo a mesma pagina publica do SMILES com a mesma busca, e le a resposta que
o site ja recebeu. Sem login, sem contornar protecao, sem tarifa que o site nao
mostraria a voce.

```bash
# na plataforma web: automatico. Ao ver 406 uma vez, as buscas seguintes ja
# vao pelo navegador. Para forcar desde o inicio:
SMILES_BROWSER=1 python server.py

# na linha de comando:
python search.py search --origin RIO --dest NYC --out 2027-05-07 --ret 2027-05-17 --navegador

# para ver a janela do Chromium e entender o que o site mostrou:
SMILES_BROWSER_HEADED=1 python server.py      # ou --navegador --show na CLI
```

Variaveis:

| variavel | efeito |
|---|---|
| `SMILES_BROWSER=1` | sempre pelo navegador (nem tenta HTTP) |
| `SMILES_BROWSER=0` | nunca pelo navegador (so HTTP; 406 vira erro) |
| `SMILES_BROWSER_HEADED=1` | mostra a janela em vez de rodar invisivel |
| `SMILES_CHROMIUM=/caminho` | usa um Chrome/Chromium que voce ja tem |

Custo: alguns segundos por busca. A instancia do Chromium **fica viva** entre
as buscas, senao a varredura de um mes no calendario abriria o navegador 30
vezes; ela se fecha sozinha depois de 10 minutos parada.

**No Vercel isso nao funciona** — la nao ha navegador, e e justamente o IP de
la que e recusado. O deploy continua util para a interface e o modo demo; para
milhas reais, rode local.

### Interface web — a plataforma (recomendado)

```bash
python server.py
# abra http://127.0.0.1:8777
```

Os **resultados aparecem na própria plataforma**:

- **Autocomplete de cidades** (digite "Rio" e ele resolve RIO = GIG+SDU,
  "Nova York" → NYC = JFK+EWR+LGA), seletor de datas, passageiros e cabine.
- **Datas flexíveis (±2 dias)**: acima da lista, uma faixa mostra os 2 dias
  antes e 2 depois da data escolhida (uma faixa para a ida e outra para a
  volta), com a menor milhagem de cada dia e o mais barato destacado. Clique
  num dia para trocar a data e rebuscar.
- **Voos diretos priorizados**: lista em duas seções (Diretos / Com conexões),
  tag `DIRETO`, badge `MENOR PREÇO`, filtro "só diretos" e ordenação por
  milhas, duração ou horário. Link "emitir no SMILES ↗" abre a mesma busca
  no site da Gol para concluir a emissão.
- **Calendário de milhas**: uma varredura dia a dia do mês (só ida, por trecho
  Ida/Volta) pinta cada dia numa escala âmbar (claro = barato, forte = caro),
  marca `★` o menor do mês e `✈` os dias com voo direto. Clicar num dia
  carrega os voos dele. Barra de progresso e botão parar.
- **Cache local (SQLite, 6h)**: cada (rota, dia, pax, cabine) só vai à rede
  uma vez; navegar de novo pelo mês é instantâneo. Entre chamadas reais há um
  **ritmo mínimo de 1,5s** — respeitoso com o servidor da Gol.
- **Modo demo**: `SMILES_DEMO=1 python server.py` (ou `api_key: "demo"` no
  config) gera voos sintéticos estáveis para conhecer a plataforma sem rede
  e sem chave.

Se ainda não houver `x-api-key`, a própria tela mostra o botão
**🔑 Capturar chave**. Roda só em `127.0.0.1` — privado, na sua máquina.

### Passo 2 — pesquisar (via terminal)

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
├── server.py              # servidor local: busca, calendário, cache, demo
├── web/
│   ├── index.html         # a plataforma: lista + calendário de milhas
│   └── standalone.html    # versão sem servidor (abre a busca no site do SMILES)
└── smiles/
    ├── __init__.py
    ├── airports.py        # base de aeroportos + metrópoles (RIO, SAO, NYC…)
    ├── config.py          # carrega/salva config.json
    ├── capture.py         # Playwright: sniff da x-api-key + endpoint
    ├── client.py          # replica a chamada airlines/search (com throttle)
    ├── cache.py           # cache SQLite das buscas (TTL 6h)
    ├── demo.py            # voos sintéticos estáveis (modo demo)
    └── parser.py          # normaliza a resposta em voos legíveis
```

## 5. Notas de responsabilidade

- **Só para você.** Não publique um serviço em cima disso nem redistribua dados.
- **Devagar.** Poucas buscas, com pausas — não martele o servidor da Gol.
- A `x-api-key` é pública (front-end), mas trate `config.json` como privado
  (está no `.gitignore`) — pode conter a chave da sua sessão.
- Nada aqui contorna login, pagamento ou proteção de conta.
