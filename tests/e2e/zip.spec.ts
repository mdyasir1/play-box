import { expect, test } from "@playwright/test";

import { ZIP_LEVELS } from "../../src/games/zip/levels";
import { loginWithDemo, seedCompletedLevels } from "./helpers";

const first = ZIP_LEVELS[0]!;

test("Zip level 1 completes, saves, unlocks level 2, and replays", async ({ page }) => {
  await loginWithDemo(page);
  await page.goto("/games/zip");

  await expect(page.getByRole("heading", { level: 1, name: "Zip" })).toBeVisible();
  await expect(page.getByText("Level 001 of 200")).toBeVisible();
  await expect(page.getByRole("button", { name: "Next level" })).toBeDisabled();

  for (const cell of first.solution) {
    await page.locator(`[data-cell="${cell}"]`).click();
  }

  await expect(page.getByRole("heading", { name: "Level 1 complete" })).toBeVisible();
  const snapshot = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("playbox.v4.progress") ?? "{}"),
  );
  expect(snapshot.games.zip.completed).toEqual([1]);
  expect(snapshot.games.zip.lastLevel).toBe(2);

  await page.getByRole("button", { name: "Replay" }).click();
  await expect(page.getByRole("heading", { name: "Level 1 complete" })).not.toBeVisible();
  await expect(page.getByText("Next number: 1.")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Level 002 of 200")).toBeVisible();
  await expect(page.getByRole("button", { name: "Next level" })).toBeDisabled();
});

test("Zip rejects an invalid starting cell", async ({ page }) => {
  await loginWithDemo(page);
  await page.goto("/games/zip");

  const start = first.solution[0]!;
  const other = start === 0 ? 1 : 0;
  await page.locator(`[data-cell="${other}"]`).click();

  await expect(page.getByText("Start the path at number 1.")).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Game board" }).getByText("0/16"),
  ).toBeVisible();
});

test("Zip next level unlocks only after completion", async ({ page }) => {
  await loginWithDemo(page);
  await page.goto("/games/zip");

  await page.getByRole("button", { name: /Choose level/i }).click();
  const picker = page.getByRole("dialog");
  await expect(picker.getByRole("button", { name: "Level 2, locked" })).toBeDisabled();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  for (const cell of first.solution) {
    await page.locator(`[data-cell="${cell}"]`).click();
  }
  await page.getByRole("button", { name: "Next level" }).click();
  await expect(page.getByText("Level 002 of 200")).toBeVisible();
});

test("Zip result dialog opens the level picker", async ({ page }) => {
  await loginWithDemo(page);
  await page.goto("/games/zip");

  for (const cell of first.solution) {
    await page.locator(`[data-cell="${cell}"]`).click();
  }
  await page.getByRole("button", { name: "Levels" }).click();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "Zip levels" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByText("Path complete.")).toBeVisible();
});

test("Zip level picker reaches level 200 when unlocked", async ({ page }) => {
  await seedCompletedLevels(page, "zip", 199);
  await loginWithDemo(page);
  await page.goto("/games/zip");

  await expect(page.getByText("Level 200 of 200")).toBeVisible();
  await page.getByRole("button", { name: /Choose level/i }).click();
  const picker = page.getByRole("dialog");
  await picker.getByRole("button", { name: "151–200" }).click();
  await expect(picker.getByRole("button", { name: "Level 200, current" })).toBeVisible();
  await expect(picker.getByText(/199 of 200 cleared/)).toBeVisible();
});

test("Zip board fits a 320px viewport", async ({ page }) => {
  await loginWithDemo(page);
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/games/zip");
  await expect(page.getByText("Level 001 of 200")).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
