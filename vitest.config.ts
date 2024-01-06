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
        passWithNoTests: true,
        logHeapUsage: true,
        setupFiles: [
            `packages/tests/src/helpers/setup.ts`
        ],
        include: [
            '**/*.test.ts',
        ],
        maxWorkers: 1, // We use the same database for all tests and setup can't be run in parallel
        minWorkers: 1,
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