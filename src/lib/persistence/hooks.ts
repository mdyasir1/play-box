"use client";

import { useState } from "react";

import type { SnapshotLoadResult } from "./storage";
import { loadLocalSnapshot } from "./storage";

export function useLocalSnapshot() {
  const [result] = useState<SnapshotLoadResult | null>(() =>
    typeof window === "undefined" ? null : loadLocalSnapshot(),
  );

  return result;
}

export function useGameProgress(gameId: string) {
  const result = useLocalSnapshot();
  return result?.snapshot.games[gameId as never] ?? null;
}