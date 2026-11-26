import { expect, test } from "@playwright/test";

test("persists locale in cookie after reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("combobox", { name: "Ngôn ngữ" }).selectOption("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Review" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Language" })).toHaveValue(
    "en",
  );
});

test("unsupported cookie falls back to Vietnamese", async ({
  page,
  context,
}) => {
  const baseURL = test.info().project.use.baseURL ?? "http://localhost:4202";
  await context.addCookies([{ name: "DX_LOCALE", value: "fr", url: baseURL }]);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
});
