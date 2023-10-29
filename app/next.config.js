/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  output: 'standalone',

  transpilePackages: ['@pedaki/api'],

  images: {
    domains: ['static.pedaki.fr'],
  },

  eslint: {
    // Already checked in ci
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Already checked in ci
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
