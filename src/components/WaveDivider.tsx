// The Copacabana promenade wave (Burle Marx) — the brand's signature line.
// Used as a thin divider/detail, never a heavy texture.
export function WaveDivider({
  className = '',
  color = 'currentColor',
  flip = false,
}: {
  className?: string;
  color?: string;
  flip?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <path
        d="M0 20 C 80 0, 160 0, 240 20 S 400 40, 480 20 S 640 0, 720 20 S 880 40, 960 20 S 1120 0, 1200 20"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.5"
      />
      <path
        d="M0 28 C 80 8, 160 8, 240 28 S 400 48, 480 28 S 640 8, 720 28 S 880 48, 960 28 S 1120 8, 1200 28"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.25"
      />
    </svg>
  );
}
