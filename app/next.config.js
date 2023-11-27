/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  poweredByHeader: false,
  output: 'standalone',

  experimental: {
    instrumentationHook: true,
  },

  transpilePackages: ['@pedaki/api', '@pedaki/auth'],

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

  webpack: (config, {isServer}) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
