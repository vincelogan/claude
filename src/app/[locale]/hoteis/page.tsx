import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { HOTELS } from '@/content';
import { PageHero } from '@/components/PageHero';
import { t, pick, type Localized } from '@/lib/i18n';
import { SITE, isLocale, type Locale } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';
import { assetPath } from '@/lib/asset';

const title: Localized = { pt: 'Hotéis de luxo no Rio', en: 'Luxury hotels in Rio' };
const lede: Localized = {
  pt: 'As melhores hospedagens da cidade — com o trade-off honesto e link direto para reservar.',
  en: 'The city’s finest stays — with the honest trade-off and a direct link to book.',
};
const priceKey = { budget: 'price.budget', mid: 'price.mid', high: 'price.high', luxury: 'price.luxury' } as const;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (isLocale(params.locale) ? params.locale : SITE.defaultLocale) as Locale;
  return buildMetadata({
    locale,
    path: 'hoteis',
    title: locale === 'pt' ? 'Hotéis de luxo no Rio de Janeiro | Rio.vip' : 'Luxury Hotels in Rio de Janeiro | Rio.vip',
    description:
      locale === 'pt'
        ? 'Os melhores hotéis do Rio: Copacabana Palace, Fasano, Emiliano, Fairmont, Janeiro e mais — com o trade-off honesto e link oficial de reserva.'
        : 'Rio’s best hotels: Copacabana Palace, Fasano, Emiliano, Fairmont, Janeiro and more — with the honest trade-off and a direct booking link.',
    keywords: ['hotéis de luxo rio', 'luxury hotels rio de janeiro', 'copacabana palace', 'hotel fasano'],
  });
}

export default function HoteisHub({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const home = `/${locale}`;
  return (
    <>
      <PageHero
        locale={locale}
        crumbs={[{ label: locale === 'pt' ? 'Hotéis' : 'Hotels' }]}
        icon="🏨"
        title={pick(title, locale)}
        lede={pick(lede, locale)}
        image="/img/stay.svg"
      />
      <div className="container-rio py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HOTELS.map((h) => (
            <Link key={h.slug} href={`${home}/hoteis/${h.slug}`} className="card card-hover group block">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={assetPath(h.photo?.url ?? h.hero)}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-soft">{h.neighborhood}</p>
                    <h3 className="font-display text-xl font-semibold">{h.name}</h3>
                  </div>
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
                    {t(priceKey[h.price], locale)}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm text-ink/70">{pick(h.subtype, locale)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
