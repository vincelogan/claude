// Generates a root redirect (out/index.html) for the static export and a
// .nojekyll marker so GitHub Pages serves Next's _next/ folder untouched.
// The site lives under /en and /pt; visitors landing on "/" are sent to the
// locale that matches their browser, defaulting to English.
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'out');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

// Match the basePath used at build time (e.g. "/claude" on GitHub Pages).
const base = process.env.BASE_PATH || '';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rio de Janeiro VIP — The Marvelous City</title>
<link rel="canonical" href="https://riodejaneiro.vip/pt/">
<link rel="alternate" hreflang="pt-BR" href="https://riodejaneiro.vip/pt/">
<link rel="alternate" hreflang="en" href="https://riodejaneiro.vip/en/">
<link rel="alternate" hreflang="x-default" href="https://riodejaneiro.vip/pt/">
<meta http-equiv="refresh" content="0; url=${base}/pt/">
<script>
  (function () {
    var base = ${JSON.stringify(base)};
    var lang = (navigator.language || 'pt').toLowerCase();
    location.replace(base + (lang.indexOf('en') === 0 ? '/en/' : '/pt/'));
  })();
</script>
</head>
<body>
<p>Redirecting to <a href="${base}/en/">riodejaneiro.vip</a>…</p>
</body>
</html>
`;

writeFileSync(join(OUT, 'index.html'), html, 'utf8');
writeFileSync(join(OUT, '.nojekyll'), '', 'utf8');

// --- /go/<slug> affiliate redirect layer ---------------------------------
// Generates a static redirect page per slug from affiliates.config.json.
// Slugs still set to TODO fall back to the homepage so links never dead-end.
let goCount = 0;
try {
  const cfg = JSON.parse(readFileSync(join(process.cwd(), 'affiliates.config.json'), 'utf8'));
  const redirects = cfg.redirects || {};
  const fallback = `${base}/pt/`;
  for (const [slug, url] of Object.entries(redirects)) {
    const target = !url || url === 'TODO_AFFILIATE_URL' ? fallback : url;
    const dir = join(OUT, 'go', slug);
    mkdirSync(dir, { recursive: true });
    const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex,nofollow">
<title>Redirecting…</title>
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${target}">
<script>location.replace(${JSON.stringify(target)});</script>
</head>
<body><p>Redirecting to <a href="${target}">your destination</a>…</p></body>
</html>
`;
    writeFileSync(join(dir, 'index.html'), page, 'utf8');
    goCount++;
  }
} catch (err) {
  console.warn('! postbuild: could not generate /go redirects:', err.message);
}

console.log(`✓ postbuild: index.html (base "${base || '/'}") + .nojekyll + ${goCount} /go redirects`);
