import type { Guide } from '../types';

export const sightseeing: Guide = {
  slug: 'sightseeing',
  group: 'experience',
  icon: '🗿',
  nav: { en: 'Sightseeing', pt: 'Pontos turísticos' },
  title: { en: 'Sightseeing & icons', pt: 'Pontos turísticos & ícones' },
  metaTitle: {
    en: 'Rio Sightseeing: Christ the Redeemer, Sugarloaf & More',
    pt: 'Pontos turísticos do Rio: Cristo, Pão de Açúcar e mais',
  },
  metaDescription: {
    en: 'The must-see icons of Rio de Janeiro — Christ the Redeemer, Sugarloaf cable car, Copacabana & Ipanema, the Selarón Steps, Tijuca Forest and how to visit each.',
    pt: 'Os ícones imperdíveis do Rio — Cristo Redentor, bondinho do Pão de Açúcar, Copacabana e Ipanema, Escadaria Selarón, Floresta da Tijuca e como visitar cada um.',
  },
  lede: {
    en: 'The postcard shots are real — and even better in person. Here’s how to see them right.',
    pt: 'Os cartões-postais são reais — e ainda melhores ao vivo. Veja como conhecê-los do jeito certo.',
  },
  intro: [
    {
      en: 'Two open arms over the city, a sugarloaf rising from the sea, the most famous beaches on Earth. Rio’s icons live up to the hype. Visit the big two — Christ the Redeemer and Sugarloaf — early in the day for clear skies and smaller queues, and buy tickets in advance.',
      pt: 'Dois braços abertos sobre a cidade, um pão de açúcar saindo do mar, as praias mais famosas do planeta. Os ícones do Rio fazem jus à fama. Visite os dois grandes — Cristo Redentor e Pão de Açúcar — cedo, para céu limpo e menos fila, e compre ingressos com antecedência.',
    },
  ],
  hero: '/img/sightseeing.svg',
  keywords: [
    'christ the redeemer tickets',
    'sugarloaf cable car',
    'things to see in rio',
    'selaron steps',
    'cristo redentor ingressos',
    'pão de açúcar',
    'pontos turísticos rio',
  ],
  sections: [
    {
      id: 'icons',
      title: { en: 'The big icons', pt: 'Os grandes ícones' },
      items: [
        {
          name: 'Christ the Redeemer (Cristo Redentor)',
          area: 'Corcovado',
          blurb: {
            en: 'The 38m statue atop Corcovado, one of the New Seven Wonders. Reach it by the cog train through Tijuca Forest, official vans, or a private tour. Go early; clouds roll in later.',
            pt: 'A estátua de 38m no alto do Corcovado, uma das Novas Sete Maravilhas. Chegue pelo trem do Corcovado por dentro da Floresta da Tijuca, vans oficiais ou tour privativo. Vá cedo; as nuvens chegam mais tarde.',
          },
          tip: {
            en: 'Buy timed tickets in advance — entry is capped and sells out, especially in summer.',
            pt: 'Compre ingresso com horário marcado — a entrada é limitada e esgota, sobretudo no verão.',
          },
        },
        {
          name: 'Sugarloaf (Pão de Açúcar)',
          area: 'Urca',
          blurb: {
            en: 'A two-stage glass cable car climbs to 396m for the best panorama in the city — beaches, mountains and Guanabara Bay. Stunning at sunset.',
            pt: 'Um bondinho de vidro em dois trechos sobe a 396m para a melhor vista da cidade — praias, montanhas e Baía de Guanabara. Deslumbrante no pôr do sol.',
          },
          tip: {
            en: 'Time the second car for golden hour, then watch the city lights come on.',
            pt: 'Programe o segundo bondinho para o fim de tarde e veja a cidade se acender.',
          },
        },
        {
          name: 'Escadaria Selarón',
          area: 'Lapa / Santa Teresa',
          blurb: {
            en: '215 steps covered in over 2,000 colorful tiles from around the world — the lifework of artist Jorge Selarón. Free, vivid and endlessly photogenic.',
            pt: '215 degraus cobertos por mais de 2.000 azulejos coloridos do mundo todo — a obra de uma vida do artista Jorge Selarón. Gratuita, vibrante e fotogênica.',
          },
        },
      ],
    },
    {
      id: 'beaches',
      title: { en: 'Beaches & viewpoints', pt: 'Praias & mirantes' },
      items: [
        {
          name: 'Copacabana & Ipanema',
          area: 'Zona Sul',
          blurb: {
            en: 'The world’s most famous beaches, side by side. Copacabana’s 4km crescent and black-and-white promenade; Ipanema’s chic sands framed by the Dois Irmãos peaks.',
            pt: 'As praias mais famosas do mundo, lado a lado. A curva de 4km de Copacabana e seu calçadão preto e branco; a areia chique de Ipanema emoldurada pelos Dois Irmãos.',
          },
        },
        {
          name: 'Arpoador sunset',
          area: 'Ipanema',
          blurb: {
            en: 'The rock between Ipanema and Copacabana where crowds gather to applaud the sunset over the sea. Free and unforgettable.',
            pt: 'A pedra entre Ipanema e Copacabana onde a multidão se reúne para aplaudir o pôr do sol no mar. Gratuito e inesquecível.',
          },
        },
        {
          name: 'Tijuca Forest & Vista Chinesa',
          area: 'Tijuca',
          blurb: {
            en: 'The world’s largest urban rainforest, laced with waterfalls and trails, with the Vista Chinesa pavilion overlooking the lagoon and beaches.',
            pt: 'A maior floresta urbana do mundo, com cachoeiras e trilhas, e o mirante da Vista Chinesa sobre a lagoa e as praias.',
          },
        },
        {
          name: 'Jardim Botânico & Parque Lage',
          area: 'Jardim Botânico',
          blurb: {
            en: 'A serene 19th-century botanical garden of towering palms, and the neighboring Parque Lage mansion with a café framing Corcovado.',
            pt: 'Um sereno jardim botânico do século 19 com palmeiras imperiais, e o vizinho Parque Lage, cujo palacete tem um café com o Corcovado ao fundo.',
          },
        },
      ],
    },
    {
      id: 'culture',
      title: { en: 'Culture & landmarks', pt: 'Cultura & marcos' },
      items: [
        {
          name: 'Museu do Amanhã',
          area: 'Praça Mauá',
          blurb: {
            en: 'Santiago Calatrava’s futuristic “Museum of Tomorrow” on the revitalized waterfront — science, sustainability and striking architecture.',
            pt: 'O futurista Museu do Amanhã, de Santiago Calatrava, na orla revitalizada — ciência, sustentabilidade e arquitetura marcante.',
          },
        },
        {
          name: 'Maracanã',
          area: 'Maracanã',
          blurb: {
            en: 'The temple of Brazilian football. Take a stadium tour, or — far better — catch a match and feel the crowd shake the stands.',
            pt: 'O templo do futebol brasileiro. Faça o tour do estádio ou — muito melhor — assista a um jogo e sinta a torcida fazer a arquibancada tremer.',
          },
        },
        {
          name: 'Santa Teresa',
          area: 'Santa Teresa',
          blurb: {
            en: 'A bohemian hilltop neighborhood of cobbled lanes, artists’ studios and colonial mansions, reached by the historic yellow tram.',
            pt: 'Um bairro boêmio no alto, de ruas de paralelepípedo, ateliês e casarões coloniais, acessível pelo histórico bonde amarelo.',
          },
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'How do I get tickets for Christ the Redeemer?', pt: 'Como compro ingressos para o Cristo Redentor?' },
      a: {
        en: 'Buy timed tickets in advance through the official channels (the Trem do Corcovado / Paineiras vans) or a reputable tour. Entry is capped, so summer and weekend slots sell out — book early and aim for a morning slot for clear views.',
        pt: 'Compre ingressos com horário antecipadamente pelos canais oficiais (Trem do Corcovado / vans Paineiras) ou um tour confiável. A entrada é limitada, então horários de verão e fim de semana esgotam — reserve cedo e prefira a manhã para vista limpa.',
      },
    },
    {
      q: { en: 'Can I see Christ the Redeemer and Sugarloaf in one day?', pt: 'Dá para ver o Cristo e o Pão de Açúcar no mesmo dia?' },
      a: {
        en: 'Yes — many visitors do both in a day, often with a private guide or combo tour. Do Christ the Redeemer in the morning (clearer skies) and Sugarloaf in the late afternoon for sunset.',
        pt: 'Sim — muitos visitantes fazem os dois no mesmo dia, geralmente com guia privativo ou tour combo. Faça o Cristo de manhã (céu mais limpo) e o Pão de Açúcar no fim da tarde para o pôr do sol.',
      },
    },
  ],
  related: ['things-to-do', 'vip', 'transport'],
};
