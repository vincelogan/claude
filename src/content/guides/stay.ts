import type { Guide } from '../types';

export const stay: Guide = {
  slug: 'stay',
  group: 'experience',
  icon: '🏨',
  nav: { en: 'Where to stay', pt: 'Onde se hospedar' },
  title: { en: 'Where to stay in Rio', pt: 'Onde se hospedar no Rio' },
  metaTitle: {
    en: 'Where to Stay in Rio: Best Neighborhoods & Luxury Hotels',
    pt: 'Onde se hospedar no Rio: melhores bairros e hotéis de luxo',
  },
  metaDescription: {
    en: 'Where to stay in Rio de Janeiro — Ipanema, Leblon, Copacabana, Botafogo and Santa Teresa compared, plus the city’s iconic luxury hotels like the Copacabana Palace.',
    pt: 'Onde se hospedar no Rio — Ipanema, Leblon, Copacabana, Botafogo e Santa Teresa comparados, além dos hotéis de luxo icônicos como o Copacabana Palace.',
  },
  lede: {
    en: 'Pick the right neighborhood and the whole trip falls into place.',
    pt: 'Escolha o bairro certo e a viagem inteira se encaixa.',
  },
  intro: [
    {
      en: 'For most first-time visitors, the safe, beach-facing Zona Sul is the place to base yourself. Ipanema and Leblon are the chic, safest choice; Copacabana is iconic and central; Botafogo is hip and good value; Santa Teresa is bohemian and boutique. Here’s how to choose — and the hotels worth the splurge.',
      pt: 'Para a maioria dos visitantes de primeira viagem, a Zona Sul, segura e de frente para a praia, é a melhor base. Ipanema e Leblon são a escolha chique e mais segura; Copacabana é icônica e central; Botafogo é descolada e em conta; Santa Teresa é boêmia e boutique. Veja como escolher — e os hotéis que valem o investimento.',
    },
  ],
  hero: '/img/stay.svg',
  keywords: [
    'where to stay in rio de janeiro',
    'best neighborhoods rio',
    'copacabana palace',
    'ipanema vs copacabana',
    'onde ficar no rio',
    'hotéis de luxo rio',
  ],
  sections: [
    {
      id: 'neighborhoods',
      title: { en: 'Choose your neighborhood', pt: 'Escolha seu bairro' },
      items: [
        {
          name: 'Ipanema & Leblon',
          area: 'Zona Sul',
          blurb: {
            en: 'The most upscale and safest beach neighborhoods — stylish, walkable, packed with great restaurants and bars. The premium choice.',
            pt: 'Os bairros de praia mais nobres e seguros — elegantes, caminháveis, cheios de ótimos restaurantes e bares. A escolha premium.',
          },
          bestFor: { en: 'Couples, first-timers, safety & style', pt: 'Casais, primeira viagem, segurança e estilo' },
          price: 'luxury',
        },
        {
          name: 'Copacabana & Leme',
          area: 'Zona Sul',
          blurb: {
            en: 'Iconic, lively and central, with options at every price point along the famous crescent. Great metro links and round-the-clock energy.',
            pt: 'Icônica, animada e central, com opções de todos os preços na curva famosa. Ótimo acesso ao metrô e energia 24 horas.',
          },
          bestFor: { en: 'Iconic vibe, value range, nightlife access', pt: 'Clima icônico, variedade de preços, vida noturna' },
          price: 'mid',
        },
        {
          name: 'Botafogo & Flamengo',
          area: 'Zona Sul',
          blurb: {
            en: 'Hip, local and well-connected, with a buzzing food and bar scene and Sugarloaf views — better value than the beachfront.',
            pt: 'Descolados, locais e bem conectados, com cena gastronômica fervilhante e vista do Pão de Açúcar — melhor custo que a orla.',
          },
          bestFor: { en: 'Foodies, value, local feel', pt: 'Gastronomia, custo-benefício, clima local' },
          price: 'mid',
        },
        {
          name: 'Santa Teresa',
          area: 'Centro',
          blurb: {
            en: 'Bohemian hilltop charm — boutique hotels, art studios and views, a tram ride from the center. Atmospheric but hillier and less beachy.',
            pt: 'Charme boêmio no alto — hotéis boutique, ateliês e vistas, a um bonde do centro. Cheio de atmosfera, mas mais íngreme e longe da praia.',
          },
          bestFor: { en: 'Boutique stays, romance, character', pt: 'Hospedagem boutique, romance, personalidade' },
          price: 'high',
        },
        {
          name: 'Barra da Tijuca',
          area: 'Zona Oeste',
          blurb: {
            en: 'Modern, spacious and family-friendly, with long beaches and big malls — but spread out and car-dependent, away from the classic sights.',
            pt: 'Moderna, espaçosa e família, com praias longas e grandes shoppings — mas espalhada e dependente de carro, longe dos pontos clássicos.',
          },
          bestFor: { en: 'Families, space, modern resorts', pt: 'Famílias, espaço, resorts modernos' },
          price: 'mid',
        },
      ],
    },
    {
      id: 'luxury',
      title: { en: 'Iconic luxury hotels', pt: 'Hotéis de luxo icônicos' },
      items: [
        {
          name: 'Copacabana Palace (Belmond)',
          area: 'Copacabana',
          blurb: {
            en: 'Rio’s legendary 1923 grande dame on the beachfront — old-world glamour, the city’s most famous pool and its most exclusive New Year and Carnival parties.',
            pt: 'A lendária grande dame de 1923 na orla — glamour clássico, a piscina mais famosa da cidade e suas festas mais exclusivas de Réveillon e Carnaval.',
          },
          price: 'luxury',
        },
        {
          name: 'Hotel Fasano Rio',
          area: 'Ipanema',
          blurb: {
            en: 'A Philippe Starck-designed icon over Ipanema beach, with a celebrated rooftop pool and the refined Italian restaurant Gero.',
            pt: 'Um ícone com design de Philippe Starck sobre a praia de Ipanema, com piscina de cobertura célebre e o requintado restaurante italiano Gero.',
          },
          price: 'luxury',
        },
        {
          name: 'Hotel Emiliano',
          area: 'Copacabana',
          blurb: {
            en: 'Sleek contemporary luxury on the Copacabana beachfront, with a stunning rooftop pool and impeccable service.',
            pt: 'Luxo contemporâneo e elegante na orla de Copacabana, com piscina de cobertura deslumbrante e serviço impecável.',
          },
          price: 'luxury',
        },
        {
          name: 'Santa Teresa Hotel (MGallery)',
          area: 'Santa Teresa',
          blurb: {
            en: 'A boutique hillside retreat in a converted colonial estate — tropical gardens, art and panoramic city views.',
            pt: 'Um refúgio boutique na encosta, em uma fazenda colonial restaurada — jardins tropicais, arte e vista panorâmica da cidade.',
          },
          price: 'luxury',
        },
        {
          name: 'Fairmont Rio de Janeiro Copacabana',
          area: 'Copacabana',
          blurb: {
            en: 'A polished beachfront tower at the Ipanema end of Copacabana, with twin rooftop pools and a prime spot for the New Year fireworks.',
            pt: 'Uma torre polida na orla, no extremo de Copacabana junto a Ipanema, com piscinas duplas no terraço e lugar privilegiado para os fogos de Réveillon.',
          },
          price: 'luxury',
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'Ipanema or Copacabana — where should I stay?', pt: 'Ipanema ou Copacabana — onde ficar?' },
      a: {
        en: 'Ipanema/Leblon is more upscale, calmer and considered the safest; Copacabana is more iconic, central and offers a wider range of prices. For a first trip prioritizing safety and style, choose Ipanema; for energy and value, Copacabana.',
        pt: 'Ipanema/Leblon é mais nobre, tranquilo e considerado o mais seguro; Copacabana é mais icônica, central e tem faixa de preços maior. Para a primeira viagem priorizando segurança e estilo, escolha Ipanema; para energia e custo, Copacabana.',
      },
    },
    {
      q: { en: 'When should I book for Carnival or New Year?', pt: 'Quando reservar para Carnaval ou Réveillon?' },
      a: {
        en: 'As early as possible — months ahead. Beachfront hotels for New Year’s Eve and Carnival sell out and charge minimum-night packages at premium rates.',
        pt: 'O quanto antes — meses de antecedência. Hotéis na orla para Réveillon e Carnaval esgotam e cobram pacotes com mínimo de diárias a preços premium.',
      },
    },
  ],
  related: ['eat', 'vip', 'safety'],
};
