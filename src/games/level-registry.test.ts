import { describe, expect, expectTypeOf, it } from "vitest";

import { GAME_IDS, type GameId } from "@/lib/games/contracts";

import { GAME_DEFINITIONS } from "./definitions";

function first<T>(items: readonly T[]): T {
  const item = items[0];

  if (item === undefined) {
    throw new Error("Expected at least one item");
  }

  return item;
}
import {
  GAME_LEVELS,
  GAME_LEVEL_CAPS,
  getAllLevelConfigs,
  getLevelConfig,
  validateLevelRegistry,
} from "./level-registry";

describe("game definitions", () => {
  it("contains exactly the five approved games", () => {
    expect(GAME_DEFINITIONS.map((game) => game.id)).toEqual([...GAME_IDS]);
    expectTypeOf(GAME_DEFINITIONS[0].id).toMatchTypeOf<GameId>();
  });

  it("declares ten levels and a config version for every game", () => {
    for (const game of GAME_DEFINITIONS) {
      expect(game.maxLevel).toBe(10);
      expect(game.configVersion).toMatch(/^[a-z-]+:1$/);
      expect(game.instructions.length).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("level registry", () => {
  it("registers all five games with sequential levels 1 through 10", () => {
    expect(validateLevelRegistry()).toEqual([]);

    for (const gameId of GAME_IDS) {
      const levels = getAllLevelConfigs(gameId);
      expect(levels).toHaveLength(10);
      expect(levels.map((config) => config.level)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ]);
      expect(getLevelConfig(gameId, 10)?.difficultyLabel).toBe("Master");
    }
  });

  it("returns undefined for invalid levels", () => {
    expect(getLevelConfig("reaction-rush", 0)).toBeUndefined();
    expect(getLevelConfig("reaction-rush", 11)).toBeUndefined();
    expect(getLevelConfig("reaction-rush", 1.5)).toBeUndefined();
    expect(getLevelConfig("reaction-rush", Number.NaN)).toBeUndefined();
  });

  it("matches the documented server score caps", () => {
    expect(GAME_LEVEL_CAPS).toEqual({
      "reaction-rush": 10_000,
      "word-master": 1_600,
      "number-merge": 5_000_000,
      "memory-challenge": 1_500,
      "neon-survival": 2_000,
    });

    for (const gameId of GAME_IDS) {
      for (const config of GAME_LEVELS[gameId]) {
        expect(config.maxScore).toBe(GAME_LEVEL_CAPS[gameId]);
      }
    }
  });

  it("keeps difficulty moving in the documented direction", () => {
    const reaction = getAllLevelConfigs("reaction-rush").map(
      (config) => config.custom as {
        rounds: number;
        delayMinMs: number;
        requiredAverageMs: number;
        maxFalseStarts: number;
      },
    );
    const reactionFirst = first(reaction);
    expect(reaction.at(-1)?.rounds).toBeGreaterThan(reactionFirst.rounds);
    expect(reaction.at(-1)?.requiredAverageMs).toBeLessThan(
      reactionFirst.requiredAverageMs,
    );
    expect(reaction.at(-1)?.delayMinMs).toBeLessThan(
      reactionFirst.delayMinMs,
    );
    expect(reaction.at(-1)?.maxFalseStarts).toBeLessThanOrEqual(
      reactionFirst.maxFalseStarts,
    );

    const word = getAllLevelConfigs("word-master").map(
      (config) => config.custom as { hints: number; dailyEnabled: boolean },
    );
    expect(word.at(-1)?.hints).toBe(0);
    expect(word.at(-1)?.dailyEnabled).toBe(true);

    const merge = getAllLevelConfigs("number-merge").map(
      (config) => config.custom as {
        boardSize: number;
        targetTile: number;
        undos: number;
      },
    );
    expect(merge.at(-1)?.boardSize).toBe(6);
    expect(merge.at(-1)?.targetTile).toBe(8192);
    expect(merge.at(-1)?.undos).toBe(1);

    const memory = getAllLevelConfigs("memory-challenge").map(
      (config) => config.custom as {
        targetLength: number;
        playbackOnMs: number;
      },
    );
    expect(memory.at(-1)?.targetLength).toBe(13);
    expect(memory.at(-1)?.playbackOnMs).toBeLessThan(
      first(memory).playbackOnMs,
    );

    const neon = getAllLevelConfigs("neon-survival").map(
      (config) => config.custom as {
        surviveSeconds: number;
        obstacleSpeed: number;
        spawnIntervalSeconds: number;
      },
    );
    expect(neon.at(-1)?.surviveSeconds).toBe(75);
    expect(neon.at(-1)?.obstacleSpeed).toBeGreaterThan(
      first(neon).obstacleSpeed,
    );
    expect(neon.at(-1)?.spawnIntervalSeconds).toBeLessThan(
      first(neon).spawnIntervalSeconds,
    );
  });
});
