import type {
  DifficultyLabel,
  LevelConfig,
} from "@/lib/games/contracts";

export const MEMORY_CHALLENGE_CONFIG_VERSION = "memory-challenge:1";

export type MemoryChallengeCustom = {
  pads: 4 | 6;
  startLength: number;
  targetLength: number;
  playbackOnMs: number;
  gapMs: number;
  inputTolerance: null;
};

type MemoryChallengeRow = readonly [
  level: number,
  pads: 4 | 6,
  startLength: number,
  targetLength: number,
  playbackOnMs: number,
  gapMs: number,
  difficultyLabel: DifficultyLabel,
];

const ROWS = [
  [1, 4, 2, 4, 800, 320, "Intro"],
  [2, 4, 2, 5, 750, 300, "Easy"],
  [3, 4, 3, 6, 700, 280, "Easy"],
  [4, 4, 3, 7, 650, 260, "Normal"],
  [5, 4, 3, 8, 600, 240, "Normal"],
  [6, 4, 4, 9, 550, 220, "Hard"],
  [7, 6, 4, 10, 500, 200, "Hard"],
  [8, 6, 4, 11, 470, 185, "Expert"],
  [9, 6, 5, 12, 440, 170, "Expert"],
  [10, 6, 5, 13, 420, 160, "Master"],
] as const satisfies readonly MemoryChallengeRow[];

export const MEMORY_CHALLENGE_LEVELS = ROWS.map(
  ([
    level,
    pads,
    startLength,
    targetLength,
    playbackOnMs,
    gapMs,
    difficultyLabel,
  ]): LevelConfig<MemoryChallengeCustom> => ({
    level,
    difficultyLabel,
    completionKind: "sequence-length",
    completionValue: targetLength,
    maxScore: 1_500,
    custom: {
      pads,
      startLength,
      targetLength,
      playbackOnMs,
      gapMs,
      inputTolerance: null,
    },
  }),
);
