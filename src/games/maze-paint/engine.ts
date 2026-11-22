import type {
  MazeDirection,
  MazeLevel,
  MazeMoveResult,
  MazeState,
} from "./types";

const DELTAS: Record<MazeDirection, readonly [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

export const MAZE_DIRECTIONS: readonly MazeDirection[] = [
  "up",
  "left",
  "down",
  "right",
];

export function mazeCellIndex(
  level: MazeLevel,
  row: number,
  col: number,
): number {
  return row * level.width + col;
}

export function isMazeFloor(level: MazeLevel, row: number, col: number): boolean {
  if (row < 0 || row >= level.height || col < 0 || col >= level.width) {
    return false;
  }
  return level.rows[row]?.[col] === ".";
}

export function mazeFloorCells(level: MazeLevel): number[] {
  const cells: number[] = [];
  for (let row = 0; row < level.height; row += 1) {
    for (let col = 0; col < level.width; col += 1) {
      if (isMazeFloor(level, row, col)) {
        cells.push(mazeCellIndex(level, row, col));
      }
    }
  }
  return cells;
}

export function createMazeState(level: MazeLevel): MazeState {
  const [row, col] = level.start;
  return {
    row,
    col,
    painted: [mazeCellIndex(level, row, col)],
  };
}

export function slideMaze(
  level: MazeLevel,
  state: MazeState,
  direction: MazeDirection,
): MazeMoveResult {
  const [rowDelta, colDelta] = DELTAS[direction];
  const painted = new Set(state.painted);
  let row = state.row;
  let col = state.col;
  let moved = false;

  while (true) {
    const nextRow = row + rowDelta;
    const nextCol = col + colDelta;
    if (!isMazeFloor(level, nextRow, nextCol)) {
      break;
    }
    row = nextRow;
    col = nextCol;
    painted.add(mazeCellIndex(level, row, col));
    moved = true;
  }

  if (!moved) {
    return { state, moved: false };
  }

  return {
    moved: true,
    state: {
      row,
      col,
      painted: [...painted],
    },
  };
}

export function mazeFloorCount(level: MazeLevel): number {
  return mazeFloorCells(level).length;
}

export function mazePaintedCount(level: MazeLevel, state: MazeState): number {
  const floors = new Set(mazeFloorCells(level));
  return state.painted.filter((cell) => floors.has(cell)).length;
}

export function mazeIsComplete(level: MazeLevel, state: MazeState): boolean {
  return mazePaintedCount(level, state) === mazeFloorCount(level);
}

export function mazeDirectionFromKey(key: string): MazeDirection | null {
  switch (key) {
    case "ArrowUp":
    case "w":
    case "W":
      return "up";
    case "ArrowDown":
    case "s":
    case "S":
      return "down";
    case "ArrowLeft":
    case "a":
    case "A":
      return "left";
    case "ArrowRight":
    case "d":
    case "D":
      return "right";
    default:
      return null;
  }
}

export function mazeDirectionFromSwipe(
  deltaX: number,
  deltaY: number,
): MazeDirection | null {
  const threshold = 24;
  if (Math.abs(deltaX) < threshold && Math.abs(deltaY) < threshold) {
    return null;
  }
  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    return deltaX > 0 ? "right" : "left";
  }
  return deltaY > 0 ? "down" : "up";
}

export function replayMazeSolution(level: MazeLevel): MazeState {
  let state = createMazeState(level);
  for (const move of level.solution) {
    const direction =
      move === "U"
        ? "up"
        : move === "D"
          ? "down"
          : move === "L"
            ? "left"
            : move === "R"
              ? "right"
              : null;
    if (!direction) {
      throw new Error(`Unknown maze move: ${move}`);
    }
    const result = slideMaze(level, state, direction);
    if (!result.moved) {
      throw new Error(`Invalid maze move: ${move}`);
    }
    state = result.state;
  }
  return state;
}

export function mazeDirectionLabel(direction: MazeDirection): string {
  switch (direction) {
    case "up":
      return "Up";
    case "down":
      return "Down";
    case "left":
      return "Left";
    case "right":
      return "Right";
  }
}
