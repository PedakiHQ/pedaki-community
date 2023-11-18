import type { Options } from 'tsup';
import { defineConfig } from 'tsup';

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['src/**/*.(tsx|ts|cjs)'],
  format: ['esm'], // ESM only as .js files are needed for build
  dts: false,
  sourcemap: false,
  minify: false,
  minifyWhitespace: true,
  keepNames: true,
  platform: 'node',
  clean: true,
  bundle: true,
  external: [],
  ...options,
}));
