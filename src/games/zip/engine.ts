import type {
  ZipCheckpoint,
  ZipLevel,
  ZipMoveResult,
  ZipValidation,
} from "./types";

export function cellRow(level: ZipLevel, cell: number): number {
  return Math.floor(cell / level.size);
}

export function cellCol(level: ZipLevel, cell: number): number {
  return cell % level.size;
}

export function isAdjacent(level: ZipLevel, a: number, b: number): boolean {
  const rowDelta = Math.abs(cellRow(level, a) - cellRow(level, b));
  const colDelta = Math.abs(cellCol(level, a) - cellCol(level, b));
  return rowDelta + colDelta === 1;
}

export function checkpointAt(
  level: ZipLevel,
  cell: number,
): ZipCheckpoint | undefined {
  return level.checkpoints.find((checkpoint) => checkpoint.cell === cell);
}

export function nextCheckpoint(
  level: ZipLevel,
  path: number[],
): ZipCheckpoint | undefined {
  const used = new Set(path);
  return level.checkpoints.find((checkpoint) => !used.has(checkpoint.cell));
}

export function beginZip(level: ZipLevel, cell: number): ZipMoveResult {
  const first = level.checkpoints.find((checkpoint) => checkpoint.value === 1);
  if (!first || first.cell !== cell) {
    return { path: [], accepted: false, reason: "start-at-one" };
  }
  return { path: [cell], accepted: true };
}

export function extendZip(
  level: ZipLevel,
  path: number[],
  cell: number,
): ZipMoveResult {
  if (path.length === 0) {
    return beginZip(level, cell);
  }

  const last = path[path.length - 1];
  if (last === undefined) {
    return beginZip(level, cell);
  }

  if (cell === last) {
    return { path, accepted: false, reason: "already-used" };
  }

  if (path.includes(cell)) {
    return { path, accepted: false, reason: "already-used" };
  }

  if (!isAdjacent(level, last, cell)) {
    return { path, accepted: false, reason: "not-adjacent" };
  }

  const checkpoint = checkpointAt(level, cell);
  if (checkpoint) {
    const expected = nextCheckpoint(level, path);
    if (!expected || checkpoint.value !== expected.value) {
      return { path, accepted: false, reason: "checkpoint-order" };
    }
  }

  return { path: [...path, cell], accepted: true };
}

export function undoZip(path: number[]): number[] {
  return path.slice(0, -1);
}

export function zipFilled(level: ZipLevel, path: number[]): number {
  return Math.min(path.length, level.size * level.size);
}

export function zipIsComplete(level: ZipLevel, path: number[]): boolean {
  return validateZipSolution(level, path).valid;
}

export function validateZipSolution(
  level: ZipLevel,
  path: number[],
): ZipValidation {
  const total = level.size * level.size;

  if (path.length === 0) {
    return { valid: false, reason: "empty" };
  }

  if (new Set(path).size !== path.length) {
    return { valid: false, reason: "duplicate-cell" };
  }

  if (path.some((cell) => !Number.isInteger(cell) || cell < 0 || cell >= total)) {
    return { valid: false, reason: "not-adjacent" };
  }

  for (let index = 1; index < path.length; index += 1) {
    const previous = path[index - 1];
    const current = path[index];
    if (
      previous === undefined ||
      current === undefined ||
      !isAdjacent(level, previous, current)
    ) {
      return { valid: false, reason: "not-adjacent" };
    }
  }

  const positions = new Map<number, number>();
  path.forEach((cell, index) => positions.set(cell, index));

  let lastPosition = -1;
  const checkpoints = [...level.checkpoints].sort((a, b) => a.value - b.value);

  for (const checkpoint of checkpoints) {
    const position = positions.get(checkpoint.cell);
    if (position === undefined) {
      return { valid: false, reason: "checkpoint-missing" };
    }
    if (position <= lastPosition) {
      return { valid: false, reason: "checkpoint-order" };
    }
    lastPosition = position;
  }

  if (path.length !== total) {
    return { valid: false, reason: "incomplete" };
  }

  return { valid: true };
}

export function zipErrorMessage(
  reason: ZipMoveResult["reason"],
): string | null {
  switch (reason) {
    case "start-at-one":
      return "Start the path at number 1.";
    case "not-adjacent":
      return "Move to a neighboring cell.";
    case "already-used":
      return "That cell is already part of the path.";
    case "checkpoint-order":
      return "Visit the numbers in order.";
    default:
      return null;
  }
}
