import { expect, type Page } from "@playwright/test";

export const PROGRESS_KEY = "playbox.v4.progress";

export async function skipSplash(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.sessionStorage.setItem("yg-splash-seen", "1");
  });
}

export async function loginWithDemo(page: Page): Promise<void> {
  await skipSplash(page);
  await page.goto("/login");
  await page.getByLabel("Email").fill("player@example.com");
  await page.getByLabel("Password").fill("playbox123");
  await page.locator("form").getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Yasir's Play-Box" })).toBeVisible();
}

export async function seedCompletedLevels(
  page: Page,
  game: "zip" | "maze-paint",
  count: number,
): Promise<void> {
  const completed = Array.from({ length: count }, (_, index) => index + 1);
  const progress: {
    version: number;
    games: Record<
      string,
      { completed: number[]; bestScores: Record<string, number>; lastLevel: number }
    >;
    updatedAt: number;
  } = {
    version: 4,
    games: {
      zip: { completed: [], bestScores: {}, lastLevel: 1 },
      "maze-paint": { completed: [], bestScores: {}, lastLevel: 1 },
    },
    updatedAt: 0,
  };
  progress.games[game] = {
    completed,
    bestScores: {},
    lastLevel: Math.min(200, count + 1),
  };

  await page.addInitScript(
    ({ key, snapshot }) => {
      window.localStorage.setItem(key, JSON.stringify(snapshot));
      window.sessionStorage.setItem("yg-splash-seen", "1");
    },
    { key: PROGRESS_KEY, snapshot: progress },
  );
}
