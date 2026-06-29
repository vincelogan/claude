import type { Section } from './types';

export const VIP_INTRO = {
  pt: 'O Rio recompensa quem vai de premium. Sobrevoe o Cristo de helicóptero, frete um iate pela baía, conheça os ícones com guia privativo e assista ao Carnaval de um camarote com open bar. Nosso concierge organiza tudo.',
  en: 'Rio rewards those who go premium. Soar over Christ by helicopter, charter a yacht across the bay, tour the icons with a private guide and watch Carnival from an open-bar camarote. Our concierge arranges it all.',
};

export const VIP_SECTIONS: Section[] = [
  {
    id: 'atracoes-vip',
    title: { pt: 'Atrações VIP', en: 'VIP attractions' },
    items: [
      {
        name: 'Voo de helicóptero sobre os ícones',
        area: 'Lagoa / Morro da Urca',
        price: 'luxury',
        blurb: {
          pt: 'Sobrevoe o Cristo, o Pão de Açúcar e as praias. Trechos curtos a partir de ~R$530 por pessoa; uma hora privativa chega aos milhares.',
          en: 'Bank over Christ, Sugarloaf and the beaches. Short hops from ~R$530pp; a private hour runs into the thousands.',
        },
      },
      {
        name: 'Iate privativo na Baía de Guanabara',
        area: 'Marina da Glória',
        price: 'luxury',
        blurb: {
          pt: 'Navegue a baía e as praias das ilhas com capitão e tripulação. Meia diária num iate de 50–60 pés: ~R$4.000–10.000.',
          en: 'Cruise the bay and island beaches with captain and crew. A half-day on a 50–60ft yacht: ~R$4,000–10,000.',
        },
      },
      {
        name: 'Dia privativo com guia local',
        price: 'high',
        blurb: {
          pt: 'Guia carioca bilíngue e veículo privativo: sem fila no Cristo e no Pão de Açúcar, mirantes escondidos, zero multidão. A partir de ~US$200/grupo na meia diária.',
          en: 'A bilingual Carioca guide and private vehicle: skip-the-line at Christ and Sugarloaf, hidden viewpoints, no crowds. From ~US$200/group for a half day.',
        },
      },
    ],
  },
  {
    id: 'transporte-vip',
    title: { pt: 'Transporte VIP', en: 'VIP transport' },
    items: [
      {
        name: 'Transfer de luxo no aeroporto',
        price: 'high',
        blurb: {
          pt: 'Recepção no GIG em sedã ou SUV premium, ou um motorista à disposição durante a estadia. Chegada sem atrito.',
          en: 'Meet-and-greet at GIG in a premium sedan or SUV, or a chauffeur on call for your stay. A seamless arrival.',
        },
      },
      {
        name: 'Camarote de Carnaval',
        area: 'Sambódromo',
        price: 'luxury',
        blurb: {
          pt: 'Suíte premium com open bar, gastronomia e shows. Camarotes badalados de ~R$1.350 a R$8.000 por pessoa, por noite.',
          en: 'A premium suite with open bar, food and shows. Marquee boxes from ~R$1,350 to R$8,000 per person, per night.',
        },
      },
      {
        name: 'Réveillon e eventos privados',
        area: 'Copacabana',
        price: 'luxury',
        blurb: {
          pt: 'Festas de gala em hotéis na orla com a melhor vista dos fogos, ou um barco privativo na baía. O Réveillon mais cobiçado do mundo.',
          en: 'Beachfront hotel galas with the best fireworks views, or a private boat on the bay. The world’s most coveted New Year’s Eve.',
        },
      },
    ],
  },
];
