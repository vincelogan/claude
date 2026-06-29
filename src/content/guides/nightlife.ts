import type { Guide } from '../types';

export const nightlife: Guide = {
  slug: 'nightlife',
  group: 'experience',
  icon: '🍸',
  nav: { en: 'Parties & Nightlife', pt: 'Festas & Noite' },
  title: { en: 'Parties & Nightlife', pt: 'Festas & Vida Noturna' },
  metaTitle: {
    en: 'Rio Nightlife Guide: Lapa Samba, Bars, Clubs & Parties',
    pt: 'Vida Noturna no Rio: Samba na Lapa, Bares, Clubs e Festas',
  },
  metaDescription: {
    en: 'Where to party in Rio de Janeiro — samba nights in Lapa, beachfront rooftop bars, the chic Leblon scene, big Barra clubs and the city’s legendary venues.',
    pt: 'Onde sair à noite no Rio — samba na Lapa, rooftops na orla, a cena chique do Leblon, os grandes clubs da Barra e os points lendários da cidade.',
  },
  lede: {
    en: 'Samba until sunrise, rooftop caipirinhas and the warmest party crowd on Earth.',
    pt: 'Samba até o amanhecer, caipirinha no rooftop e a galera mais calorosa do mundo.',
  },
  intro: [
    {
      en: 'Cariocas treat the night like a sport. It usually starts late, ends later, and always involves music. Whether you want a sweaty roda de samba in a Lapa alley, a chic cocktail in Leblon, or bottle service at a Barra megaclub, Rio delivers — and almost everyone is welcome.',
      pt: 'O carioca leva a noite a sério. Costuma começar tarde, terminar mais tarde ainda e sempre tem música. Seja uma roda de samba numa viela da Lapa, um drink chique no Leblon ou camarote num megaclub da Barra, o Rio entrega — e quase todo mundo é bem-vindo.',
    },
  ],
  hero: '/img/nightlife.svg',
  keywords: [
    'rio de janeiro nightlife',
    'lapa samba',
    'rio bars and clubs',
    'rio scenarium',
    'vida noturna rio',
    'baladas no rio',
    'rooftop bars rio',
  ],
  sections: [
    {
      id: 'lapa',
      title: { en: 'Lapa — the samba heart', pt: 'Lapa — o coração do samba' },
      intro: {
        en: 'Under the white arches of the Lapa aqueduct, the streets close on Friday and Saturday and become one giant open-air party. This is the soul of carioca nightlife.',
        pt: 'Sob os arcos brancos da Lapa, as ruas fecham nas sextas e sábados e viram uma festa a céu aberto. É a alma da noite carioca.',
      },
      items: [
        {
          name: 'Rio Scenarium',
          area: 'Lapa',
          blurb: {
            en: 'A three-story former antiques warehouse packed with vintage treasures, multiple stages and live bands every night. Touristy but genuinely magical.',
            pt: 'Um antigo galpão de antiguidades de três andares, cheio de tesouros vintage, vários palcos e bandas ao vivo todas as noites. Turístico, mas mágico.',
          },
          price: 'mid',
        },
        {
          name: 'Carioca da Gema',
          area: 'Lapa',
          blurb: {
            en: 'An intimate, beloved samba and choro house with some of the city’s best musicians and good Brazilian food. Go early; it fills up.',
            pt: 'Uma casa de samba e choro intimista e querida, com alguns dos melhores músicos da cidade e boa comida. Chegue cedo; lota.',
          },
          price: 'mid',
        },
        {
          name: 'Beco do Rato',
          area: 'Lapa',
          blurb: {
            en: 'A tiny alley bar with first-class roda de samba and a local, unpretentious crowd — the antidote to the tourist circuit.',
            pt: 'Um bar de viela com roda de samba de primeira e público local e despretensioso — o antídoto ao circuito turístico.',
          },
          price: 'budget',
        },
      ],
    },
    {
      id: 'samba-roots',
      title: { en: 'Where samba was born', pt: 'Onde o samba nasceu' },
      items: [
        {
          name: 'Pedra do Sal',
          area: 'Saúde / Little Africa',
          blurb: {
            en: 'A historic stone staircase in the birthplace of samba. Free open-air roda de samba on Monday and Friday nights, beer in hand, pure carioca soul.',
            pt: 'Uma escadaria histórica no berço do samba. Roda de samba gratuita a céu aberto às segundas e sextas, cerveja na mão, alma carioca pura.',
          },
          price: 'budget',
        },
        {
          name: 'Trapiche Gamboa',
          area: 'Gamboa',
          blurb: {
            en: 'A restored portside warehouse with live samba and a warm, local vibe a little off the tourist track.',
            pt: 'Um armazém portuário restaurado com samba ao vivo e clima local, um pouco fora da rota turística.',
          },
          price: 'mid',
        },
      ],
    },
    {
      id: 'upscale',
      title: { en: 'Chic bars & rooftops', pt: 'Bares chiques & rooftops' },
      items: [
        {
          name: 'Rua Dias Ferreira',
          area: 'Leblon',
          blurb: {
            en: 'Leblon’s restaurant-and-bar street — the polished, well-heeled side of Rio nights, with great cocktails and dining.',
            pt: 'A rua de restaurantes e bares do Leblon — o lado polido e sofisticado da noite carioca, com ótimos drinks e gastronomia.',
          },
          price: 'high',
        },
        {
          name: 'Beachfront rooftop bars',
          area: 'Ipanema / Copacabana',
          blurb: {
            en: 'Hotel rooftops along the ocean serve sunset caipirinhas with postcard views. Dress smart and book ahead on weekends.',
            pt: 'Rooftops de hotéis na orla servem caipirinhas no pôr do sol com vista de cartão-postal. Vá bem-vestido e reserve nos fins de semana.',
          },
          price: 'high',
        },
        {
          name: 'Barra megaclubs',
          area: 'Barra da Tijuca',
          blurb: {
            en: 'The west zone is club country — big electronic and bottle-service venues with a younger, dressed-up crowd that goes until dawn.',
            pt: 'A Zona Oeste é o reino dos clubs — grandes casas eletrônicas e de camarote, com público jovem e arrumado que vai até o amanhecer.',
          },
          price: 'high',
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'What time does nightlife start in Rio?', pt: 'Que horas começa a noite no Rio?' },
      a: {
        en: 'Late. Bars fill after 9–10pm and clubs don’t get going until midnight or later. Lapa is busiest Thursday to Saturday.',
        pt: 'Tarde. Os bares enchem depois das 21–22h e os clubs só esquentam a partir da meia-noite. A Lapa é mais movimentada de quinta a sábado.',
      },
    },
    {
      q: { en: 'How do I get home safely at night?', pt: 'Como volto com segurança à noite?' },
      a: {
        en: 'Use Uber or 99 (ride apps) to and from venues — they’re cheap and far safer than walking or random taxis. Avoid empty side streets, especially around Lapa late at night.',
        pt: 'Use Uber ou 99 para ir e voltar — são baratos e bem mais seguros que andar a pé ou pegar táxi na rua. Evite ruas vazias, especialmente na Lapa de madrugada.',
      },
    },
  ],
  related: ['carnaval', 'eat', 'vip', 'safety'],
};
