import { expect, test } from "@playwright/test";

import { loginWithDemo } from "./helpers";

test("home is a quiet Yasir storefront for two games", async ({ page }) => {
  await loginWithDemo(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Yasir's Play-Box" }),
  ).toBeVisible();
  await expect(page.getByText("By Yasir", { exact: true })).toBeVisible();
  await expect(page.getByText("Two games. 200 levels each.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Zip" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Maze Paint" })).toBeVisible();
  await expect(page.getByText("200 levels").first()).toBeVisible();
  await expect(page.locator('main a[href="/games/zip"]')).toHaveCount(1);
  await expect(page.locator('main a[href="/games/maze-paint"]')).toHaveCount(1);
});

test("theme toggle switches light and dark", async ({ page }) => {
  await loginWithDemo(page);
  await page.goto("/");

  const toggle = page.getByRole("button", { name: /Switch to light theme/i });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: /Switch to dark theme/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("splash announces Yasir and can be skipped", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("A personal arcade by Yasir")).toBeVisible();
  await page.getByRole("button", { name: "Skip" }).click();
  await expect(page.getByText("A personal arcade by Yasir")).not.toBeVisible();
});

test("home stays inside a 320px viewport", async ({ page }) => {
  await loginWithDemo(page);
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
