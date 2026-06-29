import Link from 'next/link';
import Image from 'next/image';
import type { RioEvent, Neighborhood, Attraction, Item } from '@/content/types';
import { Countdown } from './Countdown';
import { t, pick } from '@/lib/i18n';
import { assetPath } from '@/lib/asset';
import type { Locale } from '@/lib/site';

const priceKey = { budget: 'price.budget', mid: 'price.mid', high: 'price.high', luxury: 'price.luxury' } as const;

export function EventCard({ event, locale }: { event: RioEvent; locale: Locale }) {
  return (
    <Link
      href={`/${locale}/${event.slug}`}
      className="card card-hover group block bg-mata text-white"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={assetPath(event.hero)}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover opacity-80 transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-mata via-mata/40 to-transparent" />
      </div>
      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-soft">{pick(event.dateLabel, locale)}</p>
        <h3 className="mt-1.5 font-display text-2xl font-semibold">{pick(event.name, locale)}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/70">{pick(event.lede, locale)}</p>
        <div className="mt-4">
          <Countdown to={event.countdownTo} locale={locale} light />
        </div>
        <span className="mt-5 inline-block text-sm font-semibold text-amber-soft transition group-hover:translate-x-1">
          {t('cta.more', locale)} →
        </span>
      </div>
    </Link>
  );
}

export function NeighborhoodCard({ n, locale }: { n: Neighborhood; locale: Locale }) {
  return (
    <Link href={`/${locale}/onde-ficar/${n.slug}`} className="card card-hover group block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={assetPath(n.hero)}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-soft">{pick(n.zone, locale)}</p>
          <h3 className="font-display text-xl font-semibold">{n.name}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-ink/70">{pick(n.tagline, locale)}</p>
        <p className="mt-2 text-xs text-ink/55">
          <span className="font-semibold text-mata">{t('label.bestFor', locale)}: </span>
          {pick(n.bestFor, locale)}
        </p>
      </div>
    </Link>
  );
}

export function AttractionCard({ a, locale }: { a: Attraction; locale: Locale }) {
  return (
    <Link href={`/${locale}/o-que-fazer/${a.slug}`} className="card card-hover group block">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={assetPath(a.hero)}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="font-display text-lg font-semibold leading-tight">{a.name}</h3>
          <p className="text-[11px] text-white/70">📍 {a.area}</p>
        </div>
      </div>
    </Link>
  );
}

export function EssentialCard({
  icon,
  title,
  blurb,
  href,
}: {
  icon: string;
  title: string;
  blurb: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-ink/10 bg-cloud p-5 transition hover:-translate-y-1 hover:border-amber hover:shadow-lg"
    >
      <span className="text-2xl" aria-hidden>{icon}</span>
      <span className="mt-3 font-display text-lg font-semibold">{title}</span>
      <span className="mt-1.5 text-sm leading-relaxed text-ink/60">{blurb}</span>
    </Link>
  );
}

export function ItemCard({ item, locale }: { item: Item; locale: Locale }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-cloud p-5 transition hover:border-amber/60 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-ink">{item.name}</h3>
        {item.price && (
          <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 text-[11px] font-semibold text-mata">
            {t(priceKey[item.price], locale)}
          </span>
        )}
      </div>
      {item.area && <p className="mt-1 text-xs font-medium uppercase tracking-wider text-coral">📍 {item.area}</p>}
      <p className="mt-3 text-sm leading-relaxed text-ink/70">{pick(item.blurb, locale)}</p>
      {item.bestFor && (
        <p className="mt-3 text-sm text-ink/70">
          <span className="font-semibold text-ink">{t('label.bestFor', locale)}: </span>
          {pick(item.bestFor, locale)}
        </p>
      )}
      {item.tip && (
        <p className="mt-3 rounded-xl bg-amber/10 p-3 text-sm text-ink/75">
          <span className="font-semibold">💡 {t('label.tip', locale)}: </span>
          {pick(item.tip, locale)}
        </p>
      )}
      {item.bookingSlug && (
        <a
          href={assetPath(`/go/${item.bookingSlug}`)}
          rel="sponsored nofollow"
          className="mt-4 inline-block self-start text-xs font-semibold uppercase tracking-wider text-amber-deep transition hover:text-ink"
        >
          {t('cta.reserve', locale)} →
        </a>
      )}
    </div>
  );
}
