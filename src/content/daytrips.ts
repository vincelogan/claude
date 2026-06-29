import type { Localized } from '@/lib/i18n';
import type { Photo } from './types';

export interface DayTrip {
  slug: string;
  name: string;
  distance: Localized;
  time: Localized;
  blurb: Localized;
  hero: string;
  photo?: Photo;
}

export const DAYTRIPS: DayTrip[] = [
  {
    slug: 'buzios',
    name: 'Búzios',
    photo: { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Praia_Brava_em_Arma%C3%A7%C3%A3o_dos_B%C3%BAzios_Rio_de_Janeiro.jpg?width=1600', credit: 'Wikimedia Commons', license: 'CC BY-SA 4.0' },
    distance: { pt: '~170 km a leste', en: '~170 km east' },
    time: { pt: '~2,5–3h de carro', en: '~2.5–3h by car' },
    blurb: {
      pt: 'Uma península chique de praias pequenas e uma orla de boutiques. Vale mais como pernoite que bate-volta — combine com um passeio de barco pelas enseadas.',
      en: 'A chic peninsula of small beaches and a boutique-lined waterfront. Better as an overnight than a day trip — pair it with a boat outing to the coves.',
    },
    hero: '/img/sightseeing.svg',
  },
  {
    slug: 'petropolis',
    name: 'Petrópolis',
    photo: { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Museu_Imperial,_Petr%C3%B3polis_RJ.jpg?width=1600', credit: 'Wikimedia Commons', license: 'CC BY-SA 4.0' },
    distance: { pt: '~65 km ao norte', en: '~65 km north' },
    time: { pt: '~1,5h de carro', en: '~1.5h by car' },
    blurb: {
      pt: 'A cidade imperial de veraneio nas montanhas, com o Museu Imperial e arquitetura de influência alemã. Bate-volta fácil, com clima fresco e ótimo para fugir do calor.',
      en: 'The former imperial summer city in the mountains, with the Imperial Museum and German-influenced architecture. An easy day trip, cool and a welcome break from the heat.',
    },
    hero: '/img/things-to-do.svg',
  },
  {
    slug: 'paraty',
    name: 'Paraty',
    photo: { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Historic_Centre_of_Paraty.jpg?width=1600', credit: 'Wikimedia Commons', license: 'CC BY-SA 4.0' },
    distance: { pt: '~250 km a oeste', en: '~250 km west' },
    time: { pt: '~4–4,5h de carro', en: '~4–4.5h by car' },
    blurb: {
      pt: 'Um porto colonial preservado, de ruas de pedra e casario branco, cercado de ilhas e cachoeiras. Pela distância, vá de pernoite e some um passeio de escuna.',
      en: 'A preserved colonial port of cobbled streets and whitewashed houses, fringed by islands and waterfalls. The distance makes it an overnight; add a schooner trip.',
    },
    hero: '/img/nightlife.svg',
  },
  {
    slug: 'ilha-grande',
    name: 'Ilha Grande',
    photo: { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Praia_de_Lopes_Mendes_-_Ilha_Grande_-_RJ.jpg?width=1600', credit: 'Wikimedia Commons', license: 'CC BY-SA 4.0' },
    distance: { pt: '~150 km a oeste + barco', en: '~150 km west + boat' },
    time: { pt: '~2,5h + travessia', en: '~2.5h + crossing' },
    blurb: {
      pt: 'Uma ilha sem carros, de trilhas na mata e praias de água cristalina, alcançada de barco. Planeje um pernoite; tudo se faz a pé ou de barco.',
      en: 'A car-free island of forested trails and clear-water beaches, reached by boat. Plan an overnight; getting around is on foot or by boat.',
    },
    hero: '/img/things-to-do.svg',
  },
  {
    slug: 'niteroi',
    name: 'Niterói',
    photo: { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Museu_de_Arte_Contempor%C3%A2nea_de_Niter%C3%B3i_-_MAC_02.jpg?width=1600', credit: 'Wikimedia Commons', license: 'CC BY-SA 4.0' },
    distance: { pt: '~15 km, cruzando a baía', en: '~15 km across the bay' },
    time: { pt: '~30 min de barca', en: '~30 min by ferry' },
    blurb: {
      pt: 'Do outro lado da Baía de Guanabara, une o museu de arte contemporânea de Niemeyer a praias e às melhores vistas de volta para o Rio. Bate-volta fácil de meio dia.',
      en: 'Across Guanabara Bay, it pairs Niemeyer’s contemporary art museum with ocean beaches and the best views back toward Rio. An easy half-day trip.',
    },
    hero: '/img/sightseeing.svg',
  },
  {
    slug: 'arraial-do-cabo',
    name: 'Arraial do Cabo',
    photo: { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Praia_do_Farol_em_Arraial_do_Cabo,_RJ.jpg?width=1600', credit: 'Wikimedia Commons', license: 'CC BY-SA 4.0' },
    distance: { pt: '~150 km a leste', en: '~150 km east' },
    time: { pt: '~2,5–3h de carro', en: '~2.5–3h by car' },
    blurb: {
      pt: 'Conhecida pela água cristalina e turquesa e pelos costões dramáticos — o “Caribe brasileiro”. As praias-cartão são de barco; vá num dia de mar calmo.',
      en: 'Known for unusually clear, turquoise water and dramatic headlands — Brazil’s answer to the Caribbean. The signature beaches are reached by boat; go on a calm day.',
    },
    hero: '/img/sightseeing.svg',
  },
  {
    slug: 'angra-dos-reis',
    name: 'Angra dos Reis',
    photo: { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ba%C3%ADa_de_Angra_dos_Reis.jpg?width=1600', credit: 'Wikimedia Commons', license: 'CC BY-SA 4.0' },
    distance: { pt: '~150 km a oeste', en: '~150 km west' },
    time: { pt: '~2,5–3h de carro', en: '~2.5–3h by car' },
    blurb: {
      pt: 'A porta de entrada de uma baía com centenas de ilhas e enseadas, explorada de barco. A cidade é só o ponto de partida; frete uma embarcação para o dia.',
      en: 'The gateway to a bay scattered with hundreds of islands and anchorages, best explored by boat. The town is just a jumping-off point; charter a vessel for the day.',
    },
    hero: '/img/things-to-do.svg',
  },
  {
    slug: 'regiao-serrana',
    name: 'Região Serrana (Itaipava & Teresópolis)',
    photo: { url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dedo_de_Deus_Serra_dos_%C3%93rg%C3%A3os_06.jpg?width=1600', credit: 'Wikimedia Commons', license: 'CC BY-SA 4.0' },
    distance: { pt: '~90–100 km ao norte', en: '~90–100 km north' },
    time: { pt: '~1,5–2h de carro', en: '~1.5–2h by car' },
    blurb: {
      pt: 'O cinturão de montanhas em torno de Itaipava e Teresópolis, com ar fresco, gastronomia de interior e os picos da Serra dos Órgãos. Um dia de cenário e bons almoços.',
      en: 'The cool mountain belt around Itaipava and Teresópolis, with crisp air, country dining and the peaks of the Serra dos Órgãos. A day of scenery and long lunches.',
    },
    hero: '/img/things-to-do.svg',
  },
];
