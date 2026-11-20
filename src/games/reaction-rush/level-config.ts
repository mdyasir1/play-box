import type {
  DifficultyLabel,
  LevelConfig,
} from "@/lib/games/contracts";

export const REACTION_RUSH_CONFIG_VERSION = "reaction-rush:1";

export type ReactionRushCustom = {
  rounds: number;
  delayMinMs: number;
  delayMaxMs: number;
  requiredAverageMs: number;
  maxFalseStarts: number;
};

type ReactionRushRow = readonly [
  level: number,
  rounds: number,
  delayMinMs: number,
  delayMaxMs: number,
  requiredAverageMs: number,
  maxFalseStarts: number,
  difficultyLabel: DifficultyLabel,
];

const ROWS = [
  [1, 5, 2000, 4000, 450, 2, "Intro"],
  [2, 6, 1500, 3500, 425, 2, "Easy"],
  [3, 6, 1200, 3500, 400, 1, "Easy"],
  [4, 7, 1000, 3000, 390, 1, "Normal"],
  [5, 7, 900, 2800, 380, 1, "Normal"],
  [6, 8, 800, 2500, 370, 0, "Hard"],
  [7, 8, 700, 2500, 360, 0, "Hard"],
  [8, 9, 600, 2200, 350, 0, "Expert"],
  [9, 9, 500, 2000, 340, 0, "Expert"],
  [10, 10, 400, 1800, 330, 0, "Master"],
] as const satisfies readonly ReactionRushRow[];

export const REACTION_RUSH_LEVELS = ROWS.map(
  ([
    level,
    rounds,
    delayMinMs,
    delayMaxMs,
    requiredAverageMs,
    maxFalseStarts,
    difficultyLabel,
  ]): LevelConfig<ReactionRushCustom> => ({
    level,
    difficultyLabel,
    completionKind: "average-reaction",
    completionValue: requiredAverageMs,
    maxScore: 10_000,
    custom: {
      rounds,
      delayMinMs,
      delayMaxMs,
      requiredAverageMs,
      maxFalseStarts,
    },
  }),
);
