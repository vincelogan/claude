import type { Guide } from '../types';

export const transport: Guide = {
  slug: 'transport',
  group: 'plan',
  icon: '🚇',
  nav: { en: 'Getting around', pt: 'Transporte' },
  title: { en: 'Getting around Rio', pt: 'Como circular pelo Rio' },
  metaTitle: {
    en: 'Getting Around Rio: Metro, Uber, VIP Transfers & Tips',
    pt: 'Transporte no Rio: metrô, Uber, transfers VIP e dicas',
  },
  metaDescription: {
    en: 'How to get around Rio de Janeiro: the safe and cheap metro, ride apps (Uber/99), the historic Santa Teresa tram, and premium private drivers for a VIP trip.',
    pt: 'Como circular pelo Rio: o metrô seguro e barato, apps (Uber/99), o bondinho de Santa Teresa e motoristas privativos para uma viagem VIP.',
  },
  lede: {
    en: 'A clean metro, cheap ride apps, and a chauffeur when you want to travel in style.',
    pt: 'Um metrô limpo, apps baratos e um motorista para quando quiser viajar com estilo.',
  },
  intro: [
    {
      en: 'Rio is easy to navigate. The metro is modern, air-conditioned and connects most of the tourist axis; ride apps are cheap and safer than buses; and for VIP comfort, private drivers are widely available. Skip renting a car — traffic and parking aren’t worth it.',
      pt: 'O Rio é fácil de circular. O metrô é moderno, climatizado e conecta quase todo o eixo turístico; os apps são baratos e mais seguros que ônibus; e, para conforto VIP, há muitos motoristas privativos. Esqueça alugar carro — trânsito e estacionamento não compensam.',
    },
  ],
  hero: '/img/transport.svg',
  keywords: [
    'getting around rio de janeiro',
    'rio metro map',
    'uber in rio',
    'santa teresa tram',
    'transporte no rio',
    'metrô rio',
  ],
  sections: [
    {
      id: 'main',
      title: { en: 'Your main options', pt: 'Suas opções principais' },
      items: [
        {
          name: 'Metro (MetrôRio)',
          blurb: {
            en: 'The safest, fastest way along the core axis. Lines 1 & 4 run unified from Centro through Botafogo, Copacabana (Cardeal Arcoverde, Siqueira Campos, Cantagalo) and Ipanema (General Osório) out to Barra. A single ride is about R$7.90.',
            pt: 'O jeito mais seguro e rápido no eixo central. As linhas 1 e 4 funcionam unificadas do Centro por Botafogo, Copacabana (Cardeal Arcoverde, Siqueira Campos, Cantagalo) e Ipanema (General Osório) até a Barra. A passagem custa cerca de R$7,90.',
          },
          price: 'budget',
          tip: {
            en: 'Cleanest and busiest at rush hour. Line 2 reaches Maracanã for match days.',
            pt: 'Mais cheio na hora do rush. A Linha 2 chega ao Maracanã em dias de jogo.',
          },
        },
        {
          name: 'Uber & 99 (ride apps)',
          blurb: {
            en: 'Cheap, reliable and the default for tourists — especially at night. No cash, no route haggling, GPS-tracked.',
            pt: 'Baratos, confiáveis e o padrão para turistas — sobretudo à noite. Sem dinheiro, sem pechincha de rota, com GPS.',
          },
          price: 'budget',
        },
        {
          name: 'VLT & Santa Teresa tram',
          area: 'Centro',
          blurb: {
            en: 'The VLT light rail glides through the downtown port district (Praça Mauá, Museum of Tomorrow). The historic yellow bonde climbs over the Lapa Arches into Santa Teresa — an attraction in itself.',
            pt: 'O VLT corta a região portuária do centro (Praça Mauá, Museu do Amanhã). O histórico bonde amarelo sobe os Arcos da Lapa até Santa Teresa — uma atração em si.',
          },
          price: 'budget',
        },
        {
          name: 'Private driver / VIP transfer',
          blurb: {
            en: 'For comfort and zero hassle, hire a private driver by the day or per transfer — ideal for families, the Christ-and-Sugarloaf circuit, or arriving in style.',
            pt: 'Para conforto e zero estresse, contrate um motorista privativo por dia ou por trecho — ideal para famílias, o circuito Cristo-e-Pão de Açúcar ou chegar com estilo.',
          },
          price: 'high',
        },
      ],
    },
    {
      id: 'avoid',
      title: { en: 'What to skip', pt: 'O que evitar' },
      items: [
        {
          name: 'City buses at night',
          blurb: {
            en: 'Cheap and extensive but confusing, with pickpocketing risk and no luggage space. Use the metro or apps, especially after dark.',
            pt: 'Baratos e abrangentes, mas confusos, com risco de furto e sem espaço para bagagem. Use metrô ou apps, principalmente à noite.',
          },
          tags: ['caution'],
        },
        {
          name: 'Renting a car',
          blurb: {
            en: 'Not recommended for tourists — aggressive traffic, confusing one-ways, tolls, parking and theft risk. Ride apps are cheaper and easier.',
            pt: 'Não recomendado para turistas — trânsito agressivo, mãos confusas, pedágios, estacionamento e risco de furto. Apps são mais baratos e fáceis.',
          },
          tags: ['avoid'],
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'Is Uber safe and legal in Rio?', pt: 'O Uber é seguro e legal no Rio?' },
      a: {
        en: 'Yes. Uber and 99 are legal, cheap and the recommended way to get around, particularly at night. Confirm the plate and driver, and ride in the back seat.',
        pt: 'Sim. Uber e 99 são legais, baratos e a forma recomendada de circular, especialmente à noite. Confira a placa e o motorista, e vá no banco de trás.',
      },
    },
    {
      q: { en: 'How much is the metro?', pt: 'Quanto custa o metrô?' },
      a: {
        en: 'About R$7.90 for a single ride. It’s clean, air-conditioned and safe, covering Copacabana, Ipanema, Botafogo, Centro and Maracanã.',
        pt: 'Cerca de R$7,90 por viagem. É limpo, climatizado e seguro, atendendo Copacabana, Ipanema, Botafogo, Centro e Maracanã.',
      },
    },
  ],
  related: ['safety', 'getting-here', 'vip'],
};
