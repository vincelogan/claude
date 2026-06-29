import Link from 'next/link';
import { JsonLd } from './JsonLd';
import { t } from '@/lib/i18n';
import { type Locale, absoluteUrl } from '@/lib/site';

export interface Crumb {
  label: string;
  href?: string; // path after locale; omit for the current page
}

export function Breadcrumbs({ crumbs, locale }: { crumbs: Crumb[]; locale: Locale }) {
  const home = `/${locale}`;
  const all = [{ label: t('nav.home', locale), href: '' }, ...crumbs];

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: absoluteUrl(locale, c.href ?? ''),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <JsonLd data={ld} />
      <ol className="flex flex-wrap items-center gap-2 text-white/70">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-2">
              {last || c.href === undefined ? (
                <span className="text-white/90">{c.label}</span>
              ) : (
                <Link href={`${home}/${c.href}`.replace(/\/$/, '') || home} className="transition hover:text-white">
                  {c.label}
                </Link>
              )}
              {!last && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
