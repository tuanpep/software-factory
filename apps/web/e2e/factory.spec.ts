import { expect, test } from "@playwright/test";

import vi from "../messages/vi.json";

test("shows the review queue and supports keyboard navigation", async ({
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
    main.getByRole("heading", { name: vi.Factory.reviewTitle }),
  ).toBeVisible();
  await expect(
    main.getByRole("link", { name: /Repair docs\/setup\.md/ }),
  ).toBeVisible();
  const start = main.getByRole("link", { name: vi.Factory.startInGitHub });
  const repository = process.env.FACTORY_GITHUB_REPOSITORY;
  if (repository) {
    const workflowUrl = `https://github.com/${repository}/actions/workflows/synthetic-handoff.yml`;
    await expect(start).toHaveAttribute("href", workflowUrl);
  } else {
    await expect(start).toHaveCount(0);
  }
  expect(
    await page.locator("body").evaluate((body) => body.scrollWidth),
  ).toBeLessThanOrEqual(375);
});

test("opens a mock run detail from the list", async ({ page }) => {
  await page.goto("/");
  const main = page.getByRole("main");
  await main.getByRole("link", { name: /Repair docs\/setup\.md/ }).click();
  await expect(page).toHaveURL(/\/runs\/1042$/);
  await expect(
    main.getByRole("heading", {
      name: vi.Factory.runIdAttempt
        .replace("{id}", "1042")
        .replace("{attempt}", "1"),
    }),
  ).toBeVisible();
  await expect(main.getByText(vi.Factory.status.ready)).toBeVisible();
  await expect(
    main.getByText(vi.Factory.nextActionByStatus.ready),
  ).toBeVisible();
  await expect(main.getByText(vi.Factory.diff)).toBeVisible();
  await expect(
    main.getByText(/installation guide.*install\.md/, { exact: false }),
  ).toBeVisible();
});

test("opens inbox, follow, decisions, record, and pause", async ({ page }) => {
  const main = page.getByRole("main");

  await page.goto("/inbox");
  await expect(
    main.getByRole("heading", { name: vi.Factory.inboxTitle }),
  ).toBeVisible();
  await main
    .getByRole("link", { name: vi.Factory.inboxOpenIntent })
    .first()
    .click();
  await expect(page).toHaveURL(/\/runs\/new\?/);
  await expect(page.getByLabel(vi.Factory.newRunFieldMarkdownPath)).toHaveValue(
    "docs/setup.md",
  );

  await page.goto("/follow");
  await expect(
    main.getByRole("heading", { name: vi.Factory.followTitle }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /merge|hợp nhất/i }),
  ).toHaveCount(0);
  await main.getByRole("link", { name: /Repair docs\/setup\.md/ }).click();
  await expect(page).toHaveURL(/\/follow\/draft-1042$/);
  await expect(
    page.getByRole("button", { name: /merge|hợp nhất/i }),
  ).toHaveCount(0);

  await page.goto("/decisions/release");
  await main.getByRole("button", { name: vi.Factory.decisionReject }).click();
  await expect(main.getByText(vi.Factory.decisionRejected)).toBeVisible();

  await page.goto("/record");
  await expect(
    main.getByRole("heading", { name: vi.Factory.recordTitle }),
  ).toBeVisible();

  await page.goto("/configure/pause");
  await expect(
    main.getByRole("heading", { name: vi.Settings.configureTitle }),
  ).toBeVisible();
  await main.getByRole("button", { name: vi.Settings.pauseAction }).click();
  await expect(main.getByText(vi.Settings.pauseOn)).toBeVisible();
});

test("no longer serves template sample routes", async ({ request }) => {
  for (const path of ["/components", "/components/button"]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});
