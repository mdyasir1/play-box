import { expect, test } from "@playwright/test";

import { skipSplash } from "./helpers";

test("login page is the first screen for new visitors", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByText("Yasir", { exact: true })).toHaveCount(0);
});

test("login form has no hardcoded Yasir copy or guest access", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/login");

  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.locator("form").getByRole("button", { name: "Sign in" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue as guest" })).toHaveCount(0);
});

test("protected game route redirects unauthenticated visitors", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/games/zip");
  await expect(page).toHaveURL(/\/login/);
});
