import { CURRENT_SCHEMA_VERSION, isRecord } from "./schema";

export type SnapshotMigration = (
  value: Record<string, unknown>,
) => Record<string, unknown>;

export const SNAPSHOT_MIGRATIONS: Readonly<
  Record<number, SnapshotMigration>
> = {};

export type MigrationResult =
  | {
      ok: true;
      value: Record<string, unknown>;
      migratedFrom?: number;
    }
  | {
      ok: false;
      reason: "invalid" | "future-version" | "missing-migration";
      version?: number;
    };

type MigrationOptions = {
  migrations?: Readonly<Record<number, SnapshotMigration>>;
  targetVersion?: number;
};

export function migrateSnapshot(
  input: unknown,
  {
    migrations = SNAPSHOT_MIGRATIONS,
    targetVersion = CURRENT_SCHEMA_VERSION,
  }: MigrationOptions = {},
): MigrationResult {
  if (!isRecord(input)) {
    return { ok: false, reason: "invalid" };
  }

  const originalVersion = input.schemaVersion;

  if (
    typeof originalVersion !== "number" ||
    !Number.isInteger(originalVersion) ||
    originalVersion < 0
  ) {
    return { ok: false, reason: "invalid" };
  }

  if (originalVersion > targetVersion) {
    return {
      ok: false,
      reason: "future-version",
      version: originalVersion,
    };
  }

  if (originalVersion === targetVersion) {
    return { ok: true, value: input };
  }

  let current = input;
  let version = originalVersion;
  let steps = 0;

  while (version < targetVersion) {
    const migration = migrations[version];

    if (!migration) {
      return {
        ok: false,
        reason: "missing-migration",
        version,
      };
    }

    const next = migration(current);
    const nextVersion = next.schemaVersion;

    if (
      typeof nextVersion !== "number" ||
      !Number.isInteger(nextVersion) ||
      nextVersion <= version
    ) {
      return { ok: false, reason: "invalid", version };
    }

    current = next;
    version = nextVersion;
    steps += 1;

    if (steps > targetVersion) {
      return { ok: false, reason: "invalid", version };
    }
  }

  if (version !== targetVersion) {
    return { ok: false, reason: "invalid", version };
  }

  return {
    ok: true,
    value: current,
    migratedFrom: originalVersion,
  };
}
