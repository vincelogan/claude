// Generates branded SVG scene art for each guide + hero + OG image.
// Self-contained (no external image dependencies) so the site always looks
// polished. Replace these with real or AI-generated photography in production
// by dropping files with the same names into /public/img.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join(process.cwd(), 'public', 'img');
mkdirSync(DIR, { recursive: true });

// palette: [skyTop, skyBottom, sun, mountainFar, mountainNear, sea]
const THEMES = {
  hero:         ['#0a2a3a', '#071a24', '#e6b34a', '#0f8aa6', '#0a5e72', '#06343f'],
  sightseeing:  ['#1f7fa6', '#0a4258', '#f3cd7a', '#1593b0', '#0a5e72', '#073a48'],
  'things-to-do':['#1aa6a0', '#0a4a4a', '#f6efe4', '#1f8a5b', '#0c5f50', '#063f3c'],
  carnaval:     ['#7a1f6a', '#3a0e3f', '#f3cd7a', '#b83280', '#7a1f6a', '#2a0a2f'],
  reveillon:    ['#10243f', '#060f1f', '#f3cd7a', '#1a3a5c', '#0e2240', '#050b16'],
  nightlife:    ['#3a1f5c', '#160d2a', '#ef6f5b', '#5c2f7a', '#3a1f5c', '#120a22'],
  stay:         ['#e8a07a', '#a85c4a', '#f6efe4', '#c4727a', '#8a4a52', '#6a363c'],
  eat:          ['#e07a3a', '#a83e1f', '#f3cd7a', '#c4562a', '#8a3a1c', '#6a2c14'],
  vip:          ['#1a1a1a', '#000000', '#e6b34a', '#3a3320', '#2a2418', '#0a0a0a'],
  safety:       ['#1593b0', '#0a4a52', '#f6efe4', '#1f8a7a', '#0c5f5a', '#063f3c'],
  'getting-here':['#3a9fd6', '#1560a0', '#f6efe4', '#2f7fb0', '#1a5c8a', '#103f60'],
  transport:    ['#3a5a6a', '#1a2e3a', '#f3cd7a', '#2f6a7a', '#1a4452', '#10303a'],
  'best-time':  ['#e6a04a', '#9a4a6a', '#f3cd7a', '#c4567a', '#7a3a5c', '#3a1f3f'],
};

function scene(w, h, [skyTop, skyBottom, sun, mFar, mNear, sea], id) {
  const seaY = h * 0.74;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
  <defs>
    <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${skyTop}"/>
      <stop offset="1" stop-color="${skyBottom}"/>
    </linearGradient>
    <radialGradient id="sun${id}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${sun}" stop-opacity="0.95"/>
      <stop offset="1" stop-color="${sun}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="haze${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${skyBottom}" stop-opacity="0"/>
      <stop offset="1" stop-color="${skyBottom}" stop-opacity="0.5"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky${id})"/>
  <circle cx="${w * 0.7}" cy="${h * 0.34}" r="${h * 0.34}" fill="url(#sun${id})"/>
  <circle cx="${w * 0.7}" cy="${h * 0.34}" r="${h * 0.11}" fill="${sun}" fill-opacity="0.9"/>
  <!-- far mountains -->
  <path d="M0 ${seaY} L0 ${h*0.5} Q ${w*0.12} ${h*0.34} ${w*0.22} ${h*0.5} Q ${w*0.3} ${h*0.6} ${w*0.4} ${h*0.46} Q ${w*0.5} ${h*0.32} ${w*0.6} ${h*0.5} L${w} ${h*0.52} L${w} ${seaY} Z" fill="${mFar}" fill-opacity="0.85"/>
  <!-- Sugarloaf dome (right) -->
  <path d="M${w*0.78} ${seaY} Q ${w*0.8} ${h*0.42} ${w*0.86} ${h*0.4} Q ${w*0.92} ${h*0.42} ${w*0.94} ${seaY} Z" fill="${mNear}"/>
  <!-- Two Brothers peaks (left) -->
  <path d="M0 ${seaY} L0 ${h*0.56} L${w*0.1} ${h*0.4} L${w*0.18} ${h*0.56} L${w*0.26} ${h*0.44} L${w*0.34} ${seaY} Z" fill="${mNear}"/>
  <!-- Christ silhouette on central peak -->
  <g fill="${sun}" fill-opacity="0.92" transform="translate(${w*0.5} ${h*0.3})">
    <rect x="-1.5" y="0" width="3" height="22"/>
    <rect x="-11" y="6" width="22" height="3"/>
    <circle cx="0" cy="-3" r="3"/>
  </g>
  <path d="M${w*0.46} ${h*0.345} L${w*0.5} ${h*0.31} L${w*0.54} ${h*0.345} L${w*0.58} ${seaY} L${w*0.42} ${seaY} Z" fill="${mNear}"/>
  <!-- sea -->
  <rect y="${seaY}" width="${w}" height="${h - seaY}" fill="${sea}"/>
  <path d="M0 ${seaY} Q ${w*0.25} ${seaY - 8} ${w*0.5} ${seaY} T ${w} ${seaY} L${w} ${seaY+10} L0 ${seaY+10} Z" fill="${sun}" fill-opacity="0.18"/>
  <rect width="${w}" height="${h}" fill="url(#haze${id})"/>
</svg>`;
}

let i = 0;
for (const [name, theme] of Object.entries(THEMES)) {
  const isHero = name === 'hero';
  const svg = scene(isHero ? 1600 : 1200, isHero ? 1000 : 900, theme, i++);
  writeFileSync(join(DIR, `${name}.svg`), svg, 'utf8');
}

// OG image (1200x630)
writeFileSync(join(DIR, 'og.svg'), scene(1200, 630, THEMES.hero, 99), 'utf8');

console.log(`✓ generated ${Object.keys(THEMES).length + 1} SVG scenes in public/img`);
