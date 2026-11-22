import { describe, expect, it } from "vitest";

import {
  createMazeState,
  isMazeFloor,
  mazeCellIndex,
  mazeDirectionFromKey,
  mazeDirectionFromSwipe,
  mazeFloorCells,
  mazeFloorCount,
  mazeIsComplete,
  mazePaintedCount,
  replayMazeSolution,
  slideMaze,
} from "./engine";
import { MAZE_LEVELS } from "./levels";
import type { MazeLevel } from "./types";

const level: MazeLevel = {
  id: "test-maze",
  number: 1,
  width: 5,
  height: 5,
  rows: ["#####", "#...#", "#.#.#", "#...#", "#####"],
  start: [1, 1],
  par: 0,
  solution: "",
};

describe("maze paint engine", () => {
  it("knows walls and floors", () => {
    expect(isMazeFloor(level, 1, 1)).toBe(true);
    expect(isMazeFloor(level, 0, 0)).toBe(false);
    expect(isMazeFloor(level, -1, 1)).toBe(false);
    expect(mazeFloorCount(level)).toBe(8);
    expect(mazeFloorCells(level)).toContain(mazeCellIndex(level, 1, 1));
  });

  it("starts with the roller tile painted", () => {
    const state = createMazeState(level);
    expect(state.row).toBe(1);
    expect(state.col).toBe(1);
    expect(state.painted).toEqual([mazeCellIndex(level, 1, 1)]);
  });

  it("slides to the wall and paints every crossed tile", () => {
    const state = createMazeState(level);
    const result = slideMaze(level, state, "right");
    expect(result.moved).toBe(true);
    expect(result.state.row).toBe(1);
    expect(result.state.col).toBe(3);
    expect(mazePaintedCount(level, result.state)).toBe(3);
  });

  it("does not move when a wall is directly ahead", () => {
    const state = createMazeState(level);
    const result = slideMaze(level, state, "up");
    expect(result.moved).toBe(false);
    expect(result.state).toBe(state);
  });

  it("detects completion only when every floor tile is painted", () => {
    const state = createMazeState(level);
    expect(mazeIsComplete(level, state)).toBe(false);
    const solved = replayMazeSolution(MAZE_LEVELS[0]!);
    expect(mazeIsComplete(MAZE_LEVELS[0]!, solved)).toBe(true);
  });

  it("maps keys and swipes to directions", () => {
    expect(mazeDirectionFromKey("ArrowUp")).toBe("up");
    expect(mazeDirectionFromKey("d")).toBe("right");
    expect(mazeDirectionFromKey("nope")).toBeNull();
    expect(mazeDirectionFromSwipe(40, 2)).toBe("right");
    expect(mazeDirectionFromSwipe(2, -40)).toBe("up");
    expect(mazeDirectionFromSwipe(4, 4)).toBeNull();
  });

  it("replays every generated solution exactly", () => {
    for (const generated of MAZE_LEVELS) {
      const solved = replayMazeSolution(generated);
      expect(mazeIsComplete(generated, solved)).toBe(true);
      expect(mazePaintedCount(generated, solved)).toBe(
        mazeFloorCount(generated),
      );
      expect(generated.solution).toHaveLength(generated.par);
    }
  });
});
