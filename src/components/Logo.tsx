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
  return (
    <svg width="34" height="34" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="shrink-0">
      <circle cx="20" cy="20" r="20" fill="#0B3D2E" />
      <circle cx="20" cy="17" r="7.5" fill="#E0B765" />
      <path d="M2 31c4-1 6-9 9-9s4 5 7 5 5-11 9-11 6 14 11 15v6H2z" fill="#12513C" />
      <path d="M2 33c5-1 9-6 12-6s5 4 9 4 6-7 10-7 4 6 6 7v3H2z" fill="#0B3D2E" />
    </svg>
  );
}
