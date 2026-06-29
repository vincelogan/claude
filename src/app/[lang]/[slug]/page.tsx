import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getGuide, relatedGuides, allSlugs } from '@/content';
import type { Item, PriceLevel } from '@/content/types';
import { JsonLd } from '@/components/JsonLd';
import { t, pick } from '@/lib/i18n';
import { SITE, isLocale, type Locale, absoluteUrl } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return SITE.locales.flatMap((lang) => allSlugs().map((slug) => ({ lang, slug })));
}

export function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Metadata {
  const guide = getGuide(params.slug);
  if (!guide || !isLocale(params.lang)) return {};
  const locale = params.lang as Locale;
  return buildMetadata({
    locale,
    path: guide.slug,
    title: `${pick(guide.metaTitle ?? guide.title, locale)} | ${SITE.shortName}`,
    description: pick(guide.metaDescription, locale),
    keywords: guide.keywords,
    image: guide.hero,
    type: 'article',
  });
}

const priceKey: Record<PriceLevel, string> = {
  budget: 'price.budget',
  mid: 'price.mid',
  high: 'price.high',
  luxury: 'price.luxury',
};

export default function GuidePage({ params }: { params: { lang: string; slug: string } }) {
  if (!isLocale(params.lang)) notFound();
  const guide = getGuide(params.slug);
  if (!guide) notFound();
  const locale = params.lang as Locale;
  const related = relatedGuides(guide);

  const home = `/${locale}`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Rio de Janeiro', item: absoluteUrl(locale) },
      {
        '@type': 'ListItem',
        position: 2,
        name: pick(guide.title, locale),
        item: absoluteUrl(locale, guide.slug),
      },
    ],
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pick(guide.metaTitle ?? guide.title, locale),
    description: pick(guide.metaDescription, locale),
    image: guide.hero,
    inLanguage: locale === 'pt' ? 'pt-BR' : 'en-US',
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
    mainEntityOfPage: absoluteUrl(locale, guide.slug),
  };

  const faqLd = guide.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((f) => ({
          '@type': 'Question',
          name: pick(f.q, locale),
          acceptedAnswer: { '@type': 'Answer', text: pick(f.a, locale) },
        })),
      }
    : null;

  return (
    <article>
      <JsonLd data={[breadcrumbLd, articleLd, ...(faqLd ? [faqLd] : [])]} />

      {/* HERO */}
      <header className="relative isolate overflow-hidden bg-night text-white">
        <Image
          src={guide.hero}
          alt={pick(guide.title, locale)}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/55 to-night" />
        <div className="container-rio relative py-20 sm:py-28">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/60" aria-label="Breadcrumb">
            <Link href={home} className="transition hover:text-white">
              {locale === 'pt' ? 'Início' : 'Home'}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white/90">{pick(guide.nav, locale)}</span>
          </nav>
          <p className="text-4xl" aria-hidden>{guide.icon}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-6xl">
            {pick(guide.title, locale)}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/75">{pick(guide.lede, locale)}</p>
        </div>
      </header>

      <div className="container-rio grid gap-12 py-16 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          {/* INTRO */}
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-night/80">
            {guide.intro.map((p, i) => (
              <p key={i}>{pick(p, locale)}</p>
            ))}
          </div>

          {/* SECTIONS */}
          {guide.sections.map((section) => (
            <section key={section.id} id={section.id} className="mt-16 scroll-mt-24">
              <h2 className="text-2xl font-semibold sm:text-3xl">{pick(section.title, locale)}</h2>
              {section.intro && (
                <p className="mt-3 max-w-2xl text-night/60">{pick(section.intro, locale)}</p>
              )}
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {section.items.map((item) => (
                  <ItemCard key={item.name} item={item} locale={locale} />
                ))}
              </div>
            </section>
          ))}

          {/* FAQ */}
          {guide.faqs?.length ? (
            <section id="faq" className="mt-16 scroll-mt-24">
              <h2 className="text-2xl font-semibold sm:text-3xl">{t('label.faq', locale)}</h2>
              <div className="mt-6 divide-y divide-night/10 border-y border-night/10">
                {guide.faqs.map((f, i) => (
                  <details key={i} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-night">
                      {pick(f.q, locale)}
                      <span className="text-ocean-deep transition group-open:rotate-45" aria-hidden>+</span>
                    </summary>
                    <p className="mt-3 text-night/70">{pick(f.a, locale)}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        {/* SIDEBAR */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-night/10 bg-white p-5">
            <p className="kicker">{t('label.onThisPage', locale)}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {guide.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-night/70 transition hover:text-ocean-deep">
                    {pick(s.title, locale)}
                  </a>
                </li>
              ))}
              {guide.faqs?.length ? (
                <li>
                  <a href="#faq" className="text-night/70 transition hover:text-ocean-deep">
                    {t('label.faq', locale)}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          {related.length > 0 && (
            <div className="mt-4 rounded-2xl border border-night/10 bg-white p-5">
              <p className="kicker">{t('label.relatedGuides', locale)}</p>
              <ul className="mt-3 space-y-1">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/${locale}/${r.slug}`}
                      className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-night/80 transition hover:bg-sand"
                    >
                      <span aria-hidden className="text-base">{r.icon}</span>
                      {pick(r.nav, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 rounded-2xl bg-night p-5 text-white">
            <p className="font-display text-lg font-semibold">
              {locale === 'pt' ? 'Quer o tratamento VIP?' : 'Want the VIP treatment?'}
            </p>
            <p className="mt-2 text-sm text-white/70">
              {locale === 'pt'
                ? 'Helicóptero, iate e guias privativos pela Cidade Maravilhosa.'
                : 'Helicopter, yacht and private guides across the Marvelous City.'}
            </p>
            <Link href={`/${locale}/vip`} className="btn-gold mt-4 w-full !py-2.5">
              💎 {locale === 'pt' ? 'Ver experiências' : 'See experiences'}
            </Link>
          </div>
        </aside>
      </div>

      {/* RELATED STRIP */}
      {related.length > 0 && (
        <section className="border-t border-night/10 bg-white py-16">
          <div className="container-rio">
            <h2 className="text-2xl font-semibold">{t('label.relatedGuides', locale)}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/${locale}/${r.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-night/10 p-5 transition hover:border-gold hover:shadow-lg"
                >
                  <span className="text-3xl" aria-hidden>{r.icon}</span>
                  <span>
                    <span className="block font-semibold text-night">{pick(r.nav, locale)}</span>
                    <span className="mt-1 block text-sm text-night/60">{pick(r.lede, locale)}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}

function ItemCard({ item, locale }: { item: Item; locale: Locale }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-night/10 bg-white p-5 transition hover:border-gold/60 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-night">{item.name}</h3>
        {item.price && (
          <span className="shrink-0 rounded-full bg-sand px-2.5 py-1 text-[11px] font-semibold text-ocean-deep">
            {t(priceKey[item.price], locale)}
          </span>
        )}
      </div>
      {item.area && (
        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-coral">📍 {item.area}</p>
      )}
      <p className="mt-3 text-sm leading-relaxed text-night/70">{pick(item.blurb, locale)}</p>
      {item.bestFor && (
        <p className="mt-3 text-sm text-night/70">
          <span className="font-semibold text-night">{t('label.bestFor', locale)}: </span>
          {pick(item.bestFor, locale)}
        </p>
      )}
      {item.tip && (
        <p className="mt-3 rounded-xl bg-gold/10 p-3 text-sm text-night/75">
          <span className="font-semibold">💡 {t('label.tip', locale)}: </span>
          {pick(item.tip, locale)}
        </p>
      )}
      {item.tags && item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-night/10 px-2 py-0.5 text-[11px] text-night/55">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
