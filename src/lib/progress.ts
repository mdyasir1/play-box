import type { GameSlug } from "./games";
import { isGuestMode } from "./session";

export const LEVEL_COUNT = 200;
export const PROGRESS_STORAGE_KEY = "playbox.v4.progress";

export interface GameProgress {
  completed: number[];
  bestScores: Record<string, number>;
  lastLevel: number;
}

export interface ProgressState {
  version: 4;
  games: Record<GameSlug, GameProgress>;
  updatedAt: number;
}

export interface RemoteGameProgress {
  currentLevel: number;
  completed: number[];
  bestScores: Record<string, number>;
}

function createGameProgress(): GameProgress {
  return { completed: [], bestScores: {}, lastLevel: 1 };
}

export function createDefaultProgress(): ProgressState {
  return {
    version: 4,
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

function validLevel(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) >= 1 && (value as number) <= LEVEL_COUNT;
}

function validScore(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function parseGameProgress(value: unknown, levelCount = LEVEL_COUNT): GameProgress {
  if (!isRecord(value)) return createGameProgress();

  const completed = Array.isArray(value.completed)
    ? [...new Set(value.completed.filter((level): level is number => validLevel(level) && level <= levelCount))].sort((a, b) => a - b)
    : [];

  const bestScores: Record<string, number> = {};
  if (isRecord(value.bestScores)) {
    for (const [key, score] of Object.entries(value.bestScores)) {
      const level = Number(key);
      if (validLevel(level) && level <= levelCount && validScore(score)) {
        bestScores[key] = score;
      }
    }
  }

  const lastLevel =
    typeof value.lastLevel === "number" &&
    validLevel(value.lastLevel) &&
    value.lastLevel <= levelCount
      ? value.lastLevel
      : 1;

  return { completed, bestScores, lastLevel };
}

export function parseProgress(value: unknown): ProgressState {
  if (!isRecord(value) || value.version !== 4 || !isRecord(value.games)) {
    return createDefaultProgress();
  }

  return {
    version: 4,
    games: {
      zip: parseGameProgress(value.games.zip),
      "maze-paint": parseGameProgress(value.games["maze-paint"]),
    },
    updatedAt:
      typeof value.updatedAt === "number" && Number.isFinite(value.updatedAt)
        ? value.updatedAt
        : 0,
  };
}

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadProgress(storage?: Storage | null): ProgressState {
  if (isGuestMode()) return createDefaultProgress();
  const target = storage === undefined ? getStorage() : storage;
  if (!target) return createDefaultProgress();

  try {
    const raw = target.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    return parseProgress(JSON.parse(raw));
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress: ProgressState, storage?: Storage | null): boolean {
  if (isGuestMode()) return false;
  const target = storage === undefined ? getStorage() : storage;
  if (!target) return false;

  try {
    target.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function isLevelUnlocked(progress: ProgressState, game: GameSlug, level: number): boolean {
  if (!validLevel(level)) return false;
  return level === 1 || progress.games[game].completed.includes(level - 1);
}

export function highestUnlockedLevel(progress: ProgressState, game: GameSlug): number {
  const completed = progress.games[game].completed;
  const highestCompleted = completed.length ? Math.max(...completed) : 0;
  return Math.min(LEVEL_COUNT, Math.max(1, highestCompleted + 1));
}

export function markLevelComplete(
  progress: ProgressState,
  game: GameSlug,
  level: number,
  score: number,
  levelCount = LEVEL_COUNT,
): ProgressState {
  if (!validLevel(level) || level > levelCount || !validScore(score)) return progress;

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
        lastLevel: Math.max(previous.lastLevel, Math.min(level + 1, levelCount)),
      },
    },
    updatedAt: Date.now(),
  };
}

export function setCurrentLevel(
  progress: ProgressState,
  game: GameSlug,
  level: number,
  levelCount = LEVEL_COUNT,
): ProgressState {
  if (!validLevel(level) || level > levelCount || !isLevelUnlocked(progress, game, level)) {
    return progress;
  }
  if (progress.games[game].lastLevel === level) return progress;

  return {
    ...progress,
    games: {
      ...progress.games,
      [game]: { ...progress.games[game], lastLevel: level },
    },
    updatedAt: Date.now(),
  };
}

export function isLevelComplete(progress: ProgressState, game: GameSlug, level: number): boolean {
  return progress.games[game].completed.includes(level);
}

export function completedCount(progress: ProgressState, game: GameSlug): number {
  return progress.games[game].completed.length;
}

export function bestScore(progress: ProgressState, game: GameSlug, level: number): number | null {
  const score = progress.games[game].bestScores[String(level)];
  return score === undefined ? null : score;
}

export function mergeRemoteProgress(
  progress: ProgressState,
  game: GameSlug,
  remote: RemoteGameProgress | null,
): ProgressState {
  if (!remote) return progress;

  const local = progress.games[game];
  const remoteCompleted = Array.isArray(remote.completed)
    ? remote.completed.filter((level): level is number => validLevel(level))
    : [];
  const completed = [...new Set([...local.completed, ...remoteCompleted])].sort((a, b) => a - b);

  const bestScores = { ...local.bestScores };
  if (isRecord(remote.bestScores)) {
    for (const [key, score] of Object.entries(remote.bestScores)) {
      const level = Number(key);
      if (!validLevel(level) || !validScore(score)) continue;
      const existing = bestScores[key];
      if (existing === undefined || score < existing) bestScores[key] = score;
    }
  }

  const remoteLevel =
    validLevel(remote.currentLevel) ? Math.min(remote.currentLevel, LEVEL_COUNT) : 1;
  const lastLevel = Math.max(local.lastLevel, remoteLevel);

  return {
    ...progress,
    games: { ...progress.games, [game]: { completed, bestScores, lastLevel } },
    updatedAt: Date.now(),
  };
}
