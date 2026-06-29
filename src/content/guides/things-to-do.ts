import type { Guide } from '../types';

export const thingsToDo: Guide = {
  slug: 'things-to-do',
  group: 'experience',
  icon: '🏄',
  nav: { en: 'Things to do', pt: 'O que fazer' },
  title: { en: 'Things to do in Rio', pt: 'O que fazer no Rio' },
  metaTitle: {
    en: 'Things to Do in Rio de Janeiro: Top Experiences & Activities',
    pt: 'O que fazer no Rio de Janeiro: experiências e atividades',
  },
  metaDescription: {
    en: 'The best things to do in Rio de Janeiro — hang gliding over the beach, hiking Dois Irmãos, a match at Maracanã, samba in Lapa, surfing, boat trips and more.',
    pt: 'O que fazer de melhor no Rio — voar de asa-delta sobre a praia, trilha no Dois Irmãos, jogo no Maracanã, samba na Lapa, surfe, passeios de barco e mais.',
  },
  lede: {
    en: 'Fly off a mountain, hike to a hidden view, dance till dawn — Rio is made for doing.',
    pt: 'Voe de uma montanha, suba a um mirante escondido, dance até o amanhecer — o Rio é feito para viver.',
  },
  intro: [
    {
      en: 'Beyond the postcards, Rio is an adventure playground wedged between mountains and sea. Whether you want adrenaline, nature, culture or pure beach laziness, there’s a perfect carioca day waiting.',
      pt: 'Além dos cartões-postais, o Rio é um parque de aventuras encravado entre montanhas e mar. Seja adrenalina, natureza, cultura ou pura preguiça de praia, há um dia carioca perfeito esperando por você.',
    },
  ],
  hero: '/img/things-to-do.svg',
  keywords: [
    'things to do in rio de janeiro',
    'hang gliding rio',
    'rio hiking dois irmaos',
    'maracana match tickets',
    'o que fazer no rio de janeiro',
    'trilhas no rio',
  ],
  sections: [
    {
      id: 'adventure',
      title: { en: 'Adventure & nature', pt: 'Aventura & natureza' },
      items: [
        {
          name: 'Hang gliding from Pedra Bonita',
          area: 'São Conrado',
          blurb: {
            en: 'Run off a mountain ramp strapped to an instructor and soar over the rainforest to land on São Conrado beach. Rio’s ultimate thrill.',
            pt: 'Corra de uma rampa na montanha preso a um instrutor e planeie sobre a floresta até pousar na praia de São Conrado. A maior emoção do Rio.',
          },
          price: 'high',
        },
        {
          name: 'Dois Irmãos hike',
          area: 'Vidigal',
          blurb: {
            en: 'A short, steep trail to the twin peaks above Ipanema for arguably the best view in the city. Go with a guide and start early.',
            pt: 'Uma trilha curta e íngreme até os picos gêmeos acima de Ipanema, com talvez a melhor vista da cidade. Vá com guia e comece cedo.',
          },
          price: 'budget',
        },
        {
          name: 'Pedra do Telégrafo',
          area: 'Barra de Guaratiba',
          blurb: {
            en: 'The famous “hanging off a cliff” photo spot (the drop is an optical illusion) at the city’s wild western edge, paired with quiet beaches.',
            pt: 'O famoso ponto da foto “pendurado no penhasco” (a queda é uma ilusão de ótica) no extremo oeste selvagem da cidade, com praias tranquilas por perto.',
          },
          price: 'budget',
        },
        {
          name: 'Surfing at Arpoador',
          area: 'Ipanema',
          blurb: {
            en: 'Rio’s most central surf break, with board rentals and lessons right where Ipanema meets Copacabana.',
            pt: 'O pico de surfe mais central do Rio, com aluguel de prancha e aulas bem onde Ipanema encontra Copacabana.',
          },
          price: 'budget',
        },
      ],
    },
    {
      id: 'culture',
      title: { en: 'Culture & local life', pt: 'Cultura & vida local' },
      items: [
        {
          name: 'A match at Maracanã',
          area: 'Maracanã',
          blurb: {
            en: 'Flamengo, Fluminense, Vasco or Botafogo — a Brazilian football match is a sensory overload of drums, flags and song. Go with a guide for the safest experience.',
            pt: 'Flamengo, Fluminense, Vasco ou Botafogo — um jogo de futebol é uma overdose de tambores, bandeiras e cantos. Vá com guia para a experiência mais segura.',
          },
          price: 'mid',
        },
        {
          name: 'Samba night in Lapa',
          area: 'Lapa',
          blurb: {
            en: 'Live samba in a historic venue or an open-air roda — the beating heart of carioca culture. See our nightlife guide.',
            pt: 'Samba ao vivo numa casa histórica ou numa roda a céu aberto — o coração da cultura carioca. Veja nosso guia de vida noturna.',
          },
          price: 'mid',
        },
        {
          name: 'Cooking class & feijoada',
          area: 'Santa Teresa / Zona Sul',
          blurb: {
            en: 'Learn to make a caipirinha and a proper feijoada, then eat the spoils — a delicious, hands-on intro to Brazilian flavor.',
            pt: 'Aprenda a fazer caipirinha e uma feijoada de verdade, depois coma tudo — uma introdução deliciosa e prática ao sabor brasileiro.',
          },
          price: 'mid',
        },
      ],
    },
    {
      id: 'water',
      title: { en: 'On the water', pt: 'Na água' },
      items: [
        {
          name: 'Boat trip on Guanabara Bay',
          area: 'Marina da Glória',
          blurb: {
            en: 'Schooner cruises and private boats reveal the city’s skyline from the water, with swim stops at island beaches.',
            pt: 'Saveiros e barcos privativos revelam o skyline da cidade a partir da água, com paradas para banho em praias de ilhas.',
          },
          price: 'mid',
        },
        {
          name: 'Cagarras Islands',
          area: 'Off Ipanema',
          blurb: {
            en: 'A protected archipelago just offshore from Ipanema — snorkeling, sea turtles and a wilder side of Rio.',
            pt: 'Um arquipélago protegido em frente a Ipanema — mergulho, tartarugas marinhas e um lado mais selvagem do Rio.',
          },
          price: 'mid',
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'Are favela tours a good idea?', pt: 'Vale a pena fazer tour de favela?' },
      a: {
        en: 'We don’t recommend favela tours. Conditions can change quickly and safety can’t be guaranteed. There are richer, safer ways to experience real carioca life — samba nights, markets, cooking classes and neighborhood walks with licensed guides.',
        pt: 'Não recomendamos tours de favela. As condições mudam rápido e a segurança não pode ser garantida. Há formas mais ricas e seguras de viver a vida carioca real — noites de samba, feiras, aulas de culinária e caminhadas de bairro com guias credenciados.',
      },
    },
    {
      q: { en: 'What’s the one unmissable experience?', pt: 'Qual é a experiência imperdível?' },
      a: {
        en: 'If you do one thing beyond the icons, make it a sunset — from Sugarloaf, Arpoador or the Dois Irmãos summit. Watching Rio glow gold and then sparkle is the moment travelers remember most.',
        pt: 'Se fizer uma coisa além dos ícones, que seja um pôr do sol — do Pão de Açúcar, do Arpoador ou do alto do Dois Irmãos. Ver o Rio dourar e depois brilhar é o momento que mais marca quem visita.',
      },
    },
  ],
  related: ['sightseeing', 'nightlife', 'vip'],
};
