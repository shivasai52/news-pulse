import { defineConfig, devices } from "@playwright/test";

/**
 * News Pulse end-to-end tests.
 *
 * Playwright starts the Vite dev server automatically.
 * The BACKEND must already be running on port 5000:
 *
 *   cd backend && node server.js
 */
export default defineConfig({
  testDir: "./tests",

  // Fail the build if a test.only was left behind
  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },

  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"] }
    },
    {
      name: "mobile",
      // NFR-3: the app must work from 360px wide
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 360, height: 740 }
      }
    }
  ],

  webServer: {
    command: "npm run dev",
    cwd: "./frontend",
    url: "http://localhost:5173",
    reuseExistingServer: true,
    timeout: 120000
  }
});
