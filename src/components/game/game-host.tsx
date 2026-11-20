"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import type { GameId } from "@/lib/games/contracts";

import type { GameStageProps } from "./types";

function GameStageSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[24rem] rounded-card border border-border bg-surface/30 p-6"
    >
      <span className="sr-only">Loading game module</span>
      <div aria-hidden="true" className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

function loadGame(
  loader: () => Promise<{ default: ComponentType<GameStageProps> }>,
): ComponentType<GameStageProps> {
  return dynamic(loader, {
    ssr: false,
    loading: () => <GameStageSkeleton />,
  });
}

export const GAME_LOADERS: Record<GameId, ComponentType<GameStageProps>> = {
  "reaction-rush": loadGame(() => import("@/games/reaction-rush/Game")),
  "word-master": loadGame(() => import("@/games/word-master/Game")),
  "number-merge": loadGame(() => import("@/games/number-merge/Game")),
  "memory-challenge": loadGame(() => import("@/games/memory-challenge/Game")),
  "neon-survival": loadGame(() => import("@/games/neon-survival/Game")),
};

export function GameHost({ gameId, level }: GameStageProps) {
  const GameComponent = GAME_LOADERS[gameId];

  return <GameComponent gameId={gameId} level={level} />;
}