import type { Guide } from '../types';

export const safety: Guide = {
  slug: 'safety',
  group: 'plan',
  icon: '🛡️',
  nav: { en: 'Is Rio safe?', pt: 'O Rio é seguro?' },
  title: { en: 'Is Rio de Janeiro safe?', pt: 'O Rio de Janeiro é seguro?' },
  metaTitle: {
    en: 'Is Rio de Janeiro Safe? 2026 Honest Travel Safety Guide',
    pt: 'O Rio de Janeiro é seguro? Guia honesto de segurança 2026',
  },
  metaDescription: {
    en: 'An honest 2026 safety guide for Rio de Janeiro: which neighborhoods are safe, common scams, beach and night tips, emergency numbers and the tourist police.',
    pt: 'Um guia honesto de segurança do Rio em 2026: bairros seguros, golpes comuns, dicas de praia e noite, telefones de emergência e a delegacia do turista.',
  },
  lede: {
    en: 'The honest answer: yes — with street smarts. Here’s exactly how to stay safe.',
    pt: 'A resposta honesta: sim — com esperteza. Veja exatamente como ficar seguro.',
  },
  intro: [
    {
      en: 'Rio is safe for the millions of tourists who visit each year, provided you use common sense. Almost all serious crime is concentrated in favelas and the periphery, far from the tourist zones. For visitors, the realistic everyday risk is petty theft — phone snatching, beach theft, pickpocketing. Manage that, and you’ll have the time of your life.',
      pt: 'O Rio é seguro para os milhões de turistas que o visitam todo ano, desde que você use o bom senso. Quase todo crime grave se concentra em favelas e na periferia, longe das zonas turísticas. Para o visitante, o risco real do dia a dia é o furto — celular, praia, batedor de carteira. Controle isso e você vai aproveitar muito.',
    },
    {
      en: 'The golden rule cariocas live by: don’t give “sopa” (an easy target). Dress down, keep valuables out of sight, and don’t walk around glued to an expensive phone.',
      pt: 'A regra de ouro do carioca: não dê “sopa” (não seja alvo fácil). Vista-se discretamente, mantenha valores fora de vista e não ande grudado num celular caro.',
    },
  ],
  hero: '/img/safety.svg',
  keywords: [
    'is rio de janeiro safe',
    'rio safety tips',
    'safe neighborhoods rio',
    'rio scams tourists',
    'o rio é seguro',
    'dicas de segurança rio',
  ],
  sections: [
    {
      id: 'neighborhoods',
      title: { en: 'Safe areas vs. areas to avoid', pt: 'Áreas seguras x áreas a evitar' },
      intro: {
        en: 'Stick to the Zona Sul (South Zone) and main tourist areas and you’ll be in the safest, most patrolled parts of the city.',
        pt: 'Fique na Zona Sul e nas áreas turísticas principais — as partes mais seguras e policiadas da cidade.',
      },
      items: [
        {
          name: 'Ipanema & Leblon',
          area: 'Zona Sul',
          blurb: {
            en: 'The most affluent and safest tourist neighborhoods, with strong police presence day and night.',
            pt: 'Os bairros turísticos mais nobres e seguros, com forte presença policial dia e noite.',
          },
          tags: ['safe'],
        },
        {
          name: 'Copacabana',
          area: 'Zona Sul',
          blurb: {
            en: 'Lively and heavily policed. Stay on the main beachfront (Av. Atlântica) and lit streets; be more alert on quiet side streets late at night.',
            pt: 'Animada e muito policiada. Fique na orla principal (Av. Atlântica) e em ruas iluminadas; redobre a atenção em ruas vazias de madrugada.',
          },
          tags: ['safe'],
        },
        {
          name: 'Botafogo, Flamengo, Urca',
          area: 'Zona Sul',
          blurb: {
            en: 'Residential and increasingly popular, generally safe by day and evening. Urca (under Sugarloaf) is one of the calmest pockets in the city.',
            pt: 'Residenciais e cada vez mais procurados, seguros de dia e à noite. A Urca (sob o Pão de Açúcar) é um dos cantos mais tranquilos da cidade.',
          },
          tags: ['safe'],
        },
        {
          name: 'Lapa & Santa Teresa',
          area: 'Centro',
          blurb: {
            en: 'Great by day and lively at night with crowds — but use ride apps to arrive and leave, and avoid empty side streets and dark stairways after dark.',
            pt: 'Ótimos de dia e animados à noite com gente — mas use apps para chegar e sair, e evite ruas vazias e escadarias escuras depois do anoitecer.',
          },
          tags: ['caution'],
        },
        {
          name: 'Favelas',
          area: 'Citywide',
          blurb: {
            en: 'Do not enter favelas, including on “favela tours.” Sporadic armed conflict makes them unsafe and unpredictable for visitors.',
            pt: 'Não entre em favelas, nem em “tours de favela”. Conflitos armados esporádicos as tornam imprevisíveis e inseguras para visitantes.',
          },
          tags: ['avoid'],
        },
        {
          name: 'Centro after hours',
          area: 'Downtown',
          blurb: {
            en: 'Downtown empties out at night, on weekends and holidays, and becomes risky. Visit its sights by day.',
            pt: 'O Centro esvazia à noite, fins de semana e feriados, e fica arriscado. Visite seus pontos turísticos de dia.',
          },
          tags: ['avoid'],
        },
      ],
    },
    {
      id: 'scams',
      title: { en: 'Common scams & petty crime', pt: 'Golpes e furtos comuns' },
      items: [
        {
          name: 'Phone snatching',
          blurb: {
            en: 'The #1 tourist crime — grab-and-run, often by motorbike. Don’t walk while staring at your phone or hold it loosely near traffic.',
            pt: 'O crime nº 1 contra turistas — arrastão de celular, muitas vezes de moto. Não ande olhando o celular nem o segure de qualquer jeito perto do trânsito.',
          },
        },
        {
          name: 'Beach theft',
          blurb: {
            en: 'Bags and phones vanish while you swim. Take only minimal cash, a cheap towel and sandals; leave passport and cards in the hotel safe.',
            pt: 'Bolsas e celulares somem enquanto você nada. Leve só dinheiro trocado, uma canga simples e chinelo; deixe passaporte e cartões no cofre do hotel.',
          },
        },
        {
          name: 'Drink spiking ("Boa Noite Cinderela")',
          blurb: {
            en: 'Sedatives slipped into drinks, sometimes via dating-app meetups. Watch your drink and be cautious with strangers and online dates.',
            pt: 'Sedativos colocados em bebidas, às vezes em encontros de apps de namoro. Cuide da sua bebida e desconfie de estranhos e dates online.',
          },
        },
      ],
    },
  ],
  faqs: [
    {
      q: { en: 'What are the emergency numbers?', pt: 'Quais são os telefones de emergência?' },
      a: {
        en: 'Police 190, Ambulance (SAMU) 192, Fire/Rescue (Bombeiros) 193, City services 1746. The 24h Tourist Police (DEAT) in Leblon has English-speaking officers and files the police report you need for insurance: (21) 2332-2924.',
        pt: 'Polícia 190, Ambulância (SAMU) 192, Bombeiros 193, Serviços da cidade 1746. A Delegacia do Turista (DEAT) no Leblon funciona 24h, tem policiais que falam inglês e faz o boletim de ocorrência: (21) 2332-2924.',
      },
    },
    {
      q: { en: 'What should I do if I get robbed?', pt: 'O que fazer se eu for assaltado?' },
      a: {
        en: 'Don’t resist — hand over what’s asked. Carry a small “decoy” amount of cash for this. Afterward, file a report (Boletim de Ocorrência) at the tourist police (DEAT) for your insurance and consulate.',
        pt: 'Não resista — entregue o que for pedido. Tenha uma quantia pequena de “sacrifício” para isso. Depois, registre um Boletim de Ocorrência na delegacia do turista (DEAT) para o seguro e o consulado.',
      },
    },
    {
      q: { en: 'Is it safe to use the beaches and public transport?', pt: 'É seguro usar as praias e o transporte público?' },
      a: {
        en: 'Yes, with care. Beaches are safe by day (never at night). The metro is clean and safe; prefer Uber/99 over buses, especially at night. See our getting-around guide.',
        pt: 'Sim, com cuidado. As praias são seguras de dia (nunca à noite). O metrô é limpo e seguro; prefira Uber/99 a ônibus, sobretudo à noite. Veja nosso guia de transporte.',
      },
    },
  ],
  related: ['transport', 'getting-here', 'best-time'],
};
