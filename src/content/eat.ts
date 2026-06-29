import type { Section, FAQ } from './types';

export const EAT_INTRO = {
  pt: 'A comida carioca combina com o clima: bebida gelada, carne na brasa, suco fresco e a feijoada de sábado. Mas o Rio também tem alta gastronomia de verdade — o Guia Michelin voltou à cidade em 2024, coroando casas duas estrelas como Lasai e Oro.',
  en: 'Carioca food suits the climate: cold drinks, grilled meat, fresh juice and the Saturday feijoada. But Rio also has serious fine dining — the Michelin Guide returned in 2024, crowning two-star houses like Lasai and Oro.',
};

export const EAT_SECTIONS: Section[] = [
  {
    id: 'pratos',
    title: { pt: 'Pratos cariocas para provar', en: 'Carioca dishes to try' },
    items: [
      {
        name: 'Feijoada',
        blurb: {
          pt: 'O prato nacional — ensopado de feijão-preto e carnes de porco com arroz, couve, laranja e farofa. Tradicional no sábado.',
          en: 'The national dish — black-bean and pork stew with rice, kale, orange and farofa. Traditionally a Saturday affair.',
        },
      },
      {
        name: 'Picanha & churrasco',
        blurb: {
          pt: 'O corte mais querido do Brasil, na brasa, servido pingando — a estrela de todo rodízio.',
          en: 'Brazil’s favourite cut, fire-grilled and served sizzling — the star of every rodízio.',
        },
      },
      {
        name: 'Açaí, pão de queijo & brigadeiro',
        blurb: {
          pt: 'Açaí gelado depois da praia, pão de queijo a qualquer hora e brigadeiro de sobremesa.',
          en: 'Frozen açaí after the beach, pão de queijo any time and brigadeiro for dessert.',
        },
      },
      {
        name: 'Caipirinha & água de coco',
        blurb: {
          pt: 'O drink nacional — cachaça, limão e açúcar — e um coco gelado direto na areia.',
          en: 'The national cocktail — cachaça, lime and sugar — and an icy coconut on the sand.',
        },
      },
    ],
  },
  {
    id: 'classicos',
    title: { pt: 'Botecos & clássicos', en: 'Botecos & classics' },
    items: [
      {
        name: 'Confeitaria Colombo',
        area: 'Centro',
        price: 'mid',
        blurb: {
          pt: 'Um café Belle Époque de 1894, com espelhos de cristal e jacarandá. Café, doces e história.',
          en: 'A Belle Époque café from 1894 with crystal mirrors and rosewood. Coffee, pastries and history.',
        },
      },
      {
        name: 'Garota de Ipanema',
        area: 'Ipanema',
        price: 'mid',
        blurb: {
          pt: 'O bar onde “Garota de Ipanema” foi composta, famoso pela picanha na chapa. Turístico, mas icônico.',
          en: 'The bar where “The Girl from Ipanema” was written, famous for tableside picanha. Touristy but iconic.',
        },
      },
      {
        name: 'Jobi',
        area: 'Leblon',
        price: 'budget',
        blurb: {
          pt: 'Boteco clássico desde 1955 — chope bem tirado e bolinho de bacalhau. A alma da noite carioca.',
          en: 'A classic boteco since 1955 — perfectly poured draft and cod fritters. The soul of a carioca night.',
        },
      },
      {
        name: 'Fogo de Chão / CT Boucherie',
        area: 'Botafogo / Leblon',
        price: 'high',
        blurb: {
          pt: 'As melhores churrascarias para o rodízio completo — carnes na brasa sem fim.',
          en: 'The best churrascarias for the full rodízio — endless fire-grilled meats.',
        },
      },
    ],
  },
  {
    id: 'alta-gastronomia',
    title: { pt: 'Alta gastronomia', en: 'Fine dining' },
    intro: {
      pt: 'O Guia Michelin voltou ao Rio em 2024. Estas são as mesas de referência da cidade.',
      en: 'The Michelin Guide returned to Rio in 2024. These are the city’s benchmark tables.',
    },
    items: [
      {
        name: 'Lasai',
        area: 'Botafogo',
        price: 'luxury',
        bookingSlug: 'lasai',
        blurb: {
          pt: 'Duas estrelas Michelin e o restaurante brasileiro mais bem colocado no World’s 50 Best. Menu-degustação da horta ao balcão, do chef Rafa Costa e Silva.',
          en: 'Two Michelin stars and the top-ranked Brazilian restaurant on World’s 50 Best. A garden-to-counter tasting menu by chef Rafa Costa e Silva.',
        },
      },
      {
        name: 'Oteque',
        area: 'Botafogo',
        price: 'luxury',
        bookingSlug: 'oteque',
        blurb: {
          pt: 'Menu-degustação de alta gastronomia do mar com estrela Michelin, do chef Alberto Landgraf.',
          en: 'A Michelin-starred seafood haute-cuisine tasting menu by chef Alberto Landgraf.',
        },
      },
      {
        name: 'Aprazível',
        area: 'Santa Teresa',
        price: 'high',
        bookingSlug: 'aprazivel',
        blurb: {
          pt: 'Cozinha brasileira contemporânea num terraço na encosta, com uma das melhores vistas do Rio e lista lendária de cachaças.',
          en: 'Contemporary Brazilian cooking on a hillside terrace with one of Rio’s best views and a legendary cachaça list.',
        },
      },
      {
        name: 'Gero (Hotel Fasano)',
        area: 'Ipanema',
        price: 'luxury',
        blurb: {
          pt: 'Italiano refinado — risotos, massas e peixe grelhado — com vista para a praia de Ipanema.',
          en: 'Refined Italian — risottos, pastas and grilled fish — overlooking Ipanema beach.',
        },
      },
    ],
  },
];

export const EAT_FAQS: FAQ[] = [
  {
    q: { pt: 'O Rio tem restaurantes com estrela Michelin?', en: 'Does Rio have Michelin-starred restaurants?' },
    a: {
      pt: 'Sim. O Guia Michelin voltou ao Rio em 2024. Lasai e Oro têm duas estrelas; Oteque e Madame Olympe, de Claude Troisgros, têm uma.',
      en: 'Yes. The Michelin Guide returned in 2024. Lasai and Oro hold two stars; Oteque and Claude Troisgros’ Madame Olympe hold one.',
    },
  },
];
