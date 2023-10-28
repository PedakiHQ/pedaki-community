/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@pedaki/api']
};

module.exports = nextConfig;
