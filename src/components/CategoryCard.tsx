import Link from 'next/link';
import Image from 'next/image';
import type { Guide } from '@/content';
import { pick } from '@/lib/i18n';
import { assetPath } from '@/lib/asset';
import type { Locale } from '@/lib/site';

export function CategoryCard({
  guide,
  locale,
  large = false,
}: {
  guide: Guide;
  locale: Locale;
  large?: boolean;
}) {
  return (
    <Link
      href={`/${locale}/${guide.slug}`}
      className={`card group block ${large ? 'sm:col-span-2 sm:row-span-2' : ''}`}
    >
      <div className={`relative ${large ? 'aspect-[4/3] sm:aspect-[16/11]' : 'aspect-[4/3]'} overflow-hidden`}>
        <Image
          src={assetPath(guide.hero)}
          alt=""
          fill
          sizes={large ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 100vw, 25vw'}
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="mb-1.5 inline-block text-2xl" aria-hidden>{guide.icon}</span>
          <h3 className={`font-display font-semibold text-white ${large ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
            {pick(guide.nav, locale)}
          </h3>
          {large && (
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
              {pick(guide.lede, locale)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
