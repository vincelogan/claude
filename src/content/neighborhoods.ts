import type { Neighborhood } from './types';

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: 'ipanema',
    name: 'Ipanema',
    zone: { pt: 'Zona Sul', en: 'South Zone' },
    tagline: { pt: 'Sofisticado, local e caminhável', en: 'Sophisticated, local and walkable' },
    bestFor: { pt: 'Primeira viagem, casais', en: 'First trip, couples' },
    price: 'luxury',
    metaDescription: {
      pt: 'Ipanema é a melhor base no Rio: praia chique, restaurantes, segurança e tudo a pé. Veja por que ficar e o trade-off honesto.',
      en: 'Ipanema is the best base in Rio: a chic beach, great restaurants, safety and everything on foot. Why to stay here and the honest trade-off.',
    },
    intro: [
      {
        pt: 'Se você só puder escolher um bairro, escolha Ipanema. Elegante sem ser exclusivo demais, é totalmente caminhável, cheio de ótimos restaurantes e bares, com uma das praias mais bonitas do mundo emoldurada pelos Dois Irmãos.',
        en: 'If you can pick only one neighborhood, pick Ipanema. Elegant without being too exclusive, it’s completely walkable, packed with great restaurants and bars, and fronted by one of the world’s most beautiful beaches framed by the Dois Irmãos peaks.',
      },
    ],
    tradeoff: {
      pt: 'É mais caro que Copacabana e a vida noturna é mais contida. Mas você paga por segurança, charme e localização — e vale.',
      en: 'It’s pricier than Copacabana and the nightlife is more restrained. But you’re paying for safety, charm and location — and it’s worth it.',
    },
    highlights: [
      { pt: 'Pôr do sol no Arpoador (aplaudido)', en: 'Sunset at Arpoador (applauded)' },
      { pt: 'Feira hippie de domingo na Praça General Osório', en: 'Sunday hippie market at Praça General Osório' },
      { pt: 'Rua Garcia D’Ávila para compras de grife', en: 'Rua Garcia D’Ávila for designer shopping' },
    ],
    hero: '/img/stay.svg',
  },
  {
    slug: 'leblon',
    name: 'Leblon',
    zone: { pt: 'Zona Sul', en: 'South Zone' },
    tagline: { pt: 'O endereço mais exclusivo e tranquilo', en: 'The most exclusive, calmest address' },
    bestFor: { pt: 'Luxo, gastronomia', en: 'Luxury, fine dining' },
    price: 'luxury',
    metaDescription: {
      pt: 'Leblon é o bairro mais exclusivo do Rio: tranquilo, seguro e com a melhor gastronomia. Ideal para quem busca luxo discreto.',
      en: 'Leblon is Rio’s most exclusive neighborhood: calm, safe and home to the best dining. Ideal for discreet luxury.',
    },
    intro: [
      {
        pt: 'A continuação chique de Ipanema. Leblon é mais residencial, mais calmo e mais caro, com a melhor cena gastronômica da cidade na Rua Dias Ferreira e uma praia familiar.',
        en: 'Ipanema’s posh continuation. Leblon is more residential, calmer and pricier, with the city’s best dining scene on Rua Dias Ferreira and a family-friendly beach.',
      },
    ],
    tradeoff: {
      pt: 'Menos “acontecimento” que Ipanema e o preço mais alto da Zona Sul. Em troca: sossego e classe.',
      en: 'Less buzz than Ipanema and the highest prices in the South Zone. In return: calm and class.',
    },
    highlights: [
      { pt: 'Rua Dias Ferreira (jantar e bares)', en: 'Rua Dias Ferreira (dining and bars)' },
      { pt: 'Mirante do Leblon ao pôr do sol', en: 'Mirante do Leblon at sunset' },
      { pt: 'A praia mais tranquila da Zona Sul', en: 'The calmest beach in the South Zone' },
    ],
    hero: '/img/stay.svg',
  },
  {
    slug: 'copacabana',
    name: 'Copacabana',
    zone: { pt: 'Zona Sul', en: 'South Zone' },
    tagline: { pt: 'Icônico, vibrante e com ótimo custo', en: 'Iconic, lively and great value' },
    bestFor: { pt: 'Clássicos, preço', en: 'The classics, value' },
    price: 'mid',
    metaDescription: {
      pt: 'Copacabana: a praia mais famosa do mundo, central, animada e com opções de todos os preços. Veja por que ficar — e o trade-off.',
      en: 'Copacabana: the world’s most famous beach, central, lively and with options at every price. Why to stay — and the trade-off.',
    },
    intro: [
      {
        pt: 'A praia mais famosa do mundo e seu calçadão de ondas pretas e brancas. Copacabana é central, animada 24 horas e oferece desde hostels a hotéis lendários como o Copacabana Palace.',
        en: 'The world’s most famous beach and its black-and-white wave promenade. Copacabana is central, lively around the clock and offers everything from hostels to legendary hotels like the Copacabana Palace.',
      },
    ],
    tradeoff: {
      pt: 'Mais movimentada e turística; algumas ruas internas pedem atenção à noite. Mas a energia e o custo-benefício são imbatíveis.',
      en: 'Busier and more touristy; some inner streets call for care at night. But the energy and value are unbeatable.',
    },
    highlights: [
      { pt: 'O calçadão de Burle Marx', en: 'The Burle Marx promenade' },
      { pt: 'Forte de Copacabana (café com vista)', en: 'Copacabana Fort (café with a view)' },
      { pt: 'Palco principal do Réveillon', en: 'Main stage of the Réveillon' },
    ],
    hero: '/img/sightseeing.svg',
  },
  {
    slug: 'botafogo',
    name: 'Botafogo',
    zone: { pt: 'Zona Sul', en: 'South Zone' },
    tagline: { pt: 'Em alta, com a melhor vista do Pão de Açúcar', en: 'On the rise, with the best Sugarloaf view' },
    bestFor: { pt: 'Vibe local, jovens', en: 'Local vibe, younger crowd' },
    price: 'mid',
    metaDescription: {
      pt: 'Botafogo é o bairro mais descolado do Rio: bares, gastronomia, ótimo transporte e a clássica vista do Pão de Açúcar sobre a enseada.',
      en: 'Botafogo is Rio’s hippest neighborhood: bars, dining, great transport and the classic Sugarloaf view over the bay.',
    },
    intro: [
      {
        pt: 'O bairro mais descolado do momento: cena de bares e restaurantes fervilhante, transporte excelente (metrô) e a postal vista do Pão de Açúcar sobre a enseada. Melhor custo que a orla.',
        en: 'The hippest neighborhood right now: a buzzing bar-and-restaurant scene, excellent transport (metro) and the postcard Sugarloaf view over the bay. Better value than the beachfront.',
      },
    ],
    tradeoff: {
      pt: 'A praia da enseada não é de banho — você fica a 10 minutos de Copacabana/Ipanema. Em troca: preços melhores e clima local.',
      en: 'The bay beach isn’t for swimming — you’re 10 minutes from Copacabana/Ipanema. In return: better prices and a local feel.',
    },
    highlights: [
      { pt: 'Bares e comida na Voluntários da Pátria', en: 'Bars and food on Voluntários da Pátria' },
      { pt: 'Base para o Pão de Açúcar', en: 'Base for Sugarloaf' },
      { pt: 'Lasai e Oteque (estrelas Michelin)', en: 'Lasai and Oteque (Michelin stars)' },
    ],
    hero: '/img/vip.svg',
  },
  {
    slug: 'santa-teresa',
    name: 'Santa Teresa',
    zone: { pt: 'Centro', en: 'Centro' },
    tagline: { pt: 'Boêmio, colonial e cheio de vistas', en: 'Bohemian, colonial and full of views' },
    bestFor: { pt: 'Arte, romance', en: 'Art, romance' },
    price: 'high',
    metaDescription: {
      pt: 'Santa Teresa: bairro boêmio no alto, de ruas de paralelepípedo, ateliês, hotéis boutique e vistas. Lindo de dia; Uber à noite.',
      en: 'Santa Teresa: a bohemian hilltop of cobbled lanes, art studios, boutique hotels and views. Beautiful by day; take an Uber at night.',
    },
    intro: [
      {
        pt: 'Um bairro boêmio no alto, de ruas de paralelepípedo, casarões coloniais, ateliês e hotéis boutique, servido pelo histórico bonde amarelo. Atmosfera única e as melhores vistas da cidade.',
        en: 'A bohemian hilltop of cobbled lanes, colonial mansions, art studios and boutique hotels, served by the historic yellow tram. A unique atmosphere and the best views in the city.',
      },
    ],
    tradeoff: {
      pt: 'Longe da praia e mais íngreme; à noite é melhor andar de Uber, não a pé. Em troca: charme e personalidade que a orla não tem.',
      en: 'Far from the beach and hillier; at night it’s better to take an Uber than walk. In return: charm and character the beachfront lacks.',
    },
    highlights: [
      { pt: 'Escadaria Selarón na descida para a Lapa', en: 'Selarón Steps on the way down to Lapa' },
      { pt: 'Bondinho histórico de Santa Teresa', en: 'Historic Santa Teresa tram' },
      { pt: 'Aprazível (cozinha brasileira com vista)', en: 'Aprazível (Brazilian food with a view)' },
    ],
    hero: '/img/nightlife.svg',
  },
  {
    slug: 'barra-da-tijuca',
    name: 'Barra da Tijuca',
    zone: { pt: 'Zona Oeste', en: 'West Zone' },
    tagline: { pt: 'Praias enormes, moderno, para famílias', en: 'Huge beaches, modern, family-friendly' },
    bestFor: { pt: 'Famílias, estadias longas', en: 'Families, long stays' },
    price: 'mid',
    metaDescription: {
      pt: 'Barra da Tijuca: praias enormes, condomínios modernos e shoppings — ideal para famílias e estadias longas, mas dependente de carro.',
      en: 'Barra da Tijuca: huge beaches, modern condos and malls — ideal for families and long stays, but car-dependent.',
    },
    intro: [
      {
        pt: 'A versão moderna e espaçosa do Rio: quilômetros de praia, condomínios novos, grandes shoppings e a sede dos megaclubs. Ótimo para famílias e estadias longas.',
        en: 'Rio’s modern, spacious side: kilometres of beach, new condos, big malls and the home of the megaclubs. Great for families and long stays.',
      },
    ],
    tradeoff: {
      pt: 'Fica longe dos pontos clássicos e é melhor explorado de carro. Em troca: espaço, praias menos lotadas e estrutura moderna.',
      en: 'It’s far from the classic sights and best explored by car. In return: space, less crowded beaches and modern infrastructure.',
    },
    highlights: [
      { pt: 'Praia da Barra (18 km de areia)', en: 'Barra Beach (18 km of sand)' },
      { pt: 'Shoppings e megaclubs', en: 'Malls and megaclubs' },
      { pt: 'Base para o Recreio e a Prainha', en: 'Base for Recreio and Prainha' },
    ],
    hero: '/img/things-to-do.svg',
  },
];

const BY_SLUG = new Map(NEIGHBORHOODS.map((n) => [n.slug, n]));
export function getNeighborhood(slug: string) {
  return BY_SLUG.get(slug);
}
