import type { Guide } from '../types';

export const carnaval: Guide = {
  slug: 'carnaval',
  group: 'experience',
  icon: '🎭',
  nav: { en: 'Carnival', pt: 'Carnaval' },
  title: { en: 'Rio Carnival', pt: 'Carnaval do Rio' },
  metaTitle: {
    en: 'Rio Carnival 2027: Dates, Sambadrome & Blocos Guide',
    pt: 'Carnaval do Rio 2027: Datas, Sambódromo e Blocos',
  },
  metaDescription: {
    en: 'The complete guide to Rio Carnival 2027 (Feb 5–10): Sambadrome parade tickets, the best street blocos, camarote VIP boxes, costumes and insider tips.',
    pt: 'O guia completo do Carnaval do Rio 2027 (5 a 10 de fev): ingressos do Sambódromo, os melhores blocos de rua, camarotes VIP, fantasias e dicas.',
  },
  lede: {
    en: 'The greatest show on Earth — two million people, glitter, and non-stop samba.',
    pt: 'O maior espetáculo da Terra — dois milhões de pessoas, glitter e samba sem parar.',
  },
  intro: [
    {
      en: 'For five days and nights, Rio surrenders completely to Carnival. There are two parties happening at once: the breathtaking, ticketed parade of the samba schools inside the Sambadrome, and the free, anarchic, joyful chaos of the street blocos that take over every neighborhood. You can do one, the other, or — if you can survive it — both.',
      pt: 'Por cinco dias e noites, o Rio se entrega ao Carnaval. São duas festas ao mesmo tempo: o desfile deslumbrante das escolas de samba no Sambódromo, com ingresso, e o caos livre, alegre e contagiante dos blocos de rua que tomam cada bairro. Você pode fazer um, o outro ou — se aguentar — os dois.',
    },
    {
      en: 'Carnival 2027 runs from Friday, February 5 to Ash Wednesday, February 10, with the Special Group samba schools parading at the Sambadrome on the nights of Sunday Feb 7 and Monday Feb 8. Book accommodation months ahead — the city sells out.',
      pt: 'O Carnaval 2027 vai de sexta-feira, 5 de fevereiro, à Quarta-feira de Cinzas, 10 de fevereiro, com os desfiles do Grupo Especial no Sambódromo nas noites de domingo (7/2) e segunda (8/2). Reserve hospedagem com meses de antecedência — a cidade lota.',
    },
  ],
  hero: '/img/carnaval.svg',
  keywords: [
    'rio carnival 2027 dates',
    'sambadrome tickets',
    'rio carnival blocos',
    'carnaval rio 2027',
    'sambódromo ingressos',
    'blocos de rua rio',
    'camarote sapucaí',
  ],
  sections: [
    {
      id: 'sambadrome',
      title: { en: 'The Sambadrome parade', pt: 'O desfile no Sambódromo' },
      intro: {
        en: 'The Sambódromo Marquês de Sapucaí is a 700m-long parade avenue designed by Oscar Niemeyer. Each samba school gets ~70–80 minutes to pass with thousands of dancers, drummers and gigantic floats, judged on a fierce competition.',
        pt: 'O Sambódromo Marquês de Sapucaí é uma avenida de desfile de 700m projetada por Oscar Niemeyer. Cada escola tem ~70–80 minutos para passar com milhares de passistas, ritmistas e carros alegóricos gigantes, numa competição acirrada.',
      },
      items: [
        {
          name: 'Grandstands (Arquibancadas)',
          blurb: {
            en: 'Concrete bleacher seating — the classic, affordable way to experience the parade. Sectors are numbered; higher numbers are cheaper.',
            pt: 'Arquibancadas de concreto — o jeito clássico e mais acessível de viver o desfile. Os setores são numerados; números maiores são mais baratos.',
          },
          price: 'mid',
          tip: {
            en: 'Sectors 7, 9 and 11 sit near the judges and the best energy. Even-numbered sectors face the afternoon sun side. Bring water and wear comfy shoes — you’ll be there for hours.',
            pt: 'Os setores 7, 9 e 11 ficam perto dos jurados e da melhor energia. Setores pares pegam o lado do sol. Leve água e calçado confortável — você fica horas ali.',
          },
        },
        {
          name: 'Frisas',
          blurb: {
            en: 'Open box seats at ground level, right at the edge of the avenue. Closest you can get to the dancers without parading yourself.',
            pt: 'Camarotes abertos no nível da pista, na beirada da avenida. O mais perto que você chega dos passistas sem desfilar.',
          },
          price: 'high',
        },
        {
          name: 'Camarotes (VIP boxes)',
          blurb: {
            en: 'Premium hospitality boxes with open bar, food, AC and celebrities. Camarote prices run high and often include after-parties. The most exclusive way to watch.',
            pt: 'Camarotes premium com open bar, comida, ar-condicionado e celebridades. Os preços são altos e costumam incluir festas pós-desfile. A forma mais exclusiva de assistir.',
          },
          price: 'luxury',
          tip: {
            en: 'Camarotes like Allegria and the official Camarote da Sapucaí sell packages including a costume and a hostess. Book through official channels only.',
            pt: 'Camarotes como Allegria e o oficial Camarote da Sapucaí vendem pacotes com fantasia e recepcionista. Compre só por canais oficiais.',
          },
        },
        {
          name: 'Parade with a school (Desfilar)',
          blurb: {
            en: 'Yes — tourists can buy a costume (fantasia) and parade inside a samba school. It’s the experience of a lifetime: you’re part of the show, not the audience.',
            pt: 'Sim — turistas podem comprar uma fantasia e desfilar dentro de uma escola de samba. É a experiência de uma vida: você faz parte do show, não da plateia.',
          },
          price: 'high',
          tip: {
            en: 'Costumes go on sale months ahead via each school’s store. You just need to learn the samba-enredo and keep moving — no dance skills required.',
            pt: 'As fantasias são vendidas com meses de antecedência nas lojas das escolas. Basta aprender o samba-enredo e não parar de andar — não precisa saber dançar.',
          },
        },
      ],
    },
    {
      id: 'blocos',
      title: { en: 'Street blocos (free!)', pt: 'Blocos de rua (de graça!)' },
      intro: {
        en: 'Blocos are roving street parties with a band, a crowd in costume and a lot of beer. Hundreds happen across the city, from sunrise gatherings to massive afternoon marches. They’re free, democratic and the true soul of Carnival.',
        pt: 'Blocos são festas de rua itinerantes com banda, multidão fantasiada e muita cerveja. Centenas acontecem pela cidade, de encontros ao amanhecer a marchas gigantes à tarde. São gratuitos, democráticos e a verdadeira alma do Carnaval.',
      },
      items: [
        {
          name: 'Cordão do Bola Preta',
          area: 'Centro',
          blurb: {
            en: 'The oldest and biggest bloco, founded 1918. Over a million people flood downtown on Carnival Saturday. Iconic, chaotic, unmissable.',
            pt: 'O bloco mais antigo e maior, fundado em 1918. Mais de um milhão de pessoas tomam o Centro no sábado de Carnaval. Icônico, caótico, imperdível.',
          },
        },
        {
          name: 'Monobloco',
          area: 'Centro',
          blurb: {
            en: 'Closes Carnival with a roar — a brilliant brass-and-percussion band that turns samba, funk and pop into one giant singalong.',
            pt: 'Fecha o Carnaval com tudo — uma banda genial de metais e percussão que transforma samba, funk e pop num karaokê gigante.',
          },
        },
        {
          name: 'Sargento Pimenta',
          area: 'Aterro do Flamengo',
          blurb: {
            en: 'The Beatles played as samba. A joyful, family-friendly bloco that fills the park by Flamengo beach.',
            pt: 'Os Beatles em ritmo de samba. Um bloco alegre e família que lota o aterro perto da praia do Flamengo.',
          },
        },
        {
          name: 'Céu na Terra / Carmelitas',
          area: 'Santa Teresa',
          blurb: {
            en: 'Bohemian blocos winding through the cobbled hills of Santa Teresa — costumes, brass bands and the best views.',
            pt: 'Blocos boêmios que sobem as ladeiras de paralelepípedo de Santa Teresa — fantasias, charangas e as melhores vistas.',
          },
        },
        {
          name: 'Simpatia é Quase Amor',
          area: 'Ipanema',
          blurb: {
            en: 'Ipanema’s beloved bloco, marching along the beachfront with a classic samba sound and a flirtatious spirit.',
            pt: 'O bloco querido de Ipanema, que desfila na orla com samba clássico e clima de paquera.',
          },
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'When is Rio Carnival 2027?', pt: 'Quando é o Carnaval do Rio 2027?' },
      a: {
        en: 'Carnival 2027 runs Friday February 5 to Ash Wednesday February 10, 2027. The Special Group samba schools parade at the Sambadrome on Sunday Feb 7 and Monday Feb 8; the Champions’ Parade follows the next Saturday.',
        pt: 'O Carnaval 2027 vai de sexta, 5 de fevereiro, à Quarta-feira de Cinzas, 10 de fevereiro de 2027. O Grupo Especial desfila no Sambódromo no domingo (7/2) e na segunda (8/2); o Desfile das Campeãs acontece no sábado seguinte.',
      },
    },
    {
      q: { en: 'Do I need to pay for Carnival?', pt: 'Preciso pagar para curtir o Carnaval?' },
      a: {
        en: 'No. The street blocos are completely free. You only pay if you want to attend the Sambadrome parade (tickets) or buy into a VIP camarote. Many travelers do both.',
        pt: 'Não. Os blocos de rua são totalmente gratuitos. Você só paga se quiser assistir ao desfile no Sambódromo (ingresso) ou entrar num camarote VIP. Muitos viajantes fazem os dois.',
      },
    },
    {
      q: { en: 'Where do I buy Sambadrome tickets safely?', pt: 'Onde comprar ingressos do Sambódromo com segurança?' },
      a: {
        en: 'Buy only through official channels (LIESA, the league of samba schools, and authorized sellers). Avoid street touts. Grandstand tickets are the best value; camarotes are premium hospitality.',
        pt: 'Compre apenas por canais oficiais (LIESA, a liga das escolas de samba, e vendedores autorizados). Evite cambistas. Arquibancada tem o melhor custo-benefício; camarotes são experiência premium.',
      },
    },
    {
      q: { en: 'Is Carnival safe?', pt: 'O Carnaval é seguro?' },
      a: {
        en: 'It’s a joyful, well-policed party, but pickpocketing thrives in big crowds. Carry only a phone and some cash in a front pocket or a secure pouch, leave valuables in your hotel, and stay with your group. See our safety guide.',
        pt: 'É uma festa alegre e policiada, mas furtos acontecem nas multidões. Leve só o celular e um pouco de dinheiro no bolso da frente ou numa pochete, deixe valores no hotel e fique com seu grupo. Veja nosso guia de segurança.',
      },
    },
  ],
  related: ['reveillon', 'nightlife', 'safety'],
};
