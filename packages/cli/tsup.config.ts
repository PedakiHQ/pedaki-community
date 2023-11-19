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
  banner: {
    js: `
// BANNER START
const require = (await import("node:module")).createRequire(import.meta.url);
const __filename = (await import("node:url")).fileURLToPath(import.meta.url);
const __dirname = (await import("node:path")).dirname(__filename);
// BANNER END
`,
  },
}));
