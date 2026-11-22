import { expect, test } from "@playwright/test";

import { loginWithDemo } from "./helpers";

test("game pages expose a sequential naat queue with stop", async ({ page }) => {
  await loginWithDemo(page);
  await page.goto("/games/zip");

  await expect(page.getByRole("button", { name: /Mute naat|Unmute naat/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop naat" })).toBeVisible();

  await page.getByRole("button", { name: "Stop naat" }).click();
  await expect(page.getByText("Naats stopped")).toBeVisible();
  await expect(page.getByRole("button", { name: "Unmute naat" })).toBeVisible();
});
