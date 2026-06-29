import type { Section } from '@/content/types';
import { ItemCard } from './Cards';
import { pick } from '@/lib/i18n';
import type { Locale } from '@/lib/site';

export function Sections({ sections, locale }: { sections: Section[]; locale: Locale }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="mt-16 scroll-mt-24 first:mt-0">
          <h2 className="text-2xl font-semibold sm:text-3xl">{pick(section.title, locale)}</h2>
          {section.intro && <p className="mt-3 max-w-2xl text-ink/60">{pick(section.intro, locale)}</p>}
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {section.items.map((item) => (
              <ItemCard key={item.name} item={item} locale={locale} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
