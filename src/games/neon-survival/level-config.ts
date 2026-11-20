import type {
  DifficultyLabel,
  LevelConfig,
} from "@/lib/games/contracts";

export const NEON_SURVIVAL_CONFIG_VERSION = "neon-survival:1";

export type NeonPattern = "straight" | "sine" | "mixed" | "zigzag" | "mixed-dense" | "all";

export type NeonSurvivalCustom = {
  surviveSeconds: number;
  obstacleSpeed: number;
  spawnIntervalSeconds: number;
  patterns: readonly NeonPattern[];
  powerUps: boolean;
};

type NeonSurvivalRow = readonly [
  level: number,
  surviveSeconds: number,
  obstacleSpeed: number,
  spawnIntervalSeconds: number,
  patterns: readonly NeonPattern[],
  powerUps: boolean,
  difficultyLabel: DifficultyLabel,
];

const ROWS = [
  [1, 20, 260, 1.6, ["straight"], false, "Intro"],
  [2, 25, 300, 1.4, ["straight"], false, "Easy"],
  [3, 30, 340, 1.25, ["sine"], false, "Easy"],
  [4, 35, 380, 1.1, ["sine", "straight"], false, "Normal"],
  [5, 40, 420, 1, ["mixed"], true, "Normal"],
  [6, 45, 460, 0.9, ["mixed", "zigzag"], true, "Hard"],
  [7, 50, 500, 0.8, ["zigzag"], true, "Hard"],
  [8, 55, 550, 0.7, ["mixed-dense"], true, "Expert"],
  [9, 60, 600, 0.65, ["mixed-dense"], true, "Expert"],
  [10, 75, 660, 0.6, ["all"], true, "Master"],
] as const satisfies readonly NeonSurvivalRow[];

export const NEON_SURVIVAL_LEVELS = ROWS.map(
  ([
    level,
    surviveSeconds,
    obstacleSpeed,
    spawnIntervalSeconds,
    patterns,
    powerUps,
    difficultyLabel,
  ]): LevelConfig<NeonSurvivalCustom> => ({
    level,
    difficultyLabel,
    completionKind: "survive",
    completionValue: surviveSeconds,
    maxScore: 2_000,
    custom: {
      surviveSeconds,
      obstacleSpeed,
      spawnIntervalSeconds,
      patterns,
      powerUps,
    },
  }),
);
