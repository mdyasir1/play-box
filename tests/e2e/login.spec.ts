import { expect, test } from "@playwright/test";

import { skipSplash } from "./helpers";

test("login page is the first screen for new visitors", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main" })).toHaveCount(0);
  await expect(page.getByRole("banner").getByText("Yasir's Play-Box")).toBeVisible();
  await expect(page.getByRole("button", { name: /Switch to (light|dark) theme/i })).toBeVisible();
  await expect(page.getByText("Yasir", { exact: true })).toHaveCount(0);
});

test("login form has no hardcoded Yasir copy or guest access", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/login");

  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.locator("form").getByRole("button", { name: /Enter the box/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue as guest" })).toHaveCount(0);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByLabel("First name")).toBeVisible();
  await expect(page.getByLabel("Last name")).toBeVisible();
});

test("protected game route redirects unauthenticated visitors", async ({ page }) => {
  await skipSplash(page);
  await page.goto("/games/zip");
  await expect(page).toHaveURL(/\/login/);
});
