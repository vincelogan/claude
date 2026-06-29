import type { Metadata } from 'next';
import Link from 'next/link';
import { DAYTRIPS } from '@/content';
import { PageHero } from '@/components/PageHero';
import { t, pick, type Localized } from '@/lib/i18n';
import { SITE, isLocale, type Locale } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

const title: Localized = { pt: 'Bate-voltas saindo do Rio', en: 'Day trips from Rio' };
const lede: Localized = {
  pt: 'Praias paradisíacas, montanhas e cidades coloniais a poucas horas da cidade.',
  en: 'Paradise beaches, mountains and colonial towns just a few hours from the city.',
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (isLocale(params.locale) ? params.locale : SITE.defaultLocale) as Locale;
  return buildMetadata({
    locale,
    path: 'bate-volta',
    title: locale === 'pt' ? 'Bate-voltas saindo do Rio de Janeiro | Rio.vip' : 'Day Trips from Rio de Janeiro | Rio.vip',
    description:
      locale === 'pt'
        ? 'Os melhores bate-voltas do Rio: Búzios, Petrópolis, Paraty, Ilha Grande, Niterói, Arraial do Cabo e mais — com distância, tempo e dicas.'
        : 'The best day trips from Rio: Búzios, Petrópolis, Paraty, Ilha Grande, Niterói, Arraial do Cabo and more — with distance, time and tips.',
    keywords: ['bate-volta rio de janeiro', 'day trips from rio', 'búzios', 'paraty', 'arraial do cabo'],
  });
}

export default function BateVolta({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const home = `/${locale}`;
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: locale === 'pt' ? 'Bate-voltas' : 'Day trips' }]}
        icon="🗺️"
        title={pick(title, locale)}
        lede={pick(lede, locale)}
        image="/img/things-to-do.svg"
      />
      <div className="container-rio py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DAYTRIPS.map((d) => (
            <div key={d.slug} className="flex flex-col rounded-2xl border border-ink/10 bg-cloud p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-xl font-semibold">{d.name}</h2>
                <span className="shrink-0 text-xs font-semibold text-amber-deep">{pick(d.time, locale)}</span>
              </div>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-coral">{pick(d.distance, locale)}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{pick(d.blurb, locale)}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link href={`${home}/vip`} className="btn-vip">{t('cta.concierge', locale)} →</Link>
          <Link href={`${home}/planejar`} className="btn-outline">{t('cta.plan', locale)} →</Link>
        </div>
      </div>
    </>
  );
}
