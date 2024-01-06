import {defineConfig} from 'vitest/config'
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "path";


export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        watch: false,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary', 'json'],
            include: [
                "packages/**/*.ts",
            ],
            exclude: [
                'packages/tests/src/helpers/**/*',
                'packages/cli/*',
                'packages/db/*',
                'packages/**/env.ts',
                'packages/**/constants.ts',
            ],
        },
        setupFiles: [
            `packages/tests/src/helpers/setup.ts`
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