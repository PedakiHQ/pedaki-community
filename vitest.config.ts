import { defineConfig } from 'vitest/config'
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "path";
const helpersFolder = path.resolve(__dirname, 'packages/services/src/tests/helpers');

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        watch: false,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary', 'json'],
            include: ["packages/**/*.ts"],
        },
        setupFiles: [
            `${helpersFolder}/setup.ts`
        ],
        include: [
            '**/*.test.ts',
        ],
        sequence: {
            hooks: "list"
        }
    },
    resolve: {
        alias: {
            '@pedaki/auth': path.resolve(__dirname, './packages/auth/src'),
        }
    }
})