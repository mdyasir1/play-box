import { GAME_ID_SET } from "@/lib/games/contracts";
import type {
  ActivityEntry,
  GameId,
  GameProgress,
  ProgressSnapshot,
  ResultSubmission,
} from "@/lib/games/contracts";
import { GAME_DEFINITION_BY_ID } from "@/games/definitions";
import { GAME_LEVEL_CAPS } from "@/games/level-registry";

import {
  CURRENT_SCHEMA_VERSION,
  MAX_ACTIVITY_ENTRIES,
  MAX_PENDING_RESULTS,
  MAX_SUBMISSION_DURATION_MS,
  createEmptyGameProgress,
  isIntegerInRange,
  isIsoTimestamp,
  isRecord,
  isUuidV4,
} from "./schema";

export type SnapshotValidationResult =
  | { ok: true; snapshot: ProgressSnapshot }
  | {
      ok: false;
      reason: "invalid" | "future-version";
      version?: number;
    };

function isGameId(value: unknown): value is GameId {
  return typeof value === "string" && GAME_ID_SET.has(value as GameId);
}

function normalizeGameProgress(
  value: unknown,
  gameId: GameId,
): GameProgress | null {
  if (!isRecord(value)) {
    return null;
  }

  const maxLevel = GAME_DEFINITION_BY_ID[gameId].maxLevel;
  const scoreCap = GAME_LEVEL_CAPS[gameId];

  if (!isIntegerInRange(value.unlockedLevel, 1, maxLevel)) {
    return null;
  }

  if (!Array.isArray(value.completedLevels)) {
    return null;
  }

  const completedLevels = new Set<number>();

  for (const level of value.completedLevels) {
    if (!isIntegerInRange(level, 1, maxLevel)) {
      return null;
    }

    completedLevels.add(level);
  }

  const sortedLevels = [...completedLevels].sort((a, b) => a - b);
  const highestCompleted = sortedLevels.at(-1) ?? 0;
  const unlockedLevel = Math.min(
    maxLevel,
    Math.max(value.unlockedLevel, highestCompleted + 1),
  );

  if (!isIntegerInRange(value.bestScore, 0, scoreCap)) {
    return null;
  }

  if (!isRecord(value.perLevelBest)) {
    return null;
  }

  const perLevelBest: Record<number, number> = {};

  for (const [key, score] of Object.entries(value.perLevelBest)) {
    const level = Number(key);

    if (
      !isIntegerInRange(level, 1, maxLevel) ||
      !isIntegerInRange(score, 0, scoreCap)
    ) {
      return null;
    }

    perLevelBest[level] = score;
  }

  if (!isIntegerInRange(value.totalPlays, 0, Number.MAX_SAFE_INTEGER)) {
    return null;
  }

  const bestPerLevel = Math.max(0, ...Object.values(perLevelBest));

  return {
    unlockedLevel,
    completedLevels: sortedLevels,
    bestScore: Math.min(scoreCap, Math.max(value.bestScore, bestPerLevel)),
    perLevelBest,
    totalPlays: value.totalPlays,
  };
}

export function normalizeResultSubmission(
  value: unknown,
): ResultSubmission | null {
  if (!isRecord(value)) {
    return null;
  }

  const { gameId, level, score, durationMs } = value;

  if (!isGameId(gameId)) {
    return null;
  }

  const maxLevel = GAME_DEFINITION_BY_ID[gameId].maxLevel;
  const scoreCap = GAME_LEVEL_CAPS[gameId];

  if (!isIntegerInRange(level, 1, maxLevel)) {
    return null;
  }

  if (!isIntegerInRange(score, 0, scoreCap)) {
    return null;
  }

  if (!isIntegerInRange(durationMs, 0, MAX_SUBMISSION_DURATION_MS)) {
    return null;
  }

  if (value.result !== "win" && value.result !== "loss") {
    return null;
  }

  if (!isIsoTimestamp(value.completedAt)) {
    return null;
  }

  if (!isUuidV4(value.idempotencyKey)) {
    return null;
  }

  if (
    typeof value.clientVersion !== "string" ||
    value.clientVersion.length === 0 ||
    value.clientVersion.length > 32
  ) {
    return null;
  }

  if (
    typeof value.levelConfigVersion !== "string" ||
    value.levelConfigVersion.length === 0 ||
    value.levelConfigVersion.length > 64
  ) {
    return null;
  }

  return {
    idempotencyKey: value.idempotencyKey,
    gameId,
    level,
    score,
    durationMs,
    result: value.result,
    completedAt: value.completedAt,
    clientVersion: value.clientVersion,
    levelConfigVersion: value.levelConfigVersion,
  };
}

function normalizeActivityEntry(value: unknown): ActivityEntry | null {
  if (!isRecord(value) || !isGameId(value.gameId)) {
    return null;
  }

  const maxLevel = GAME_DEFINITION_BY_ID[value.gameId].maxLevel;
  const scoreCap = GAME_LEVEL_CAPS[value.gameId];

  if (
    !isUuidV4(value.id) ||
    !isIntegerInRange(value.level, 1, maxLevel) ||
    !isIntegerInRange(value.score, 0, scoreCap) ||
    (value.result !== "win" && value.result !== "loss") ||
    !isIsoTimestamp(value.completedAt)
  ) {
    return null;
  }

  return {
    id: value.id,
    gameId: value.gameId,
    level: value.level,
    score: value.score,
    result: value.result,
    completedAt: value.completedAt,
  };
}

function normalizeAchievements(
  value: unknown,
): Record<string, string> | null {
  if (!isRecord(value)) {
    return null;
  }

  const achievements: Record<string, string> = {};

  for (const [achievementId, unlockedAt] of Object.entries(value)) {
    if (
      achievementId.length === 0 ||
      achievementId.length > 100 ||
      !isIsoTimestamp(unlockedAt)
    ) {
      return null;
    }

    achievements[achievementId] = unlockedAt;
  }

  return achievements;
}

function normalizeActivity(value: unknown): ActivityEntry[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const activity: ActivityEntry[] = [];
  const seen = new Set<string>();

  for (const entry of value.slice(0, MAX_ACTIVITY_ENTRIES)) {
    const normalized = normalizeActivityEntry(entry);

    if (!normalized) {
      return null;
    }

    if (!seen.has(normalized.id)) {
      seen.add(normalized.id);
      activity.push(normalized);
    }
  }

  return activity;
}

function normalizePending(value: unknown): ResultSubmission[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const pending: ResultSubmission[] = [];
  const seen = new Set<string>();

  for (const entry of value) {
    const normalized = normalizeResultSubmission(entry);

    if (!normalized) {
      return null;
    }

    if (!seen.has(normalized.idempotencyKey)) {
      seen.add(normalized.idempotencyKey);
      pending.push(normalized);
    }
  }

  return pending.slice(-MAX_PENDING_RESULTS);
}

export function validateSnapshot(value: unknown): SnapshotValidationResult {
  if (!isRecord(value)) {
    return { ok: false, reason: "invalid" };
  }

  const version = value.schemaVersion;

  if (
    typeof version !== "number" ||
    !Number.isInteger(version) ||
    version < 0
  ) {
    return { ok: false, reason: "invalid" };
  }

  if (version > CURRENT_SCHEMA_VERSION) {
    return { ok: false, reason: "future-version", version };
  }

  if (version !== CURRENT_SCHEMA_VERSION) {
    return { ok: false, reason: "invalid", version };
  }

  if (!isUuidV4(value.installationId) || !isIsoTimestamp(value.updatedAt)) {
    return { ok: false, reason: "invalid" };
  }

  if (!isRecord(value.games)) {
    return { ok: false, reason: "invalid" };
  }

  const games = {} as Record<GameId, GameProgress>;

  for (const gameId of Object.keys(GAME_DEFINITION_BY_ID) as GameId[]) {
    const rawGame = value.games[gameId];

    if (rawGame === undefined) {
      games[gameId] = createEmptyGameProgress();
      continue;
    }

    const normalized = normalizeGameProgress(rawGame, gameId);

    if (!normalized) {
      return { ok: false, reason: "invalid" };
    }

    games[gameId] = normalized;
  }

  const achievements = normalizeAchievements(value.achievements);
  const activity = normalizeActivity(value.activity);
  const pending = normalizePending(value.pending);

  if (!achievements || !activity || !pending) {
    return { ok: false, reason: "invalid" };
  }

  return {
    ok: true,
    snapshot: {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      installationId: value.installationId,
      games,
      achievements,
      activity,
      pending,
      updatedAt: value.updatedAt,
    },
  };
}
