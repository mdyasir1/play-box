import { expect, test } from "@playwright/test";

import { ZIP_LEVELS } from "../../src/games/zip/levels";

const first = ZIP_LEVELS[0]!;

test("Zip level 1 can be completed, saved, replayed, and resumed", async ({
  page,
}) => {
  await page.goto("/games/zip");

  await expect(page.getByRole("heading", { level: 1, name: "Zip" })).toBeVisible();
  await expect(page.getByText("Level 1 of 100")).toBeVisible();
  await expect(page.getByText("Next number: 1.")).toBeVisible();

  for (const cell of first.solution) {
    await page.locator(`[data-cell="${cell}"]`).click();
  }

  await expect(
    page.getByRole("heading", { name: "Level 1 complete" }),
  ).toBeVisible();

  const snapshot = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("playbox.v3.progress") ?? "{}"),
  );
  expect(snapshot.games.zip.completed).toEqual([1]);
  expect(snapshot.games.zip.bestScores["1"]).toBeGreaterThanOrEqual(1);
  expect(snapshot.games.zip.lastLevel).toBe(2);

  await page.getByRole("button", { name: "Replay" }).click();
  await expect(
    page.getByRole("heading", { name: "Level 1 complete" }),
  ).not.toBeVisible();
  await expect(page.getByText("Next number: 1.")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Level 2 of 100")).toBeVisible();
});

test("Zip explains an invalid starting cell", async ({ page }) => {
  await page.goto("/games/zip");

  const start = first.solution[0]!;
  const other = start === 0 ? 1 : 0;
  await page.locator(`[data-cell="${other}"]`).click();

  await expect(page.getByText("Start the path at number 1.")).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Game board" }).getByText("0/16"),
  ).toBeVisible();
});

test("Zip opens the next level from the result dialog", async ({ page }) => {
  await page.goto("/games/zip");
  const second = ZIP_LEVELS[1]!;

  for (const cell of first.solution) {
    await page.locator(`[data-cell="${cell}"]`).click();
  }

  await page.getByRole("button", { name: "Next level" }).click();
  await expect(page.getByText("Level 2 of 100")).toBeVisible();
  await expect(page.getByText("Next number: 1.")).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Game board" })
      .getByText(`0/${second.size * second.size}`),
  ).toBeVisible();
});

test("Zip result dialog opens the level picker", async ({ page }) => {
  await page.goto("/games/zip");

  for (const cell of first.solution) {
    await page.locator(`[data-cell="${cell}"]`).click();
  }

  await page.getByRole("button", { name: "Levels" }).click();
  const picker = page.getByRole("dialog");
  await expect(picker.getByRole("heading", { name: "Zip levels" })).toBeVisible();

  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByText("Path complete. Nicely done.")).toBeVisible();
});

test("Zip level picker jumps to any of the 100 levels", async ({ page }) => {
  await page.goto("/games/zip");

  await page.getByRole("button", { name: /Choose level/i }).click();
  const picker = page.getByRole("dialog");
  await expect(picker).toBeVisible();
  await expect(picker.getByRole("heading", { name: "Zip levels" })).toBeVisible();

  await picker.getByRole("button", { name: "Level 50" }).click();
  await expect(page.getByText("Level 50 of 100")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Level 50 of 100")).toBeVisible();
});

test("Zip game board fits a 320px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/games/zip");
  await expect(page.getByText("Level 1 of 100")).toBeVisible();

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
