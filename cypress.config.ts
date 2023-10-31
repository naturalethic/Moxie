import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        specPattern: "test/**/*.cy.{ts,tsx}",
        supportFile: "test/support/e2e.ts",
    },
});
