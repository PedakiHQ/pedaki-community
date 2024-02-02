import {defineConfig} from 'vitest/config'
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "path";


export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        watch: false,
    }
})