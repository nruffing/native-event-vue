/// <reference types="vitest" />

import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'native-event-vue',
      fileName: 'native-event-vue',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  test: {
    env: {
      NATIVE_EVENT_VUE_DEBUG_LOG: 'true',
    },
    browser: {
      enabled: true,
      name: 'chrome',
    },
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['lib/**/*.ts'],
      all: true,
    },
    typecheck: {
      enabled: true,
    },
  },
})
