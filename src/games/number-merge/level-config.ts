import type {
  DifficultyLabel,
  LevelConfig,
} from "@/lib/games/contracts";

export const NUMBER_MERGE_CONFIG_VERSION = "number-merge:1";

export type NumberMergeCustom = {
  boardSize: 4 | 5 | 6;
  targetTile: number;
  moveLimit: number | null;
  undos: number;
};

type NumberMergeRow = readonly [
  level: number,
  boardSize: 4 | 5 | 6,
  targetTile: number,
  moveLimit: number | null,
  undos: number,
  difficultyLabel: DifficultyLabel,
];

const ROWS = [
  [1, 4, 128, null, 3, "Intro"],
  [2, 4, 256, null, 3, "Easy"],
  [3, 4, 512, null, 3, "Easy"],
  [4, 4, 1024, null, 3, "Normal"],
  [5, 4, 2048, null, 3, "Normal"],
  [6, 5, 2048, 300, 2, "Hard"],
  [7, 5, 4096, 400, 2, "Hard"],
  [8, 5, 4096, 320, 2, "Expert"],
  [9, 5, 8192, 500, 1, "Expert"],
  [10, 6, 8192, 400, 1, "Master"],
] as const satisfies readonly NumberMergeRow[];

export const NUMBER_MERGE_LEVELS = ROWS.map(
  ([
    level,
    boardSize,
    targetTile,
    moveLimit,
    undos,
    difficultyLabel,
  ]): LevelConfig<NumberMergeCustom> => ({
    level,
    difficultyLabel,
    completionKind: "reach-tile",
    completionValue: targetTile,
    maxScore: 5_000_000,
    custom: {
      boardSize,
      targetTile,
      moveLimit,
      undos,
    },
  }),
);
