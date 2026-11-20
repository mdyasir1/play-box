import { describe, expect, it } from "vitest";

import type {
  ProgressSnapshot,
  ResultSubmission,
} from "@/lib/games/contracts";

import { applyResultToSnapshot } from "./apply-result";
import {
  createEmptySnapshot,
  createInstallationId,
} from "./schema";

const NOW = new Date("2026-11-21T12:00:00.000Z");

function makeSnapshot(): ProgressSnapshot {
  return createEmptySnapshot(createInstallationId(), NOW);
}

function makeResult(
  overrides: Partial<ResultSubmission> = {},
): ResultSubmission {
  return {
    idempotencyKey: createInstallationId(),
    gameId: "reaction-rush",
    level: 1,
    score: 900,
    durationMs: 5_000,
    result: "win",
    completedAt: "2026-11-21T11:59:00.000Z",
    clientVersion: "0.3.0",
    levelConfigVersion: "reaction-rush:1",
    ...overrides,
  };
}

describe("applyResultToSnapshot", () => {
  it("unlocks the next level and records a win", () => {
    const snapshot = makeSnapshot();
    const result = makeResult();
    const next = applyResultToSnapshot(snapshot, result, { now: NOW });
    const game = next.games["reaction-rush"];

    expect(game.unlockedLevel).toBe(2);
    expect(game.completedLevels).toEqual([1]);
    expect(game.bestScore).toBe(900);
    expect(game.perLevelBest).toEqual({ 1: 900 });
    expect(game.totalPlays).toBe(1);
    expect(next.activity[0]).toMatchObject({
      id: result.idempotencyKey,
      result: "win",
      level: 1,
    });
    expect(next.pending).toHaveLength(1);
    expect(next.updatedAt).toBe(NOW.toISOString());
    expect(snapshot.games["reaction-rush"].totalPlays).toBe(0);
  });

  it("records a loss without unlocking or updating best scores", () => {
    const snapshot = makeSnapshot();
    snapshot.games["reaction-rush"] = {
      unlockedLevel: 2,
      completedLevels: [1],
      bestScore: 800,
      perLevelBest: { 1: 800 },
      totalPlays: 3,
    };

    const next = applyResultToSnapshot(
      snapshot,
      makeResult({ level: 2, score: 2_000, result: "loss" }),
      { now: NOW },
    );
    const game = next.games["reaction-rush"];

    expect(game.unlockedLevel).toBe(2);
    expect(game.completedLevels).toEqual([1]);
    expect(game.bestScore).toBe(800);
    expect(game.perLevelBest).toEqual({ 1: 800 });
    expect(game.totalPlays).toBe(4);
    expect(next.activity[0]?.result).toBe("loss");
  });

  it("caps level 10 and never unlocks an eleventh level", () => {
    const snapshot = makeSnapshot();
    snapshot.games["reaction-rush"].unlockedLevel = 10;
    snapshot.games["reaction-rush"].completedLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const next = applyResultToSnapshot(
      snapshot,
      makeResult({ level: 10, score: 750 }),
      { now: NOW },
    );

    expect(next.games["reaction-rush"].unlockedLevel).toBe(10);
    expect(next.games["reaction-rush"].completedLevels).toContain(10);
  });

  it("is idempotent for a repeated submission key", () => {
    const snapshot = makeSnapshot();
    const result = makeResult();
    const first = applyResultToSnapshot(snapshot, result, { now: NOW });
    const second = applyResultToSnapshot(first, result, { now: NOW });

    expect(second).toBe(first);
    expect(second.games["reaction-rush"].totalPlays).toBe(1);
    expect(second.pending).toHaveLength(1);
  });

  it("keeps the pending queue capped at 100", () => {
    let snapshot = makeSnapshot();
    const keys: string[] = [];

    for (let index = 0; index < 101; index += 1) {
      const result = makeResult({
        level: 2,
        result: "loss",
        completedAt: `2026-11-21T11:${String(index % 60).padStart(2, "0")}:00.000Z`,
      });
      keys.push(result.idempotencyKey);
      snapshot = applyResultToSnapshot(snapshot, result, { now: NOW });
    }

    expect(snapshot.pending).toHaveLength(100);
    expect(snapshot.pending.map((entry) => entry.idempotencyKey)).toEqual(
      keys.slice(-100),
    );
    expect(snapshot.games["reaction-rush"].totalPlays).toBe(101);
  });

  it("rejects invalid submissions instead of writing them", () => {
    const snapshot = makeSnapshot();

    expect(() =>
      applyResultToSnapshot(
        snapshot,
        makeResult({ gameId: "tic-tac-toe" as never }),
      ),
    ).toThrow(RangeError);
    expect(() =>
      applyResultToSnapshot(snapshot, makeResult({ score: 10_001 })),
    ).toThrow(RangeError);
  });
});
