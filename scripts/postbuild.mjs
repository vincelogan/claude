// Generates a root redirect (out/index.html) for the static export.
// The site lives under /en and /pt; visitors landing on "/" are sent to the
// locale that matches their browser, defaulting to English.
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'out');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rio de Janeiro VIP — The Marvelous City</title>
<link rel="canonical" href="https://riodejaneiro.vip/en/">
<link rel="alternate" hreflang="en" href="https://riodejaneiro.vip/en/">
<link rel="alternate" hreflang="pt" href="https://riodejaneiro.vip/pt/">
<link rel="alternate" hreflang="x-default" href="https://riodejaneiro.vip/en/">
<meta http-equiv="refresh" content="0; url=/en/">
<script>
  (function () {
    var lang = (navigator.language || 'en').toLowerCase();
    location.replace(lang.indexOf('pt') === 0 ? '/pt/' : '/en/');
  })();
</script>
</head>
<body>
<p>Redirecting to <a href="/en/">riodejaneiro.vip</a>…</p>
</body>
</html>
`;

writeFileSync(join(OUT, 'index.html'), html, 'utf8');
console.log('✓ postbuild: wrote out/index.html root redirect');
