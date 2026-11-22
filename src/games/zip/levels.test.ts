import { describe, expect, it } from "vitest";

import { validateZipSolution } from "./engine";
import { ZIP_LEVELS } from "./levels";

describe("Zip level data", () => {
  it("ships exactly 200 levels with unique ids and numbers", () => {
    expect(ZIP_LEVELS).toHaveLength(200);
    expect(new Set(ZIP_LEVELS.map((level) => level.id)).size).toBe(200);
    expect(ZIP_LEVELS.map((level) => level.number)).toEqual(
      Array.from({ length: 200 }, (_, index) => index + 1),
    );
  });

  it("contains only valid, complete Hamiltonian solution paths", () => {
    for (const level of ZIP_LEVELS) {
      expect(validateZipSolution(level, level.solution)).toEqual({
        valid: true,
      });
      expect(level.solution).toHaveLength(level.size * level.size);
      expect(new Set(level.solution).size).toBe(level.size * level.size);
      expect(level.size).toBeGreaterThanOrEqual(4);
      expect(level.size).toBeLessThanOrEqual(8);
    }
  });

  it("places the first and last checkpoints at the path ends", () => {
    for (const level of ZIP_LEVELS) {
      const sorted = [...level.checkpoints].sort((a, b) => a.value - b.value);
      expect(sorted[0]?.value).toBe(1);
      expect(sorted[0]?.cell).toBe(level.solution[0]);
      expect(sorted.at(-1)?.cell).toBe(level.solution.at(-1));
      expect(sorted.map((checkpoint) => checkpoint.value)).toEqual(
        Array.from({ length: sorted.length }, (_, index) => index + 1),
      );
      expect(sorted.length).toBeGreaterThanOrEqual(4);
      expect(sorted.length).toBeLessThanOrEqual(6);
      expect(new Set(sorted.map((checkpoint) => checkpoint.cell)).size).toBe(
        sorted.length,
      );
    }
  });

  it("moves through adjacent cells without repeats", () => {
    for (const level of ZIP_LEVELS) {
      for (let index = 1; index < level.solution.length; index += 1) {
        const previous = level.solution[index - 1];
        const current = level.solution[index];
        if (previous === undefined || current === undefined) {
          throw new Error(`Broken solution in ${level.id}`);
        }
        const previousRow = Math.floor(previous / level.size);
        const previousCol = previous % level.size;
        const currentRow = Math.floor(current / level.size);
        const currentCol = current % level.size;
        expect(
          Math.abs(previousRow - currentRow) +
            Math.abs(previousCol - currentCol),
        ).toBe(1);
      }
    }
  });
});
