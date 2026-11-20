import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { ProgressSnapshot } from "@/lib/games/contracts";

import {
  createEmptySnapshot,
  createInstallationId,
} from "./schema";
import {
  STORAGE_KEYS,
  loadLocalSnapshot,
  saveLocalSnapshot,
} from "./storage";

const NOW = new Date("2026-11-21T12:00:00.000Z");

function makeSnapshot(): ProgressSnapshot {
  return createEmptySnapshot(createInstallationId(), NOW);
}

function corruptKeys(): string[] {
  const keys: string[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);

    if (key?.startsWith(STORAGE_KEYS.corruptPrefix)) {
      keys.push(key);
    }
  }

  return keys;
}

describe("local snapshot storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("round-trips a valid snapshot and keeps the installation id", () => {
    const snapshot = makeSnapshot();

    expect(saveLocalSnapshot(snapshot)).toEqual({ status: "saved" });

    const loaded = loadLocalSnapshot(NOW);

    expect(loaded.status).toBe("ok");
    expect(loaded.readOnly).toBe(false);
    expect(loaded.snapshot.games).toEqual(snapshot.games);
    expect(loaded.snapshot.installationId).toBe(snapshot.installationId);
    expect(localStorage.getItem(STORAGE_KEYS.installation)).toBe(
      snapshot.installationId,
    );
  });

  it("returns an empty snapshot when nothing was saved", () => {
    const loaded = loadLocalSnapshot(NOW);

    expect(loaded.status).toBe("empty");
    expect(loaded.snapshot.activity).toEqual([]);
    expect(loaded.snapshot.games["word-master"].unlockedLevel).toBe(1);
  });

  it("quarantines corrupt JSON and starts clean", () => {
    localStorage.setItem(STORAGE_KEYS.progress, "{not-json");

    const loaded = loadLocalSnapshot(NOW);

    expect(loaded.status).toBe("recovered");
    expect(loaded.notice).toContain("quarantined");
    expect(localStorage.getItem(STORAGE_KEYS.progress)).toBeNull();
    expect(corruptKeys()).toHaveLength(1);
    expect(loaded.snapshot.games["reaction-rush"].unlockedLevel).toBe(1);
  });

  it("quarantines structurally invalid snapshots", () => {
    const snapshot = makeSnapshot();
    const raw = JSON.parse(JSON.stringify(snapshot)) as Record<string, unknown>;
    const games = raw.games as Record<string, Record<string, unknown>>;
    games["reaction-rush"]!.bestScore = -1;
    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(raw));

    const loaded = loadLocalSnapshot(NOW);

    expect(loaded.status).toBe("recovered");
    expect(corruptKeys()).toHaveLength(1);
  });

  it("strips unknown fields instead of persisting them", () => {
    const snapshot = makeSnapshot();
    const raw = JSON.parse(JSON.stringify(snapshot)) as Record<string, unknown>;
    const games = raw.games as Record<string, Record<string, unknown>>;
    raw.extra = "drop me";
    games["unknown-game"] = { unlockedLevel: 10 };
    games["reaction-rush"]!.extra = true;
    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(raw));

    const loaded = loadLocalSnapshot(NOW);

    expect(loaded.status).toBe("ok");
    expect(loaded.snapshot).not.toHaveProperty("extra");
    expect(loaded.snapshot.games).not.toHaveProperty("unknown-game");
    expect(loaded.snapshot.games["reaction-rush"]).not.toHaveProperty("extra");
  });

  it("refuses to overwrite a newer schema version", () => {
    const snapshot = makeSnapshot();
    const raw = {
      ...snapshot,
      schemaVersion: 2,
      futureField: "keep me",
    };
    const serialized = JSON.stringify(raw);
    localStorage.setItem(STORAGE_KEYS.progress, serialized);

    const loaded = loadLocalSnapshot(NOW);

    expect(loaded.status).toBe("unsupported");
    expect(loaded.readOnly).toBe(true);
    expect(localStorage.getItem(STORAGE_KEYS.progress)).toBe(serialized);
  });

  it("treats an unmigratable old version as recoverable corruption", () => {
    const snapshot = makeSnapshot();
    localStorage.setItem(
      STORAGE_KEYS.progress,
      JSON.stringify({ ...snapshot, schemaVersion: 0 }),
    );

    const loaded = loadLocalSnapshot(NOW);

    expect(loaded.status).toBe("recovered");
    expect(corruptKeys()).toHaveLength(1);
  });

  it("trusts the separately stored installation id", () => {
    const canonical = createInstallationId();
    const snapshot = makeSnapshot();
    localStorage.setItem(STORAGE_KEYS.installation, canonical);
    localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(snapshot));

    const loaded = loadLocalSnapshot(NOW);

    expect(loaded.status).toBe("ok");
    expect(loaded.snapshot.installationId).toBe(canonical);
  });

  it("trims activity to the newest ten entries on quota pressure", () => {
    const snapshot = makeSnapshot();
    snapshot.activity = Array.from({ length: 50 }, (_, index) => ({
      id: createInstallationId(),
      gameId: "reaction-rush" as const,
      level: 1,
      score: index,
      result: "loss" as const,
      completedAt: "2026-11-21T11:00:00.000Z",
    }));
    localStorage.setItem(
      STORAGE_KEYS.installation,
      snapshot.installationId,
    );

    const originalSetItem = Storage.prototype.setItem;
    let progressWrites = 0;

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key: string,
      value: string,
    ) {
      if (key === STORAGE_KEYS.progress) {
        progressWrites += 1;

        if (progressWrites === 1) {
          throw new DOMException("Quota exceeded", "QuotaExceededError");
        }
      }

      return originalSetItem.call(this, key, value);
    });

    expect(saveLocalSnapshot(snapshot)).toEqual({ status: "saved-trimmed" });
    expect(progressWrites).toBe(2);

    const loaded = loadLocalSnapshot(NOW);
    expect(loaded.snapshot.activity).toHaveLength(10);
    expect(loaded.snapshot.activity[0]?.id).toBe(snapshot.activity[0]?.id);
  });

  it("never overwrites old data when quota remains exhausted", () => {
    const oldSnapshot = makeSnapshot();
    localStorage.setItem(
      STORAGE_KEYS.installation,
      oldSnapshot.installationId,
    );
    const oldRaw = JSON.stringify(oldSnapshot);
    localStorage.setItem(STORAGE_KEYS.progress, oldRaw);
    const originalSetItem = Storage.prototype.setItem;

    vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (
      this: Storage,
      key: string,
      value: string,
    ) {
      if (key === STORAGE_KEYS.progress) {
        throw new DOMException("Quota exceeded", "QuotaExceededError");
      }

      return originalSetItem.call(this, key, value);
    });

    const next = makeSnapshot();
    next.games["reaction-rush"].bestScore = 500;

    expect(saveLocalSnapshot(next)).toEqual({ status: "quota" });
    expect(localStorage.getItem(STORAGE_KEYS.progress)).toBe(oldRaw);
  });

  it("rejects invalid snapshots before writing", () => {
    const snapshot = makeSnapshot();
    snapshot.games["reaction-rush"].unlockedLevel = 11;

    expect(saveLocalSnapshot(snapshot)).toEqual({ status: "invalid" });
    expect(localStorage.getItem(STORAGE_KEYS.progress)).toBeNull();
  });
});
