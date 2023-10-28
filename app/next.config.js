/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  output: 'standalone',

  transpilePackages: ['@pedaki/api'],

  images: {
    domains: ["static.pedaki.fr"],
  },
};

module.exports = nextConfig;
