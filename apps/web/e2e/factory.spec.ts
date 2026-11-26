import { expect, test } from "@playwright/test";

import vi from "../messages/vi.json";

test("shows the disconnected run list and supports keyboard navigation", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: vi.App.skipToContent })).toBeFocused();
  await page.keyboard.press("Enter");
  const main = page.getByRole("main");
  await expect(main).toBeFocused();
  await expect(main.getByRole("heading", { name: vi.Factory.runs })).toBeVisible();
  await expect(main.getByRole("heading", { name: vi.Factory.empty })).toBeVisible();
  await expect(main.getByText(vi.Factory.notConnected)).toBeVisible();
  expect(await page.locator("body").evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(375);
});

test("no longer serves template or sample run routes", async ({ request }) => {
  for (const path of ["/components", "/components/button", "/runs/1042"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});
