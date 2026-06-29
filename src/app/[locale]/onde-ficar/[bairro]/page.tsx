import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NEIGHBORHOODS, getNeighborhood } from '@/content';
import { PageHero } from '@/components/PageHero';
import { FAQAccordion } from '@/components/FAQAccordion';
import { t, pick } from '@/lib/i18n';
import { SITE, isLocale, type Locale } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return SITE.locales.flatMap((locale) => NEIGHBORHOODS.map((n) => ({ locale, bairro: n.slug })));
}

export function generateMetadata({ params }: { params: { locale: string; bairro: string } }): Metadata {
  const n = getNeighborhood(params.bairro);
  if (!n || !isLocale(params.locale)) return {};
  const locale = params.locale as Locale;
  return buildMetadata({
    locale,
    path: `onde-ficar/${n.slug}`,
    title: `${n.name} — ${locale === 'pt' ? 'onde ficar no Rio' : 'where to stay in Rio'} | ${SITE.shortName}`,
    description: pick(n.metaDescription, locale),
    image: n.hero,
    type: 'article',
  });
}

export default function BairroPage({ params }: { params: { locale: string; bairro: string } }) {
  if (!isLocale(params.locale)) notFound();
  const n = getNeighborhood(params.bairro);
  if (!n) notFound();
  const locale = params.locale as Locale;
  const home = `/${locale}`;

  return (
    <article>
      <PageHero
        locale={locale}
        crumbs={[{ label: t('nav.stay', locale), href: 'onde-ficar' }, { label: n.name }]}
        meta={pick(n.zone, locale)}
        title={n.name}
        lede={pick(n.tagline, locale)}
        image={n.hero}
      />

      <div className="container-rio grid gap-12 py-16 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0 max-w-2xl">
          <div className="space-y-5 text-lg prose-rio">
            {n.intro.map((p, i) => (
              <p key={i}>{pick(p, locale)}</p>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-coral/30 bg-coral/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-coral">{t('label.tradeoff', locale)}</p>
            <p className="mt-2 text-ink/80">{pick(n.tradeoff, locale)}</p>
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-semibold">{t('label.highlights', locale)}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {n.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl border border-ink/10 bg-cloud p-4 text-sm text-ink/75">
                  <span className="text-amber" aria-hidden>◆</span>
                  {pick(h, locale)}
                </li>
              ))}
            </ul>
          </div>

          {n.faqs && n.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold">{t('label.faq', locale)}</h2>
              <div className="mt-6">
                <FAQAccordion faqs={n.faqs} locale={locale} />
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-ink/10 bg-cloud p-5">
            <p className="eyebrow">{t('label.bestFor', locale)}</p>
            <p className="mt-2 font-display text-lg font-semibold">{pick(n.bestFor, locale)}</p>
            <Link href={`${home}/o-que-fazer`} className="btn-outline mt-5 w-full">{t('nav.do', locale)} →</Link>
            <Link href={`${home}/vip`} className="btn-vip mt-2 w-full">{t('cta.concierge', locale)} →</Link>
          </div>
          <div className="mt-4 rounded-2xl border border-ink/10 bg-cloud p-5">
            <p className="eyebrow">{t('nav.stay', locale)}</p>
            <ul className="mt-3 space-y-1.5">
              {NEIGHBORHOODS.filter((o) => o.slug !== n.slug).map((o) => (
                <li key={o.slug}>
                  <Link href={`${home}/onde-ficar/${o.slug}`} className="text-sm text-ink/70 transition hover:text-mata">
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}
