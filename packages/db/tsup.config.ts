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

    // Fix issue:
    // Error [ERR_UNSUPPORTED_DIR_IMPORT]: Directory import '[...]/node_modules/prisma-field-encryption/dist/generator/runtime' is not supported resolving ES modules imported from [...]packages/db/dist/chunk-NR2ORHUI.js
    const fs = await import('fs');
    fs.readdirSync('dist').forEach(file => {
      const filePath = `dist/${file}`;
      if (!fs.lstatSync(filePath).isFile()) return;
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('prisma-field-encryption/dist/generator/runtime')) {
        const newContent = content.replace(
          'prisma-field-encryption/dist/generator/runtime',
          'prisma-field-encryption/dist/generator/runtime/index.js',
        );
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    });
  },
  ...options,
}));
