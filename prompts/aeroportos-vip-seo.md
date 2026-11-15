# Prompts de SEO para o aeroportos.vip

Preparados em 15/11/2026, a partir da análise de SEO desta data e do repositório `vincelogan/aeroportos-vip` (commit fa4d21c).

## Como usar
- Abra uma sessão do Claude Code no repositório `vincelogan/aeroportos-vip`. O `CLAUDE.md` do repo carrega sozinho, e os prompts contam com as regras dele: sem travessão, redação própria, fonte oficial, `fitText`/`firstFit`, componente `FAQ`, hubs em `src/lib/hubs.ts`.
- Cole um prompt por vez, na ordem da tabela. Cada um termina numa branch com PR, sem merge no `main`: você revisa e publica.
- Números de referência:
  - contagens medidas em 15/11/2026 nas 488 páginas do sitemap publicado;
  - volumes de busca do Google Ads Brasil via DataForSEO (média de 12 meses).
- O que já existe no repo e não precisa de prompt:
  - auditoria de 07/11 (`docs/auditoria-seo/`) e `scripts/audit-seo.mjs`;
  - IndexNow em dias úteis (`api/indexnow.js`);
  - roteiro de distribuição de 09/11 a 18/12 (`docs/auditoria-seo/roteiro-distribuicao.md`).
- A semana 1 do roteiro (Search Console e Bing Webmaster Tools) é tarefa sua. Sem ela, o prompt 8 fica sem dados.

| # | Prompt | Onde rodar | Depende de |
|---|---|---|---|
| 1 | Resposta rápida nos hubs de banco e de bandeira | repo do site | nada |
| 2 | Links internos para a cauda longa | repo do site | nada |
| 3 | Hubs de operadora (Plaza Premium, W Premium) | repo do site | nada |
| 4 | Visa Airport Companion, DragonPass e o guia da troca | repo do site | nada |
| 5 | Dados de Congonhas e Viracopos | repo do site | acesso web aos sites oficiais |
| 6 | Placar da home lido duas vezes | repo do site | nada |
| 7 | Pesquisa de cauda longa | sessão com Firecrawl (DataForSEO) | créditos do Firecrawl |
| 8 | Search Console: consultas entre a 5ª e a 20ª posição | qualquer sessão, com o CSV | 3 a 4 semanas de dados |
| 9 | Peças da semana 2 do roteiro (GRU sem cartão) | repo do site | nada |
| 10 | Marca "Aeroportos VIP" no INPI | qualquer sessão | nada |

---

## 1. Resposta rápida nos hubs de banco e de bandeira

```
Objetivo: fazer os hubs de banco (/bancos/<banco>/) e de bandeira (/cartoes/tipo/<categoria>/) responderem, no topo e na meta description, o que quem busca "sala vip <banco>" ou "sala vip <categoria>" quer saber primeiro: quais são as salas próprias e se estão abertas.

Contexto (medido em 15/11/2026):
- "sala vip inter" tem 4.400 buscas/mês. A description de /bancos/inter/ é "Inter dá acesso a 103 salas VIP em 33 aeroportos com 3 cartões, incluindo 3 salas próprias." (91 caracteres) e não diz que a sala do T2 de Guarulhos fechou em 29/10/2026 (docs/PENDENCIAS.md). As abertas são Confins (BRT, T1), Curitiba e Fortaleza.
- "sala vip nubank" tem 2.900 buscas/mês. A resposta é o Nubank Ultravioleta Lounge (GRU T3), mas a description de /bancos/nubank/ (89 caracteres) não cita a sala.
- "sala vip mastercard black" e "sala vip visa infinite" têm 6.600 buscas/mês cada. Parte de quem busca quer as salas da bandeira no T3 de GRU (Sala Mastercard Black do mezanino, Lounge by Mastercard Black, Visa Infinite Lounge, Visa Infinite Privilege Lounge). Essas páginas de sala recebem mais links internos (49 e 52) que os hubs /cartoes/tipo/mastercard-black/ (34) e /cartoes/tipo/visa-infinite/ (36) e podem tomar a posição deles.

O que fazer:
1. Em src/pages/bancos/[banco].astro e src/pages/cartoes/tipo/[tipo].astro (dados de bankHub e categoryHub em src/lib/hubs.ts), criar uma "Resposta rápida" no topo, no mesmo padrão do hub de aeroporto. Até 3 frases, sempre derivadas dos dados e nunca digitadas à mão:
   - salas próprias do banco ou da bandeira, com aeroporto, terminal, embarque, status (aberta, fechada, em reforma) e para quem vale;
   - depois, quantas salas o banco ou a bandeira libera via programa;
   - sala fechada recentemente aparece como fechada, com a data do changelog, e a frase aponta as que estão abertas.
2. Description dos dois modelos: começar pela resposta (sala própria e status) e só depois o número de salas e cartões. Usar fitText, sem cortar palavra. Exemplo de formato, a confirmar com o dado: "A sala do Inter em Guarulhos (T2) fechou em 29/10/2026. Abertas: Confins, Curitiba e Fortaleza, para clientes Inter. Veja as 103 salas pelos cartões."
3. FAQ dos dois modelos:
   - "A sala VIP do <banco> em Guarulhos está aberta?" quando o banco tiver sala própria em GRU;
   - "Onde fica a sala <categoria> em Guarulhos?" para as categorias com sala da bandeira.
4. Não mexer no title que já cabe em 60 caracteres e começa pelo termo buscado.

Restrições: regras do CLAUDE.md (redação própria, sem recomendar cartão, data de atualização só muda quando o dado muda). Não criar página nova. Não usar noindex nem canonical para resolver canibalização.

Pronto quando:
- npm run build passa e node scripts/audit-seo.mjs mostra 0 URLs com erro;
- as 4 páginas citadas mostram a resposta rápida e a nova description no dist (cole as 4 descriptions no PR);
- a mudança vale para todos os bancos e categorias (mostre mais 3 exemplos no PR).

Entrega: branch seo-resposta-rapida-hubs, PR com antes e depois das descriptions, sem merge.
```

---

## 2. Links internos para a cauda longa

```
Objetivo: reforçar com links internos as páginas que disputam termos com volume e hoje recebem poucos links.

Contexto (contado em 15/11/2026 no site publicado):
- As 90 páginas programa x aeroporto (/programas/<programa>/<aeroporto>/, por exemplo "LoungeKey em Guarulhos") têm 2 links de entrada cada: o índice do programa e o hub do aeroporto. Nenhuma página de sala liga para elas. Exemplo: /salas-vip/guarulhos-gru/plaza-premium-domestico-t2/ aceita Priority Pass e não liga para /programas/priority-pass/guarulhos-gru/.
- As salas da bandeira (mastercard-black-lounge-t3, lounge-by-mastercard-black-t3, visa-infinite-lounge-t3, visa-infinite-privilege-lounge-t3) não ligam para /cartoes/tipo/<categoria>/.
- As salas de banco (nubank-ultravioleta-lounge-t3, vip-lounge-inter-t2 e as demais com dono_tipo banco) não ligam para /bancos/<banco>/.
- Os cartões ligam para o hub da categoria com a âncora "Todos os Mastercard Black" ou "Todos os Visa Infinite".

O que fazer (no modelo, para todas as páginas, derivado dos dados):
1. Página de sala (src/pages/salas-vip/[airport]/[lounge].astro): em cada forma de acesso por programa, link para a página daquele programa naquele aeroporto, quando ela existir. Âncora no formato "<Programa> em <Cidade>: todas as salas".
2. Sala com dono banco: link para o hub do banco ("Sala VIP <Banco>: todas as salas"). Sala de bandeira: link para o hub da categoria ("Sala VIP Mastercard Black: todas as salas").
3. Página de cartão (src/pages/cartoes/[card].astro): âncora para o hub que comece pelo termo buscado ("Sala VIP Mastercard Black: quais salas libera"), sem repetir a mesma âncora em dois links da mesma página.
4. Só links contextuais, dentro do conteúdo. Nada de bloco novo repetido no site inteiro nem no rodapé.

Pronto quando:
- rodar audit-seo antes e depois, e cada página programa x aeroporto passar a ter, no mínimo, os links das salas daquele aeroporto que aceitam o programa, mais os 2 atuais;
- os hubs /cartoes/tipo/mastercard-black/ e /cartoes/tipo/visa-infinite/ recebem os links das salas da bandeira, e cada /bancos/<banco>/ recebe o link de cada sala própria;
- 0 links quebrados e Lighthouse sem perda (o CLAUDE.md pede 100);
- o PR traz uma tabela com URL, links de entrada antes e depois.

Entrega: branch seo-links-internos, PR, sem merge.
```

---

## 3. Hubs de operadora (Plaza Premium, W Premium)

```
Objetivo: tornar /operadoras/plaza-premium/ e /operadoras/w-premium/ a melhor resposta para quem busca preço, horário e cartão por sala: "plaza premium lounge" (6.600 buscas/mês), "w premium lounge" (3.600/mês) e a cauda "plaza premium guarulhos", "w premium congonhas preço". O mesmo modelo vale para Advantage e Ambaar.

Contexto: as duas páginas têm 715 e 745 palavras de conteúdo principal, só com "Programas aceitos" e "Salas por aeroporto". Os links das 12 + 12 salas já chegam. A busca só pelo nome leva ao site oficial; o ganho está em quem quer comparar.

O que fazer em src/pages/operadoras/[operadora].astro (dados de operatorHub):
1. "Resposta rápida": quantas salas abertas, em quais aeroportos, a faixa de preço avulso confirmada (só tarifa confirmada, com duração e canal, via avulsoSummary e fmtAvulso) e os programas mais aceitos.
2. Tabela por sala: aeroporto, terminal, embarque (doméstico ou internacional), antes ou depois do raio-X, horário, avulso com duração e canal, programas e cartões aceitos, data de verificação. Dado "a_confirmar" em cinza, como no resto do site.
3. FAQ respondida a partir dos dados: "Quanto custa a <rede> sem cartão?", "Quais cartões dão acesso?", "Priority Pass entra?", "Que horas abre?", "Tem chuveiro?".
4. Title e description pelo padrão do CLAUDE.md (termo primeiro, até 60 caracteres; description com fitText).

Pronto quando:
- build e audit-seo sem erro;
- cada página de operadora tem tabela e FAQ, sem nenhum preço sem fonte;
- o PR traz um trecho do dist das 2 páginas.

Entrega: branch seo-hubs-operadoras, PR, sem merge.
```

---

## 4. Visa Airport Companion, DragonPass e o guia da troca

```
Objetivo: responder no topo de /programas/visa-airport-companion/ (14.800 buscas/mês) e /programas/dragonpass/ (9.900/mês) a dúvida principal de cada programa, e ampliar o guia /guias/loungekey-dragonpass-mastercard/. Esse guia tem 353 palavras e recebe 272 links internos.

Contexto: nas buscas sobre o Visa Airport Companion, a dúvida nº 1 é como usar. O roteiro é cadastrar o cartão no app e gerar o QR Code. Na recepção, se o nome não for reconhecido, dizer DragonPass, porque a rede é operada pela DragonPass. Sobre o DragonPass, a dúvida da vez é a troca do LoungeKey pelo DragonPass em cartões Mastercard (C6, BTG).

O que fazer:
1. Página do programa (src/pages/programas/[program]/index.astro ou o dado editorial do programa): bloco "Como usar" no topo, em 3 ou 4 passos, com fonte oficial e data. Só o que a fonte oficial confirma; o resto fica "a confirmar". Se houver dado, aplicar também a Priority Pass e LoungeKey.
2. Guia LoungeKey x DragonPass. Incluir, com redação própria e sem copiar blogs:
   - tabela por banco: quem trocou, quando, fonte;
   - o que muda na prática nos aeroportos brasileiros: salas que aceitam um programa e não o outro, derivado dos dados;
   - FAQ.
3. Conferir as fontes oficiais com WebFetch. O que não abrir (o site da Visa bloqueia leitura automática) vira pendência em docs/PENDENCIAS.md.

Pronto quando:
- build e audit-seo sem erro;
- cada afirmação nova tem fonte e data;
- o changelog está atualizado se algum dado mudou.

Entrega: branch seo-programas-como-usar, PR, sem merge.
```

---

## 5. Dados de Congonhas e Viracopos

```
Objetivo: fechar as pendências de dado de Congonhas e Viracopos. "sala vip congonhas" tem 9.900 buscas/mês, igual a Guarulhos, e "sala vip viracopos" tem 6.600/mês, mas parte dos preços ainda vem só de fonte secundária.

Pendências (docs/PENDENCIAS.md):
- CGH: o avulso da Ambaar (R$ 220 por 4 horas) e da W Premium (R$ 220 por 3 horas) só tem fonte secundária. O mesmo vale para Visa Airport Companion, C6 e Sisprime na W Premium.
- VCP: o avulso da The Lounge Viracopos aparece como US$ 38 (igual ao do Panamá) numa fonte e R$ 200 em outra. O title do hub ainda diz "(out 2026)".

O que fazer: seguir a "Manutenção mensal" do CLAUDE.md só para CGH e VCP.
- Reverificar cada sala na fonte oficial (operadora, aeroporto, programa).
- Atualizar regras, preço (com duração e canal), horário, confianca e verificado_em.
- Registrar as mudanças no changelog.
- Tirar de PENDENCIAS.md o que for resolvido; o que não for fica com o motivo.
Não inventar dado para a página parecer mais completa: aqui, profundidade é dado confirmado.

Pronto quando:
- npm run build passa;
- o PR resume o que mudou, o que ficou "a confirmar" e por quê;
- a data no title só muda se o dado mudou.

Entrega: branch dados-cgh-vcp, PR, sem merge.
```

---

## 6. Placar da home lido duas vezes

```
Objetivo: o placar da home não pode virar número errado para quem lê o texto da página (buscador, leitor de tela, ferramenta de IA).

Contexto: em src/pages/index.astro, linha 99, cada número aparece duas vezes no HTML: <span class="sr-only">187</span><span aria-hidden="true" data-roll>187</span>. Ferramentas que extraem texto leem "187187 salas abertas mapeadas". Em 15/11/2026, um navegador que capturou a página no meio da animação leu "187318". O Google renderiza JavaScript e pode indexar qualquer um dos dois.

O que fazer: manter a animação (decisão do dono, seção "Movimento" do CLAUDE.md), mas com cada número uma vez só no texto. Duas formas possíveis:
- número real como texto normal e os dígitos que giram só como camada visual (pseudo-elemento com content: attr(data-n));
- spans criados pelo JS, que somem no fim da animação.
Requisitos: layout sem mudança (CLS 0) e prefers-reduced-motion respeitado.

Pronto quando:
- o texto extraído de dist/index.html (com um parser de HTML) mostra "187 salas abertas mapeadas", com cada número uma vez;
- Lighthouse continua 100;
- a animação continua igual no navegador.

Entrega: branch fix-placar-texto, PR, sem merge.
```

---

## 7. Pesquisa de cauda longa

```
Objetivo: medir a cauda longa dos termos de sala VIP no Brasil e ligar cada termo a uma página que já existe no aeroportos.vip.

Ferramenta: DataForSEO pelo Firecrawl (alexandria_library_read, provider dataforseo). keywords/search-volume aceita até 1.000 termos pelo mesmo preço, então junte tudo numa chamada; para ideias, use keywords/ideas. location_code 2076, language_code pt.

Termos a medir, gerados a partir de https://aeroportos.vip/sitemap.xml:
- <programa> + <aeroporto>, para Priority Pass, LoungeKey, DragonPass e Visa Airport Companion nos 33 aeroportos, com nome e IATA ("loungekey guarulhos", "priority pass gru", "dragonpass congonhas");
- sala vip + <aeroporto> + terminal (GRU T2 e T3), "sala vip <aeroporto> preço", "sala vip <aeroporto> sem cartão", "sala vip <aeroporto> 24 horas";
- <operadora> + <aeroporto> (plaza premium guarulhos, w premium congonhas, ambaar confins, advantage viracopos);
- sala vip + <banco> e + <cartão>, para os 63 cartões;
- ideias a partir de: sala vip aeroporto, sala vip guarulhos, cartão com sala vip, priority pass.

Entrega: CSV e um resumo com:
1. Os 50 termos de maior volume, cada um com a URL do site que deve disputá-lo (do sitemap), a intenção (informacional, navegacional ou de compra) e o CPC.
2. Termos com 100 buscas/mês ou mais sem página clara: propor pergunta no FAQ de uma página existente. Página nova só se nenhuma servir, com justificativa.
3. Termos navegacionais de marca, em que o site oficial fica com o 1º lugar, marcados como "cauda" e fora da prioridade.
Não usar texto de concorrentes.
```

---

## 8. Search Console: consultas entre a 5ª e a 20ª posição

```
Objetivo: achar as consultas em que o aeroportos.vip já aparece entre a 5ª e a 20ª posição e fazer a menor mudança que o faça subir.

Entrada: exportação do Search Console, Desempenho > Resultados da pesquisa, últimos 28 dias, com as abas Consultas e Páginas. [anexar CSV ou planilha]

O que fazer:
1. Cruzar consulta x página. Se o export não trouxer o par, pedir o export filtrado por página das 15 URLs do mapa abaixo.
2. Listar as consultas com posição média entre 5 e 20 e pelo menos 50 impressões, ordenadas por impressões.
3. Para cada uma: qual página aparece, se é a página certa (ver o mapa) e a menor mudança que responde a consulta (title, description, pergunta no FAQ ou link interno). Nada de página nova.
4. Canibalização: duas URLs do site alternando na mesma consulta. Exemplos: /aeroportos/guarulhos-gru/ e /salas-vip/guarulhos-gru/ em "sala vip guarulhos"; o hub do cartão e a página da sala em "sala vip mastercard black". Propor ajuste de link e de texto, sem noindex.

Mapa termo > página:
- priority pass > /programas/priority-pass/
- loungekey > /programas/loungekey/
- visa airport companion > /programas/visa-airport-companion/
- dragonpass > /programas/dragonpass/
- sala vip > /
- sala vip guarulhos > /salas-vip/guarulhos-gru/
- sala vip congonhas > /salas-vip/congonhas-cgh/
- sala vip viracopos > /salas-vip/viracopos-vcp/
- sala vip confins > /salas-vip/confins-cnf/
- sala vip mastercard black > /cartoes/tipo/mastercard-black/
- sala vip visa infinite > /cartoes/tipo/visa-infinite/
- sala vip inter > /bancos/inter/
- sala vip nubank > /bancos/nubank/
- plaza premium lounge > /operadoras/plaza-premium/
- w premium lounge > /operadoras/w-premium/

Entrega: tabela com consulta, página, posição, impressões, CTR e ação proposta. Num segundo passo, implementar no repositório o que eu aprovar.
```

---

## 9. Peças da semana 2 do roteiro (GRU sem cartão)

```
Objetivo: preparar as peças da semana 2 do roteiro (docs/auditoria-seo/roteiro-distribuicao.md, de 16 a 20/11/2026): "Sala VIP em Guarulhos sem cartão: quanto custa 1 hora e quanto custam 3 horas".

O que fazer:
1. Tirar os preços do dado atual (src/data), não do roteiro: tarifa, duração, canal, terminal, antes ou depois do raio-X e data de verificação de cada sala de GRU com avulso confirmado.
2. Escrever:
   - um post de LinkedIn do dono, com até 1.300 caracteres;
   - um carrossel de Instagram de 6 a 8 telas, com o texto de cada tela;
   - um e-mail curto de sugestão de pauta para newsletters e blogs de milhas, oferecendo a tabela como fonte, sem pedir link.
3. Gerar uma imagem simples com a tabela e a data de verificação visível. Pode sair do mesmo gerador de OG do site (src/lib/og.ts).
4. Toda peça leva para /salas-vip/guarulhos-gru/, com utm_source e utm_medium por canal (o GA4 mantém os utm_*).

Restrições: regras de texto do CLAUDE.md (sem travessão, frases curtas, números e datas, sem superlativo). Nada de recomendação de cartão. Nada publicado ou enviado.

Entrega: arquivos em docs/distribuicao/2026-11-semana-2/ numa branch, PR sem merge.
```

---

## 10. Marca "Aeroportos VIP" no INPI

```
Objetivo: avaliar se há conflito entre a marca aeroportos.vip e "Aeroportos VIP Club", nome de duas salas do Aeroporto de Brasília (o próprio site tem /salas-vip/brasilia-bsb/aeroportos-vip-club-domestica/ e /salas-vip/brasilia-bsb/aeroportos-vip-club-internacional/).

O que fazer:
1. Pesquisar no INPI registros e pedidos com "AEROPORTOS VIP", "AEROPORTO VIP" e variações, nas classes 35, 39, 41 e 43 e em outras que aparecerem. Para cada um: titular, número, situação, classe e especificação.
2. Ver se já existe pedido próprio do aeroportos.vip.
3. Avaliar:
   - o risco de colidência (LPI art. 124, XIX; afinidade de mercado; distintividade de "aeroportos" + "vip");
   - o risco prático nas buscas pela marca, quando alguém procura a sala de Brasília e encontra o site, ou o contrário.
4. Recomendar: depositar pedido próprio? Em quais classes? Manter o nome ou reforçar um elemento distintivo?

Saída: parecer curto, separando fato, interpretação e recomendação, e marcando o que não foi confirmado.
```
