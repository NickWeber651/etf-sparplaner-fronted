import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

// Vitest-Konfiguration für Unit-Tests
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',  // Browser-Umgebung simulieren
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      globals: true,  // describe, it, expect global verfügbar
    },
  }),
)
