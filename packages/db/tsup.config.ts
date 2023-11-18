import cpy from 'cpy';
import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['src/**/*.(tsx|ts|cjs)'],
  format: ['esm'], // ESM only as .js files are needed for build
  dts: process.env.NODE_ENV !== 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  minify: true,
  minifyWhitespace: true,
  keepNames: true,
  platform: 'node',
  clean: true,
  bundle: true,
  external: ['@prisma/client', '.prisma/client'],
  onSuccess: async () => {
    await cpy('package.json', 'dist');
  },
  ...options,
}));
