import { describe, expect, it } from "vitest";

import {
  beginZip,
  extendZip,
  isAdjacent,
  nextCheckpoint,
  undoZip,
  validateZipSolution,
  zipErrorMessage,
  zipIsComplete,
} from "./engine";
import type { ZipLevel } from "./types";

const level: ZipLevel = {
  id: "test-3",
  number: 1,
  size: 3,
  checkpoints: [
    { value: 1, cell: 0 },
    { value: 2, cell: 4 },
    { value: 3, cell: 8 },
  ],
  solution: [0, 1, 2, 5, 4, 3, 6, 7, 8],
};

const orderLevel: ZipLevel = {
  id: "test-order",
  number: 2,
  size: 3,
  checkpoints: [
    { value: 1, cell: 0 },
    { value: 2, cell: 8 },
    { value: 3, cell: 3 },
  ],
  solution: [0, 3, 6, 7, 8],
};

describe("zip engine", () => {
  it("only starts on the cell marked 1", () => {
    expect(beginZip(level, 0)).toEqual({ path: [0], accepted: true });
    expect(beginZip(level, 1)).toEqual({
      path: [],
      accepted: false,
      reason: "start-at-one",
    });
  });

  it("extends through adjacent cells and rejects invalid moves", () => {
    const started = beginZip(level, 0);
    expect(extendZip(level, started.path, 1).path).toEqual([0, 1]);
    expect(extendZip(level, [0, 1], 0)).toMatchObject({
      accepted: false,
      reason: "already-used",
    });
    expect(extendZip(level, [0], 5)).toMatchObject({
      accepted: false,
      reason: "not-adjacent",
    });
  });

  it("enforces checkpoint order", () => {
    const result = extendZip(orderLevel, [0], 3);
    expect(result).toMatchObject({
      accepted: false,
      path: [0],
      reason: "checkpoint-order",
    });
  });

  it("tracks the next checkpoint and undo", () => {
    expect(nextCheckpoint(level, [])?.value).toBe(1);
    expect(nextCheckpoint(level, [0, 1])?.value).toBe(2);
    expect(nextCheckpoint(level, [0, 1, 2, 5, 4])?.value).toBe(3);
    expect(undoZip([0, 1, 2])).toEqual([0, 1]);
    expect(undoZip([0])).toEqual([]);
  });

  it("recognizes a complete valid solution", () => {
    expect(validateZipSolution(level, level.solution)).toEqual({ valid: true });
    expect(zipIsComplete(level, level.solution)).toBe(true);
  });

  it("rejects empty, duplicated, non-adjacent, incomplete, and missing-checkpoint paths", () => {
    expect(validateZipSolution(level, [])).toEqual({
      valid: false,
      reason: "empty",
    });
    expect(validateZipSolution(level, [0, 1, 0])).toMatchObject({
      valid: false,
      reason: "duplicate-cell",
    });
    expect(validateZipSolution(level, [0, 2])).toMatchObject({
      valid: false,
      reason: "not-adjacent",
    });
    expect(validateZipSolution(level, [0, 1, 2, 5, 4])).toMatchObject({
      valid: false,
      reason: "checkpoint-missing",
    });
    expect(
      validateZipSolution(
        { ...level, checkpoints: [{ value: 1, cell: 0 }, { value: 2, cell: 4 }] },
        [0, 1, 2, 5, 4],
      ),
    ).toMatchObject({ valid: false, reason: "incomplete" });
  });

  it("reports adjacency and user-facing messages", () => {
    expect(isAdjacent(level, 0, 1)).toBe(true);
    expect(isAdjacent(level, 0, 4)).toBe(false);
    expect(zipErrorMessage("start-at-one")).toMatch(/number 1/);
    expect(zipErrorMessage("not-adjacent")).toMatch(/neighboring/);
    expect(zipErrorMessage("checkpoint-order")).toMatch(/order/);
    expect(zipErrorMessage(undefined)).toBeNull();
  });
});
