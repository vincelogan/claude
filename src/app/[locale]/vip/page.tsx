import type { Metadata } from 'next';
import { VIP_INTRO, VIP_SECTIONS } from '@/content';
import { PageHero } from '@/components/PageHero';
import { ItemCard } from '@/components/Cards';
import { ConciergeForm } from '@/components/ConciergeForm';
import { t, pick, type Localized } from '@/lib/i18n';
import { SITE, isLocale, type Locale } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

const title: Localized = { pt: 'Experiências VIP & Concierge', en: 'VIP Experiences & Concierge' };
const lede: Localized = {
  pt: 'Conheça o Rio como poucos — do alto, da água e atrás da corda. Nós organizamos tudo.',
  en: 'See Rio the way few do — from the air, the water and behind the rope. We arrange it all.',
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (isLocale(params.locale) ? params.locale : SITE.defaultLocale) as Locale;
  return buildMetadata({
    locale,
    path: 'vip',
    title: locale === 'pt' ? 'Experiências VIP no Rio: helicóptero, iate, concierge | Rio.vip' : 'Rio VIP Experiences: Helicopter, Yacht, Concierge | Rio.vip',
    description:
      locale === 'pt'
        ? 'Helicóptero sobre o Cristo, iate na Baía de Guanabara, guia privativo, transfer de luxo e camarote de Carnaval. Concierge VIP no Rio de Janeiro.'
        : 'Helicopter over Christ, a yacht on Guanabara Bay, private guides, luxury transfers and Carnival camarotes. VIP concierge in Rio de Janeiro.',
    keywords: ['rio helicopter tour', 'rio vip concierge', 'luxury tour rio de janeiro', 'passeio de helicóptero rio'],
  });
}

export default function VipPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  return (
    <article>
      <PageHero
        locale={locale}
        crumbs={[{ label: t('nav.vip', locale) }]}
        icon="💎"
        title={pick(title, locale)}
        lede={pick(lede, locale)}
        image="/img/vip.svg"
      />
      <div className="container-rio py-16">
        <p className="max-w-2xl text-lg text-ink/75">{pick(VIP_INTRO, locale)}</p>

        {VIP_SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-semibold sm:text-3xl">{pick(s.title, locale)}</h2>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s.items.map((item) => (
                <ItemCard key={item.name} item={item} locale={locale} />
              ))}
            </div>
          </section>
        ))}

        <section id="concierge" className="mt-20 scroll-mt-24 rounded-3xl bg-mata p-8 text-white sm:p-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow !text-amber-soft before:!bg-amber-soft">{t('cta.concierge', locale)}</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                {locale === 'pt' ? 'Conte o que você quer viver.' : 'Tell us what you want to experience.'}
              </h2>
              <p className="mt-4 text-white/70">
                {locale === 'pt'
                  ? 'Montamos um roteiro privativo sob medida — hotéis de luxo, guias, helicóptero, iate e acesso VIP a eventos. Resposta rápida, sem compromisso.'
                  : 'We design a bespoke private itinerary — luxury hotels, guides, helicopter, yacht and VIP event access. Fast reply, no obligation.'}
              </p>
            </div>
            <ConciergeForm locale={locale} />
          </div>
        </section>
      </div>
    </article>
  );
}
