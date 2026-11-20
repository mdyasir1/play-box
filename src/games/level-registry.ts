import {
  GAME_IDS,
  type GameId,
  type LevelConfig,
} from "@/lib/games/contracts";

import { GAME_DEFINITION_BY_ID } from "./definitions";
import { MEMORY_CHALLENGE_LEVELS } from "./memory-challenge/level-config";
import { NEON_SURVIVAL_LEVELS } from "./neon-survival/level-config";
import { NUMBER_MERGE_LEVELS } from "./number-merge/level-config";
import { REACTION_RUSH_LEVELS } from "./reaction-rush/level-config";
import { WORD_MASTER_LEVELS } from "./word-master/level-config";

export const GAME_LEVELS = {
  "reaction-rush": REACTION_RUSH_LEVELS,
  "word-master": WORD_MASTER_LEVELS,
  "number-merge": NUMBER_MERGE_LEVELS,
  "memory-challenge": MEMORY_CHALLENGE_LEVELS,
  "neon-survival": NEON_SURVIVAL_LEVELS,
} as const satisfies Record<GameId, readonly LevelConfig<unknown>[]>;

export const GAME_LEVEL_CAPS = {
  "reaction-rush": 10_000,
  "word-master": 1_600,
  "number-merge": 5_000_000,
  "memory-challenge": 1_500,
  "neon-survival": 2_000,
} as const satisfies Record<GameId, number>;

export function getAllLevelConfigs(
  gameId: GameId,
): readonly LevelConfig<unknown>[] {
  return GAME_LEVELS[gameId];
}

export function getLevelConfig(
  gameId: GameId,
  level: number,
): LevelConfig<unknown> | undefined {
  if (!Number.isInteger(level) || level < 1) {
    return undefined;
  }

  return GAME_LEVELS[gameId].find((config) => config.level === level);
}

export function validateLevelRegistry(): string[] {
  const errors: string[] = [];

  for (const gameId of GAME_IDS) {
    const definition = GAME_DEFINITION_BY_ID[gameId];
    const levels = GAME_LEVELS[gameId];

    if (levels.length !== definition.maxLevel) {
      errors.push(
        `${gameId}: expected ${definition.maxLevel} levels, found ${levels.length}`,
      );
    }

    if (GAME_LEVEL_CAPS[gameId] <= 0) {
      errors.push(`${gameId}: score cap must be positive`);
    }

    levels.forEach((config, index) => {
      const expectedLevel = index + 1;

      if (config.level !== expectedLevel) {
        errors.push(
          `${gameId}: expected level ${expectedLevel}, found ${config.level}`,
        );
      }

      if (config.maxScore !== GAME_LEVEL_CAPS[gameId]) {
        errors.push(`${gameId}: level ${config.level} has an invalid score cap`);
      }

      if (config.completionValue <= 0) {
        errors.push(
          `${gameId}: level ${config.level} has an invalid completion value`,
        );
      }

      if (
        typeof config.custom !== "object" ||
        config.custom === null ||
        Array.isArray(config.custom)
      ) {
        errors.push(`${gameId}: level ${config.level} has invalid custom data`);
      }
    });
  }

  return errors;
}
