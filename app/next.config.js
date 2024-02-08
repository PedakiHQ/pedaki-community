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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.pedaki.fr',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'files.pedaki.fr',
        pathname: `**`,
      },
      process.env.NODE_ENV === 'development' && {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '{{{NEXT_PUBLIC_PEDAKI_HOSTNAME}}}',
        pathname: `**`,
      },
    ].filter(Boolean),
  },

  rewrites() {
    return [
      process.env.NEXT_PUBLIC_PUBLIC_FILES_HOST?.startsWith('http') && {
        source: '/favicon.ico',
        destination: `${process.env.NEXT_PUBLIC_PUBLIC_FILES_HOST}/logo/favicon-32x32.png`, // Same as in src/constants.ts
        locale: false,
      },
    ].filter(Boolean);
  },

  eslint: {
    // Already checked in ci
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Already checked in ci
    ignoreBuildErrors: true,
  },

  webpack: (config, { isServer }) => {
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
