import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { t, pick, type Localized } from '@/lib/i18n';
import { SITE, isLocale, type Locale } from '@/lib/site';
import { buildMetadata } from '@/lib/seo';

const title: Localized = { pt: 'Sobre o riodejaneiro.vip', en: 'About riodejaneiro.vip' };
const lede: Localized = {
  pt: 'Curadoria independente sobre o melhor do Rio — honesta sobre segurança e trade-offs.',
  en: 'Independent curation of the best of Rio — honest about safety and trade-offs.',
};
const body: Localized[] = [
  {
    pt: 'O riodejaneiro.vip nasceu de uma ideia simples: reunir, num só lugar bonito e confiável, tudo o que faz do Rio a Cidade Maravilhosa — e tudo o que um viajante precisa saber antes de chegar.',
    en: 'riodejaneiro.vip began with a simple idea: bring together, in one beautiful, trustworthy place, everything that makes Rio the Marvelous City — and everything a traveler needs to know before arriving.',
  },
  {
    pt: 'Cobrimos os grandes momentos (Carnaval, Réveillon), os ícones, os bairros, a gastronomia e as experiências VIP — sempre com a verdade sobre segurança, custos e o que vale ou não a pena. Honestidade é o que gera credibilidade.',
    en: 'We cover the big moments (Carnival, Réveillon), the icons, the neighborhoods, the food and the VIP experiences — always with the truth about safety, costs and what is or isn’t worth it. Honesty is what builds trust.',
  },
  {
    pt: 'As informações são revisadas e atualizadas em 2026. Ainda assim, preços e datas mudam: confirme sempre com as fontes oficiais antes de reservar.',
    en: 'The information is reviewed and updated in 2026. Even so, prices and dates change: always confirm with official sources before booking.',
  },
];

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = (isLocale(params.locale) ? params.locale : SITE.defaultLocale) as Locale;
  return buildMetadata({
    locale,
    path: 'sobre',
    title: `${pick(title, locale)} | ${SITE.shortName}`,
    description: pick(lede, locale),
  });
}

export default function Sobre({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const home = `/${locale}`;
  return (
    <article>
      <PageHero
        locale={locale}
        crumbs={[{ label: t('nav.about', locale) }]}
        icon="🌅"
        title={pick(title, locale)}
        lede={pick(lede, locale)}
        image="/img/sightseeing.svg"
      />
      <div className="container-rio py-16">
        <div className="max-w-2xl space-y-5 text-lg prose-rio">
          {body.map((p, i) => (
            <p key={i}>{pick(p, locale)}</p>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={`${home}/planejar`} className="btn-dark">{t('cta.plan', locale)} →</Link>
          <Link href={`${home}/vip`} className="btn-vip">{t('cta.concierge', locale)} →</Link>
        </div>
      </div>
    </article>
  );
}
