import type { ProgressSnapshot } from "@/lib/games/contracts";

import { migrateSnapshot } from "./migrations";
import {
  CURRENT_SCHEMA_VERSION,
  createEmptySnapshot,
  createInstallationId,
  isRecord,
  isUuidV4,
} from "./schema";
import { validateSnapshot } from "./validation";

export const STORAGE_KEYS = {
  progress: "ypb:v1:progress",
  installation: "ypb:v1:installation",
  corruptPrefix: "ypb:v1:corrupt:",
} as const;

export type SnapshotLoadStatus =
  | "ok"
  | "empty"
  | "recovered"
  | "migrated"
  | "unsupported"
  | "unavailable";

export interface SnapshotLoadResult {
  snapshot: ProgressSnapshot;
  status: SnapshotLoadStatus;
  readOnly: boolean;
  notice?: string;
}

export type SnapshotSaveResult =
  | { status: "saved" }
  | { status: "saved-trimmed" }
  | { status: "invalid" }
  | { status: "quota" }
  | { status: "unavailable" };

function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getOrCreateInstallationId(
  storage: Storage | null = getBrowserStorage(),
  candidate?: unknown,
): string {
  if (!storage) {
    return createInstallationId();
  }

  let stored: string | null = null;

  try {
    stored = storage.getItem(STORAGE_KEYS.installation);
  } catch {
    return createInstallationId();
  }

  if (isUuidV4(stored)) {
    return stored;
  }

  const installationId = isUuidV4(candidate)
    ? candidate
    : createInstallationId();

  try {
    storage.setItem(STORAGE_KEYS.installation, installationId);
  } catch {
    // A blocked write does not prevent this session from using the ID.
  }

  return installationId;
}

function isQuotaError(error: unknown): boolean {
  return (
    (error instanceof DOMException &&
      (error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
        error.code === 22 ||
        error.code === 1014)) ||
    (error instanceof Error && error.name === "QuotaExceededError")
  );
}

function quarantine(
  storage: Storage,
  raw: string,
): boolean {
  const key = `${STORAGE_KEYS.corruptPrefix}${Date.now()}`;

  try {
    storage.setItem(key, raw);
    return true;
  } catch {
    return false;
  }
}

function recover(
  storage: Storage,
  raw: string,
  installationId: string,
  now: Date,
): SnapshotLoadResult {
  const quarantined = quarantine(storage, raw);

  if (quarantined) {
    try {
      storage.removeItem(STORAGE_KEYS.progress);
    } catch {
      // The fresh snapshot is still safe to use in memory.
    }
  }

  return {
    snapshot: createEmptySnapshot(installationId, now),
    status: "recovered",
    readOnly: false,
    notice: quarantined
      ? "Saved progress was unreadable. The original data was quarantined and a fresh profile was started."
      : "Saved progress was unreadable and could not be quarantined. The original data was left untouched.",
  };
}

export function loadLocalSnapshot(
  now: Date = new Date(),
): SnapshotLoadResult {
  const storage = getBrowserStorage();

  if (!storage) {
    return {
      snapshot: createEmptySnapshot(createInstallationId(), now),
      status: "unavailable",
      readOnly: false,
      notice:
        "Local storage is unavailable. Progress will not survive a refresh.",
    };
  }

  let raw: string | null;

  try {
    raw = storage.getItem(STORAGE_KEYS.progress);
  } catch {
    return {
      snapshot: createEmptySnapshot(
        getOrCreateInstallationId(storage),
        now,
      ),
      status: "unavailable",
      readOnly: false,
      notice:
        "Local storage is blocked. Progress will not survive a refresh.",
    };
  }

  if (raw === null) {
    const installationId = getOrCreateInstallationId(storage);

    return {
      snapshot: createEmptySnapshot(installationId, now),
      status: "empty",
      readOnly: false,
    };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    const installationId = getOrCreateInstallationId(storage);
    return recover(storage, raw, installationId, now);
  }

  if (!isRecord(parsed)) {
    const installationId = getOrCreateInstallationId(storage);
    return recover(storage, raw, installationId, now);
  }

  const version = parsed.schemaVersion;
  const installationId = getOrCreateInstallationId(
    storage,
    parsed.installationId,
  );

  if (
    typeof version === "number" &&
    Number.isInteger(version) &&
    version > CURRENT_SCHEMA_VERSION
  ) {
    return {
      snapshot: createEmptySnapshot(installationId, now),
      status: "unsupported",
      readOnly: true,
      notice:
        "Saved progress uses a newer app version. It was left untouched; update the app before playing.",
    };
  }

  if (
    typeof version !== "number" ||
    !Number.isInteger(version) ||
    version < 0
  ) {
    return recover(storage, raw, installationId, now);
  }

  let candidate: Record<string, unknown> = parsed;
  let migrated = false;

  if (version < CURRENT_SCHEMA_VERSION) {
    const migration = migrateSnapshot(parsed);

    if (!migration.ok) {
      return recover(storage, raw, installationId, now);
    }

    candidate = migration.value;
    migrated = true;
  }

  const validation = validateSnapshot(candidate);

  if (!validation.ok) {
    return recover(storage, raw, installationId, now);
  }

  return {
    snapshot: {
      ...validation.snapshot,
      installationId,
    },
    status: migrated ? "migrated" : "ok",
    readOnly: false,
    ...(migrated
      ? { notice: "Saved progress was upgraded to the current format." }
      : {}),
  };
}

export function saveLocalSnapshot(
  snapshot: ProgressSnapshot,
): SnapshotSaveResult {
  const validation = validateSnapshot(snapshot);

  if (!validation.ok) {
    return { status: "invalid" };
  }

  const storage = getBrowserStorage();

  if (!storage) {
    return { status: "unavailable" };
  }

  const installationId = getOrCreateInstallationId(
    storage,
    validation.snapshot.installationId,
  );
  const normalized = {
    ...validation.snapshot,
    installationId,
  };

  try {
    storage.setItem(STORAGE_KEYS.progress, JSON.stringify(normalized));
    return { status: "saved" };
  } catch (error) {
    if (!isQuotaError(error)) {
      return { status: "unavailable" };
    }
  }

  const trimmed = {
    ...normalized,
    activity: normalized.activity.slice(0, 10),
  };

  try {
    storage.setItem(STORAGE_KEYS.progress, JSON.stringify(trimmed));
    return { status: "saved-trimmed" };
  } catch (error) {
    return {
      status: isQuotaError(error) ? "quota" : "unavailable",
    };
  }
}
