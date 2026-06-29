import type { Localized } from './i18n';

// Mega-menu structure. Kept light (no heavy content imports) so it can be used
// in the client Header. Slugs match the route segments (Portuguese).

export interface NavItem {
  href: string; // path after locale, no leading slash
  label: Localized;
}

export interface NavGroup {
  id: string;
  label: Localized;
  /** Landing page for the whole group (header link target) */
  href: string;
  columns: { heading?: Localized; items: NavItem[] }[];
}

export const NAV: NavGroup[] = [
  {
    id: 'eventos',
    label: { pt: 'Eventos', en: 'Events' },
    href: 'carnaval',
    columns: [
      {
        items: [
          { href: 'carnaval', label: { pt: 'Carnaval 2027', en: 'Carnival 2027' } },
          { href: 'reveillon', label: { pt: 'Réveillon', en: 'New Year’s Eve' } },
        ],
      },
    ],
  },
  {
    id: 'onde-ficar',
    label: { pt: 'Onde ficar', en: 'Where to stay' },
    href: 'onde-ficar',
    columns: [
      {
        heading: { pt: 'Por bairro', en: 'By neighborhood' },
        items: [
          { href: 'onde-ficar/ipanema', label: { pt: 'Ipanema', en: 'Ipanema' } },
          { href: 'onde-ficar/leblon', label: { pt: 'Leblon', en: 'Leblon' } },
          { href: 'onde-ficar/copacabana', label: { pt: 'Copacabana', en: 'Copacabana' } },
          { href: 'onde-ficar/botafogo', label: { pt: 'Botafogo', en: 'Botafogo' } },
          { href: 'onde-ficar/santa-teresa', label: { pt: 'Santa Teresa', en: 'Santa Teresa' } },
          { href: 'onde-ficar/barra-da-tijuca', label: { pt: 'Barra da Tijuca', en: 'Barra da Tijuca' } },
        ],
      },
    ],
  },
  {
    id: 'o-que-fazer',
    label: { pt: 'O que fazer', en: 'Things to do' },
    href: 'o-que-fazer',
    columns: [
      {
        heading: { pt: 'Ícones & natureza', en: 'Icons & nature' },
        items: [
          { href: 'o-que-fazer/cristo-redentor', label: { pt: 'Cristo Redentor', en: 'Christ the Redeemer' } },
          { href: 'o-que-fazer/pao-de-acucar', label: { pt: 'Pão de Açúcar', en: 'Sugarloaf' } },
          { href: 'o-que-fazer/praias-zona-sul', label: { pt: 'Praias da Zona Sul', en: 'South Zone beaches' } },
          { href: 'o-que-fazer/floresta-da-tijuca', label: { pt: 'Floresta da Tijuca', en: 'Tijuca Forest' } },
        ],
      },
      {
        heading: { pt: 'Cultura & noite', en: 'Culture & night' },
        items: [
          { href: 'o-que-fazer/escadaria-selaron', label: { pt: 'Escadaria Selarón', en: 'Selarón Steps' } },
          { href: 'o-que-fazer/maracana', label: { pt: 'Maracanã', en: 'Maracanã' } },
          { href: 'o-que-fazer/pedra-do-sal', label: { pt: 'Pedra do Sal (samba)', en: 'Pedra do Sal (samba)' } },
          { href: 'o-que-fazer/jardim-botanico-parque-lage', label: { pt: 'Jardim Botânico', en: 'Botanical Garden' } },
        ],
      },
    ],
  },
  {
    id: 'onde-comer',
    label: { pt: 'Onde comer', en: 'Where to eat' },
    href: 'onde-comer',
    columns: [
      {
        items: [
          { href: 'onde-comer#alta-gastronomia', label: { pt: 'Alta gastronomia', en: 'Fine dining' } },
          { href: 'onde-comer#classicos', label: { pt: 'Botecos & clássicos', en: 'Botecos & classics' } },
          { href: 'onde-comer#pratos', label: { pt: 'Pratos cariocas', en: 'Carioca dishes' } },
        ],
      },
    ],
  },
  {
    id: 'vip',
    label: { pt: 'VIP', en: 'VIP' },
    href: 'vip',
    columns: [
      {
        items: [
          { href: 'vip#atracoes-vip', label: { pt: 'Atrações VIP', en: 'VIP attractions' } },
          { href: 'vip#transporte-vip', label: { pt: 'Transporte VIP', en: 'VIP transport' } },
          { href: 'vip', label: { pt: 'Concierge', en: 'Concierge' } },
        ],
      },
    ],
  },
  {
    id: 'planejar',
    label: { pt: 'Planejar', en: 'Plan' },
    href: 'planejar',
    columns: [
      {
        items: [
          { href: 'planejar#seguranca', label: { pt: 'É seguro?', en: 'Is it safe?' } },
          { href: 'planejar#como-chegar', label: { pt: 'Como chegar', en: 'How to get here' } },
          { href: 'planejar#locomocao', label: { pt: 'Como circular', en: 'Getting around' } },
          { href: 'planejar#dinheiro-epoca', label: { pt: 'Dinheiro & época', en: 'Money & timing' } },
        ],
      },
    ],
  },
];
