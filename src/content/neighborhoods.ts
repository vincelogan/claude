import type { Neighborhood } from './types';

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    slug: 'ipanema',
    name: 'Ipanema',
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ipanema_e_Morro_Dois_Irm%C3%A3os_02.JPG?width=1600',
      credit: 'Vani Ribeiro / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
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
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vista_de_Leblon_e_Ipanema%2C_do_Mirante_do_Leblon_-_panoramio.jpg?width=1600',
      credit: 'Wikimedia Commons',
      license: 'CC BY 3.0',
    },
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
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rio_de_janeiro_copacabana_beach_2010.JPG?width=1600',
      credit: 'chensiyuan / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
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
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vista_do_Botafogo_Praia_Shopping_01.jpg?width=1600',
      credit: 'Halley Pacheco de Oliveira / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
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
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bondinho_de_Santa_Teresa_%283725740423%29.jpg?width=1600',
      credit: 'Rodrigo Soldon / Wikimedia Commons',
      license: 'CC BY 2.0',
    },
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
  {
    slug: 'urca',
    name: 'Urca',
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sugarloaf_Mountain%2C_Rio_de_Janeiro%2C_Brazil.jpg?width=1600',
      credit: 'Donatas Dabravolskas / Wikimedia Commons',
      license: 'CC BY-SA 4.0',
    },
    zone: { pt: 'Zona Sul', en: 'South Zone' },
    tagline: { pt: 'Tranquilo, charmoso, ao pé do Pão de Açúcar', en: 'Calm, charming, at the foot of Sugarloaf' },
    bestFor: { pt: 'Sossego, vistas, pôr do sol', en: 'Quiet, views, sunset' },
    price: 'high',
    metaDescription: {
      pt: 'Urca: um enclave tranquilo ao pé do Pão de Açúcar, com a mureta onde os cariocas tomam cerveja no pôr do sol. Um dos cantos mais seguros do Rio.',
      en: 'Urca: a tranquil enclave at the foot of Sugarloaf, with the sea wall where locals gather for sunset beers. One of the calmest, safest pockets in Rio.',
    },
    intro: [
      {
        pt: 'Um bairro minúsculo e tranquilo ao pé do Pão de Açúcar, com a famosa mureta onde os cariocas se reúnem para a cerveja do pôr do sol. Clima de vila e uma das sensações mais seguras da cidade.',
        en: 'A tiny, tranquil enclave at the foot of Sugarloaf, with the famous sea wall where locals gather for a sunset beer. A village feel and one of the safest atmospheres in the city.',
      },
    ],
    tradeoff: {
      pt: 'É residencial e pacato, com pouquíssimos hotéis e quase nenhuma vida noturna — você sai para variar de jantar.',
      en: 'It’s residential and sleepy, with very few hotels and minimal nightlife — you’ll head out for dining variety.',
    },
    highlights: [
      { pt: 'Mureta da Urca ao pôr do sol', en: 'The Urca sea wall at sunset' },
      { pt: 'Bondinho do Pão de Açúcar ao lado', en: 'Sugarloaf cable car next door' },
      { pt: 'Trilha do Costão / Pista Cláudio Coutinho', en: 'Cláudio Coutinho coastal trail' },
    ],
    hero: '/img/vip.svg',
  },
  {
    slug: 'lapa',
    name: 'Lapa',
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Arcos_da_Lapa_in_Rio_de_Janeiro.jpg?width=1600',
      credit: 'Rodrigo Soldon / Wikimedia Commons',
      license: 'CC BY 2.0',
    },
    zone: { pt: 'Centro', en: 'Centro' },
    tagline: { pt: 'O coração da noite e do samba', en: 'The beating heart of nightlife and samba' },
    bestFor: { pt: 'Vida noturna, samba, música ao vivo', en: 'Nightlife, samba, live music' },
    price: 'budget',
    metaDescription: {
      pt: 'Lapa: o coração da noite carioca sob os Arcos, com casas de samba, música ao vivo e festas de rua no fim de semana. Vá à noite, em grupo, de aplicativo.',
      en: 'Lapa: the heart of carioca nightlife under the arches, with samba clubs, live music and weekend street parties. Go at night, in a group, by ride app.',
    },
    intro: [
      {
        pt: 'Sob os icônicos Arcos da Lapa, o bairro pulsa com casas de samba, música ao vivo e festas de rua nos fins de semana. É essencial para quem busca a energia noturna da cidade.',
        en: 'Under the iconic Lapa arches, the district pulses with samba clubs, live music and weekend street parties. Essential for anyone chasing the city’s nocturnal energy.',
      },
    ],
    tradeoff: {
      pt: 'É gritante e pode ser inseguro tarde da noite e nas noites lotadas — a maioria sai para a noite em vez de se hospedar ali. Leve pouco e use aplicativo.',
      en: 'It’s gritty and can be unsafe late and on crowded nights — most visitors come out for the evening rather than stay over. Carry little and use ride apps.',
    },
    highlights: [
      { pt: 'Arcos da Lapa e a Escadaria Selarón', en: 'The Lapa arches and the Selarón Steps' },
      { pt: 'Rio Scenarium e Carioca da Gema', en: 'Rio Scenarium and Carioca da Gema' },
      { pt: 'Festa de rua na sexta e no sábado', en: 'Street party on Friday and Saturday' },
    ],
    hero: '/img/nightlife.svg',
  },
  {
    slug: 'flamengo',
    name: 'Flamengo',
    zone: { pt: 'Zona Sul', en: 'South Zone' },
    tagline: { pt: 'Residencial, verde e bem conectado', en: 'Residential, green and well connected' },
    bestFor: { pt: 'Custo-benefício, parques, clima local', en: 'Value, parks, local life' },
    price: 'mid',
    metaDescription: {
      pt: 'Flamengo: bairro residencial e arborizado à beira do Aterro, com ótimo acesso de metrô e bom custo. Prático e autêntico, mas a baía não é de banho.',
      en: 'Flamengo: a leafy residential district by the bayside park, with great metro links and good value. Practical and authentic, but the bay isn’t for swimming.',
    },
    intro: [
      {
        pt: 'Bairro arborizado à beira do Aterro do Flamengo — um enorme parque para correr e pedalar — com metrô forte para o resto da cidade. Bom custo e clima de gente de verdade.',
        en: 'A leafy district fronting Aterro do Flamengo — a vast bayside park for running and cycling — with strong metro links across the city. Good value and an authentic everyday feel.',
      },
    ],
    tradeoff: {
      pt: 'A água da baía não serve para banho — é uma base bem localizada, não um destino de praia.',
      en: 'The bay water isn’t suitable for swimming — it’s a well-located base, not a beach destination.',
    },
    highlights: [
      { pt: 'Aterro do Flamengo (parque de Burle Marx)', en: 'Aterro do Flamengo (Burle Marx park)' },
      { pt: 'MAM — Museu de Arte Moderna', en: 'MAM — Museum of Modern Art' },
      { pt: 'Metrô e fácil acesso ao Centro', en: 'Metro and easy access to the Centro' },
    ],
    hero: '/img/things-to-do.svg',
  },
  {
    slug: 'gavea',
    name: 'Gávea',
    zone: { pt: 'Zona Sul', en: 'South Zone' },
    tagline: { pt: 'Boêmio, jovem e arborizado', en: 'Bohemian, youthful and leafy' },
    bestFor: { pt: 'Noite universitária, verde, cena local', en: 'Student nightlife, greenery, local scene' },
    price: 'high',
    metaDescription: {
      pt: 'Gávea: bairro nobre e verde perto da Lagoa e do Jardim Botânico, com cena de bares no Baixo Gávea e o Jóquei. Noite local longe das praias turísticas.',
      en: 'Gávea: an affluent, green neighborhood near the lagoon and botanical garden, with a bar scene at Baixo Gávea and the racetrack. Local nightlife away from the tourist beaches.',
    },
    intro: [
      {
        pt: 'Bairro nobre e arborizado perto da Lagoa e do Jardim Botânico, com público universitário, o Jóquei e a cena animada do Baixo Gávea. Ideal para a noite local.',
        en: 'An affluent, leafy neighborhood near the lagoon and botanical garden, with a university crowd, the racetrack and the lively Baixo Gávea square. Ideal for local nightlife.',
      },
    ],
    tradeoff: {
      pt: 'Hospedagem limitada e sem praia própria — costuma ser combinado com uma estada em Ipanema ou Leblon.',
      en: 'Limited lodging and no beach of its own — usually combined with a stay in nearby Ipanema or Leblon.',
    },
    highlights: [
      { pt: 'Baixo Gávea (bares e boemia)', en: 'Baixo Gávea (bars and bohemia)' },
      { pt: 'Instituto Moreira Salles', en: 'Instituto Moreira Salles' },
      { pt: 'Perto da Lagoa e do Jardim Botânico', en: 'Near the lagoon and Botanical Garden' },
    ],
    hero: '/img/nightlife.svg',
  },
  {
    slug: 'jardim-botanico',
    name: 'Jardim Botânico',
    photo: {
      url: 'https://commons.wikimedia.org/wiki/Special:FilePath/As_palmeiras_imperiais_do_Jardim_Bot%C3%A2nico_-_Rio_de_Janeiro._%289062349874%29.jpg?width=1600',
      credit: 'Halley Pacheco de Oliveira / Wikimedia Commons',
      license: 'CC BY-SA 3.0',
    },
    zone: { pt: 'Zona Sul', en: 'South Zone' },
    tagline: { pt: 'Verde, tranquilo e gastronômico', en: 'Green, tranquil and food-forward' },
    bestFor: { pt: 'Natureza, gastronomia, casais', en: 'Nature, dining, couples' },
    price: 'high',
    metaDescription: {
      pt: 'Jardim Botânico: bairro calmo e nobre sob o Corcovado, com o famoso jardim e uma cena gastronômica discreta e excelente. Verde e sereno, sem praia.',
      en: 'Jardim Botânico: a calm, upscale neighborhood under Corcovado, with its famous garden and a quietly excellent dining scene. Green and serene, no beach.',
    },
    intro: [
      {
        pt: 'Bairro calmo e nobre sob o Corcovado, que une o verde do jardim botânico a uma cena gastronômica discretamente excelente. Para quem quer natureza, boa comida e sossego perto da Lagoa.',
        en: 'A calm, upscale district under Corcovado that pairs the greenery of its botanical garden with a quietly excellent restaurant scene. For nature, good food and peace near the lagoon.',
      },
    ],
    tradeoff: {
      pt: 'É um bairro interno, sem praia e com poucos hotéis — conte com viagens curtas até a orla.',
      en: 'It’s inland with no beach and few hotels — plan on short rides to the coast.',
    },
    highlights: [
      { pt: 'Jardim Botânico (palmeiras imperiais)', en: 'Botanical Garden (imperial palms)' },
      { pt: 'Parque Lage e o café com vista do Cristo', en: 'Parque Lage and the café under Christ' },
      { pt: 'Restaurantes de bairro premiados', en: 'Award-winning neighborhood restaurants' },
    ],
    hero: '/img/things-to-do.svg',
  },
  {
    slug: 'lagoa',
    name: 'Lagoa',
    zone: { pt: 'Zona Sul', en: 'South Zone' },
    tagline: { pt: 'Ativa, cênica e à beira da água', en: 'Active, scenic and waterside' },
    bestFor: { pt: 'Corrida e bike, vistas, quiosques', en: 'Running & cycling, views, kiosks' },
    price: 'high',
    metaDescription: {
      pt: 'Lagoa: o anel em volta da Lagoa Rodrigo de Freitas, com pista de corrida e bike, quiosques à beira-d’água e o Corcovado ao fundo. Cênico e ativo.',
      en: 'Lagoa: the ring around the Rodrigo de Freitas lagoon, with a running-and-cycling path, waterside kiosks and Corcovado behind. Scenic and active.',
    },
    intro: [
      {
        pt: 'O bairro cerca a Lagoa Rodrigo de Freitas, com uma pista de 7,5 km para corrida e bike e quiosques à beira-d’água, emoldurada por montanhas e pelo Cristo. Para quem gosta de cenário e movimento entre as praias.',
        en: 'The district rings the Rodrigo de Freitas lagoon, with a 7.5 km running-and-cycling path and waterside kiosks, framed by mountains and Christ the Redeemer. For those who value scenery and recreation between the beaches.',
      },
    ],
    tradeoff: {
      pt: 'A água da lagoa não é de banho e há poucos hotéis — a maioria curte de dia, vindo de um bairro de praia.',
      en: 'The lagoon water isn’t for swimming and hotels are few — most enjoy it by day from a beach base.',
    },
    highlights: [
      { pt: 'Pista de 7,5 km ao redor da Lagoa', en: 'The 7.5 km loop around the lagoon' },
      { pt: 'Quiosques à beira-d’água ao entardecer', en: 'Waterside kiosks at dusk' },
      { pt: 'Aluguel de bike no lado de Ipanema', en: 'Bike rental on the Ipanema side' },
    ],
    hero: '/img/sightseeing.svg',
  },
];

const BY_SLUG = new Map(NEIGHBORHOODS.map((n) => [n.slug, n]));
export function getNeighborhood(slug: string) {
  return BY_SLUG.get(slug);
}
