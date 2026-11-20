import type {
  ProgressSnapshot,
  ResultSubmission,
} from "@/lib/games/contracts";
import { GAME_DEFINITION_BY_ID } from "@/games/definitions";

import {
  MAX_ACTIVITY_ENTRIES,
  MAX_PENDING_RESULTS,
} from "./schema";
import { normalizeResultSubmission } from "./validation";

type ApplyResultOptions = {
  now?: Date;
};

export function applyResultToSnapshot(
  snapshot: ProgressSnapshot,
  submission: ResultSubmission,
  { now = new Date() }: ApplyResultOptions = {},
): ProgressSnapshot {
  const result = normalizeResultSubmission(submission);

  if (!result) {
    throw new RangeError("Cannot apply an invalid result submission");
  }

  const alreadyRecorded =
    snapshot.pending.some(
      (entry) => entry.idempotencyKey === result.idempotencyKey,
    ) ||
    snapshot.activity.some((entry) => entry.id === result.idempotencyKey);

  if (alreadyRecorded) {
    return snapshot;
  }

  const maxLevel = GAME_DEFINITION_BY_ID[result.gameId].maxLevel;
  const previous = snapshot.games[result.gameId];
  const won = result.result === "win";
  const completedLevels = won
    ? [...new Set([...previous.completedLevels, result.level])].sort(
        (a, b) => a - b,
      )
    : previous.completedLevels;
  const unlockedLevel = won
    ? Math.min(maxLevel, Math.max(previous.unlockedLevel, result.level + 1))
    : previous.unlockedLevel;
  const perLevelBest = won
    ? {
        ...previous.perLevelBest,
        [result.level]: Math.max(
          previous.perLevelBest[result.level] ?? 0,
          result.score,
        ),
      }
    : previous.perLevelBest;

  return {
    ...snapshot,
    games: {
      ...snapshot.games,
      [result.gameId]: {
        unlockedLevel,
        completedLevels,
        bestScore: won
          ? Math.max(previous.bestScore, result.score)
          : previous.bestScore,
        perLevelBest,
        totalPlays: previous.totalPlays + 1,
      },
    },
    activity: [
      {
        id: result.idempotencyKey,
        gameId: result.gameId,
        level: result.level,
        score: result.score,
        result: result.result,
        completedAt: result.completedAt,
      },
      ...snapshot.activity,
    ].slice(0, MAX_ACTIVITY_ENTRIES),
    pending: [...snapshot.pending, result].slice(-MAX_PENDING_RESULTS),
    updatedAt: now.toISOString(),
  };
}
