import type {
  DifficultyLabel,
  LevelConfig,
} from "@/lib/games/contracts";

export const WORD_MASTER_CONFIG_VERSION = "word-master:1";

export type WordTier =
  | "T1"
  | "T1/T2"
  | "T2"
  | "T2/T3"
  | "T3"
  | "T3/T4"
  | "T4"
  | "T4/T5"
  | "T5";

export type WordMasterCustom = {
  wordTier: WordTier;
  attempts: number;
  hints: number;
  dailyEnabled: boolean;
};

type WordMasterRow = readonly [
  level: number,
  wordTier: WordTier,
  hints: number,
  dailyEnabled: boolean,
  difficultyLabel: DifficultyLabel,
];

const ROWS = [
  [1, "T1", 2, false, "Intro"],
  [2, "T1/T2", 2, false, "Easy"],
  [3, "T2", 1, false, "Easy"],
  [4, "T2/T3", 1, false, "Normal"],
  [5, "T3", 1, true, "Normal"],
  [6, "T3/T4", 1, true, "Hard"],
  [7, "T4", 0, true, "Hard"],
  [8, "T4/T5", 0, true, "Expert"],
  [9, "T5", 0, true, "Expert"],
  [10, "T5", 0, true, "Master"],
] as const satisfies readonly WordMasterRow[];

export const WORD_MASTER_LEVELS = ROWS.map(
  ([
    level,
    wordTier,
    hints,
    dailyEnabled,
    difficultyLabel,
  ]): LevelConfig<WordMasterCustom> => ({
    level,
    difficultyLabel,
    completionKind: "solve",
    completionValue: 1,
    maxScore: 1_600,
    custom: {
      wordTier,
      attempts: 6,
      hints,
      dailyEnabled,
    },
  }),
);
