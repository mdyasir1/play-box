import axe from "axe-core";
import { expect, test, type Page } from "@playwright/test";

import { ZIP_LEVELS } from "../../src/games/zip/levels";
import { loginWithDemo } from "./helpers";

type AxeViolation = {
  id: string;
  impact: string | null;
  nodes: Array<{ target: unknown[] }>;
};

type AxeWindow = Window & {
  axe: {
    run: (
      context: Document,
      options: { runOnly: { type: string; values: string[] } },
    ) => Promise<{ violations: AxeViolation[] }>;
  };
};

async function seriousViolations(page: Page) {
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(async () => {
    const result = await (window as unknown as AxeWindow).axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
    });
    return result.violations
      .filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical",
      )
      .map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => node.target.join(" ")),
      }));
  });
}

const PATHS = ["/", "/games/zip", "/games/maze-paint"] as const;

for (const path of PATHS) {
  test(`has no serious accessibility violations on ${path}`, async ({ page }) => {
    await loginWithDemo(page);
    await page.goto(path);
    await expect(page.locator("main")).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);
  });
}

test("level picker and result dialog pass accessibility checks", async ({
  page,
}) => {
  await loginWithDemo(page);
  await page.goto("/games/zip");
  await page.getByRole("button", { name: /Choose level/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();

  for (const cell of ZIP_LEVELS[0]!.solution) {
    await page.locator(`[data-cell="${cell}"]`).click();
  }
  await expect(
    page.getByRole("heading", { name: "Level 1 complete" }),
  ).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
});
