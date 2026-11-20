import { expect, test } from "@playwright/test";

test("core navigation pages render with accessible headings and navigation", async ({ page }) => {
  for (const route of ["/", "/games", "/stats", "/achievements"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    const expectedHeading =
      route === "/achievements"
        ? page.getByRole("heading", { name: "Achievements", level: 2 })
        : page.getByRole("heading", { level: 1 });
    await expect(expectedHeading).toBeVisible();
  }

  const nav = page.getByRole("navigation", { name: "Primary" });
  for (const link of ["Games", "Stats", "Achievements"]) {
    await expect(nav.getByRole("link", { name: link })).toBeVisible();
  }
});

test("library has search and category filters", async ({ page }) => {
  await page.goto("/games");

  await expect(page.getByRole("searchbox", { name: "Search games" })).toBeVisible();
  for (const label of ["All", "Reflex", "Word", "Puzzle", "Memory", "Action"]) {
    await expect(page.getByRole("button", { name: label, exact: true })).toBeVisible();
  }

  const search = page.getByRole("searchbox", { name: "Search games" });
  await search.fill("reaction");
  await expect(page.getByText("Reaction Rush")).toBeVisible();
});
