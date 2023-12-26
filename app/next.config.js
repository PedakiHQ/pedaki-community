const fileHost = process.env.NEXT_PUBLIC_PUBLIC_FILES_HOST;
const fileHostProtocol = fileHost.startsWith('https') ? 'https' : 'http';
const fileHostWithoutProtocol = fileHost.replace(fileHostProtocol + '://', '').replace(/:.*$/, '');

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
                protocol: fileHostProtocol,
                hostname: fileHostWithoutProtocol,
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
