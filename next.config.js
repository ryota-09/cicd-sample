/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: "/assets",
  async redirects() {
    return [
      {
        source: '/assets/public/vercel.svg',
        destination: '/images/vercel.svg',
        permanent: true,
      },
      {
        source: '/assets/_next/:path*',
        destination: '/_next/:path*',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;
