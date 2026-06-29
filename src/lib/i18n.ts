import type { Locale } from './site';

export type Localized<T = string> = { pt: T; en: T };

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

// UI chrome strings. Page/content copy lives in src/content.
const DICT = {
  'nav.events': { pt: 'Eventos', en: 'Events' },
  'nav.stay': { pt: 'Onde ficar', en: 'Where to stay' },
  'nav.do': { pt: 'O que fazer', en: 'Things to do' },
  'nav.eat': { pt: 'Onde comer', en: 'Where to eat' },
  'nav.vip': { pt: 'VIP', en: 'VIP' },
  'nav.plan': { pt: 'Planejar', en: 'Plan' },
  'nav.about': { pt: 'Sobre', en: 'About' },
  'nav.menu': { pt: 'Menu', en: 'Menu' },
  'nav.close': { pt: 'Fechar', en: 'Close' },
  'nav.home': { pt: 'Início', en: 'Home' },

  'cta.concierge': { pt: 'Concierge VIP', en: 'VIP Concierge' },
  'cta.requestConcierge': { pt: 'Solicitar concierge', en: 'Request concierge' },
  'cta.explore': { pt: 'Explorar o Rio', en: 'Explore Rio' },
  'cta.plan': { pt: 'Planejar a viagem', en: 'Plan your trip' },
  'cta.more': { pt: 'Saiba mais', en: 'Learn more' },
  'cta.reserve': { pt: 'Reservar', en: 'Reserve' },
  'cta.viewAll': { pt: 'Ver todos', en: 'View all' },
  'cta.seeNeighborhoods': { pt: 'Ver todos os bairros', en: 'See all neighborhoods' },
  'cta.seeThingsToDo': { pt: 'Ver o que fazer', en: 'See things to do' },

  'home.essentialsEyebrow': { pt: 'Antes de tudo', en: 'Before anything' },
  'home.essentialsTitle': { pt: 'As respostas que você procura', en: 'The answers you’re looking for' },
  'home.eventsEyebrow': { pt: 'Agenda', en: 'What’s on' },
  'home.eventsTitle': { pt: 'Os dois maiores momentos do Rio', en: 'Rio’s two biggest moments' },
  'home.stayEyebrow': { pt: 'Onde ficar', en: 'Where to stay' },
  'home.stayTitle': { pt: 'Escolha o bairro certo', en: 'Choose the right neighborhood' },
  'home.stayLead': {
    pt: 'O bairro define sua viagem. Veja o melhor de cada um — com o trade-off honesto.',
    en: 'Your neighborhood shapes the whole trip. Here’s the best of each — with the honest trade-off.',
  },
  'home.doEyebrow': { pt: 'O que fazer', en: 'Things to do' },
  'home.doTitle': { pt: 'Os ícones e além', en: 'The icons and beyond' },
  'home.eatEyebrow': { pt: 'Onde comer', en: 'Where to eat' },
  'home.eatTitle': { pt: 'Do boteco à estrela Michelin', en: 'From corner bars to Michelin stars' },
  'home.vipEyebrow': { pt: 'Experiências VIP', en: 'VIP experiences' },
  'home.vipTitle': { pt: 'O Rio como poucos veem', en: 'Rio the way few people see it' },
  'home.vipLead': {
    pt: 'Helicóptero sobre o Cristo, iate na baía, guia privativo e camarote. Nós cuidamos de tudo.',
    en: 'Helicopter over Christ, a yacht on the bay, a private guide and a camarote. We handle it all.',
  },
  'home.faqEyebrow': { pt: 'Perguntas frequentes', en: 'Frequently asked' },
  'home.faqTitle': { pt: 'Tudo o que todo viajante pergunta', en: 'Everything every traveler asks' },
  'home.newsletterTitle': { pt: 'O melhor do Rio, no seu e-mail', en: 'The best of Rio, in your inbox' },
  'home.newsletterLead': {
    pt: 'Datas de eventos, novidades e dicas de quem conhece. Sem spam.',
    en: 'Event dates, news and insider tips. No spam.',
  },

  'label.bestFor': { pt: 'Ideal para', en: 'Best for' },
  'label.tradeoff': { pt: 'O trade-off honesto', en: 'The honest trade-off' },
  'label.tip': { pt: 'Dica de quem conhece', en: 'Insider tip' },
  'label.howToGet': { pt: 'Como chegar', en: 'How to get there' },
  'label.bestTime': { pt: 'Melhor horário', en: 'Best time' },
  'label.cost': { pt: 'Quanto custa', en: 'What it costs' },
  'label.highlights': { pt: 'Destaques', en: 'Highlights' },
  'label.onThisPage': { pt: 'Nesta página', en: 'On this page' },
  'label.faq': { pt: 'Perguntas frequentes', en: 'Frequently asked' },
  'label.area': { pt: 'Região', en: 'Area' },

  'countdown.days': { pt: 'dias', en: 'days' },
  'countdown.hours': { pt: 'h', en: 'h' },
  'countdown.minutes': { pt: 'min', en: 'min' },
  'countdown.seconds': { pt: 's', en: 's' },
  'countdown.live': { pt: 'Acontecendo agora', en: 'Happening now' },

  'price.budget': { pt: 'Econômico', en: 'Budget' },
  'price.mid': { pt: 'Intermediário', en: 'Mid-range' },
  'price.high': { pt: 'Sofisticado', en: 'Upscale' },
  'price.luxury': { pt: 'Luxo', en: 'Luxury' },

  'form.name': { pt: 'Nome', en: 'Name' },
  'form.email': { pt: 'E-mail', en: 'Email' },
  'form.dates': { pt: 'Datas da viagem', en: 'Travel dates' },
  'form.message': { pt: 'Como podemos ajudar?', en: 'How can we help?' },
  'form.send': { pt: 'Enviar pedido', en: 'Send request' },
  'form.sending': { pt: 'Enviando…', en: 'Sending…' },
  'form.sent': { pt: 'Pedido enviado! Retornamos em breve.', en: 'Request sent! We’ll be in touch shortly.' },
  'form.newsletterPlaceholder': { pt: 'seu@email.com', en: 'you@email.com' },
  'form.subscribe': { pt: 'Inscrever', en: 'Subscribe' },
  'form.subscribed': { pt: 'Inscrito! 🎉', en: 'Subscribed! 🎉' },

  'footer.explore': { pt: 'Explorar', en: 'Explore' },
  'footer.travel': { pt: 'Viagem', en: 'Travel' },
  'footer.premium': { pt: 'Premium', en: 'Premium' },
  'footer.about': { pt: 'Sobre', en: 'About' },
  'footer.curated': {
    pt: 'Curadoria independente. Atualizado em 2026.',
    en: 'Independent curation. Updated 2026.',
  },
  'footer.rights': { pt: 'Todos os direitos reservados.', en: 'All rights reserved.' },
  'footer.disclaimer': {
    pt: 'Guia independente. Preços, datas e detalhes mudam — confirme com fontes oficiais antes de reservar.',
    en: 'Independent guide. Prices, dates and details change — confirm with official sources before booking.',
  },
} as const;

export type MessageKey = keyof typeof DICT;

export function t(key: MessageKey, locale: Locale): string {
  return DICT[key][locale];
}
