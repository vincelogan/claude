import type { Locale } from '@/lib/site';

// Wordmark: sun rising behind Rio's mountains.
export function Logo({
  locale,
  variant = 'dark',
  className = '',
}: {
  locale: Locale;
  variant?: 'dark' | 'light';
  className?: string;
}) {
  const text = variant === 'light' ? 'text-white' : 'text-ink';
  const sub = variant === 'light' ? 'text-white/60' : 'text-mata';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="riodejaneiro.vip">
      <Mark />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-lg font-semibold tracking-tight ${text}`}>
          rio<span className="text-amber">.</span>vip
        </span>
        <span className={`mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] ${sub}`}>
          {locale === 'pt' ? 'Cidade Maravilhosa' : 'The Marvelous City'}
        </span>
      </span>
    </span>
  );
}

function Mark() {
  // Dois Irmãos peaks in gold on charcoal (brand mark).
  return (
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="shrink-0">
      <rect width="40" height="40" rx="9" fill="#1C1C1C" />
      <g
        fill="none"
        stroke="#C5A059"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
        transform="translate(6 7) scale(0.24)"
      >
        <path d="M24 86 L52 30 L74 86 Z" />
        <path d="M64 86 L86 46 L104 86 Z" />
        <line x1="18" y1="92" x2="102" y2="92" strokeWidth="1.6" />
      </g>
    </svg>
  );
}
