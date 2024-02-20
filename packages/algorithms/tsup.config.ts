import cpy from 'cpy';
import { defineConfig } from 'tsup';
import type { Options } from 'tsup';
import { $ } from "execa";

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['src/**/*'],
  format: ['esm'],
  dts: process.env.NODE_ENV !== 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  minify: true,
  minifyWhitespace: true,
  keepNames: true,
  clean: true,
  bundle: false,
  onSuccess: async () => {
    await cpy(['package.json', 'README.md'], 'dist');
    await $`pnpm exec tsconfig-replace-paths`;
    await $`node ../../scripts/fix-ts-paths.js`;
  },
  ...options,
}));
