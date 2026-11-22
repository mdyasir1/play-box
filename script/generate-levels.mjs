import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function mulberry32(seed) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function adjacent(size, a, b) {
  const ar = Math.floor(a / size);
  const ac = a % size;
  const br = Math.floor(b / size);
  const bc = b % size;
  return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
}

function snakePath(size) {
  const path = [];
  for (let row = 0; row < size; row += 1) {
    if (row % 2 === 0) {
      for (let col = 0; col < size; col += 1) {
        path.push(row * size + col);
      }
    } else {
      for (let col = size - 1; col >= 0; col -= 1) {
        path.push(row * size + col);
      }
    }
  }
  return path;
}

function twoOpt(path, size, random, passes) {
  const length = path.length;
  for (let pass = 0; pass < passes; pass += 1) {
    const i = Math.floor(random() * (length - 2));
    const j = i + 2 + Math.floor(random() * (length - i - 3));
    if (j >= length - 1) {
      continue;
    }
    const a = path[i];
    const b = path[i + 1];
    const c = path[j];
    const d = path[j + 1];
    if (adjacent(size, a, c) && adjacent(size, b, d)) {
      let left = i + 1;
      let right = j;
      while (left < right) {
        [path[left], path[right]] = [path[right], path[left]];
        left += 1;
        right -= 1;
      }
    }
  }
  return path;
}

function validateHamiltonian(path, size) {
  const total = size * size;
  if (path.length !== total || new Set(path).size !== total) {
    return false;
  }
  for (const cell of path) {
    if (!Number.isInteger(cell) || cell < 0 || cell >= total) {
      return false;
    }
  }
  for (let index = 1; index < path.length; index += 1) {
    if (!adjacent(size, path[index - 1], path[index])) {
      return false;
    }
  }
  return true;
}

function zipSize(level) {
  if (level <= 10) return 4;
  if (level <= 30) return 5;
  if (level <= 55) return 6;
  if (level <= 80) return 7;
  return 8;
}

function zipCheckpointCount(level) {
  if (level <= 10) return 5;
  if (level <= 20) return 5;
  if (level <= 30) return 4;
  if (level <= 40) return 5;
  if (level <= 55) return 4;
  if (level <= 65) return 5;
  if (level <= 80) return 4;
  if (level <= 90) return 5;
  return 4;
}

function makeZipLevel(level) {
  const random = mulberry32(0x7a11 + level * 7919);
  const size = zipSize(level);
  const path = snakePath(size);

  if (random() < 0.5) {
    path.reverse();
  }
  if (random() < 0.5) {
    for (let row = 0; row < size; row += 1) {
      let left = row * size;
      let right = left + size - 1;
      while (left < right) {
        [path[left], path[right]] = [path[right], path[left]];
        left += 1;
        right -= 1;
      }
    }
  }

  twoOpt(path, size, random, size * size * 40);
  if (!validateHamiltonian(path, size)) {
    throw new Error(`Zip level ${level} produced an invalid path`);
  }

  const count = Math.min(zipCheckpointCount(level), path.length);
  const selected = new Set([0, path.length - 1]);
  while (selected.size < count) {
    selected.add(1 + Math.floor(random() * (path.length - 2)));
  }
  const indices = [...selected].sort((a, b) => a - b);
  const checkpoints = indices.map((pathIndex, checkpointIndex) => ({
    value: checkpointIndex + 1,
    cell: path[pathIndex],
  }));

  return {
    id: `zip-${String(level).padStart(3, "0")}`,
    number: level,
    size,
    checkpoints,
    solution: path,
  };
}

function mazeSize(level) {
  if (level <= 15) return 6;
  if (level <= 50) return 7;
  return 8;
}

function mazeTargetFloor(level, size) {
  const base = 9 + Math.floor(((level - 1) * 10) / 99);
  return Math.min(base, Math.max(5, (size - 2) * (size - 2) - 2));
}

function carveMaze(size, targetFloor, random) {
  const grid = Array.from({ length: size }, () => Array(size).fill("#"));
  const startRow = 1 + Math.floor(random() * (size - 2));
  const startCol = 1 + Math.floor(random() * (size - 2));
  grid[startRow][startCol] = ".";
  let floors = 1;
  const frontier = new Set();
  const addFrontier = (row, col) => {
    if (
      row > 0 &&
      row < size - 1 &&
      col > 0 &&
      col < size - 1 &&
      grid[row][col] === "#"
    ) {
      frontier.add(row * size + col);
    }
  };
  addFrontier(startRow - 1, startCol);
  addFrontier(startRow + 1, startCol);
  addFrontier(startRow, startCol - 1);
  addFrontier(startRow, startCol + 1);

  const floorNeighbors = (row, col) => {
    let count = 0;
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      if (grid[row + dr]?.[col + dc] === ".") {
        count += 1;
      }
    }
    return count;
  };

  while (floors < targetFloor && frontier.size > 0) {
    const candidates = [...frontier];
    let chosen = candidates[Math.floor(random() * candidates.length)];
    if (random() < 0.65) {
      let best = chosen;
      let bestScore = floorNeighbors(
        Math.floor(best / size),
        best % size,
      );
      for (const candidate of candidates) {
        const score = floorNeighbors(
          Math.floor(candidate / size),
          candidate % size,
        );
        if (score < bestScore) {
          best = candidate;
          bestScore = score;
        }
      }
      chosen = best;
    }
    const row = Math.floor(chosen / size);
    const col = chosen % size;
    frontier.delete(chosen);
    if (grid[row][col] !== "#") {
      continue;
    }
    grid[row][col] = ".";
    floors += 1;
    addFrontier(row - 1, col);
    addFrontier(row + 1, col);
    addFrontier(row, col - 1);
    addFrontier(row, col + 1);
  }

  const floorCells = [];
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (grid[row][col] === ".") {
        floorCells.push([row, col]);
      }
    }
  }

  const start = floorCells[Math.floor(random() * floorCells.length)];
  return {
    rows: grid.map((row) => row.join("")),
    floorCells,
    start,
  };
}

function mazeTransitions(rows, start) {
  const height = rows.length;
  const width = rows[0].length;
  const floors = [];
  const indexByCell = new Map();
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      if (rows[row][col] === ".") {
        indexByCell.set(row * width + col, floors.length);
        floors.push([row, col]);
      }
    }
  }

  const startIndex = indexByCell.get(start[0] * width + start[1]);
  if (startIndex === undefined) {
    return null;
  }

  const deltas = [
    ["U", -1, 0],
    ["D", 1, 0],
    ["L", 0, -1],
    ["R", 0, 1],
  ];
  const transitions = floors.map(([row, col]) => {
    return deltas.map(([move, dr, dc]) => {
      let currentRow = row;
      let currentCol = col;
      let mask = 0;
      while (true) {
        const nextRow = currentRow + dr;
        const nextCol = currentCol + dc;
        if (
          nextRow < 0 ||
          nextRow >= height ||
          nextCol < 0 ||
          nextCol >= width ||
          rows[nextRow][nextCol] !== "."
        ) {
          break;
        }
        currentRow = nextRow;
        currentCol = nextCol;
        const index = indexByCell.get(currentRow * width + currentCol);
        mask |= 1 << index;
      }
      return {
        move,
        next: indexByCell.get(currentRow * width + currentCol),
        mask,
      };
    });
  });

  return { floors, startIndex, transitions };
}

function solveMaze(rows, start, stateLimit = 700_000) {
  const parsed = mazeTransitions(rows, start);
  if (!parsed) {
    return null;
  }
  const { floors, startIndex, transitions } = parsed;
  if (floors.length > 24) {
    return null;
  }

  const fullMask = 2 ** floors.length - 1;
  const startMask = 1 << startIndex;
  if (startMask === fullMask) {
    return { solution: "", par: 0 };
  }

  const queue = [startIndex * (fullMask + 1) + startMask];
  const parents = new Map();
  parents.set(queue[0], null);
  let head = 0;
  let explored = 0;

  while (head < queue.length) {
    const key = queue[head];
    head += 1;
    explored += 1;
    if (explored > stateLimit) {
      return null;
    }
    const pos = Math.floor(key / (fullMask + 1));
    const mask = key % (fullMask + 1);

    for (const transition of transitions[pos]) {
      const nextMask = mask | transition.mask;
      const nextPos = transition.next;
      if (nextPos === undefined || nextPos === pos) {
        continue;
      }
      const nextKey = nextPos * (fullMask + 1) + nextMask;
      if (parents.has(nextKey)) {
        continue;
      }
      parents.set(nextKey, { previous: key, move: transition.move });
      if (nextMask === fullMask) {
        const moves = [];
        let cursor = nextKey;
        while (cursor !== queue[0]) {
          const parent = parents.get(cursor);
          if (!parent) {
            break;
          }
          moves.push(parent.move);
          cursor = parent.previous;
        }
        moves.reverse();
        return { solution: moves.join(""), par: moves.length };
      }
      queue.push(nextKey);
    }
  }

  return null;
}

function makeMazeLevel(level) {
  const size = mazeSize(level);
  const target = mazeTargetFloor(level, size);
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const random = mulberry32(0x3a2e + level * 104729 + attempt * 97);
    const candidate = carveMaze(size, target, random);
    if (candidate.floorCells.length < target) {
      continue;
    }
    const solved = solveMaze(candidate.rows, candidate.start);
    if (!solved) {
      continue;
    }
    return {
      id: `maze-${String(level).padStart(3, "0")}`,
      number: level,
      width: size,
      height: size,
      rows: candidate.rows,
      start: candidate.start,
      par: solved.par,
      solution: solved.solution,
    };
  }
  throw new Error(`Maze level ${level} could not be generated`);
}

const zipLevels = Array.from({ length: 100 }, (_, index) => makeZipLevel(index + 1));
const mazeLevels = Array.from({ length: 100 }, (_, index) => makeMazeLevel(index + 1));

for (const level of zipLevels) {
  if (!validateHamiltonian(level.solution, level.size)) {
    throw new Error(`Invalid zip level ${level.id}`);
  }
  if (level.checkpoints.length < 3) {
    throw new Error(`Too few checkpoints on ${level.id}`);
  }
}

for (const level of mazeLevels) {
  const result = solveMaze(level.rows, level.start);
  if (!result || result.par !== level.par || result.solution !== level.solution) {
    throw new Error(`Invalid maze level ${level.id}`);
  }
}

function write(file, contents) {
  const target = resolve(root, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents, "utf8");
}

write(
  "src/games/zip/levels.ts",
  `import type { ZipLevel } from "./types";\n\nexport const ZIP_LEVELS: ZipLevel[] = ${JSON.stringify(zipLevels, null, 2)};\n`,
);

write(
  "src/games/maze-paint/levels.ts",
  `import type { MazeLevel } from "./types";\n\nexport const MAZE_LEVELS: MazeLevel[] = ${JSON.stringify(mazeLevels, null, 2)};\n`,
);

console.log(
  `Generated ${zipLevels.length} Zip levels and ${mazeLevels.length} Maze Paint levels.`,
);
console.log(
  `Maze par range: ${Math.min(...mazeLevels.map((level) => level.par))}-${Math.max(...mazeLevels.map((level) => level.par))}.`,
);
console.log(
  `Maze floor range: ${Math.min(...mazeLevels.map((level) => level.rows.join("").split(".").length - 1))}-${Math.max(...mazeLevels.map((level) => level.rows.join("").split(".").length - 1))}.`,
);
