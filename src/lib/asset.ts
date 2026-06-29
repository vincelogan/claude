// Prefixes a local asset path (e.g. images in /public) with the deploy base path.
// next/image does not reliably prepend basePath for static-exported local images,
// so we do it explicitly. Empty in local/custom-domain builds; "/claude" on the
// GitHub Pages project site (set via NEXT_PUBLIC_BASE_PATH in CI).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function assetPath(path: string): string {
  if (/^https?:\/\//.test(path)) return path; // already absolute (external)
  return `${BASE}${path}`;
}
