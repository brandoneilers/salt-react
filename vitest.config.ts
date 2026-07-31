import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
  },
})
