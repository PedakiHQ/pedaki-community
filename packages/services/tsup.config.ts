import cpy from 'cpy';
import { esbuildPluginFilePathExtensions } from 'esbuild-plugin-file-path-extensions';
import { $ } from 'execa';
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
  platform: 'node',
  keepNames: true,
  bundle: false,
  tsconfig: 'tsconfig.json',
  plugins: [esbuildPluginFilePathExtensions({ esmExtension: 'js' })],
  onSuccess: async () => {
    await cpy('package.json', 'dist');
    await $`pnpm exec tsconfig-replace-paths`;
    await $`node ../../scripts/fix-ts-paths.js`;
  },
  ...options,
}));
