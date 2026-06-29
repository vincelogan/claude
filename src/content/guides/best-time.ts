import type { Guide } from '../types';

export const bestTime: Guide = {
  slug: 'best-time',
  group: 'plan',
  icon: '🌤️',
  nav: { en: 'Best time to visit', pt: 'Melhor época' },
  title: { en: 'Best time to visit Rio', pt: 'Melhor época para visitar o Rio' },
  metaTitle: {
    en: 'Best Time to Visit Rio de Janeiro: Month-by-Month Guide',
    pt: 'Melhor época para visitar o Rio: guia mês a mês',
  },
  metaDescription: {
    en: 'When to visit Rio de Janeiro: weather by season, the hot summer peak (Carnival & New Year), the mild dry winter, and the shoulder-season sweet spots.',
    pt: 'Quando visitar o Rio de Janeiro: clima por estação, o verão quente (Carnaval e Réveillon), o inverno seco e ameno e as melhores épocas de menor movimento.',
  },
  lede: {
    en: 'Rio is beautiful year-round — but the “best” month depends on what you’re chasing.',
    pt: 'O Rio é lindo o ano todo — mas o “melhor” mês depende do que você procura.',
  },
  intro: [
    {
      en: 'Remember the seasons are flipped: this is the Southern Hemisphere. Summer (Dec–Mar) is hot, lively and the peak of the party calendar; winter (Jun–Aug) is mild, dry and great value. The shoulder months of April–May and September–October are arguably the sweet spot — warm, quieter and cheaper.',
      pt: 'Lembre que as estações são invertidas: é Hemisfério Sul. O verão (dez–mar) é quente, agitado e o auge do calendário de festas; o inverno (jun–ago) é ameno, seco e mais barato. Abril–maio e setembro–outubro são, talvez, o ponto ideal — quentes, mais tranquilos e em conta.',
    },
  ],
  hero: '/img/best-time.svg',
  keywords: [
    'best time to visit rio de janeiro',
    'rio weather by month',
    'rio high season',
    'melhor época para visitar o rio',
    'clima rio de janeiro',
  ],
  sections: [
    {
      id: 'seasons',
      title: { en: 'Season by season', pt: 'Estação por estação' },
      items: [
        {
          name: 'Summer — Dec to Mar',
          blurb: {
            en: 'Hot and humid (often 30–40°C), with bright beach days and afternoon storms. Peak season: New Year’s Eve and Carnival fall here. Highest prices, biggest crowds, best atmosphere.',
            pt: 'Quente e úmido (muitas vezes 30–40°C), com praias cheias de sol e tempestades à tarde. Alta temporada: Réveillon e Carnaval acontecem aqui. Preços altos, mais gente, clima imbatível.',
          },
          bestFor: { en: 'Carnival, Réveillon, beach & party energy', pt: 'Carnaval, Réveillon, praia e clima de festa' },
        },
        {
          name: 'Autumn — Apr to May',
          blurb: {
            en: 'Warm (~26°C), little rain and thinning crowds as prices drop. A genuine sweet spot for sightseeing and beaches without the peak-season crush.',
            pt: 'Quente (~26°C), pouca chuva e menos gente conforme os preços caem. Um ótimo momento para passeios e praia sem a lotação da alta temporada.',
          },
          bestFor: { en: 'Sightseeing, value, fewer crowds', pt: 'Passeios, bom custo, menos gente' },
        },
        {
          name: 'Winter — Jun to Aug',
          blurb: {
            en: 'Mild and the driest time of year, with pleasant sunny days (~22–26°C) and cooler nights. Comfortable for hiking and exploring; great value.',
            pt: 'Ameno e a época mais seca do ano, com dias agradáveis de sol (~22–26°C) e noites mais frescas. Confortável para trilhas e explorar; ótimo custo-benefício.',
          },
          bestFor: { en: 'Hiking, sightseeing, lower prices', pt: 'Trilhas, passeios, preços menores' },
        },
        {
          name: 'Spring — Sep to Nov',
          blurb: {
            en: 'Warming up again with stable weather and the city gearing toward summer. Generally good value before the December surge; Rock in Rio lands here in its Rio years.',
            pt: 'Esquentando de novo, com tempo estável e a cidade caminhando para o verão. Bom custo-benefício antes da explosão de dezembro; o Rock in Rio cai aqui nos anos cariocas.',
          },
          bestFor: { en: 'Stable weather, pre-summer value', pt: 'Tempo estável, custo antes do verão' },
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'What is the best overall time to visit Rio?', pt: 'Qual é a melhor época geral para visitar o Rio?' },
      a: {
        en: 'For the best balance of warm weather, lower prices and fewer crowds, aim for the shoulder seasons: April–May or September–October. The dry winter (Jun–Aug) also offers lovely, comfortable beach days.',
        pt: 'Para o melhor equilíbrio entre tempo quente, preços menores e menos gente, prefira a baixa-alta: abril–maio ou setembro–outubro. O inverno seco (jun–ago) também tem dias de praia agradáveis.',
      },
    },
    {
      q: { en: 'When are Carnival and New Year’s Eve?', pt: 'Quando são o Carnaval e o Réveillon?' },
      a: {
        en: 'New Year’s Eve is December 31 on Copacabana. Carnival 2027 runs February 5–10, with the Sambadrome parades on February 7–8. Both are peak season — book months ahead.',
        pt: 'O Réveillon é em 31 de dezembro, em Copacabana. O Carnaval 2027 vai de 5 a 10 de fevereiro, com os desfiles do Sambódromo em 7 e 8 de fevereiro. Ambos são alta temporada — reserve com meses de antecedência.',
      },
    },
  ],
  related: ['carnaval', 'reveillon', 'getting-here'],
};
