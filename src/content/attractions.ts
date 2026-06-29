import type { Attraction, AttractionCategory } from './types';

export const ATTRACTION_CATEGORIES: { key: AttractionCategory; label: { pt: string; en: string }; icon: string }[] = [
  { key: 'icones', label: { pt: 'Ícones do Rio', en: 'Rio icons' }, icon: '🗿' },
  { key: 'praias', label: { pt: 'Praias', en: 'Beaches' }, icon: '🏖️' },
  { key: 'natureza', label: { pt: 'Natureza & trilhas', en: 'Nature & trails' }, icon: '🥾' },
  { key: 'cultura', label: { pt: 'Cultura & museus', en: 'Culture & museums' }, icon: '🎨' },
  { key: 'vida-noturna', label: { pt: 'Vida noturna', en: 'Nightlife' }, icon: '🍸' },
];

export const ATTRACTIONS: Attraction[] = [
  {
    slug: 'cristo-redentor',
    officialUrl: 'https://www.tremdocorcovado.rio/',
    ticketUrl: 'https://www.tremdocorcovado.rio/',
    name: 'Cristo Redentor',
    category: 'icones',
    area: 'Corcovado',
    tagline: { pt: 'A estátua que abraça a cidade', en: 'The statue that embraces the city' },
    metaDescription: {
      pt: 'Como visitar o Cristo Redentor: trem do Corcovado, vans oficiais, melhor horário e dicas. Uma das Novas Sete Maravilhas do Mundo.',
      en: 'How to visit Christ the Redeemer: the Corcovado train, official vans, best time and tips. One of the New Seven Wonders of the World.',
    },
    intro: [
      {
        pt: 'A estátua de 38 metros no alto do Corcovado, uma das Novas Sete Maravilhas do Mundo, abraça o Rio a 700 metros de altitude. A vista de 360° abrange praias, montanhas e a Baía de Guanabara.',
        en: 'The 38-metre statue atop Corcovado, one of the New Seven Wonders of the World, embraces Rio from 700 metres up. The 360° view spans beaches, mountains and Guanabara Bay.',
      },
    ],
    howToGet: {
      pt: 'Pelo charmoso Trem do Corcovado por dentro da Floresta da Tijuca, por vans oficiais (Paineiras) ou num tour privativo. Nunca suba pela trilha sozinho.',
      en: 'By the charming Corcovado cog train through the Tijuca Forest, by official vans (Paineiras), or on a private tour. Never hike up alone.',
    },
    bestTime: {
      pt: 'Logo na abertura, de manhã, para céu limpo e menos fila. As nuvens chegam à tarde.',
      en: 'Right at opening, in the morning, for clear skies and shorter queues. Clouds roll in by afternoon.',
    },
    costNote: {
      pt: 'Ingresso com horário marcado; a entrada é limitada e esgota no verão e fins de semana. Compre com antecedência.',
      en: 'Timed ticket; entry is capped and sells out in summer and on weekends. Buy in advance.',
    },
    tip: {
      pt: 'Combine com o Pão de Açúcar no mesmo dia: Cristo de manhã, Pão de Açúcar no fim da tarde para o pôr do sol.',
      en: 'Pair it with Sugarloaf the same day: Christ in the morning, Sugarloaf in the late afternoon for sunset.',
    },
    hero: '/img/sightseeing.svg',
    keywords: ['cristo redentor', 'christ the redeemer tickets', 'corcovado'],
  },
  {
    slug: 'pao-de-acucar',
    officialUrl: 'https://www.bondinho.com.br/',
    ticketUrl: 'https://www.bondinho.com.br/ingresso-bondinho',
    name: 'Pão de Açúcar',
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sugarloaf_Mountain%2C_Rio_de_Janeiro%2C_Brazil.jpg?width=1600',
      credit: 'Donatas Dabravolskas / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    category: 'icones',
    area: 'Urca',
    tagline: { pt: 'O bondinho e a melhor vista da cidade', en: 'The cable car and the best view in the city' },
    metaDescription: {
      pt: 'Pão de Açúcar: o bondinho de vidro em dois trechos até 396 m, com a melhor vista do Rio. Como chegar, ingressos e o pôr do sol perfeito.',
      en: 'Sugarloaf Mountain: the two-stage glass cable car to 396 m with the best view of Rio. How to get there, tickets and the perfect sunset.',
    },
    intro: [
      {
        pt: 'Um bondinho de vidro em dois trechos sobe até 396 metros para a melhor panorâmica da cidade — praias, montanhas e a Baía de Guanabara. Deslumbrante no pôr do sol.',
        en: 'A two-stage glass cable car climbs to 396 metres for the best panorama in the city — beaches, mountains and Guanabara Bay. Stunning at sunset.',
      },
    ],
    howToGet: {
      pt: 'O bondinho parte da Praia Vermelha, na Urca. De metrô até Botafogo + ônibus/Uber, ou direto de Uber.',
      en: 'The cable car departs from Praia Vermelha in Urca. Metro to Botafogo + bus/Uber, or straight by Uber.',
    },
    bestTime: {
      pt: 'Programe o segundo bondinho para o fim da tarde e veja a cidade dourar e depois se acender.',
      en: 'Time the second car for late afternoon and watch the city turn gold, then light up.',
    },
    costNote: {
      pt: 'Ingresso do bondinho na bilheteria ou online; versões skip-the-line evitam fila no verão.',
      en: 'Cable-car ticket at the box office or online; skip-the-line versions avoid queues in summer.',
    },
    tip: {
      pt: 'Há trilha leve até o Morro da Urca (primeiro trecho) para quem quer economizar metade do caminho.',
      en: 'There’s an easy trail up Morro da Urca (the first stage) if you want to save half the climb.',
    },
    hero: '/img/vip.svg',
    keywords: ['pão de açúcar', 'sugarloaf cable car', 'bondinho'],
  },
  {
    slug: 'praias-zona-sul',
    name: 'Copacabana, Ipanema & Arpoador',
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rio_de_janeiro_copacabana_beach_2010.JPG?width=1600',
      credit: 'chensiyuan / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    category: 'praias',
    area: 'Zona Sul',
    tagline: { pt: 'As praias mais famosas do planeta', en: 'The most famous beaches on the planet' },
    metaDescription: {
      pt: 'As praias da Zona Sul do Rio: Copacabana, Ipanema, Leblon e o pôr do sol do Arpoador. Postos, quiosques e dicas de segurança na areia.',
      en: 'Rio’s South Zone beaches: Copacabana, Ipanema, Leblon and the Arpoador sunset. Lifeguard posts, kiosks and beach-safety tips.',
    },
    intro: [
      {
        pt: 'A vida carioca acontece na areia. Copacabana e sua curva de 4 km, Ipanema entre os Dois Irmãos, e o Arpoador — a pedra onde a multidão aplaude o pôr do sol no mar.',
        en: 'Carioca life happens on the sand. Copacabana and its 4 km curve, Ipanema framed by the Dois Irmãos, and Arpoador — the rock where crowds applaud the sunset over the sea.',
      },
    ],
    howToGet: {
      pt: 'Metrô (estações Cantagalo, Ipanema/General Osório, Cardeal Arcoverde) ou Uber. Tudo caminhável na Zona Sul.',
      en: 'Metro (Cantagalo, Ipanema/General Osório, Cardeal Arcoverde stations) or Uber. All walkable in the South Zone.',
    },
    bestTime: {
      pt: 'Manhã para sol e mar calmos; fim de tarde no Arpoador para o pôr do sol. Nunca à noite.',
      en: 'Morning for sun and calm sea; late afternoon at Arpoador for sunset. Never at night.',
    },
    costNote: {
      pt: 'Gratuitas. Aluguel de cadeira e guarda-sol ~R$40–60; quiosques de água de coco e petiscos.',
      en: 'Free. Chair and umbrella rental ~R$40–60; kiosks for coconut water and snacks.',
    },
    tip: {
      pt: 'Leve só dinheiro trocado e uma canga; deixe celular e cartões no hotel quando for entrar no mar.',
      en: 'Bring only small cash and a sarong; leave your phone and cards at the hotel when you go for a swim.',
    },
    hero: '/img/sightseeing.svg',
    keywords: ['best beaches rio', 'copacabana', 'ipanema', 'arpoador sunset'],
  },
  {
    slug: 'floresta-da-tijuca',
    officialUrl: 'https://parquenacionaldatijuca.rio/',
    name: 'Floresta da Tijuca',
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/A%C3%A7ude_Solid%C3%A3o_na_Floresta_da_Tijuca_I.jpg?width=1600',
      credit: 'Halley Pacheco de Oliveira / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
    category: 'natureza',
    area: 'Tijuca',
    tagline: { pt: 'A maior floresta urbana do mundo', en: 'The largest urban forest in the world' },
    metaDescription: {
      pt: 'Floresta da Tijuca: cachoeiras, trilhas e a Vista Chinesa, dentro do Rio. Como visitar a maior floresta urbana do mundo.',
      en: 'Tijuca Forest: waterfalls, trails and the Vista Chinesa, inside Rio. How to visit the largest urban forest in the world.',
    },
    intro: [
      {
        pt: 'Uma floresta tropical inteira dentro da cidade, com cachoeiras, trilhas e mirantes como a Vista Chinesa, debruçada sobre a lagoa e as praias.',
        en: 'An entire rainforest inside the city, with waterfalls, trails and lookouts like the Vista Chinesa, overlooking the lagoon and beaches.',
      },
    ],
    howToGet: {
      pt: 'De Uber/táxi ou tour de jipe. Para trilhas (Pico da Tijuca, Pedra Bonita), vá com guia e cedo.',
      en: 'By Uber/taxi or jeep tour. For trails (Pico da Tijuca, Pedra Bonita), go with a guide and start early.',
    },
    bestTime: {
      pt: 'Manhã, mais fresca e com luz melhor. Evite após chuva forte (trilhas escorregadias).',
      en: 'Morning, cooler and with better light. Avoid after heavy rain (slippery trails).',
    },
    costNote: {
      pt: 'Entrada gratuita na maior parte; tours de jipe e guias têm custo.',
      en: 'Mostly free entry; jeep tours and guides are paid.',
    },
    tip: {
      pt: 'A Cascatinha Taunay e a Vista Chinesa são paradas fáceis sem trilha pesada.',
      en: 'The Cascatinha Taunay waterfall and Vista Chinesa are easy stops with no hard hiking.',
    },
    hero: '/img/things-to-do.svg',
    keywords: ['tijuca forest', 'floresta da tijuca trilhas', 'vista chinesa'],
  },
  {
    slug: 'escadaria-selaron',
    officialUrl: 'https://riotur.rio/en/que_fazer/escadaria-selaron-lapa-steps/',
    name: 'Escadaria Selarón',
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Colorful_Selaron_Stairs_5.jpg?width=1600',
      credit: 'Donatas Dabravolskas / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    category: 'cultura',
    area: 'Lapa / Santa Teresa',
    tagline: { pt: '2.000 azulejos de 60 países', en: '2,000 tiles from 60 countries' },
    metaDescription: {
      pt: 'Escadaria Selarón: 215 degraus cobertos por mais de 2.000 azulejos coloridos, entre a Lapa e Santa Teresa. Gratuita e icônica.',
      en: 'The Selarón Steps: 215 stairs covered in over 2,000 colourful tiles, between Lapa and Santa Teresa. Free and iconic.',
    },
    intro: [
      {
        pt: '215 degraus cobertos por mais de 2.000 azulejos de 60 países — a obra de uma vida do artista chileno Jorge Selarón. Gratuita, vibrante e infinitamente fotogênica.',
        en: '215 steps covered in over 2,000 tiles from 60 countries — the lifework of Chilean artist Jorge Selarón. Free, vivid and endlessly photogenic.',
      },
    ],
    howToGet: {
      pt: 'A pé da Lapa (perto da estação Cinelândia) ou descendo de Santa Teresa.',
      en: 'On foot from Lapa (near Cinelândia station) or walking down from Santa Teresa.',
    },
    bestTime: {
      pt: 'Cedo, para fotos sem multidão. Evite ficar sozinho ali tarde da noite.',
      en: 'Early, for crowd-free photos. Avoid being there alone late at night.',
    },
    costNote: { pt: 'Gratuita.', en: 'Free.' },
    tip: {
      pt: 'Combine com um almoço em Santa Teresa e a descida pela Lapa ao entardecer.',
      en: 'Combine it with lunch in Santa Teresa and the walk down to Lapa at dusk.',
    },
    hero: '/img/nightlife.svg',
    keywords: ['selaron steps', 'escadaria selarón', 'lapa'],
  },
  {
    slug: 'maracana',
    officialUrl: 'https://en.tourmaracana.com.br/',
    ticketUrl: 'https://en.tourmaracana.com.br/ingressos',
    name: 'Maracanã',
    category: 'cultura',
    area: 'Maracanã',
    tagline: { pt: 'O templo do futebol brasileiro', en: 'The temple of Brazilian football' },
    metaDescription: {
      pt: 'Maracanã: tour do estádio ou — muito melhor — um jogo com a torcida cantando. Como ir com segurança e o que esperar.',
      en: 'Maracanã: a stadium tour or — far better — a match with the crowd singing. How to go safely and what to expect.',
    },
    intro: [
      {
        pt: 'O estádio mais famoso do Brasil. Faça o tour ou, muito melhor, assista a um jogo de Flamengo, Fluminense, Vasco ou Botafogo e sinta a arquibancada tremer.',
        en: 'Brazil’s most famous stadium. Take the tour or, far better, catch a Flamengo, Fluminense, Vasco or Botafogo match and feel the stands shake.',
      },
    ],
    howToGet: {
      pt: 'Metrô Linha 2 até a estação Maracanã — fácil e seguro em dia de jogo.',
      en: 'Metro Line 2 to Maracanã station — easy and safe on match days.',
    },
    bestTime: {
      pt: 'Dia de clássico para a maior atmosfera. Vá com guia/experiência organizada na primeira vez.',
      en: 'A derby day for the biggest atmosphere. Go with a guide/organised experience your first time.',
    },
    costNote: {
      pt: 'Tour do estádio acessível; ingressos de jogo variam por partida e setor.',
      en: 'Affordable stadium tour; match tickets vary by game and sector.',
    },
    tip: {
      pt: 'Leve pouco; vista cores neutras se não souber para quem torcer.',
      en: 'Travel light; wear neutral colours if you’re unsure who to root for.',
    },
    hero: '/img/things-to-do.svg',
    keywords: ['maracana stadium', 'maracanã ingressos', 'football rio'],
  },
  {
    slug: 'pedra-do-sal',
    name: 'Pedra do Sal',
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arcos_da_Lapa_in_Rio_de_Janeiro.jpg?width=1600',
      credit: 'Rodrigo Soldon / Wikimedia Commons',
      license: 'CC BY 2.0',
    },
    category: 'vida-noturna',
    area: 'Saúde / Pequena África',
    tagline: { pt: 'O berço do samba, ao ar livre', en: 'The birthplace of samba, in the open air' },
    metaDescription: {
      pt: 'Pedra do Sal: roda de samba gratuita às segundas e sextas no berço do samba carioca, na Pequena África. Alma e história.',
      en: 'Pedra do Sal: a free samba circle on Mondays and Fridays in the birthplace of carioca samba, in Little Africa. Soul and history.',
    },
    intro: [
      {
        pt: 'Uma escadaria histórica na Pequena África, berço do samba carioca. Roda de samba gratuita às segundas e sextas, cerveja na mão, alma pura.',
        en: 'A historic stone staircase in Little Africa, the cradle of carioca samba. A free samba circle on Mondays and Fridays, beer in hand, pure soul.',
      },
    ],
    howToGet: {
      pt: 'VLT até a região portuária ou Uber. Vá em grupo e volte de aplicativo.',
      en: 'VLT light rail to the port district or Uber. Go in a group and head back by app.',
    },
    bestTime: {
      pt: 'Noites de segunda e sexta, a partir das 19h–20h.',
      en: 'Monday and Friday nights, from 7–8pm.',
    },
    costNote: { pt: 'Gratuito; bebidas vendidas no local.', en: 'Free; drinks sold on site.' },
    tip: {
      pt: 'Leve só dinheiro trocado para as barracas e o celular no bolso da frente.',
      en: 'Bring only small cash for the stalls and keep your phone in a front pocket.',
    },
    hero: '/img/nightlife.svg',
    keywords: ['pedra do sal', 'samba rio', 'little africa'],
  },
  {
    slug: 'jardim-botanico-parque-lage',
    officialUrl: 'https://www.gov.br/jbrj/pt-br/',
    ticketUrl: 'https://jbrj.eleventickets.com/',
    name: 'Jardim Botânico & Parque Lage',
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/As_palmeiras_imperiais_do_Jardim_Bot%C3%A2nico_-_Rio_de_Janeiro._%289062349874%29.jpg?width=1600',
      credit: 'Halley Pacheco de Oliveira / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
    category: 'natureza',
    area: 'Jardim Botânico',
    tagline: { pt: 'Palmeiras imperiais e um palacete com vista', en: 'Imperial palms and a mansion with a view' },
    metaDescription: {
      pt: 'Jardim Botânico e Parque Lage: um jardim do século 19 com palmeiras imperiais e o palacete com café e vista do Cristo. Sereno e gratuito.',
      en: 'Jardim Botânico and Parque Lage: a 19th-century garden of imperial palms and a mansion café with a view of Christ. Serene and free/cheap.',
    },
    intro: [
      {
        pt: 'Um sereno jardim botânico do século 19, com a alameda de palmeiras imperiais, e o vizinho Parque Lage, cujo palacete tem um café emoldurando o Corcovado.',
        en: 'A serene 19th-century botanical garden with its avenue of imperial palms, and the neighbouring Parque Lage, whose mansion frames Corcovado from its café.',
      },
    ],
    howToGet: {
      pt: 'Uber ou ônibus até o Jardim Botânico; os dois ficam lado a lado.',
      en: 'Uber or bus to Jardim Botânico; the two sit side by side.',
    },
    bestTime: {
      pt: 'Manhã de dia útil, mais vazia e fresca.',
      en: 'A weekday morning, emptier and cooler.',
    },
    costNote: {
      pt: 'Parque Lage gratuito; Jardim Botânico cobra entrada simbólica.',
      en: 'Parque Lage is free; the Botanical Garden charges a small entry fee.',
    },
    tip: {
      pt: 'Tome café no palacete do Parque Lage com o Cristo ao fundo — a foto perfeita.',
      en: 'Have coffee at the Parque Lage mansion with Christ in the background — the perfect photo.',
    },
    hero: '/img/things-to-do.svg',
    keywords: ['jardim botânico rio', 'parque lage', 'jardim botanico'],
  },
];

const BY_SLUG = new Map(ATTRACTIONS.map((a) => [a.slug, a]));
export function getAttraction(slug: string) {
  return BY_SLUG.get(slug);
}
