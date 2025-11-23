// Playwright peruskonfiguraatio: ajaa testit Vite-dev-palvelinta vasten mock-tilassa
type EnvRecord = Record<string, string | undefined>;
declare const process: { env: EnvRecord; CI?: string };

import { defineConfig, devices } from "@playwright/test";

process.env.VITE_AUTH_MODE = "mock"; // pakotetaan mock-auth ja mock-backend testien ajaksi

const sharedEnv = {
  ...process.env,
  VITE_AUTH_MODE: "mock",
} satisfies EnvRecord;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  webServer: {
    command: "npm run dev -- --host localhost --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
    env: sharedEnv,
  },
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
