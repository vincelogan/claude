import type { Guide } from '../types';

export const reveillon: Guide = {
  slug: 'reveillon',
  group: 'experience',
  icon: '🎆',
  nav: { en: 'Réveillon', pt: 'Réveillon' },
  title: { en: 'Réveillon — New Year on Copacabana', pt: 'Réveillon em Copacabana' },
  metaTitle: {
    en: 'Réveillon Copacabana 2027: World’s Biggest New Year’s Eve',
    pt: 'Réveillon Copacabana 2027: o maior Ano-Novo do mundo',
  },
  metaDescription: {
    en: 'Guide to New Year’s Eve on Copacabana Beach — the Guinness-record fireworks, the all-white tradition, Iemanjá offerings, best viewpoints, parties and safety tips.',
    pt: 'Guia do Réveillon na praia de Copacabana — os fogos recordistas, a tradição do branco, oferendas a Iemanjá, melhores pontos, festas e dicas de segurança.',
  },
  lede: {
    en: 'Two million people in white, on one beach, under the world’s biggest fireworks.',
    pt: 'Dois milhões de pessoas de branco, numa praia, sob os maiores fogos do mundo.',
  },
  intro: [
    {
      en: 'Copacabana on December 31 is the largest New Year’s Eve celebration on the planet — a Guinness World Record. More than two million people dress in white and gather on the four-kilometre crescent of sand as a 12-minute pyromusical show erupts from barges anchored offshore, mirrored by a thousand-drone display in the sky.',
      pt: 'Copacabana no dia 31 de dezembro é a maior celebração de Ano-Novo do planeta — recorde no Guinness. Mais de dois milhões de pessoas se vestem de branco na praia de quatro quilômetros enquanto um show piromusical de 12 minutos explode das balsas no mar, espelhado por um show com mil drones no céu.',
    },
    {
      en: 'But Réveillon is more than a party. As midnight nears, devotees of Iemanjá — the Afro-Brazilian goddess of the sea — wade into the waves to release white flowers and candles, asking for blessings. It’s spiritual, joyful and utterly unforgettable.',
      pt: 'Mas o Réveillon é mais que festa. Perto da meia-noite, devotos de Iemanjá — a deusa do mar — entram nas ondas para soltar flores brancas e velas, pedindo bênçãos. É espiritual, alegre e inesquecível.',
    },
  ],
  hero: '/img/reveillon.svg',
  keywords: [
    'reveillon copacabana 2027',
    'new years eve rio de janeiro',
    'copacabana fireworks',
    'rio new year white clothes',
    'iemanja offerings',
    'reveillon rio dicas',
  ],
  sections: [
    {
      id: 'traditions',
      title: { en: 'The traditions', pt: 'As tradições' },
      items: [
        {
          name: 'Wear white',
          blurb: {
            en: 'Everyone dresses head-to-toe in white to attract peace and renewal. Add a color accent for your wish: yellow/gold for money, green for health, pink for love, red for passion, blue for calm.',
            pt: 'Todo mundo se veste de branco para atrair paz e renovação. Acrescente uma cor para seu desejo: amarelo/dourado para dinheiro, verde para saúde, rosa para amor, vermelho para paixão, azul para tranquilidade.',
          },
        },
        {
          name: 'Jump seven waves',
          blurb: {
            en: 'At midnight, locals jump seven waves and make seven wishes — a tradition for good luck in the year ahead.',
            pt: 'À meia-noite, os cariocas pulam sete ondas e fazem sete pedidos — tradição de boa sorte para o ano que começa.',
          },
        },
        {
          name: 'Offerings to Iemanjá',
          blurb: {
            en: 'Following Umbanda and Candomblé tradition, people float white flowers, candles and small boats out to sea as offerings to Iemanjá, the orixá of the ocean.',
            pt: 'Seguindo a tradição de Umbanda e Candomblé, as pessoas soltam flores brancas, velas e barquinhos no mar como oferendas a Iemanjá, a orixá do oceano.',
          },
          tip: {
            en: 'If your offering returns to shore, legend says Iemanjá didn’t accept it; if it floats out, your wish was received.',
            pt: 'Se a oferenda volta para a areia, diz a lenda que Iemanjá não aceitou; se vai para o mar, seu pedido foi recebido.',
          },
        },
      ],
    },
    {
      id: 'where',
      title: { en: 'Where to watch', pt: 'Onde assistir' },
      items: [
        {
          name: 'Copacabana beachfront',
          area: 'Copacabana',
          blurb: {
            en: 'The full-immersion experience. Anywhere along Avenida Atlântica has great sightlines; around Posto 5 has the most electric energy.',
            pt: 'A experiência completa. Qualquer ponto da Avenida Atlântica tem boa vista; perto do Posto 5 fica a energia mais elétrica.',
          },
          price: 'budget',
        },
        {
          name: 'Morro do Leme / Arpoador',
          area: 'Copacabana / Ipanema',
          blurb: {
            en: 'Elevated rocky promontories at each end of the beach give sweeping views with thinner crowds.',
            pt: 'Os costões rochosos nas pontas da praia dão vistas amplas com menos gente.',
          },
          price: 'budget',
        },
        {
          name: 'Hotel parties & rooftops',
          area: 'Copacabana',
          blurb: {
            en: 'The Copacabana Palace (Belmond), Pestana, Sheraton Grand and Rio Othon host ticketed white-tie dinners and rooftop viewing parties with the best views in the city. Book months ahead.',
            pt: 'Copacabana Palace (Belmond), Pestana, Sheraton Grand e Rio Othon oferecem jantares e festas em rooftops com as melhores vistas da cidade. Reserve com meses de antecedência.',
          },
          price: 'luxury',
        },
        {
          name: 'Boat party on Guanabara Bay',
          area: 'Guanabara Bay',
          blurb: {
            en: 'Charter and group boats watch the fireworks from the water — a memorable, premium alternative to the beach crush.',
            pt: 'Barcos fretados e em grupo assistem aos fogos da água — uma alternativa premium e marcante à multidão da praia.',
          },
          price: 'high',
        },
        {
          name: 'Barra & Recreio',
          area: 'Barra da Tijuca',
          blurb: {
            en: 'The city stages a separate fireworks display out west — a calmer option for families avoiding Copacabana’s density.',
            pt: 'A cidade faz um show de fogos separado na Zona Oeste — opção mais tranquila para famílias que fogem da multidão de Copacabana.',
          },
          price: 'mid',
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'What time are the fireworks?', pt: 'Que horas são os fogos?' },
      a: {
        en: 'The main pyromusical show begins at midnight and runs about 12 minutes, fired from barges along Copacabana beach, accompanied by a drone show. Arrive by early evening to find a good spot.',
        pt: 'O show piromusical principal começa à meia-noite e dura cerca de 12 minutos, lançado das balsas ao longo de Copacabana, com show de drones. Chegue no começo da noite para garantir um bom lugar.',
      },
    },
    {
      q: { en: 'How do I get there and back?', pt: 'Como chego e volto?' },
      a: {
        en: 'Don’t drive — streets close. The metro runs extended (often 24h) hours over New Year and is the best way in and out. Walk the last stretch and wear flat shoes.',
        pt: 'Não vá de carro — as ruas fecham. O metrô funciona em horário estendido (muitas vezes 24h) no Réveillon e é a melhor forma de ir e voltar. Caminhe o trecho final e use calçado baixo.',
      },
    },
    {
      q: { en: 'Is it safe in such a huge crowd?', pt: 'É seguro numa multidão tão grande?' },
      a: {
        en: 'It’s heavily policed with security searches, metal detectors and cameras; glass is banned. Move in a group, carry minimal cash in a zipped cross-body pouch, leave your passport in the hotel safe, and agree a meeting point in case you’re separated.',
        pt: 'É muito policiado, com revistas, detectores de metal e câmeras; vidro é proibido. Ande em grupo, leve pouco dinheiro numa pochete fechada, deixe o passaporte no cofre do hotel e combine um ponto de encontro caso se separem.',
      },
    },
  ],
  related: ['carnaval', 'stay', 'safety'],
};
