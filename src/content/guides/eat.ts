import type { Guide } from '../types';

export const eat: Guide = {
  slug: 'eat',
  group: 'experience',
  icon: '🍽️',
  nav: { en: 'Where to eat', pt: 'Onde comer' },
  title: { en: 'Where to eat in Rio', pt: 'Onde comer no Rio' },
  metaTitle: {
    en: 'Where to Eat in Rio: Feijoada, Churrasco & Michelin Stars',
    pt: 'Onde comer no Rio: feijoada, churrasco e estrelas Michelin',
  },
  metaDescription: {
    en: 'A guide to eating in Rio de Janeiro — must-try carioca dishes, classic botecos and churrascarias, beach snacks and the city’s Michelin-starred fine dining.',
    pt: 'Um guia para comer no Rio — pratos cariocas imperdíveis, botecos e churrascarias clássicas, petiscos de praia e a alta gastronomia estrelada Michelin.',
  },
  lede: {
    en: 'From a beach-day coconut to a two-Michelin-star tasting menu — Rio eats well.',
    pt: 'Do coco gelado na praia ao menu-degustação duas estrelas Michelin — o Rio come bem.',
  },
  intro: [
    {
      en: 'Carioca food is built for the climate and the beach: cold drinks, grilled meat, fresh juice and slow Saturday feijoadas. But Rio also has a serious fine-dining scene — the Michelin Guide returned to the city in 2024, crowning two-star houses like Lasai and Oro. Eat across the whole spectrum.',
      pt: 'A comida carioca combina com o clima e a praia: bebida gelada, carne na brasa, suco fresco e a feijoada de sábado sem pressa. Mas o Rio também tem alta gastronomia de verdade — o Guia Michelin voltou à cidade em 2024, coroando casas duas estrelas como Lasai e Oro. Coma o espectro inteiro.',
    },
  ],
  hero: '/img/eat.svg',
  keywords: [
    'where to eat in rio de janeiro',
    'best restaurants rio',
    'feijoada rio',
    'rio michelin restaurants',
    'onde comer no rio',
    'churrascaria rio',
  ],
  sections: [
    {
      id: 'musttry',
      title: { en: 'Carioca dishes to try', pt: 'Pratos cariocas para provar' },
      items: [
        {
          name: 'Feijoada',
          blurb: {
            en: 'Brazil’s national dish — a rich black-bean and pork stew with rice, kale, orange and farofa. Traditionally a long, lazy Saturday lunch.',
            pt: 'O prato nacional — um ensopado farto de feijão-preto e carnes de porco com arroz, couve, laranja e farofa. Tradicionalmente um almoço longo de sábado.',
          },
        },
        {
          name: 'Picanha & churrasco',
          blurb: {
            en: 'Brazil’s prized cut of beef, grilled over fire and served sizzling — the star of every churrascaria rodízio.',
            pt: 'O corte mais querido do Brasil, grelhado na brasa e servido pingando — a estrela de todo rodízio de churrascaria.',
          },
        },
        {
          name: 'Açaí, pão de queijo & brigadeiro',
          blurb: {
            en: 'A frozen açaí bowl after the beach, warm cheese-bread pão de queijo any time, and brigadeiro chocolate fudge balls for dessert.',
            pt: 'Uma tigela de açaí depois da praia, pão de queijo quentinho a qualquer hora e brigadeiro de sobremesa.',
          },
        },
        {
          name: 'Caipirinha & coconut water',
          blurb: {
            en: 'The national cocktail — cachaça, lime and sugar over ice — and an icy coconut straight from the shell on the sand.',
            pt: 'O drink nacional — cachaça, limão e açúcar com gelo — e uma água de coco gelada direto na areia.',
          },
        },
      ],
    },
    {
      id: 'classics',
      title: { en: 'Botecos & classics', pt: 'Botecos & clássicos' },
      items: [
        {
          name: 'Confeitaria Colombo',
          area: 'Centro',
          blurb: {
            en: 'A breathtaking Belle Époque café from 1894, with crystal mirrors and rosewood — come for coffee, pastries and history.',
            pt: 'Um café Belle Époque deslumbrante de 1894, com espelhos de cristal e jacarandá — vá pelo café, pelos doces e pela história.',
          },
          price: 'mid',
        },
        {
          name: 'Garota de Ipanema',
          area: 'Ipanema',
          blurb: {
            en: 'The bar where “The Girl from Ipanema” was written, famous for tableside sizzling picanha. Touristy but iconic.',
            pt: 'O bar onde “Garota de Ipanema” foi composta, famoso pela picanha na chapa na mesa. Turístico, mas icônico.',
          },
          price: 'mid',
        },
        {
          name: 'Jobi',
          area: 'Leblon',
          blurb: {
            en: 'A classic boteco open since 1955 — perfectly poured draft beer and cod fritters, the soul of a carioca night out.',
            pt: 'Um boteco clássico desde 1955 — chope bem tirado e bolinho de bacalhau, a alma de uma noite carioca.',
          },
          price: 'budget',
        },
        {
          name: 'Fogo de Chão / CT Boucherie',
          area: 'Botafogo / Leblon',
          blurb: {
            en: 'Top churrascarias for the full rodízio experience — endless fire-grilled meats (or, at CT Boucherie, endless sides with your chosen cut).',
            pt: 'As melhores churrascarias para o rodízio completo — carnes na brasa sem fim (ou, no CT Boucherie, acompanhamentos sem fim com o corte escolhido).',
          },
          price: 'high',
        },
      ],
    },
    {
      id: 'finedining',
      title: { en: 'Fine dining', pt: 'Alta gastronomia' },
      intro: {
        en: 'The Michelin Guide returned to Rio in 2024 and publishes annually. These are the city’s benchmark tables.',
        pt: 'O Guia Michelin voltou ao Rio em 2024 e publica anualmente. Estas são as mesas de referência da cidade.',
      },
      items: [
        {
          name: 'Lasai',
          area: 'Botafogo',
          blurb: {
            en: 'Two Michelin stars and the top-ranked Brazilian restaurant on the World’s 50 Best list — an intimate, garden-to-counter tasting menu by chef Rafa Costa e Silva.',
            pt: 'Duas estrelas Michelin e o restaurante brasileiro mais bem colocado no World’s 50 Best — um menu-degustação intimista, da horta ao balcão, do chef Rafa Costa e Silva.',
          },
          price: 'luxury',
        },
        {
          name: 'Oteque',
          area: 'Botafogo',
          blurb: {
            en: 'A Michelin-starred seafood haute-cuisine tasting menu in an elegant townhouse, by chef Alberto Landgraf.',
            pt: 'Um menu-degustação de alta gastronomia do mar com estrela Michelin, em um casarão elegante, do chef Alberto Landgraf.',
          },
          price: 'luxury',
        },
        {
          name: 'Aprazível',
          area: 'Santa Teresa',
          blurb: {
            en: 'Contemporary Brazilian cooking on a thatched hillside terrace with some of the best views in Rio and a legendary cachaça list.',
            pt: 'Cozinha brasileira contemporânea em um terraço na encosta com uma das melhores vistas do Rio e uma lista lendária de cachaças.',
          },
          price: 'high',
        },
        {
          name: 'Gero (Hotel Fasano)',
          area: 'Ipanema',
          blurb: {
            en: 'Refined Italian — risottos, pastas and grilled fish — overlooking Ipanema beach in the Fasano hotel.',
            pt: 'Italiano refinado — risotos, massas e peixe grelhado — com vista para a praia de Ipanema, no hotel Fasano.',
          },
          price: 'luxury',
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'What should I eat in Rio?', pt: 'O que comer no Rio?' },
      a: {
        en: 'Start with a feijoada on Saturday, picanha at a churrascaria, açaí and pão de queijo as snacks, a caipirinha at sunset and a coconut on the beach. For a splurge, book a Michelin-starred tasting at Lasai or Oteque.',
        pt: 'Comece com uma feijoada no sábado, picanha numa churrascaria, açaí e pão de queijo como lanche, uma caipirinha no pôr do sol e um coco na praia. Para um luxo, reserve uma degustação estrelada no Lasai ou Oteque.',
      },
    },
    {
      q: { en: 'Does Rio have Michelin-starred restaurants?', pt: 'O Rio tem restaurantes com estrela Michelin?' },
      a: {
        en: 'Yes. The Michelin Guide returned to Rio in 2024. Lasai and Oro hold two stars, with one-star houses including Oteque and Madame Olympe by Claude Troisgros.',
        pt: 'Sim. O Guia Michelin voltou ao Rio em 2024. Lasai e Oro têm duas estrelas, e entre os de uma estrela estão Oteque e Madame Olympe, de Claude Troisgros.',
      },
    },
  ],
  related: ['nightlife', 'stay', 'vip'],
};
