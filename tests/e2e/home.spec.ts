import { expect, test } from "@playwright/test";

test("home shows the two-game lineup and local-save promise", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /tiny arcade/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Play Zip/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Play Maze Paint/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Pick your puzzle" })).toBeVisible();
  await expect(page.getByText("Zip", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Maze Paint", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Saved locally/i).first()).toBeVisible();

  await expect(page.locator('main a[href="/games/zip"]')).toHaveCount(2);
  await expect(page.locator('main a[href="/games/maze-paint"]')).toHaveCount(2);
});

test("home stays inside a 320px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Pick your puzzle" })).toBeVisible();

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
