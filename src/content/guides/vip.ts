import type { Guide } from '../types';

export const vip: Guide = {
  slug: 'vip',
  group: 'experience',
  icon: '💎',
  nav: { en: 'VIP experiences', pt: 'Experiências VIP' },
  title: { en: 'VIP & luxury experiences', pt: 'Experiências VIP & de luxo' },
  metaTitle: {
    en: 'Rio VIP Experiences: Helicopter Tours, Yachts & Private Guides',
    pt: 'Experiências VIP no Rio: helicóptero, iate e guias privativos',
  },
  metaDescription: {
    en: 'The VIP side of Rio de Janeiro — helicopter flights over Christ the Redeemer, private yacht charters, bespoke guided tours, luxury transfers and Carnival camarotes.',
    pt: 'O lado VIP do Rio — voos de helicóptero sobre o Cristo, fretamento de iate, tours privativos sob medida, transfers de luxo e camarotes de Carnaval.',
  },
  lede: {
    en: 'See the Marvelous City the way the few do — from the air, the water and behind the rope.',
    pt: 'Conheça a Cidade Maravilhosa como poucos — do alto, da água e atrás da corda.',
  },
  intro: [
    {
      en: 'Rio rewards those who go premium. Soar over Christ the Redeemer by helicopter, charter a yacht across Guanabara Bay, tour the icons with a private bilingual guide, and watch Carnival from an open-bar camarote. This is the city at its most exclusive — we’ll point you to the experiences worth it.',
      pt: 'O Rio recompensa quem vai de premium. Sobrevoe o Cristo de helicóptero, frete um iate pela Baía de Guanabara, conheça os ícones com guia privativo bilíngue e assista ao Carnaval de um camarote com open bar. É a cidade no seu lado mais exclusivo — vamos indicar o que vale a pena.',
    },
  ],
  hero: '/img/vip.svg',
  keywords: [
    'luxury tour rio de janeiro',
    'helicopter tour rio',
    'private tour rio de janeiro',
    'yacht charter rio',
    'rio carnival camarote',
    'passeio de helicóptero rio',
  ],
  sections: [
    {
      id: 'experiences',
      title: { en: 'Signature VIP experiences', pt: 'Experiências VIP marcantes' },
      items: [
        {
          name: 'Helicopter flight over the icons',
          area: 'Lagoa / Morro da Urca',
          blurb: {
            en: 'Bank over Christ the Redeemer, Sugarloaf and the beaches on a private flight. Short hops from about R$530pp; a full private hour for a small group runs into the low thousands.',
            pt: 'Sobrevoe o Cristo, o Pão de Açúcar e as praias num voo privativo. Trechos curtos a partir de ~R$530 por pessoa; uma hora privativa para um grupo pequeno fica na casa dos milhares.',
          },
          price: 'luxury',
        },
        {
          name: 'Private yacht charter',
          area: 'Marina da Glória',
          blurb: {
            en: 'Cruise Guanabara Bay and the island beaches with a captain and crew. A crewed half-day on a 50–60ft yacht runs roughly R$4,000–10,000; a full luxury day, more.',
            pt: 'Navegue a Baía de Guanabara e as praias das ilhas com capitão e tripulação. Uma meia diária com tripulação em um iate de 50–60 pés fica em torno de R$4.000–10.000; uma diária de luxo, mais.',
          },
          price: 'luxury',
        },
        {
          name: 'Private guided day with a local',
          blurb: {
            en: 'A licensed, bilingual Carioca guide and private vehicle tailor the icons to you — skip-the-line at Christ and Sugarloaf, hidden viewpoints, no crowds. From around US$200 per group for a half day.',
            pt: 'Um guia carioca credenciado e bilíngue, com veículo privativo, monta os ícones do seu jeito — sem fila no Cristo e no Pão de Açúcar, mirantes escondidos, sem multidão. A partir de ~US$200 por grupo na meia diária.',
          },
          price: 'high',
        },
        {
          name: 'Luxury airport transfer & chauffeur',
          blurb: {
            en: 'Meet-and-greet at the airport in a premium sedan or SUV, or a chauffeur on call for your stay — the seamless way to move around the city.',
            pt: 'Recepção no aeroporto em sedã ou SUV premium, ou um motorista à disposição durante a estadia — o jeito sem atrito de circular pela cidade.',
          },
          price: 'high',
        },
      ],
    },
    {
      id: 'seasonal',
      title: { en: 'Seasonal VIP', pt: 'VIP de temporada' },
      items: [
        {
          name: 'Carnival camarote (VIP box)',
          area: 'Sambadrome',
          blurb: {
            en: 'Watch the samba schools from a premium suite with open bar, gourmet food, AC and live shows. Marquee boxes like Camarote Nº1 and Allegria run from roughly R$1,350 to R$8,000 per person, per night.',
            pt: 'Assista às escolas de um camarote premium com open bar, gastronomia, ar e shows ao vivo. Camarotes badalados como Nº1 e Allegria vão de cerca de R$1.350 a R$8.000 por pessoa, por noite.',
          },
          price: 'luxury',
        },
        {
          name: 'Copacabana Palace Magic Ball',
          area: 'Copacabana',
          blurb: {
            en: 'The black-tie gala of Carnival, held at the Copacabana Palace — the most exclusive party in Brazil. Tickets are premium and sell out far ahead.',
            pt: 'O baile de gala black-tie do Carnaval, no Copacabana Palace — a festa mais exclusiva do Brasil. Ingressos premium que esgotam com muita antecedência.',
          },
          price: 'luxury',
        },
        {
          name: 'Réveillon VIP party',
          area: 'Copacabana',
          blurb: {
            en: 'Beachfront hotel galas with the best fireworks views, or a private boat on the bay — the most coveted New Year’s Eve in the world.',
            pt: 'Festas de gala em hotéis na orla com a melhor vista dos fogos, ou um barco privativo na baía — o Réveillon mais cobiçado do mundo.',
          },
          price: 'luxury',
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'How much is a helicopter tour over Rio?', pt: 'Quanto custa um passeio de helicóptero no Rio?' },
      a: {
        en: 'Short scenic flights start around R$530 per person for 6–7 minutes. Longer routes over Christ the Redeemer and the beaches cost more, and a full private hour for a small group runs into the low thousands of reais. Operators fly from Lagoa and Morro da Urca.',
        pt: 'Voos panorâmicos curtos começam em torno de R$530 por pessoa por 6–7 minutos. Rotas mais longas sobre o Cristo e as praias custam mais, e uma hora privativa para um grupo pequeno fica na casa dos milhares de reais. Os operadores voam da Lagoa e do Morro da Urca.',
      },
    },
    {
      q: { en: 'Can you arrange a fully bespoke luxury trip?', pt: 'Dá para montar uma viagem de luxo sob medida?' },
      a: {
        en: 'Yes — specialist operators design private, end-to-end Rio itineraries with luxury hotels, private guides, helicopter and yacht days, and VIP event access. Budget roughly US$300–500+ per day for a premium private experience.',
        pt: 'Sim — operadores especializados montam roteiros privativos completos no Rio, com hotéis de luxo, guias privativos, dias de helicóptero e iate e acesso VIP a eventos. Conte com cerca de US$300–500+ por dia para uma experiência privada premium.',
      },
    },
  ],
  related: ['sightseeing', 'stay', 'carnaval'],
};
