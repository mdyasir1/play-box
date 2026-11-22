"use client";

import { useCallback, useEffect, useState } from "react";

import type { GameSlug } from "./games";
import {
  createDefaultProgress,
  loadProgress,
  markLevelComplete,
  saveProgress,
  setCurrentLevel,
  type ProgressState,
} from "./progress";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(createDefaultProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
  }, []);

  const completeLevel = useCallback((game: GameSlug, level: number, score: number) => {
    setProgress((previous) => {
      const next = markLevelComplete(previous, game, level, score);
      if (next !== previous) saveProgress(next);
      return next;
    });
  }, []);

  const chooseLevel = useCallback((game: GameSlug, level: number) => {
    setProgress((previous) => {
      const next = setCurrentLevel(previous, game, level);
      if (next !== previous) saveProgress(next);
      return next;
    });
  }, []);

  return { progress, ready, setProgress, completeLevel, chooseLevel };
}
