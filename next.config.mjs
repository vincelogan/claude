/** @type {import('next').NextConfig} */

// When deploying to a GitHub Pages *project* site the app is served from a
// sub-path (e.g. /claude). Set BASE_PATH in CI to handle that; local builds and
// custom-domain deploys leave it empty and serve from the root.
const basePath = process.env.BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'commons.wikimedia.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
