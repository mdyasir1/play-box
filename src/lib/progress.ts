import type { GameSlug } from "./games";

export const PROGRESS_STORAGE_KEY = "playbox.v3.progress";

export interface GameProgress {
  completed: number[];
  bestScores: Record<string, number>;
  lastLevel: number;
}

export interface ProgressState {
  version: 3;
  games: Record<GameSlug, GameProgress>;
  updatedAt: number;
}

function createGameProgress(): GameProgress {
  return {
    completed: [],
    bestScores: {},
    lastLevel: 1,
  };
}

export function createDefaultProgress(): ProgressState {
  return {
    version: 3,
    games: {
      zip: createGameProgress(),
      "maze-paint": createGameProgress(),
    },
    updatedAt: 0,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseGameProgress(value: unknown, levelCount: number): GameProgress {
  if (!isRecord(value)) {
    return createGameProgress();
  }

  const completed = Array.isArray(value.completed)
    ? [
        ...new Set(
          value.completed.filter(
            (level): level is number =>
              Number.isInteger(level) && level >= 1 && level <= levelCount,
          ),
        ),
      ].sort((a, b) => a - b)
    : [];

  const bestScores: Record<string, number> = {};
  if (isRecord(value.bestScores)) {
    for (const [key, score] of Object.entries(value.bestScores)) {
      const level = Number(key);
      if (
        Number.isInteger(level) &&
        level >= 1 &&
        level <= levelCount &&
        typeof score === "number" &&
        Number.isFinite(score) &&
        score >= 0
      ) {
        bestScores[key] = score;
      }
    }
  }

  const lastLevel =
    typeof value.lastLevel === "number" &&
    Number.isInteger(value.lastLevel) &&
    value.lastLevel >= 1 &&
    value.lastLevel <= levelCount
      ? value.lastLevel
      : 1;

  return { completed, bestScores, lastLevel };
}

export function parseProgress(value: unknown): ProgressState {
  if (
    !isRecord(value) ||
    value.version !== 3 ||
    !isRecord(value.games)
  ) {
    return createDefaultProgress();
  }

  return {
    version: 3,
    games: {
      zip: parseGameProgress(value.games.zip, 100),
      "maze-paint": parseGameProgress(value.games["maze-paint"], 100),
    },
    updatedAt:
      typeof value.updatedAt === "number" && Number.isFinite(value.updatedAt)
        ? value.updatedAt
        : 0,
  };
}

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") {
      return null;
    }
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadProgress(storage?: Storage | null): ProgressState {
  const target = storage === undefined ? getStorage() : storage;
  if (!target) {
    return createDefaultProgress();
  }

  try {
    const raw = target.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return createDefaultProgress();
    }
    return parseProgress(JSON.parse(raw));
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(
  progress: ProgressState,
  storage?: Storage | null,
): boolean {
  const target = storage === undefined ? getStorage() : storage;
  if (!target) {
    return false;
  }

  try {
    target.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function markLevelComplete(
  progress: ProgressState,
  game: GameSlug,
  level: number,
  score: number,
  levelCount = 100,
): ProgressState {
  const previous = progress.games[game];
  const completed = previous.completed.includes(level)
    ? previous.completed
    : [...previous.completed, level].sort((a, b) => a - b);

  const key = String(level);
  const existing = previous.bestScores[key];
  const bestScores =
    existing === undefined || score < existing
      ? { ...previous.bestScores, [key]: score }
      : previous.bestScores;

  return {
    ...progress,
    games: {
      ...progress.games,
      [game]: {
        completed,
        bestScores,
        lastLevel: Math.max(
          previous.lastLevel,
          Math.min(level + 1, levelCount),
        ),
      },
    },
    updatedAt: Date.now(),
  };
}

export function setCurrentLevel(
  progress: ProgressState,
  game: GameSlug,
  level: number,
  levelCount = 100,
): ProgressState {
  if (
    !Number.isInteger(level) ||
    level < 1 ||
    level > levelCount ||
    progress.games[game].lastLevel === level
  ) {
    return progress;
  }

  return {
    ...progress,
    games: {
      ...progress.games,
      [game]: {
        ...progress.games[game],
        lastLevel: level,
      },
    },
    updatedAt: Date.now(),
  };
}

export function isLevelComplete(
  progress: ProgressState,
  game: GameSlug,
  level: number,
): boolean {
  return progress.games[game].completed.includes(level);
}

export function completedCount(
  progress: ProgressState,
  game: GameSlug,
): number {
  return progress.games[game].completed.length;
}

export function bestScore(
  progress: ProgressState,
  game: GameSlug,
  level: number,
): number | null {
  const score = progress.games[game].bestScores[String(level)];
  return score === undefined ? null : score;
}
