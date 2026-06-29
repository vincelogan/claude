import type { Guide } from './types';
import { carnaval } from './guides/carnaval';
import { reveillon } from './guides/reveillon';
import { nightlife } from './guides/nightlife';
import { sightseeing } from './guides/sightseeing';
import { thingsToDo } from './guides/things-to-do';
import { stay } from './guides/stay';
import { eat } from './guides/eat';
import { vip } from './guides/vip';
import { safety } from './guides/safety';
import { gettingHere } from './guides/getting-here';
import { transport } from './guides/transport';
import { bestTime } from './guides/best-time';

// Order matters — this drives navigation and the homepage grids.
export const EXPERIENCE_GUIDES: Guide[] = [
  sightseeing,
  thingsToDo,
  carnaval,
  reveillon,
  nightlife,
  stay,
  eat,
  vip,
];

export const PLAN_GUIDES: Guide[] = [safety, gettingHere, transport, bestTime];

export const GUIDES: Guide[] = [...EXPERIENCE_GUIDES, ...PLAN_GUIDES];

const BY_SLUG = new Map(GUIDES.map((g) => [g.slug, g]));

export function getGuide(slug: string): Guide | undefined {
  return BY_SLUG.get(slug);
}

export function allSlugs(): string[] {
  return GUIDES.map((g) => g.slug);
}

export function relatedGuides(guide: Guide): Guide[] {
  return (guide.related ?? [])
    .map((slug) => BY_SLUG.get(slug))
    .filter((g): g is Guide => Boolean(g));
}

export type { Guide };
