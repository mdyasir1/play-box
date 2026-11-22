import { describe, expect, it } from "vitest";

import {
  bestScore,
  completedCount,
  createDefaultProgress,
  isLevelComplete,
  loadProgress,
  markLevelComplete,
  parseProgress,
  PROGRESS_STORAGE_KEY,
  saveProgress,
  setCurrentLevel,
} from "./progress";

class MemoryStorage implements Storage {
  private data = new Map<string, string>();

  get length(): number {
    return this.data.size;
  }

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.data.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

describe("progress", () => {
  it("creates a clean default snapshot", () => {
    const progress = createDefaultProgress();
    expect(progress.version).toBe(3);
    expect(progress.games.zip.completed).toEqual([]);
    expect(progress.games["maze-paint"].completed).toEqual([]);
    expect(progress.games.zip.lastLevel).toBe(1);
  });

  it("saves and loads a snapshot", () => {
    const storage = new MemoryStorage();
    const progress = markLevelComplete(createDefaultProgress(), "zip", 4, 12);
    expect(saveProgress(progress, storage)).toBe(true);
    expect(loadProgress(storage)).toEqual(progress);
    expect(storage.getItem(PROGRESS_STORAGE_KEY)).toContain('"version":3');
  });

  it("falls back to defaults for missing, corrupt, or wrong-version data", () => {
    const storage = new MemoryStorage();
    expect(loadProgress(storage)).toEqual(createDefaultProgress());
    storage.setItem(PROGRESS_STORAGE_KEY, "{not json");
    expect(loadProgress(storage)).toEqual(createDefaultProgress());
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ version: 2 }));
    expect(loadProgress(storage)).toEqual(createDefaultProgress());
  });

  it("sanitizes malformed completed levels and best scores", () => {
    const parsed = parseProgress({
      version: 3,
      updatedAt: 123,
      games: {
        zip: {
          completed: [3, 3, 0, 101, "x", 2],
          bestScores: { "2": 4, "0": 9, "101": 2, "3": -1, "4": "fast" },
          lastLevel: 999,
        },
        "maze-paint": {
          completed: [],
          bestScores: {},
          lastLevel: 7,
        },
      },
    });
    expect(parsed.games.zip.completed).toEqual([2, 3]);
    expect(parsed.games.zip.bestScores).toEqual({ "2": 4 });
    expect(parsed.games.zip.lastLevel).toBe(1);
    expect(parsed.games["maze-paint"].lastLevel).toBe(7);
  });

  it("marks completion once and keeps the best score", () => {
    let progress = createDefaultProgress();
    progress = markLevelComplete(progress, "maze-paint", 5, 14);
    progress = markLevelComplete(progress, "maze-paint", 5, 11);
    progress = markLevelComplete(progress, "maze-paint", 5, 20);
    expect(progress.games["maze-paint"].completed).toEqual([5]);
    expect(progress.games["maze-paint"].bestScores["5"]).toBe(11);
    expect(progress.games["maze-paint"].lastLevel).toBe(6);
    expect(isLevelComplete(progress, "maze-paint", 5)).toBe(true);
    expect(bestScore(progress, "maze-paint", 5)).toBe(11);
    expect(completedCount(progress, "maze-paint")).toBe(1);
  });

  it("does not move lastLevel backwards when replaying", () => {
    let progress = createDefaultProgress();
    progress = markLevelComplete(progress, "zip", 20, 10);
    progress = markLevelComplete(progress, "zip", 2, 8);
    expect(progress.games.zip.lastLevel).toBe(21);
  });

  it("selects levels safely", () => {
    let progress = createDefaultProgress();
    progress = setCurrentLevel(progress, "zip", 25);
    expect(progress.games.zip.lastLevel).toBe(25);
    const unchanged = setCurrentLevel(progress, "zip", 0);
    expect(unchanged).toBe(progress);
  });

  it("reports failed reads and writes without throwing", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("quota");
      },
    } as unknown as Storage;
    expect(loadProgress(broken)).toEqual(createDefaultProgress());
    expect(saveProgress(createDefaultProgress(), broken)).toBe(false);
    expect(saveProgress(createDefaultProgress(), null)).toBe(false);
  });
});
