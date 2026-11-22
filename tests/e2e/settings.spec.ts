import { expect, test } from "@playwright/test";

import { loginWithDemo } from "./helpers";

test("settings updates the player name and shows it in the header", async ({ page }) => {
  await loginWithDemo(page);
  await page.goto("/settings");

  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await page.getByLabel("First name").fill("Ayesha");
  await page.getByLabel("Last name").fill("Siddiqui");
  await page.getByRole("button", { name: /Save profile/i }).click();
  await expect(page.getByText("Profile updated.")).toBeVisible();

  await page.goto("/");
  await expect(page.getByText("Ayesha Siddiqui")).toBeVisible();
  await expect(page.getByText(/Alright, Ayesha/)).toBeVisible();
});

test("settings is stacked and usable at 320px", async ({ page }) => {
  await loginWithDemo(page);
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/settings");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
