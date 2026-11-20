import { expect, test } from "@playwright/test";

const WIDTHS = [320, 360, 375, 390, 414, 430, 768, 1024, 1280, 1440] as const;

const ROUTES = [
  "/",
  "/games",
  "/games/reaction-rush",
  "/games/reaction-rush/play",
  "/stats",
  "/achievements",
] as const;

for (const width of WIDTHS) {
  test(`shell has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const route of ROUTES) {
      const response = await page.goto(route);

      expect(response?.status(), `${route} at ${width}px`).toBe(200);
      const expectedHeading =
        route === "/achievements"
          ? page.getByRole("heading", { name: "Achievements", level: 2 })
          : page.getByRole("heading", { level: 1 });
      await expect(expectedHeading).toBeVisible();

      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }));

      expect(
        dimensions.scrollWidth,
        `${route} at ${width}px overflows by ${
          dimensions.scrollWidth - dimensions.innerWidth
        }px`,
      ).toBeLessThanOrEqual(dimensions.innerWidth + 1);
    }
  });
}

test("navigation switches between mobile and desktop at 1024px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1023, height: 800 });
  await page.goto("/");

  await expect(page.getByRole("complementary")).toBeHidden();
  await expect(
    page.getByRole("navigation", { name: "Mobile primary" }),
  ).toBeVisible();

  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto("/");

  await expect(page.getByRole("complementary")).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Mobile primary" }),
  ).toBeHidden();
  await expect(
    page.getByRole("navigation", { name: "Primary" }),
  ).toBeVisible();
});

test("skip link is the first keyboard stop", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
});