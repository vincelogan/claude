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
  {
    slug: 'museu-do-amanha',
    officialUrl: 'https://museudoamanha.org.br/',
    ticketUrl: 'https://museudoamanha.org.br/visite/horarios-e-ingressos',
    name: 'Museu do Amanhã',
    category: 'cultura',
    area: 'Praça Mauá / Centro',
    tagline: { pt: 'O museu do futuro, de Calatrava', en: 'Calatrava’s museum of tomorrow' },
    metaDescription: {
      pt: 'Museu do Amanhã: o edifício futurista de Santiago Calatrava na orla revitalizada, sobre ciência, sustentabilidade e o futuro. Horários e ingressos.',
      en: 'Museum of Tomorrow: Santiago Calatrava’s futuristic building on the revitalised waterfront, on science, sustainability and the future. Hours and tickets.',
    },
    intro: [
      {
        pt: 'O “museu do amanhã” de Santiago Calatrava explora o clima e o futuro humano por instalações imersivas, mais que por acervo. O prédio em balanço é um marco da orla revitalizada.',
        en: 'Santiago Calatrava’s “museum of tomorrow” explores climate and the human future through immersive installations rather than artefacts. The cantilevered building is a landmark of the revitalised waterfront.',
      },
    ],
    howToGet: { pt: 'VLT até a Praça Mauá, ou Uber. Combine com o AquaRio ao lado.', en: 'VLT to Praça Mauá, or Uber. Combine with AquaRio next door.' },
    bestTime: { pt: 'Compre ingresso com horário; reserve cerca de 90 minutos.', en: 'Buy a timed ticket; allow about 90 minutes.' },
    costNote: { pt: 'Ingresso acessível; entrada gratuita às terças.', en: 'Affordable ticket; free entry on Tuesdays.' },
    tip: { pt: 'Pôr do sol na Praça Mauá depois da visita, com a roda-gigante ao lado.', en: 'Sunset on Praça Mauá afterward, with the Ferris wheel next door.' },
    hero: '/img/sightseeing.svg',
    keywords: ['museu do amanha', 'museum of tomorrow', 'praça mauá'],
  },
  {
    slug: 'aquario-marinho',
    officialUrl: 'https://www.aquariomarinhodorio.com.br/',
    ticketUrl: 'https://ingressos.aquariomarinhodorio.com.br/',
    name: 'AquaRio',
    category: 'cultura',
    area: 'Gamboa / Porto',
    tagline: { pt: 'O maior aquário marinho da América do Sul', en: 'South America’s largest marine aquarium' },
    metaDescription: {
      pt: 'AquaRio: o maior aquário marinho da América do Sul, com um túnel entre raias e tubarões. Ótima opção em família ou em dia de chuva, no Porto Maravilha.',
      en: 'AquaRio: South America’s largest marine aquarium, with a tunnel through rays and sharks. A great family or rainy-day option in the revitalised port.',
    },
    intro: [
      {
        pt: 'Construído em torno de um túnel num tanque de raias e tubarões, é uma opção certeira para famílias ou dias de chuva, no porto revitalizado.',
        en: 'Built around a tunnel through a tank of rays and sharks, it’s a dependable family or rainy-day option in the revitalised port zone.',
      },
    ],
    howToGet: { pt: 'VLT até a região portuária ou Uber. Ao lado do Museu do Amanhã.', en: 'VLT to the port district or Uber. Next to the Museum of Tomorrow.' },
    bestTime: { pt: 'Reserve horário online; manhãs são mais tranquilas.', en: 'Book a timed slot online; mornings are calmer.' },
    costNote: { pt: 'Ingresso médio; combinados com o Museu do Amanhã.', en: 'Mid-range ticket; combos with the Museum of Tomorrow.' },
    tip: { pt: 'Faça o circuito do porto: AquaRio, Museu do Amanhã e a roda-gigante Yup Star.', en: 'Do the port circuit: AquaRio, Museum of Tomorrow and the Yup Star wheel.' },
    hero: '/img/things-to-do.svg',
    keywords: ['aquario rio', 'aquario marinho do rio', 'aquarium rio'],
  },
  {
    slug: 'theatro-municipal',
    officialUrl: 'http://theatromunicipal.rj.gov.br/',
    name: 'Theatro Municipal',
    category: 'cultura',
    area: 'Cinelândia / Centro',
    tagline: { pt: 'A ópera Belle Époque do Rio', en: 'Rio’s Belle Époque opera house' },
    metaDescription: {
      pt: 'Theatro Municipal: a casa de ópera Belle Époque do Rio, inspirada na Ópera de Paris. Veja por dentro num tour guiado ou, melhor ainda, num espetáculo.',
      en: 'Theatro Municipal: Rio’s Belle Époque opera house, modelled on the Paris Opera. See it on a guided tour or, better, during a performance.',
    },
    intro: [
      {
        pt: 'A casa de ópera Belle Époque do Rio, espelhada na Ópera de Paris, com interior dourado que se aprecia melhor num tour guiado ou num espetáculo à noite.',
        en: 'Rio’s Belle Époque opera house, modelled on the Paris Opera, with a gilded interior best seen on a guided tour or during an evening performance.',
      },
    ],
    howToGet: { pt: 'Metrô até Cinelândia. Fica na Praça Floriano, no Centro.', en: 'Metro to Cinelândia. It sits on Praça Floriano downtown.' },
    bestTime: { pt: 'Tours em dias selecionados — reserve com antecedência.', en: 'Tours run on selected days — book ahead.' },
    costNote: { pt: 'Tour acessível; ingressos de espetáculo variam por evento.', en: 'Affordable tour; performance tickets vary by event.' },
    tip: { pt: 'Para o efeito completo, vá a um concerto ou balé à noite.', en: 'For the full effect, attend an evening concert or ballet.' },
    hero: '/img/nightlife.svg',
    keywords: ['theatro municipal rio', 'rio opera house', 'cinelândia'],
  },
  {
    slug: 'mirante-dona-marta',
    name: 'Mirante Dona Marta',
    category: 'natureza',
    area: 'Corcovado',
    tagline: { pt: 'A vista de cartão-postal do Rio', en: 'Rio’s postcard viewpoint' },
    metaDescription: {
      pt: 'Mirante Dona Marta: o mirante a meia altura do Corcovado com vista da baía, do Pão de Açúcar e do Cristo. Vá de táxi ou tour — não suba a pé.',
      en: 'Mirante Dona Marta: a balcony partway up Corcovado with views of the bay, Sugarloaf and Christ. Go by taxi or tour — don’t walk up.',
    },
    intro: [
      {
        pt: 'Uma sacada a meia altura do Corcovado com vista ampla da baía, do Pão de Açúcar e da cidade, além de um ângulo lateral do Cristo Redentor.',
        en: 'A balcony partway up Corcovado with a sweeping view of the bay, Sugarloaf and the city, plus a side angle on Christ the Redeemer.',
      },
    ],
    howToGet: { pt: 'Não há transporte público até o topo — vá de táxi/Uber ou em tour.', en: 'No public transport to the top — go by taxi/Uber or on a tour.' },
    bestTime: { pt: 'Fim de tarde para a luz dourada; evite à noite (estrada escura).', en: 'Late afternoon for golden light; avoid at night (unlit road).' },
    costNote: { pt: 'Gratuito; você paga só o transporte.', en: 'Free; you pay only for transport.' },
    tip: { pt: 'Combine com o Cristo no mesmo trajeto de subida.', en: 'Combine it with Christ the Redeemer on the way up.' },
    hero: '/img/things-to-do.svg',
    keywords: ['mirante dona marta', 'rio viewpoint', 'corcovado view'],
  },
  {
    slug: 'pedra-bonita',
    name: 'Pedra Bonita & voo livre',
    category: 'natureza',
    area: 'São Conrado',
    tagline: { pt: 'Asa-delta sobre a floresta e o mar', en: 'Hang gliding over forest and sea' },
    metaDescription: {
      pt: 'Pedra Bonita: a rampa de voo livre acima de São Conrado, de onde asa-deltas e parapentes descem até a praia. A maior emoção do Rio.',
      en: 'Pedra Bonita: the hang-gliding ramp above São Conrado, where gliders drift down to the beach. Rio’s ultimate thrill.',
    },
    intro: [
      {
        pt: 'A rampa de onde asa-deltas e parapentes decolam em voo duplo até a praia de São Conrado. A trilha curta até o cume também vale por si só.',
        en: 'The ramp where tandem hang-gliders and paragliders launch down to São Conrado beach. The short hike to the summit is rewarding on its own.',
      },
    ],
    howToGet: { pt: 'De Uber/táxi até a rampa, em São Conrado. Operadores buscam no hotel.', en: 'By Uber/taxi to the ramp in São Conrado. Operators offer hotel pickup.' },
    bestTime: { pt: 'Manhãs, conforme o vento; voos dependem totalmente do tempo.', en: 'Mornings, wind permitting; flights depend entirely on the weather.' },
    costNote: { pt: 'Voo duplo é caro mas inesquecível; a trilha é gratuita.', en: 'Tandem flights are pricey but unforgettable; the hike is free.' },
    tip: { pt: 'Reserve um operador flexível e trate o tempo, não a agenda, como final.', en: 'Book a flexible operator and treat conditions, not the schedule, as final.' },
    hero: '/img/things-to-do.svg',
    keywords: ['hang gliding rio', 'pedra bonita', 'voo livre são conrado'],
  },
  {
    slug: 'praia-vermelha-claudio-coutinho',
    name: 'Praia Vermelha & Pista Cláudio Coutinho',
    category: 'natureza',
    area: 'Urca',
    tagline: { pt: 'Enseada calma e trilha à beira-mar', en: 'A calm cove and a coastal trail' },
    metaDescription: {
      pt: 'Praia Vermelha e a Pista Cláudio Coutinho: uma enseada abrigada sob o Pão de Açúcar e uma trilha plana à beira da rocha, com micos pelo caminho.',
      en: 'Praia Vermelha and the Cláudio Coutinho trail: a sheltered cove beneath Sugarloaf and a flat coastal path along the rock, with marmosets along the way.',
    },
    intro: [
      {
        pt: 'Uma pequena enseada abrigada sob o Pão de Açúcar, com uma trilha pavimentada que acompanha a rocha e costuma cruzar com micos. O primeiro trecho, plano, é fácil.',
        en: 'A small sheltered cove beneath Sugarloaf, with a paved trail hugging the rock that often passes marmosets. The flat first stretch is easy.',
      },
    ],
    howToGet: { pt: 'Uber até a Urca; a trilha começa no fim da Praia Vermelha.', en: 'Uber to Urca; the trail starts at the end of Praia Vermelha.' },
    bestTime: { pt: 'Manhã, mais fresca e tranquila.', en: 'Morning, cooler and quieter.' },
    costNote: { pt: 'Gratuito.', en: 'Free.' },
    tip: { pt: 'Há um desvio íngreme que sobe ao Morro da Urca — leve água.', en: 'A steep branch climbs to Morro da Urca — bring water.' },
    hero: '/img/sightseeing.svg',
    keywords: ['praia vermelha', 'pista claudio coutinho', 'urca trail'],
  },
  {
    slug: 'joatinga',
    name: 'Praia da Joatinga',
    category: 'praias',
    area: 'Joá',
    tagline: { pt: 'Uma cala escondida sob as falésias', en: 'A hidden cove beneath the cliffs' },
    metaDescription: {
      pt: 'Praia da Joatinga: uma cala dramática e reservada sob as falésias do Joá, querida dos locais. Acesso por trilha íngreme e dependente da maré.',
      en: 'Joatinga Beach: a dramatic, secluded cove beneath the Joá cliffs, beloved by locals. Access is via a steep path and tide-dependent.',
    },
    intro: [
      {
        pt: 'Uma cala pequena e dramática escondida sob falésias no exclusivo Joá, querida dos cariocas pela beleza e pela reclusão.',
        en: 'A small, dramatic cove tucked beneath cliffs in the exclusive Joá area, prized by locals for its beauty and seclusion.',
      },
    ],
    howToGet: { pt: 'Por uma trilha íngreme em meio às casas do Joá; estacionamento limitado.', en: 'Via a steep path through the Joá homes; limited parking.' },
    bestTime: { pt: 'Maré baixa — a praia quase some na maré cheia. Confira a tábua de marés.', en: 'Low tide — the beach can vanish at high tide. Check the tide table.' },
    costNote: { pt: 'Gratuito; quase sem estrutura.', en: 'Free; almost no facilities.' },
    tip: { pt: 'Leve o que precisar e calce algo firme para a descida.', en: 'Bring what you need and wear sturdy shoes for the descent.' },
    hero: '/img/sightseeing.svg',
    keywords: ['praia da joatinga', 'joatinga beach', 'hidden beach rio'],
  },
  {
    slug: 'grumari',
    name: 'Praia de Grumari',
    category: 'praias',
    area: 'Zona Oeste',
    tagline: { pt: 'Areia avermelhada e mata, sem urbanização', en: 'Reddish sand and forest, no development' },
    metaDescription: {
      pt: 'Praia de Grumari: uma praia selvagem e protegida de areia avermelhada, cercada por mata atlântica na Zona Oeste. Só de carro, e com mar forte.',
      en: 'Grumari Beach: a wild, protected beach of reddish sand backed by Atlantic forest in the West Zone. Car-only, with strong surf.',
    },
    intro: [
      {
        pt: 'Uma praia selvagem e protegida, de areia avermelhada e cercada por mata atlântica no extremo oeste, com clima genuinamente intocado.',
        en: 'A wild, protected beach of reddish sand backed by Atlantic forest in the far west, with a genuinely unspoiled feel.',
      },
    ],
    howToGet: { pt: 'Só de carro ou tour — não há transporte público nem metrô por perto.', en: 'Car or tour only — no public transport or nearby metro.' },
    bestTime: { pt: 'Vá cedo num dia de semana; as ondas são fortes.', en: 'Go early on a weekday; the waves are powerful.' },
    costNote: { pt: 'Gratuito; estrutura mínima.', en: 'Free; minimal facilities.' },
    tip: { pt: 'Combine com a vizinha Prainha num único bate-volta de carro.', en: 'Combine it with neighbouring Prainha in one driving day trip.' },
    hero: '/img/things-to-do.svg',
    keywords: ['praia de grumari', 'grumari beach', 'wild beach rio'],
  },
  {
    slug: 'prainha',
    name: 'Prainha',
    category: 'praias',
    area: 'Recreio',
    tagline: { pt: 'A praia de surfe entre a mata', en: 'The surf beach framed by forest' },
    metaDescription: {
      pt: 'Prainha: a praia de surfe mais conhecida do Rio, emoldurada por mata na Zona Oeste. Lotada nos fins de semana; mar forte, ideal para surfistas.',
      en: 'Prainha: Rio’s best-known surf beach, framed by forest in the West Zone. Busy on weekends; strong waves, best for surfers.',
    },
    intro: [
      {
        pt: 'Uma praia compacta e cercada por mata, o pico de surfe mais famoso do Rio, mais cheia aos fins de semana com a galera do surfe. Um refúgio de natureza longe das praias urbanas.',
        en: 'A compact, forest-framed beach that is Rio’s best-known surf break, busiest on weekends with the surfing crowd. A nature-rich escape from the city beaches.',
      },
    ],
    howToGet: { pt: 'Só de carro ou tour, passando o Recreio; sem transporte prático.', en: 'Car or tour only, past Recreio; no convenient public transport.' },
    bestTime: { pt: 'Cedo ou meio de semana — lota rápido aos sábados e domingos.', en: 'Early or midweek — it fills up fast on weekends.' },
    costNote: { pt: 'Gratuito; ondas fortes pedem bons nadadores.', en: 'Free; strong waves call for confident swimmers.' },
    tip: { pt: 'Há trilha curta a um mirante sobre a praia — a foto perfeita.', en: 'A short trail leads to a lookout over the beach — the perfect photo.' },
    hero: '/img/sightseeing.svg',
    keywords: ['prainha rio', 'surf rio de janeiro', 'prainha beach'],
  },
  {
    slug: 'rio-scenarium',
    name: 'Rio Scenarium',
    category: 'vida-noturna',
    area: 'Lapa',
    tagline: { pt: 'A casa de samba mais famosa da Lapa', en: 'Lapa’s most famous live-music house' },
    metaDescription: {
      pt: 'Rio Scenarium: a casa de música ao vivo mais famosa da Lapa, em três andares de antiguidades, com samba e choro quase todas as noites. Chegue cedo.',
      en: 'Rio Scenarium: Lapa’s best-known live-music house, across three antique-filled floors, with samba and choro most nights. Arrive early.',
    },
    intro: [
      {
        pt: 'Um antigo galpão de antiguidades de três andares, repleto de tesouros vintage, com bandas ao vivo de samba e choro quase todas as noites. Turístico, mas genuinamente mágico.',
        en: 'A three-story former antiques warehouse packed with vintage treasures, with live samba and choro bands most nights. Touristy but genuinely magical.',
      },
    ],
    howToGet: { pt: 'Uber até a Lapa; volte de aplicativo. Há cover na entrada.', en: 'Uber to Lapa; head back by app. There’s a cover charge.' },
    bestTime: { pt: 'Chegue antes da banda começar para conseguir mesa. Fica animado até tarde.', en: 'Arrive before the band starts to get a table. It stays lively until late.' },
    costNote: { pt: 'Cover de entrada + consumo; faixa intermediária.', en: 'Entry cover + spend; mid-range.' },
    tip: { pt: 'Leve pouco dinheiro e mantenha o celular guardado na multidão.', en: 'Carry little cash and keep your phone tucked away in the crowd.' },
    hero: '/img/nightlife.svg',
    keywords: ['rio scenarium', 'lapa samba', 'live music rio'],
  },
  {
    slug: 'real-gabinete-portugues',
    name: 'Real Gabinete Português de Leitura',
    category: 'cultura',
    area: 'Centro',
    tagline: { pt: 'A biblioteca mais bonita do Rio', en: 'Rio’s most beautiful library' },
    metaDescription: {
      pt: 'Real Gabinete Português de Leitura: uma sala de leitura neomanuelina de 1887, com três níveis de estantes de madeira e clarabóia de vitral. Entrada gratuita.',
      en: 'Real Gabinete Português de Leitura: an 1887 neo-Manueline reading room with three tiers of dark-wood shelving and a stained-glass skylight. Free entry.',
    },
    intro: [
      {
        pt: 'Uma sala de leitura neomanuelina de 1887, com três níveis de estantes de madeira escura e uma clarabóia de vitral, guardando o maior acervo português fora de Portugal.',
        en: 'An 1887 neo-Manueline reading room with three soaring tiers of dark-wood shelving and a stained-glass skylight, holding the largest Portuguese collection outside Portugal.',
      },
    ],
    howToGet: { pt: 'Metrô até Uruguaiana/Carioca, a poucos minutos a pé no Centro.', en: 'Metro to Uruguaiana/Carioca, a few minutes’ walk downtown.' },
    bestTime: { pt: 'Logo na abertura, em dia de semana — a sala limita a entrada.', en: 'Right at opening, on a weekday — the room caps entries.' },
    costNote: { pt: 'Gratuito; horários curtos e só em dias úteis.', en: 'Free; short, weekday-only hours.' },
    tip: { pt: 'Combine com a Confeitaria Colombo e o Centro histórico de dia.', en: 'Combine it with Confeitaria Colombo and the historic centre by day.' },
    hero: '/img/sightseeing.svg',
    keywords: ['real gabinete português', 'rio library', 'royal portuguese reading room'],
  },
];

const BY_SLUG = new Map(ATTRACTIONS.map((a) => [a.slug, a]));
export function getAttraction(slug: string) {
  return BY_SLUG.get(slug);
}
