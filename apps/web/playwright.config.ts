import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://localhost:4202",
    trace: "on-first-retry",
    storageState: {
      cookies: [
        {
          name: "DX_LOCALE",
          value: "vi",
          domain: "localhost",
          path: "/",
          expires: -1,
          httpOnly: true,
          secure: false,
          sameSite: "Lax",
        },
      ],
      origins: [],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4202",
    env: {
      FACTORY_GITHUB_REPOSITORY: process.env.FACTORY_GITHUB_REPOSITORY ?? "",
    },
    reuseExistingServer: false,
  },
});
