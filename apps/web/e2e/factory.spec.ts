import { expect, test } from "@playwright/test";

import vi from "../messages/vi.json";

test("shows the run list and supports keyboard navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: vi.App.skipToContent }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  const main = page.getByRole("main");
  await expect(main).toBeFocused();
  await expect(
    main.getByRole("heading", { name: vi.Factory.runs }),
  ).toBeVisible();
  await expect(
    main.getByRole("heading", { name: vi.Factory.empty }),
  ).toBeVisible();
  const start = main.getByRole("link", { name: vi.Factory.startInGitHub });
  const repository = process.env.FACTORY_GITHUB_REPOSITORY;
  if (repository) {
    const workflowUrl = `https://github.com/${repository}/actions/workflows/synthetic-handoff.yml`;
    await expect(main.getByText(vi.Factory.historyInGitHub)).toBeVisible();
    await expect(start).toHaveAttribute("href", workflowUrl);
    await page.keyboard.press("Tab");
    await expect(start).toBeFocused();
    await page.route(workflowUrl, (route) => route.fulfill({ status: 200 }));
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(workflowUrl);
    await page.goBack();
    await expect(start).toBeVisible();
  } else {
    await expect(main.getByText(vi.Factory.notConnected)).toBeVisible();
    await expect(start).toHaveCount(0);
  }
  expect(
    await page.locator("body").evaluate((body) => body.scrollWidth),
  ).toBeLessThanOrEqual(375);
});

test("no longer serves template or sample run routes", async ({ request }) => {
  for (const path of ["/components", "/components/button", "/runs/1042"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});
