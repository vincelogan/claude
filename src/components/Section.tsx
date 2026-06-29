import { ReactNode } from 'react';

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <span className={`eyebrow ${light ? '!text-amber-soft before:!bg-amber-soft' : ''}`}>{children}</span>;
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  light = false,
  className = '',
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2 className={`mt-3 text-3xl font-semibold sm:text-4xl ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {lead && <p className={`mt-4 text-lg ${light ? 'text-white/70' : 'text-ink/60'}`}>{lead}</p>}
    </div>
  );
}
