import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { HOTELS, getHotel } from '@/content';
import { PageHero } from '@/components/PageHero';
import { EntityLinks } from '@/components/EntityLinks';
import { JsonLd } from '@/components/JsonLd';
import { t, pick } from '@/lib/i18n';
import { SITE, isLocale, type Locale, absoluteUrl } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

const priceToSchema = { budget: '$', mid: '$$', high: '$$$', luxury: '$$$$' } as const;

export function generateStaticParams() {
  return SITE.locales.flatMap((locale) => HOTELS.map((h) => ({ locale, slug: h.slug })));
}

export function generateMetadata({ params }: { params: { locale: string; slug: string } }): Metadata {
  const h = getHotel(params.slug);
  if (!h || !isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  return buildMetadata({
    locale,
    path: `hoteis/${h.slug}`,
    title: `${h.name} — ${h.neighborhood}, Rio | ${SITE.shortName}`,
    description: pick(h.blurb, locale),
    image: h.photo?.url ?? h.hero,
    type: 'article',
  });
}

export default function HotelPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound();
  const h = getHotel(params.slug);
  if (!h) notFound();
  const locale = params.locale as Locale;
  const home = `/${locale}`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: h.name,
    description: pick(h.blurb, locale),
    image: h.photo?.url ?? `${SITE.url}${h.hero}`,
    url: absoluteUrl(locale, `hoteis/${h.slug}`),
    priceRange: priceToSchema[h.price],
    address: {
      '@type': 'PostalAddress',
      addressLocality: h.neighborhood,
      addressRegion: 'RJ',
      addressCountry: 'BR',
    },
    ...(h.officialUrl ? { sameAs: h.officialUrl } : {}),
  };

  return (
    <article>
      <JsonLd data={ld} />
      <PageHero
        locale={locale}
        crumbs={[{ label: locale === 'pt' ? 'Hotéis' : 'Hotels', href: 'hoteis' }, { label: h.name }]}
        meta={`${h.neighborhood} · ${pick(h.zone, locale)}`}
        title={h.name}
        lede={pick(h.subtype, locale)}
        image={h.hero}
        photo={h.photo}
      />

      <div className="container-rio py-16">
        <div className="max-w-2xl space-y-5 text-lg prose-rio">
          <p>{pick(h.blurb, locale)}</p>
        </div>

        {h.tradeoff && (
          <div className="mt-8 max-w-2xl rounded-2xl border border-coral/30 bg-coral/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-coral">{t('label.tradeoff', locale)}</p>
            <p className="mt-2 text-ink/80">{pick(h.tradeoff, locale)}</p>
          </div>
        )}

        <EntityLinks
          locale={locale}
          officialUrl={h.officialUrl}
          bookingSlug={h.bookingSlug}
          className="mt-8"
        />

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={`${home}/hoteis`} className="btn-outline">← {locale === 'pt' ? 'Todos os hotéis' : 'All hotels'}</Link>
          <Link href={`${home}/onde-ficar`} className="btn-outline">{t('nav.stay', locale)} →</Link>
          <Link href={`${home}/vip`} className="btn-vip">{t('cta.concierge', locale)} →</Link>
        </div>
      </div>
    </article>
  );
}
