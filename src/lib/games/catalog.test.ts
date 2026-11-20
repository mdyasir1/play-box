import { describe, expect, it } from "vitest";

import { GAME_CATALOG, getGameById } from "./catalog";

describe("game catalog", () => {
  it("contains exactly the five approved games", () => {
    expect(GAME_CATALOG.map((game) => game.id)).toEqual([
      "reaction-rush",
      "word-master",
      "number-merge",
      "memory-challenge",
      "neon-survival",
    ]);
  });

  it("has unique ids", () => {
    const ids = new Set(GAME_CATALOG.map((game) => game.id));
    expect(ids.size).toBe(GAME_CATALOG.length);
  });

  it("has metadata for every card", () => {
    for (const game of GAME_CATALOG) {
      expect(game.name.length).toBeGreaterThan(0);
      expect(game.description.length).toBeGreaterThan(0);
      expect(game.accent.length).toBeGreaterThan(0);
    }
  });

  it("finds known games and returns undefined for unknown ids", () => {
    expect(getGameById("word-master")?.name).toBe("Word Master");
    expect(getGameById("tic-tac-toe")).toBeUndefined();
  });
});
