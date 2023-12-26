const {join} = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    poweredByHeader: false,
    output: 'standalone',

    experimental: {
        instrumentationHook: true
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
                protocol: "https",
                hostname: "files.pedaki.fr",
                pathname: `**`,
            },
            {
                protocol: "https",
                hostname: "{{{NEXT_PUBLIC_PEDAKI_HOSTNAME}}}",
                pathname: `**`,
            }
        ],
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
