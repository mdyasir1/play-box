import { describe, expect, it } from "vitest";

import {
  mazeFloorCount,
  mazeIsComplete,
  replayMazeSolution,
} from "./engine";
import { MAZE_LEVELS } from "./levels";

describe("Maze Paint level data", () => {
  it("ships exactly 100 solvable levels", () => {
    expect(MAZE_LEVELS).toHaveLength(100);
    expect(new Set(MAZE_LEVELS.map((level) => level.id)).size).toBe(100);
    expect(MAZE_LEVELS.map((level) => level.number)).toEqual(
      Array.from({ length: 100 }, (_, index) => index + 1),
    );
  });

  it("has valid dimensions, closed borders, and a floor start", () => {
    for (const level of MAZE_LEVELS) {
      expect(level.width).toBeGreaterThanOrEqual(6);
      expect(level.width).toBeLessThanOrEqual(8);
      expect(level.height).toBe(level.width);
      expect(level.rows).toHaveLength(level.height);
      for (const row of level.rows) {
        expect(row).toHaveLength(level.width);
      }
      expect(level.rows[0]).toBe("#".repeat(level.width));
      expect(level.rows.at(-1)).toBe("#".repeat(level.width));
      for (const row of level.rows) {
        expect(row[0]).toBe("#");
        expect(row.at(-1)).toBe("#");
      }
      const [row, col] = level.start;
      expect(level.rows[row]?.[col]).toBe(".");
      expect(mazeFloorCount(level)).toBeGreaterThanOrEqual(9);
      expect(mazeFloorCount(level)).toBeLessThanOrEqual(19);
    }
  });

  it("replays every stored solution to a complete board at par", () => {
    for (const level of MAZE_LEVELS) {
      const solved = replayMazeSolution(level);
      expect(mazeIsComplete(level, solved)).toBe(true);
      expect(level.par).toBe(level.solution.length);
      expect(level.par).toBeGreaterThan(0);
      expect(level.solution).toMatch(/^[UDLR]+$/);
    }
  });

  it("keeps the layout roster varied", () => {
    const layouts = new Set(MAZE_LEVELS.map((level) => level.rows.join("|")));
    expect(layouts.size).toBeGreaterThan(80);
  });
});
