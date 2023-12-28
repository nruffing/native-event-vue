import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:9080',
    specPattern: 'tests/**/*.cy.ts',
    supportFile: false,
  },
})
