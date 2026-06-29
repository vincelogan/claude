import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ATTRACTIONS, getAttraction } from '@/content';
import { PageHero } from '@/components/PageHero';
import { FAQAccordion } from '@/components/FAQAccordion';
import { JsonLd } from '@/components/JsonLd';
import { t, pick } from '@/lib/i18n';
import { SITE, isLocale, type Locale, absoluteUrl } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return SITE.locales.flatMap((locale) => ATTRACTIONS.map((a) => ({ locale, slug: a.slug })));
}

export function generateMetadata({ params }: { params: { locale: string; slug: string } }): Metadata {
  const a = getAttraction(params.slug);
  if (!a || !isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  return buildMetadata({
    locale,
    path: `o-que-fazer/${a.slug}`,
    title: `${a.name} — Rio de Janeiro | ${SITE.shortName}`,
    description: pick(a.metaDescription, locale),
    keywords: a.keywords,
    image: a.hero,
    type: 'article',
  });
}

export default function AttractionPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound();
  const a = getAttraction(params.slug);
  if (!a) notFound();
  const locale = params.locale as Locale;
  const home = `/${locale}`;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: a.name,
    description: pick(a.metaDescription, locale),
    image: `${SITE.url}${a.hero}`,
    url: absoluteUrl(locale, `o-que-fazer/${a.slug}`),
    address: { '@type': 'PostalAddress', addressLocality: 'Rio de Janeiro', addressCountry: 'BR' },
    isAccessibleForFree: pick(a.costNote, 'en').toLowerCase().includes('free'),
  };

  const facts: { label: string; value: string }[] = [
    { label: t('label.howToGet', locale), value: pick(a.howToGet, locale) },
    { label: t('label.bestTime', locale), value: pick(a.bestTime, locale) },
    { label: t('label.cost', locale), value: pick(a.costNote, locale) },
  ];

  return (
    <article>
      <JsonLd data={ld} />
      <PageHero
        locale={locale}
        crumbs={[{ label: t('nav.do', locale), href: 'o-que-fazer' }, { label: a.name }]}
        meta={a.area}
        title={a.name}
        lede={pick(a.tagline, locale)}
        image={a.hero}
      />

      <div className="container-rio py-16">
        <div className="max-w-2xl space-y-5 text-lg prose-rio">
          {a.intro.map((p, i) => (
            <p key={i}>{pick(p, locale)}</p>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="rounded-2xl border border-ink/10 bg-cloud p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber">{f.label}</p>
              <p className="mt-2 text-sm text-ink/75">{f.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 max-w-2xl rounded-2xl bg-amber/10 p-5 text-ink/80">
          <span className="font-semibold">💡 {t('label.tip', locale)}: </span>
          {pick(a.tip, locale)}
        </div>

        {a.faqs && a.faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold">{t('label.faq', locale)}</h2>
            <div className="mt-6">
              <FAQAccordion faqs={a.faqs} locale={locale} />
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={`${home}/o-que-fazer`} className="btn-outline">← {t('nav.do', locale)}</Link>
          <Link href={`${home}/vip`} className="btn-vip">{t('cta.concierge', locale)} →</Link>
        </div>
      </div>
    </article>
  );
}
