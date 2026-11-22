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
import { SESSION_CHANGE_EVENT } from "./session";

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(createDefaultProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    const reset = () => setProgress(loadProgress());
    window.addEventListener(SESSION_CHANGE_EVENT, reset);
    return () => window.removeEventListener(SESSION_CHANGE_EVENT, reset);
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
