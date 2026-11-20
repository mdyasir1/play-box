import type { GameDefinition, GameId } from "@/lib/games/contracts";

import { MEMORY_CHALLENGE_DEFINITION } from "./memory-challenge/definition";
import { NEON_SURVIVAL_DEFINITION } from "./neon-survival/definition";
import { NUMBER_MERGE_DEFINITION } from "./number-merge/definition";
import { REACTION_RUSH_DEFINITION } from "./reaction-rush/definition";
import { WORD_MASTER_DEFINITION } from "./word-master/definition";

export const GAME_DEFINITIONS = [
  REACTION_RUSH_DEFINITION,
  WORD_MASTER_DEFINITION,
  NUMBER_MERGE_DEFINITION,
  MEMORY_CHALLENGE_DEFINITION,
  NEON_SURVIVAL_DEFINITION,
] as const satisfies readonly GameDefinition[];

export const GAME_DEFINITION_BY_ID = {
  "reaction-rush": REACTION_RUSH_DEFINITION,
  "word-master": WORD_MASTER_DEFINITION,
  "number-merge": NUMBER_MERGE_DEFINITION,
  "memory-challenge": MEMORY_CHALLENGE_DEFINITION,
  "neon-survival": NEON_SURVIVAL_DEFINITION,
} as const satisfies Record<GameId, GameDefinition>;

export function getGameDefinition(gameId: string): GameDefinition | undefined {
  return GAME_DEFINITIONS.find((game) => game.id === gameId);
}
