import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { RESTAURANTS, getRestaurant } from '@/content';
import { PageHero } from '@/components/PageHero';
import { EntityLinks } from '@/components/EntityLinks';
import { JsonLd } from '@/components/JsonLd';
import { t, pick } from '@/lib/i18n';
import { SITE, isLocale, type Locale, absoluteUrl } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

const priceToSchema = { budget: '$', mid: '$$', high: '$$$', luxury: '$$$$' } as const;

export function generateStaticParams() {
  return SITE.locales.flatMap((locale) => RESTAURANTS.map((r) => ({ locale, slug: r.slug })));
}

export function generateMetadata({ params }: { params: { locale: string; slug: string } }): Metadata {
  const r = getRestaurant(params.slug);
  if (!r || !isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  return buildMetadata({
    locale,
    path: `onde-comer/${r.slug}`,
    title: `${r.name} — ${pick(r.cuisine, locale)}, Rio | ${SITE.shortName}`,
    description: pick(r.blurb, locale),
    image: r.photo?.url ?? r.hero,
    type: 'article',
  });
}

export default function RestaurantPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound();
  const r = getRestaurant(params.slug);
  if (!r) notFound();
  const locale = params.locale as Locale;
  const home = `/${locale}`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: r.name,
    description: pick(r.blurb, locale),
    image: r.photo?.url ?? `${SITE.url}${r.hero}`,
    url: absoluteUrl(locale, `onde-comer/${r.slug}`),
    servesCuisine: pick(r.cuisine, locale),
    priceRange: priceToSchema[r.price],
    address: {
      '@type': 'PostalAddress',
      addressLocality: r.neighborhood,
      addressRegion: 'RJ',
      addressCountry: 'BR',
    },
    ...(r.officialUrl ? { sameAs: r.officialUrl } : {}),
  };

  return (
    <article>
      <JsonLd data={ld} />
      <PageHero
        locale={locale}
        crumbs={[{ label: t('nav.eat', locale), href: 'onde-comer' }, { label: r.name }]}
        meta={`${r.neighborhood}${r.michelin ? ` · ${r.michelin}` : ''}`}
        title={r.name}
        lede={pick(r.cuisine, locale)}
        image={r.hero}
        photo={r.photo}
      />

      <div className="container-rio py-16">
        <div className="max-w-2xl space-y-5 text-lg prose-rio">
          <p>{pick(r.blurb, locale)}</p>
        </div>

        <EntityLinks
          locale={locale}
          officialUrl={r.officialUrl}
          bookingSlug={r.bookingSlug}
          className="mt-8"
        />

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={`${home}/onde-comer`} className="btn-outline">← {t('nav.eat', locale)}</Link>
          <Link href={`${home}/vip`} className="btn-vip">{t('cta.concierge', locale)} →</Link>
        </div>
      </div>
    </article>
  );
}
