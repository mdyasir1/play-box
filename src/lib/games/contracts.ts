export const GAME_IDS = [
  "reaction-rush",
  "word-master",
  "number-merge",
  "memory-challenge",
  "neon-survival",
] as const;

export type GameId = (typeof GAME_IDS)[number];

export const GAME_ID_SET: ReadonlySet<GameId> = new Set(GAME_IDS);

export type DifficultyLabel =
  | "Intro"
  | "Easy"
  | "Normal"
  | "Hard"
  | "Expert"
  | "Master";

export type GameCategory = "reflex" | "word" | "puzzle" | "memory" | "action";

export type GameIconName =
  | "zap"
  | "book-open"
  | "layers"
  | "brain"
  | "rocket";

export type CompletionKind =
  | "average-reaction"
  | "solve"
  | "reach-tile"
  | "sequence-length"
  | "survive";

export interface GameDefinition {
  id: GameId;
  name: string;
  tagline: string;
  description: string;
  category: GameCategory;
  configVersion: string;
  maxLevel: number;
  accentVar: string;
  instructions: readonly string[];
}

export interface LevelConfig<TCustom = unknown> {
  level: number;
  difficultyLabel: DifficultyLabel;
  completionKind: CompletionKind;
  completionValue: number;
  maxScore: number;
  custom: TCustom;
}

export type ResultKind = "win" | "loss";

export interface GameProgress {
  unlockedLevel: number;
  completedLevels: number[];
  bestScore: number;
  perLevelBest: Record<number, number>;
  totalPlays: number;
}

export interface ActivityEntry {
  id: string;
  gameId: GameId;
  level: number;
  score: number;
  result: ResultKind;
  completedAt: string;
}

export interface ResultSubmission {
  idempotencyKey: string;
  gameId: GameId;
  level: number;
  score: number;
  durationMs: number;
  result: ResultKind;
  completedAt: string;
  clientVersion: string;
  levelConfigVersion: string;
}

export interface ProgressSnapshot {
  schemaVersion: number;
  installationId: string;
  games: Record<GameId, GameProgress>;
  achievements: Record<string, string>;
  activity: ActivityEntry[];
  pending: ResultSubmission[];
  updatedAt: string;
}

export interface SyncOutcome {
  status: "synced" | "queued" | "offline" | "rejected";
  reason?: "validation" | "rate-limited" | "unavailable";
  serverProgress?: ProgressSnapshot;
}
