import { expect, test } from "@playwright/test";

import { MAZE_LEVELS } from "../../src/games/maze-paint/levels";
import { loginWithDemo, seedCompletedLevels } from "./helpers";

const first = MAZE_LEVELS[0]!;
const KEY_BY_MOVE: Record<string, string> = {
  U: "ArrowUp",
  D: "ArrowDown",
  L: "ArrowLeft",
  R: "ArrowRight",
};

test("Maze Paint level 1 completes, saves, and unlocks level 2", async ({ page }) => {
  await loginWithDemo(page);
  await page.goto("/games/maze-paint");

  await expect(page.getByRole("heading", { level: 1, name: "Maze Paint" })).toBeVisible();
  await expect(page.getByText("Level 001 of 200")).toBeVisible();
  await expect(page.getByRole("button", { name: "Next level" })).toBeDisabled();

  for (const move of first.solution) {
    await page.keyboard.press(KEY_BY_MOVE[move]!);
  }

  await expect(page.getByRole("heading", { name: "Level 1 complete" })).toBeVisible();
  const snapshot = await page.evaluate(() =>
    JSON.parse(window.localStorage.getItem("playbox.v4.progress") ?? "{}"),
  );
  expect(snapshot.games["maze-paint"].completed).toEqual([1]);
  expect(snapshot.games["maze-paint"].lastLevel).toBe(2);

  await page.getByRole("button", { name: "Replay" }).click();
  await expect(page.getByRole("heading", { name: "Level 1 complete" })).not.toBeVisible();
  await expect(page.getByText("Painted 1 of", { exact: false })).toBeVisible();

  await page.reload();
  await expect(page.getByText("Level 002 of 200")).toBeVisible();
});

test("Maze Paint reports blocked directions", async ({ page }) => {
  await loginWithDemo(page);
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
  await page.getByRole("button", { name: buttonName[blocked![0] as string] }).click();
  await expect(page.getByText("Blocked there — try another direction.")).toBeVisible();
});

test("Maze Paint ignores keyboard input while the level picker is open", async ({ page }) => {
  await loginWithDemo(page);
  await page.goto("/games/maze-paint");

  await page.getByRole("button", { name: /Choose level/i }).click();
  const picker = page.getByRole("dialog");
  await expect(picker.getByRole("button", { name: "Level 2, locked" })).toBeDisabled();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByText("Painted 1 of", { exact: false })).toBeVisible();
});

test("Maze Paint opens the next level from the result dialog", async ({ page }) => {
  await loginWithDemo(page);
  await page.goto("/games/maze-paint");
  await expect(page.getByText("Level 001 of 200")).toBeVisible();

  for (const move of first.solution) {
    await page.keyboard.press(KEY_BY_MOVE[move]!);
  }
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "Level 1 complete" })).toBeVisible();
  await dialog.getByRole("button", { name: "Next level" }).click();
  await expect(page.getByText("Level 002 of 200")).toBeVisible();
  await expect(page.getByRole("button", { name: "Next level" })).toBeDisabled();
});

test("Maze Paint level picker reaches level 200 when unlocked", async ({ page }) => {
  await seedCompletedLevels(page, "maze-paint", 199);
  await loginWithDemo(page);
  await page.goto("/games/maze-paint");

  await expect(page.getByText("Level 200 of 200")).toBeVisible();
  await page.getByRole("button", { name: /Choose level/i }).click();
  const picker = page.getByRole("dialog");
  await expect(picker.getByRole("heading", { name: "Maze Paint levels" })).toBeVisible();
  await picker.getByRole("button", { name: "151–200" }).click();
  await expect(picker.getByRole("button", { name: "Level 200, current" })).toBeVisible();
});

test("Maze Paint board fits a 320px viewport", async ({ page }) => {
  await loginWithDemo(page);
  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto("/games/maze-paint");
  await expect(page.getByText("Level 001 of 200")).toBeVisible();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
