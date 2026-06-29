import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import { WaveDivider } from './WaveDivider';
import { SmartImage } from './SmartImage';
import { assetPath } from '@/lib/asset';
import type { Photo } from '@/content/types';
import type { Locale } from '@/lib/site';

export function PageHero({
  locale,
  crumbs,
  icon,
  title,
  lede,
  image,
  photo,
  meta,
}: {
  locale: Locale;
  crumbs: Crumb[];
  icon?: string;
  title: string;
  lede?: string;
  image: string;
  photo?: Photo;
  meta?: string; // small line above title (e.g. dates, area)
}) {
  return (
    <header className="relative isolate overflow-hidden bg-mata text-white">
      <SmartImage
        src={photo?.url ?? assetPath(image)}
        fallback={assetPath(image)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-55"
      />
      {photo?.credit && (
        <span className="absolute bottom-2 right-3 z-10 text-[10px] text-white/55">
          📷 {photo.credit}
        </span>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-mata/70 via-mata/55 to-mata" />
      <div className="container-rio relative pb-16 pt-8 sm:pb-20 sm:pt-10">
        <Breadcrumbs crumbs={crumbs} locale={locale} />
        {icon && <p className="mt-8 text-4xl" aria-hidden>{icon}</p>}
        {meta && <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-amber-soft">{meta}</p>}
        <h1
          className={`max-w-3xl font-display font-semibold leading-[1.06] ${icon ? 'mt-3' : 'mt-6'}`}
          style={{ fontSize: 'clamp(2.4rem,5vw,4.2rem)' }}
        >
          {title}
        </h1>
        {lede && <p className="mt-5 max-w-2xl text-lg text-white/75">{lede}</p>}
      </div>
      <WaveDivider className="absolute bottom-0 left-0 h-5 w-full text-amber-soft" />
    </header>
  );
}
