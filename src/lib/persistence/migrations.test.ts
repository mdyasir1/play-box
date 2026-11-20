import { describe, expect, it } from "vitest";

import { migrateSnapshot } from "./migrations";

describe("migrateSnapshot", () => {
  it("accepts current snapshots unchanged", () => {
    const input = { schemaVersion: 1, value: "current" };
    const result = migrateSnapshot(input);

    expect(result).toEqual({ ok: true, value: input });
  });

  it("refuses future schema versions", () => {
    const result = migrateSnapshot({ schemaVersion: 2 });

    expect(result).toEqual({
      ok: false,
      reason: "future-version",
      version: 2,
    });
  });

  it("runs an injected old-version migration chain", () => {
    const result = migrateSnapshot(
      { schemaVersion: 0, legacy: true },
      {
        migrations: {
          0: (value) => ({ ...value, schemaVersion: 1 }),
        },
      },
    );

    expect(result).toEqual({
      ok: true,
      value: { schemaVersion: 1, legacy: true },
      migratedFrom: 0,
    });
  });

  it("reports a missing migration instead of guessing", () => {
    const result = migrateSnapshot({ schemaVersion: 0 });

    expect(result).toEqual({
      ok: false,
      reason: "missing-migration",
      version: 0,
    });
  });

  it("rejects migrations that do not advance the version", () => {
    const result = migrateSnapshot(
      { schemaVersion: 0 },
      {
        migrations: {
          0: (value) => value,
        },
      },
    );

    expect(result).toEqual({
      ok: false,
      reason: "invalid",
      version: 0,
    });
  });
});
