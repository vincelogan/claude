import type { Section, FAQ } from './types';

// Essentials shown as the "antes de tudo" bar on the home + the Planejar page.
export const ESSENTIALS: { id: string; icon: string; title: { pt: string; en: string }; blurb: { pt: string; en: string } }[] = [
  {
    id: 'seguranca',
    icon: '🛡️',
    title: { pt: 'É seguro?', en: 'Is it safe?' },
    blurb: {
      pt: 'Sim, com bom senso. Fique na Zona Sul e use Uber/99 à noite.',
      en: 'Yes, with street smarts. Stay in the South Zone and use Uber/99 at night.',
    },
  },
  {
    id: 'como-chegar',
    icon: '✈️',
    title: { pt: 'Como chegar', en: 'How to get here' },
    blurb: {
      pt: 'GIG (internacional) e SDU (doméstico). Do GIG, app ou transfer até a Zona Sul.',
      en: 'GIG (international) and SDU (domestic). From GIG, an app or transfer to the South Zone.',
    },
  },
  {
    id: 'melhor-epoca',
    icon: '🌤️',
    title: { pt: 'Melhor época', en: 'Best time' },
    blurb: {
      pt: 'Primavera e outono são amenos e em conta. Verão é quente, caro e cheio.',
      en: 'Spring and autumn are mild and good value. Summer is hot, pricey and packed.',
    },
  },
  {
    id: 'dinheiro',
    icon: '💳',
    title: { pt: 'Dinheiro', en: 'Money' },
    blurb: {
      pt: 'Real (BRL). Cartões aceitos em quase tudo; Pix domina. Troco para quiosques.',
      en: 'Real (BRL). Cards accepted almost everywhere; Pix dominates. Cash for kiosks.',
    },
  },
];

export const PLAN_SECTIONS: Section[] = [
  {
    id: 'seguranca',
    title: { pt: 'É seguro?', en: 'Is it safe?' },
    intro: {
      pt: 'Sim, para os milhões que visitam todo ano, com bom senso. O risco real é o furto, não a violência — que se concentra longe das áreas turísticas.',
      en: 'Yes, for the millions who visit each year, with common sense. The real risk is petty theft, not violence — which is concentrated far from tourist areas.',
    },
    items: [
      {
        name: 'Onde ficar e o que evitar',
        blurb: {
          pt: 'Fique na Zona Sul (Ipanema, Leblon, Copacabana, Botafogo) — mais patrulhada. Não entre em favelas; o Centro esvazia e fica arriscado à noite.',
          en: 'Stay in the South Zone (Ipanema, Leblon, Copacabana, Botafogo) — best patrolled. Don’t enter favelas; the Centro empties and gets risky at night.',
        },
      },
      {
        name: 'Hábitos que protegem',
        blurb: {
          pt: 'Não exiba celular/joias; separe cartões e dinheiro; não vá à praia depois de escurecer; à noite, Uber/99 em vez de andar.',
          en: 'Don’t flash your phone/jewellery; split cards and cash; don’t hit the beach after dark; at night, take Uber/99 instead of walking.',
        },
      },
      {
        name: 'Emergências',
        blurb: {
          pt: 'Polícia 190, SAMU 192, Bombeiros 193. A Delegacia do Turista (DEAT), no Leblon, é 24h e atende em inglês.',
          en: 'Police 190, ambulance 192, fire 193. The 24h Tourist Police (DEAT) in Leblon has English-speaking officers.',
        },
      },
    ],
  },
  {
    id: 'como-chegar',
    title: { pt: 'Como chegar', en: 'How to get here' },
    items: [
      {
        name: 'Os dois aeroportos',
        blurb: {
          pt: 'GIG (Galeão) recebe os voos internacionais, ~20 km da Zona Sul. SDU (Santos Dumont) é doméstico, junto ao Centro.',
          en: 'GIG (Galeão) handles international flights, ~20 km from the South Zone. SDU (Santos Dumont) is domestic, next to the Centro.',
        },
      },
      {
        name: 'Do GIG ao hotel',
        blurb: {
          pt: 'Uber/99 (~R$80–130) é o mais recomendado; táxi oficial ~R$150–200; transfer privativo para chegar sem estresse.',
          en: 'Uber/99 (~R$80–130) is recommended; official taxi ~R$150–200; a private transfer for a stress-free arrival.',
        },
      },
      {
        name: 'Vistos & vacina',
        blurb: {
          pt: 'EUA, Canadá e Austrália precisam de eVisa desde abr/2025; UE e Reino Unido são isentos. Vacina de febre amarela recomendada. Confirme a regra atual.',
          en: 'US, Canada and Australia need an eVisa since Apr 2025; EU and UK are exempt. Yellow fever vaccine recommended. Confirm the current rule.',
        },
      },
    ],
  },
  {
    id: 'locomocao',
    title: { pt: 'Como circular', en: 'Getting around' },
    items: [
      {
        name: 'Metrô',
        blurb: {
          pt: 'Seguro, limpo e rápido (~R$7,90). Atende Copacabana, Ipanema, Botafogo, Centro e Maracanã.',
          en: 'Safe, clean and fast (~R$7.90). Serves Copacabana, Ipanema, Botafogo, Centro and Maracanã.',
        },
      },
      {
        name: 'Uber & 99',
        blurb: {
          pt: 'Baratos e o padrão à noite. Mais fáceis e seguros que ônibus ou táxi de rua.',
          en: 'Cheap and the default at night. Easier and safer than buses or street taxis.',
        },
      },
      {
        name: 'O que evitar',
        blurb: {
          pt: 'Ônibus à noite e alugar carro não compensam. Em eventos, vá de transporte público.',
          en: 'Buses at night and renting a car aren’t worth it. For events, use public transport.',
        },
      },
    ],
  },
  {
    id: 'dinheiro-epoca',
    title: { pt: 'Dinheiro & melhor época', en: 'Money & best time' },
    items: [
      {
        name: 'Dinheiro',
        blurb: {
          pt: 'Real (BRL). Visa/Master aceitos amplamente; Pix domina. Leve troco para quiosques e feiras; saque em banco/shopping. Gorjeta de 10% costuma vir na conta.',
          en: 'Real (BRL). Visa/Mastercard widely accepted; Pix dominates. Carry cash for kiosks and markets; withdraw at banks/malls. A 10% tip is usually on the bill.',
        },
      },
      {
        name: 'Melhor época',
        blurb: {
          pt: 'Primavera (set–nov) e outono (abr–jun): ameno e melhor valor. Verão (dez–mar): quente (>35°C), Réveillon e Carnaval, caro e cheio. Inverno (jul–ago): fresco e seco.',
          en: 'Spring (Sep–Nov) and autumn (Apr–Jun): mild and best value. Summer (Dec–Mar): hot (>35°C), Réveillon and Carnival, pricey and packed. Winter (Jul–Aug): cool and dry.',
        },
      },
      {
        name: 'Idioma & apps',
        blurb: {
          pt: 'Português; inglês limitado fora do circuito turístico. Apps úteis: Uber, 99, MetrôRio e Blocos da Rua (no Carnaval).',
          en: 'Portuguese; limited English outside the tourist circuit. Useful apps: Uber, 99, MetrôRio and Blocos da Rua (for Carnival).',
        },
      },
    ],
  },
];

// Master FAQ — feeds the home accordion and the Planejar FAQPage schema.
export const FAQS: FAQ[] = [
  {
    q: { pt: 'O Rio de Janeiro é seguro para turistas?', en: 'Is Rio de Janeiro safe for tourists?' },
    a: {
      pt: 'Sim, com bom senso. Fique na Zona Sul (Ipanema, Leblon, Copacabana, Botafogo), use Uber/99 à noite, não exiba valores e leve pouco à praia. Não entre em favelas.',
      en: 'Yes, with street smarts. Stay in the South Zone (Ipanema, Leblon, Copacabana, Botafogo), use Uber/99 at night, don’t flash valuables and take little to the beach. Don’t enter favelas.',
    },
  },
  {
    q: { pt: 'Quando é o Carnaval do Rio 2027?', en: 'When is Rio Carnival 2027?' },
    a: {
      pt: 'De 5 a 13 de fevereiro de 2027. O Grupo Especial desfila no Sambódromo no domingo 7, segunda 8 e terça 9; o Desfile das Campeãs é no sábado 13.',
      en: 'February 5–13, 2027. The Special Group parades at the Sambadrome on Sunday 7, Monday 8 and Tuesday 9; the Champions’ Parade is Saturday the 13th.',
    },
  },
  {
    q: { pt: 'Preciso de visto para o Brasil?', en: 'Do I need a visa for Brazil?' },
    a: {
      pt: 'Desde abril de 2025, cidadãos dos EUA, Canadá e Austrália precisam de um eVisa (~US$80,90), solicitado online. UE e Reino Unido são isentos para turismo. Confirme sempre a regra atual.',
      en: 'Since April 2025, US, Canadian and Australian citizens need an eVisa (~US$80.90), applied for online. EU and UK are exempt for tourism. Always confirm the current rule.',
    },
  },
  {
    q: { pt: 'Quantos dias ficar no Rio?', en: 'How many days should I spend in Rio?' },
    a: {
      pt: 'Quatro a cinco dias cobrem os ícones (Cristo, Pão de Açúcar), as praias, um pôr do sol no Arpoador, uma noite de samba e um bate-volta. Para Carnaval ou Réveillon, some os dias do evento.',
      en: 'Four to five days cover the icons (Christ, Sugarloaf), the beaches, an Arpoador sunset, a samba night and a day trip. For Carnival or Réveillon, add the event days.',
    },
  },
  {
    q: { pt: 'Qual é a melhor época para visitar o Rio?', en: 'What’s the best time to visit Rio?' },
    a: {
      pt: 'Primavera (set–nov) e outono (abr–jun): clima ameno, menos gente e melhor preço. Verão (dez–mar) é quente e tem Réveillon e Carnaval, mas é caro e lotado.',
      en: 'Spring (Sep–Nov) and autumn (Apr–Jun): mild weather, fewer crowds and better prices. Summer (Dec–Mar) is hot and has Réveillon and Carnival, but it’s pricey and packed.',
    },
  },
  {
    q: { pt: 'Como ir do aeroporto à Zona Sul?', en: 'How do I get from the airport to the South Zone?' },
    a: {
      pt: 'Do GIG (internacional), use Uber/99 (~R$80–130), táxi oficial (~R$150–200) ou um transfer privativo. São 30–60 minutos conforme o trânsito.',
      en: 'From GIG (international), use Uber/99 (~R$80–130), an official taxi (~R$150–200) or a private transfer. It’s 30–60 minutes depending on traffic.',
    },
  },
];
