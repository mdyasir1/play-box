import type {
  GameId,
  GameProgress,
  ProgressSnapshot,
} from "@/lib/games/contracts";

export const CURRENT_SCHEMA_VERSION = 1;
export const MAX_ACTIVITY_ENTRIES = 50;
export const MAX_PENDING_RESULTS = 100;
export const MAX_SUBMISSION_DURATION_MS = 3_600_000;

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ISO_TIMESTAMP_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export function createEmptyGameProgress(): GameProgress {
  return {
    unlockedLevel: 1,
    completedLevels: [],
    bestScore: 0,
    perLevelBest: {},
    totalPlays: 0,
  };
}

export function createEmptySnapshot(
  installationId: string,
  now: Date = new Date(),
): ProgressSnapshot {
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    installationId,
    games: {
      "reaction-rush": createEmptyGameProgress(),
      "word-master": createEmptyGameProgress(),
      "number-merge": createEmptyGameProgress(),
      "memory-challenge": createEmptyGameProgress(),
      "neon-survival": createEmptyGameProgress(),
    },
    achievements: {},
    activity: [],
    pending: [],
    updatedAt: now.toISOString(),
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isUuidV4(value: unknown): value is string {
  return typeof value === "string" && UUID_V4_PATTERN.test(value);
}

export function isIsoTimestamp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    ISO_TIMESTAMP_PATTERN.test(value) &&
    Number.isFinite(Date.parse(value))
  );
}

export function isIntegerInRange(
  value: unknown,
  min: number,
  max: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= min &&
    value <= max
  );
}

export function createInstallationId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
    bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
    const hex = Array.from(bytes, (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");

    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join("-");
  }

  throw new Error("A cryptographically secure random source is required");
}

export function gamesRecord(
  factory: (gameId: GameId) => GameProgress,
): Record<GameId, GameProgress> {
  return {
    "reaction-rush": factory("reaction-rush"),
    "word-master": factory("word-master"),
    "number-merge": factory("number-merge"),
    "memory-challenge": factory("memory-challenge"),
    "neon-survival": factory("neon-survival"),
  };
}
