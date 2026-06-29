import type { FAQ } from '@/content/types';
import { pick } from '@/lib/i18n';
import type { Locale } from '@/lib/site';

// Accessible accordion using native <details>/<summary> (keyboard + screen-reader
// friendly, works without JS).
export function FAQAccordion({ faqs, locale }: { faqs: FAQ[]; locale: Locale }) {
  return (
    <div className="divide-y divide-ink/10 border-y border-ink/10">
      {faqs.map((f, i) => (
        <details key={i} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium text-ink">
            {pick(f.q, locale)}
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sand text-mata transition group-open:rotate-45"
              aria-hidden
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-3xl text-ink/70">{pick(f.a, locale)}</p>
        </details>
      ))}
    </div>
  );
}
