'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

// Renders a (possibly remote, freely-licensed) photo and falls back to the
// local branded SVG art if the photo fails to load — so a broken/blocked
// remote image never shows on the page.
export function SmartImage({
  src,
  fallback,
  alt,
  ...rest
}: { src: string; fallback: string; alt: string } & Omit<ImageProps, 'src' | 'alt'>) {
  const [current, setCurrent] = useState(src);
  return (
    <Image
      {...rest}
      src={current}
      alt={alt}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
