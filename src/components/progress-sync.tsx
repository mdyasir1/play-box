"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth-provider";
import { useProgress } from "@/lib/use-progress";
import {
  getRemoteProgressAction,
  saveRemoteProgressAction,
} from "@/lib/progress-actions";
import { mergeRemoteProgress } from "@/lib/progress";
import type { GameSlug } from "@/lib/games";

const GAME_SLUGS: readonly GameSlug[] = ["zip", "maze-paint"];

export function ProgressSync() {
  const { user, authReady } = useAuth();
  const { progress, ready, setProgress } = useProgress();
  const [remoteReady, setRemoteReady] = useState(false);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!authReady || !ready) return;
    if (!userId) {
      setRemoteReady(false);
      return;
    }

    let cancelled = false;
    setRemoteReady(false);

    Promise.all(GAME_SLUGS.map((game) => getRemoteProgressAction(game)))
      .then((remoteValues) => {
        if (cancelled) return;
        setProgress((previous) => {
          let next = previous;
          GAME_SLUGS.forEach((game, index) => {
            next = mergeRemoteProgress(next, game, remoteValues[index] ?? null);
          });
          return next;
        });
        setRemoteReady(true);
      })
      .catch(() => {
        if (!cancelled) setRemoteReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [authReady, ready, userId, setProgress]);

  useEffect(() => {
    if (!userId || !ready || !remoteReady) return;
    for (const game of GAME_SLUGS) {
      const gameProgress = progress.games[game];
      void saveRemoteProgressAction(
        game,
        gameProgress.lastLevel,
        gameProgress.completed,
        gameProgress.bestScores,
      );
    }
  }, [progress, ready, remoteReady, userId]);

  return null;
}
