import type { Guide } from '../types';

export const gettingHere: Guide = {
  slug: 'getting-here',
  group: 'plan',
  icon: '✈️',
  nav: { en: 'How to get here', pt: 'Como chegar' },
  title: { en: 'How to get to Rio de Janeiro', pt: 'Como chegar ao Rio de Janeiro' },
  metaTitle: {
    en: 'How to Get to Rio: Airports, Visas & Airport Transfers',
    pt: 'Como chegar ao Rio: aeroportos, vistos e transfers',
  },
  metaDescription: {
    en: 'Getting to Rio de Janeiro: the two airports (GIG & SDU), the new visa rules for US/Canada/Australia, and the best ways to transfer from the airport to your hotel.',
    pt: 'Como chegar ao Rio: os dois aeroportos (GIG e SDU), as novas regras de visto para EUA/Canadá/Austrália e as melhores formas de transfer do aeroporto ao hotel.',
  },
  lede: {
    en: 'Two airports, one new visa rule, and the smartest way from the runway to the beach.',
    pt: 'Dois aeroportos, uma nova regra de visto e o jeito mais esperto de ir da pista à praia.',
  },
  intro: [
    {
      en: 'Rio has two airports. International flights land at Galeão (GIG), about 20km north of the beaches; domestic shuttles use the central Santos Dumont (SDU), right on the downtown waterfront. From GIG, a ride-hailing app or pre-booked transfer gets you to the Zona Sul in 30–60 minutes.',
      pt: 'O Rio tem dois aeroportos. Voos internacionais chegam ao Galeão (GIG), cerca de 20km ao norte das praias; as pontes-aéreas domésticas usam o Santos Dumont (SDU), no centro à beira-mar. Do GIG, um app de transporte ou transfer reservado leva você à Zona Sul em 30–60 minutos.',
    },
  ],
  hero: '/img/getting-here.svg',
  keywords: [
    'how to get to rio de janeiro',
    'galeao airport transfer',
    'brazil visa for us citizens',
    'rio airport to copacabana',
    'como chegar ao rio',
    'transfer aeroporto rio',
  ],
  sections: [
    {
      id: 'visa',
      title: { en: 'Do you need a visa?', pt: 'Você precisa de visto?' },
      intro: {
        en: 'Important 2025 change: Brazil reinstated tourist visas for some nationalities. Always confirm your status on the official Brazilian government portal before booking.',
        pt: 'Mudança importante de 2025: o Brasil voltou a exigir visto de turismo para algumas nacionalidades. Confirme sempre seu caso no portal oficial do governo antes de reservar.',
      },
      items: [
        {
          name: 'US, Canada & Australia',
          blurb: {
            en: 'Now require an eVisa (since April 2025), ~US$80.90, applied for online. Processing is usually a few days; the US visa is multiple-entry and valid 10 years (90 days per stay). Apply only on the official VFS portal.',
            pt: 'Agora exigem eVisa (desde abril de 2025), ~US$80,90, solicitado online. O processamento costuma levar alguns dias; o visto dos EUA é de múltiplas entradas, válido por 10 anos (90 dias por estada). Solicite apenas no portal oficial VFS.',
          },
          tags: ['visa required'],
        },
        {
          name: 'EU, UK & many others',
          blurb: {
            en: 'Visa-exempt for short tourist stays (typically up to 90 days). Carry a passport valid for your trip and an onward ticket.',
            pt: 'Isentos de visto para estadas curtas de turismo (em geral até 90 dias). Leve passaporte válido para a viagem e passagem de saída.',
          },
          tags: ['visa-free'],
        },
        {
          name: 'Yellow fever',
          blurb: {
            en: 'The yellow fever vaccine is recommended for Rio de Janeiro state, including the city and coastal islands. Get it at least 10 days before travel; some onward countries require proof.',
            pt: 'A vacina contra febre amarela é recomendada para o estado do Rio, incluindo a cidade e as ilhas. Tome ao menos 10 dias antes da viagem; alguns países exigem comprovante na saída.',
          },
          tags: ['health'],
        },
      ],
    },
    {
      id: 'airports',
      title: { en: 'The two airports', pt: 'Os dois aeroportos' },
      items: [
        {
          name: 'Galeão / Tom Jobim (GIG)',
          area: 'Ilha do Governador',
          blurb: {
            en: 'The international gateway, ~20km from the Zona Sul. All long-haul flights from the US, Europe and Latin America land here.',
            pt: 'O portão internacional, a ~20km da Zona Sul. Todos os voos de longa distância de EUA, Europa e América Latina chegam aqui.',
          },
          tip: {
            en: 'Budget 45–90 minutes to your hotel depending on traffic. Use the official ride-app pickup point.',
            pt: 'Conte 45–90 minutos até o hotel, dependendo do trânsito. Use o ponto oficial de embarque dos apps.',
          },
        },
        {
          name: 'Santos Dumont (SDU)',
          area: 'Centro',
          blurb: {
            en: 'Domestic only, on the downtown waterfront — wonderfully central. Used for shuttles to São Paulo, Belo Horizonte and Brasília.',
            pt: 'Só voos domésticos, no centro à beira-mar — superbem localizado. Usado para pontes-aéreas a São Paulo, Belo Horizonte e Brasília.',
          },
        },
      ],
    },
    {
      id: 'transfer',
      title: { en: 'Airport to your hotel', pt: 'Do aeroporto ao hotel' },
      items: [
        {
          name: 'Uber / 99 (ride apps)',
          blurb: {
            en: 'The recommended option — roughly R$80–130 from GIG to Copacabana/Ipanema, with no haggling. Request from the designated airport pickup area.',
            pt: 'A opção recomendada — cerca de R$80–130 do GIG a Copacabana/Ipanema, sem pechincha. Solicite na área designada de embarque do aeroporto.',
          },
          price: 'mid',
        },
        {
          name: 'Private transfer / chauffeur',
          blurb: {
            en: 'Pre-booked meet-and-greet in a sedan or SUV (~R$180–250, more for luxury Mercedes/Audi). The smoothest arrival after a long flight; tolls and waiting usually included.',
            pt: 'Transfer reservado com recepção, em sedã ou SUV (~R$180–250, mais para Mercedes/Audi de luxo). A chegada mais tranquila após um voo longo; pedágios e espera geralmente inclusos.',
          },
          price: 'high',
        },
        {
          name: 'Official taxi',
          blurb: {
            en: 'Licensed airport taxis run ~R$150–200 plus tolls. Pay at the official desk to avoid surprises.',
            pt: 'Os táxis oficiais do aeroporto custam ~R$150–200 mais pedágios. Pague no balcão oficial para evitar surpresas.',
          },
          price: 'mid',
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'Do US citizens need a visa for Rio in 2026?', pt: 'Americanos precisam de visto para o Rio em 2026?' },
      a: {
        en: 'Yes. Since April 2025, US, Canadian and Australian citizens need a Brazilian eVisa (~US$80.90), applied for online at the official VFS portal a few days before travel. EU and UK travelers are visa-exempt for tourism. Always verify the current rule before booking.',
        pt: 'Sim. Desde abril de 2025, cidadãos dos EUA, Canadá e Austrália precisam de eVisa brasileiro (~US$80,90), solicitado online no portal oficial VFS alguns dias antes da viagem. Europeus e britânicos são isentos para turismo. Confirme sempre a regra atual antes de reservar.',
      },
    },
    {
      q: { en: 'Which airport should I fly into?', pt: 'Em qual aeroporto devo chegar?' },
      a: {
        en: 'From abroad you’ll arrive at Galeão (GIG). If you’re connecting from elsewhere in Brazil, the central Santos Dumont (SDU) is far more convenient for the Zona Sul.',
        pt: 'Vindo do exterior você chega no Galeão (GIG). Se estiver conectando de outro ponto do Brasil, o Santos Dumont (SDU), no centro, é bem mais prático para a Zona Sul.',
      },
    },
  ],
  related: ['transport', 'safety', 'best-time'],
};
