import { expect, test } from "@playwright/test";

import { MAZE_LEVELS } from "../../src/games/maze-paint/levels";

const first = MAZE_LEVELS[0]!;

const KEY_BY_MOVE: Record<string, string> = {
  U: "ArrowUp",
  D: "ArrowDown",
  L: "ArrowLeft",
  R: "ArrowRight",
};

test("Maze Paint level 1 completes with keyboard controls and saves", async ({
  page,
}) => {
  await page.goto("/games/maze-paint");

  await expect(
    page.getByRole("heading", { level: 1, name: "Maze Paint" }),
  ).toBeVisible();
  await expect(page.getByText("Level 1 of 100")).toBeVisible();

  for (const move of first.solution) {
    await page.keyboard.press(KEY_BY_MOVE[move]!);
  }

  await expect(
    page.getByRole("heading", { name: "Level 1 complete" }),
  ).toBeVisible();

  const snapshot = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("playbox.v3.progress") ?? "{}"),
  );
  expect(snapshot.games["maze-paint"].completed).toEqual([1]);
  expect(snapshot.games["maze-paint"].bestScores["1"]).toBe(first.par);
  expect(snapshot.games["maze-paint"].lastLevel).toBe(2);

  await page.getByRole("button", { name: "Replay" }).click();
  await expect(
    page.getByRole("heading", { name: "Level 1 complete" }),
  ).not.toBeVisible();
  await expect(page.getByText("Painted 1 of", { exact: false })).toBeVisible();

  await page.reload();
  await expect(page.getByText("Level 2 of 100")).toBeVisible();
});

test("Maze Paint reports blocked directions", async ({ page }) => {
  await page.goto("/games/maze-paint");

  const [row, col] = first.start;
  const blocked = [
    ["ArrowUp", row - 1, col],
    ["ArrowDown", row + 1, col],
    ["ArrowLeft", row, col - 1],
    ["ArrowRight", row, col + 1],
  ].find(([, nextRow, nextCol]) => {
    return first.rows[nextRow as number]?.[nextCol as number] !== ".";
  });

  expect(blocked).toBeDefined();
  const buttonName: Record<string, string> = {
    ArrowUp: "Up",
    ArrowDown: "Down",
    ArrowLeft: "Left",
    ArrowRight: "Right",
  };
  await page
    .getByRole("button", { name: buttonName[blocked![0] as string] })
    .click();
  await expect(page.getByText("Blocked there — try another direction.")).toBeVisible();
});

test("Maze Paint opens the next level from the result dialog", async ({
  page,
}) => {
  await page.goto("/games/maze-paint");

  for (const move of first.solution) {
    await page.keyboard.press(KEY_BY_MOVE[move]!);
  }

  await page.getByRole("button", { name: "Next level" }).click();
  await expect(page.getByText("Level 2 of 100")).toBeVisible();
  await expect(page.getByText("Painted 1 of", { exact: false })).toBeVisible();
});

test("Maze Paint level picker exposes all 100 levels", async ({ page }) => {
  await page.goto("/games/maze-paint");

  await page.getByRole("button", { name: /Choose level/i }).click();
  const picker = page.getByRole("dialog");
  await expect(picker).toBeVisible();
  await expect(
    picker.getByRole("heading", { name: "Maze Paint levels" }),
  ).toBeVisible();

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByText("Painted 1 of", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: /Choose level/i }).click();
  await expect(picker).toBeVisible();
  await expect(picker.getByRole("button", { name: "Level 100" })).toBeVisible();

  await picker.getByRole("button", { name: "Level 100" }).click();
  await expect(page.getByText("Level 100 of 100")).toBeVisible();
  await expect(page.getByText("Painted 1 of", { exact: false })).toBeVisible();

  await page.reload();
  await expect(page.getByText("Level 100 of 100")).toBeVisible();
});

test("Maze Paint board fits a 320px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/games/maze-paint");
  await expect(page.getByText("Level 1 of 100")).toBeVisible();

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
