import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['test/integration/**/*.test.ts'],
        hookTimeout: 10_000,
        testTimeout: 10_000,
        fileParallelism: false,
        globalSetup: 'test/integration/util/config.ts'
    }
});
