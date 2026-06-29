import type { RioEvent } from './types';

export const carnaval: RioEvent = {
  slug: 'carnaval',
  icon: '🎭',
  nav: { pt: 'Carnaval 2027', en: 'Carnival 2027' },
  name: { pt: 'Carnaval do Rio 2027', en: 'Rio Carnival 2027' },
  countdownTo: '2027-02-07T21:00:00-03:00',
  dateLabel: { pt: '5 a 13 de fevereiro de 2027', en: 'February 5–13, 2027' },
  metaTitle: {
    pt: 'Carnaval do Rio 2027: datas, Sambódromo e blocos',
    en: 'Rio Carnival 2027: Dates, Sambadrome & Street Blocos',
  },
  metaDescription: {
    pt: 'O guia completo do Carnaval do Rio 2027 (5 a 13 de fevereiro): desfiles do Sambódromo, Grupo Especial, ingressos, camarotes e os melhores blocos de rua.',
    en: 'The complete guide to Rio Carnival 2027 (Feb 5–13): Sambadrome parades, the Special Group, tickets, camarotes and the best street blocos.',
  },
  lede: {
    pt: 'O maior espetáculo da Terra — dois milhões nas ruas, glitter e samba sem parar.',
    en: 'The greatest show on Earth — two million in the streets, glitter and non-stop samba.',
  },
  intro: [
    {
      pt: 'Por cinco dias e noites, o Rio se entrega ao Carnaval. São duas festas ao mesmo tempo: o desfile deslumbrante das escolas de samba no Sambódromo, com ingresso, e o caos livre e alegre dos blocos de rua que tomam cada bairro. Faça um, o outro ou — se aguentar — os dois.',
      en: 'For five days and nights, Rio surrenders to Carnival. Two parties run at once: the breathtaking, ticketed samba-school parade at the Sambadrome, and the free, joyful chaos of the street blocos taking over every neighborhood. Do one, the other or — if you can survive it — both.',
    },
  ],
  hero: '/img/carnaval.svg',
  keywords: [
    'rio carnival 2027 dates',
    'carnaval rio 2027 datas',
    'sambódromo ingressos',
    'rio carnival blocos',
    'sambadrome tickets',
  ],
  schema: {
    startDate: '2027-02-05',
    endDate: '2027-02-13',
    location: 'Sambódromo Marquês de Sapucaí, Rio de Janeiro',
  },
  sections: [
    {
      id: 'datas',
      title: { pt: 'As datas oficiais de 2027', en: 'The official 2027 dates' },
      intro: {
        pt: 'O Carnaval 2027 vai de 5 a 13 de fevereiro, no Sambódromo Marquês de Sapucaí.',
        en: 'Carnival 2027 runs February 5–13, at the Sambódromo Marquês de Sapucaí.',
      },
      items: [
        {
          name: 'Série Ouro',
          area: 'Sex 5 + Sáb 6/fev',
          blurb: {
            pt: 'A segunda divisão abre o Sambódromo na sexta e no sábado. Ingressos bem mais baratos e ótima energia.',
            en: 'The second division opens the Sambadrome on Friday and Saturday. Far cheaper tickets and great energy.',
          },
        },
        {
          name: 'Grupo Especial',
          area: 'Dom 7 · Seg 8 · Ter 9/fev',
          blurb: {
            pt: 'As maiores escolas do Rio desfilam nas três noites principais — quatro escolas por noite. O auge da competição.',
            en: 'Rio’s top schools parade on the three main nights — four schools a night. The peak of the competition.',
          },
        },
        {
          name: 'Desfile das Campeãs',
          area: 'Sáb 13/fev',
          blurb: {
            pt: 'As campeãs reapresentam seus desfiles no sábado seguinte. Mais barato e igualmente espetacular.',
            en: 'The champions re-parade the following Saturday. Cheaper and just as spectacular.',
          },
        },
      ],
    },
    {
      id: 'sambodromo',
      title: { pt: 'Setores e ingressos', en: 'Sectors & tickets' },
      intro: {
        pt: 'Compre apenas por canais oficiais. Arquibancada é o melhor custo-benefício; camarote é a experiência premium.',
        en: 'Buy only through official channels. Grandstands are the best value; a camarote is the premium experience.',
      },
      items: [
        {
          name: 'Arquibancadas',
          price: 'mid',
          blurb: {
            pt: 'Os degraus clássicos. Os setores 7, 9 e 11 ficam perto dos jurados e da melhor energia.',
            en: 'The classic bleachers. Sectors 7, 9 and 11 sit near the judges and the best energy.',
          },
        },
        {
          name: 'Frisas',
          price: 'high',
          blurb: {
            pt: 'Camarotes abertos no nível da pista, na beira da avenida. O mais perto que você chega dos passistas.',
            en: 'Open boxes at runway level, on the edge of the avenue. The closest you get to the dancers.',
          },
        },
        {
          name: 'Camarotes',
          price: 'luxury',
          blurb: {
            pt: 'Suítes premium com open bar, gastronomia, ar e shows. De ~R$1.350 a R$8.000 por pessoa, por noite.',
            en: 'Premium suites with open bar, food, AC and shows. From ~R$1,350 to R$8,000 per person, per night.',
          },
        },
        {
          name: 'Desfilar numa escola',
          price: 'high',
          blurb: {
            pt: 'Turistas podem comprar uma fantasia e desfilar dentro de uma escola. Não precisa saber sambar — só não parar de andar.',
            en: 'Tourists can buy a costume and parade inside a samba school. No dancing skills needed — just keep moving.',
          },
        },
      ],
    },
    {
      id: 'blocos',
      title: { pt: 'Blocos de rua (de graça!)', en: 'Street blocos (free!)' },
      intro: {
        pt: 'Centenas de festas de rua com banda e multidão fantasiada, do amanhecer à noite. A verdadeira alma do Carnaval.',
        en: 'Hundreds of street parties with a band and a costumed crowd, from dawn to night. The true soul of Carnival.',
      },
      items: [
        {
          name: 'Cordão da Bola Preta',
          area: 'Centro',
          blurb: {
            pt: 'O mais antigo e maior (desde 1918). Mais de um milhão de pessoas no sábado de Carnaval.',
            en: 'The oldest and biggest (since 1918). Over a million people on Carnival Saturday.',
          },
        },
        {
          name: 'Sargento Pimenta',
          area: 'Aterro do Flamengo',
          blurb: {
            pt: 'Os Beatles em ritmo de samba. Alegre, família, à beira da praia.',
            en: 'The Beatles as samba. Joyful, family-friendly, by the beach.',
          },
        },
        {
          name: 'Céu na Terra / Carmelitas',
          area: 'Santa Teresa',
          blurb: {
            pt: 'Blocos boêmios que sobem as ladeiras de Santa Teresa, com as melhores vistas.',
            en: 'Bohemian blocos climbing the lanes of Santa Teresa, with the best views.',
          },
        },
        {
          name: 'Simpatia é Quase Amor',
          area: 'Ipanema',
          blurb: {
            pt: 'O bloco querido de Ipanema, na orla, com samba clássico e clima de paquera.',
            en: 'Ipanema’s beloved bloco on the beachfront — classic samba and a flirtatious spirit.',
          },
        },
      ],
    },
  ],
  faqs: [
    {
      q: { pt: 'Quando é o Carnaval do Rio 2027?', en: 'When is Rio Carnival 2027?' },
      a: {
        pt: 'De 5 a 13 de fevereiro de 2027. O Grupo Especial desfila no Sambódromo no domingo (7), segunda (8) e terça (9); o Desfile das Campeãs é no sábado, 13.',
        en: 'February 5–13, 2027. The Special Group parades at the Sambadrome on Sunday (7), Monday (8) and Tuesday (9); the Champions’ Parade is Saturday the 13th.',
      },
    },
    {
      q: { pt: 'Preciso pagar para curtir o Carnaval?', en: 'Do I have to pay for Carnival?' },
      a: {
        pt: 'Não. Os blocos de rua são gratuitos. Você só paga para assistir ao Sambódromo (ingresso) ou entrar num camarote VIP.',
        en: 'No. The street blocos are free. You only pay to watch the Sambadrome (ticket) or enter a VIP camarote.',
      },
    },
    {
      q: { pt: 'O Carnaval é seguro?', en: 'Is Carnival safe?' },
      a: {
        pt: 'É uma festa alegre e bem policiada, mas furtos acontecem nas multidões. Leve só o celular e um pouco de dinheiro, deixe valores no hotel e fique com seu grupo.',
        en: 'It’s a joyful, well-policed party, but pickpocketing thrives in crowds. Carry only a phone and some cash, leave valuables in your hotel and stay with your group.',
      },
    },
  ],
};

export const reveillon: RioEvent = {
  slug: 'reveillon',
  icon: '🎆',
  nav: { pt: 'Réveillon', en: 'New Year’s Eve' },
  name: { pt: 'Réveillon de Copacabana', en: 'Réveillon — New Year on Copacabana' },
  countdownTo: '2026-12-31T22:00:00-03:00',
  dateLabel: { pt: '31 de dezembro de 2026', en: 'December 31, 2026' },
  metaTitle: {
    pt: 'Réveillon Copacabana 2027: o maior Ano-Novo do mundo',
    en: 'Réveillon Copacabana 2027: The World’s Biggest New Year’s Eve',
  },
  metaDescription: {
    pt: 'Guia do Réveillon de Copacabana — os fogos recordistas do Guinness, ~2,5 milhões de pessoas, a tradição do branco, oferendas a Iemanjá e dicas de logística.',
    en: 'Guide to Réveillon on Copacabana — the Guinness-record fireworks, ~2.5 million people, the all-white tradition, Iemanjá offerings and logistics tips.',
  },
  lede: {
    pt: 'Dois milhões e meio de pessoas de branco, numa praia, sob os maiores fogos do mundo.',
    en: 'Two and a half million people in white, on one beach, under the world’s biggest fireworks.',
  },
  intro: [
    {
      pt: 'O Réveillon de Copacabana é a maior celebração de Ano-Novo do planeta — recorde no Guinness. Cerca de 2,5 milhões de pessoas se vestem de branco na areia enquanto os fogos explodem das balsas no mar por uns 12 minutos, com um show de 1.200 drones no céu.',
      en: 'Copacabana’s Réveillon is the largest New Year’s celebration on the planet — a Guinness World Record. Around 2.5 million people dress in white on the sand as fireworks erupt from ocean barges for some 12 minutes, mirrored by a 1,200-drone show in the sky.',
    },
    {
      pt: 'Mas é mais que festa. Perto da meia-noite, devotos entram nas ondas para soltar flores brancas e velas como oferenda a Iemanjá, a deusa do mar. Vista branco, pule sete ondas e faça sete pedidos.',
      en: 'But it’s more than a party. Near midnight, devotees wade into the waves to release white flowers and candles as offerings to Iemanjá, goddess of the sea. Wear white, jump seven waves and make seven wishes.',
    },
  ],
  hero: '/img/reveillon.svg',
  keywords: [
    'reveillon copacabana 2027',
    'rio new years eve',
    'copacabana fireworks',
    'ano novo rio 2027',
  ],
  schema: {
    startDate: '2026-12-31',
    endDate: '2027-01-01',
    location: 'Praia de Copacabana, Rio de Janeiro',
  },
  sections: [
    {
      id: 'tradicoes',
      title: { pt: 'As tradições', en: 'The traditions' },
      items: [
        {
          name: 'Vestir branco',
          blurb: {
            pt: 'Todo mundo se veste de branco para atrair paz e renovação. Acrescente uma cor para seu desejo: dourado (dinheiro), verde (saúde), rosa (amor).',
            en: 'Everyone dresses in white to attract peace and renewal. Add a color for your wish: gold (money), green (health), pink (love).',
          },
        },
        {
          name: 'Pular sete ondas',
          blurb: {
            pt: 'À meia-noite, os cariocas pulam sete ondas e fazem sete pedidos para o ano que começa.',
            en: 'At midnight, locals jump seven waves and make seven wishes for the year ahead.',
          },
        },
        {
          name: 'Oferendas a Iemanjá',
          blurb: {
            pt: 'Flores brancas, velas e barquinhos vão ao mar como oferenda a Iemanjá, a orixá do oceano.',
            en: 'White flowers, candles and little boats float out to sea as offerings to Iemanjá, the orixá of the ocean.',
          },
        },
      ],
    },
    {
      id: 'logistica',
      title: { pt: 'Logística e segurança', en: 'Logistics & safety' },
      items: [
        {
          name: 'Vá de metrô',
          blurb: {
            pt: 'O acesso de carro fecha por volta das 19h. O metrô funciona em horário estendido e é a melhor forma de ir e voltar.',
            en: 'Car access closes around 7pm. The metro runs extended hours and is the best way in and out.',
          },
        },
        {
          name: 'Sem vidro, pouca bagagem',
          blurb: {
            pt: 'Há revistas e detectores; vidro é proibido. Leve pouco dinheiro numa pochete fechada e deixe o passaporte no hotel.',
            en: 'There are searches and detectors; glass is banned. Carry little cash in a zipped pouch and leave your passport at the hotel.',
          },
        },
        {
          name: 'Onde assistir',
          blurb: {
            pt: 'A orla toda tem boa vista; perto do Posto 5 fica a energia mais intensa. O Morro do Leme e o Arpoador dão vistas elevadas com menos gente.',
            en: 'The whole beachfront has good views; around Posto 5 has the most intense energy. Morro do Leme and Arpoador offer elevated views with thinner crowds.',
          },
        },
      ],
    },
  ],
  faqs: [
    {
      q: { pt: 'Que horas são os fogos?', en: 'What time are the fireworks?' },
      a: {
        pt: 'O show principal começa à meia-noite e dura cerca de 12 minutos, lançado das balsas, com show de drones. Chegue no começo da noite para garantir lugar.',
        en: 'The main show starts at midnight and lasts about 12 minutes, fired from barges, with a drone show. Arrive early evening to secure a spot.',
      },
    },
    {
      q: { pt: 'É seguro numa multidão tão grande?', en: 'Is it safe in such a huge crowd?' },
      a: {
        pt: 'É muito policiado, com revistas e câmeras. Ande em grupo, leve pouco dinheiro, deixe o passaporte no hotel e combine um ponto de encontro.',
        en: 'It’s heavily policed, with searches and cameras. Move in a group, carry little cash, leave your passport at the hotel and agree a meeting point.',
      },
    },
  ],
};

export const EVENTS: RioEvent[] = [carnaval, reveillon];

const EVENTS_BY_SLUG = new Map(EVENTS.map((e) => [e.slug, e]));
export function getEvent(slug: string): RioEvent | undefined {
  return EVENTS_BY_SLUG.get(slug);
}
