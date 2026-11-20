"use client";

import {
  ArrowLeft,
  CircleHelp,
  Pause,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { getLevelConfig } from "@/games/level-registry";
import { DifficultyChip } from "@/components/ui/difficulty-chip";
import { LevelBadge } from "@/components/ui/level-badge";
import { Button } from "@/components/ui/button";
import type { GameDefinition } from "@/lib/games/contracts";
import { cn } from "@/lib/utils";

type GameHeaderProps = {
  game: GameDefinition;
  level: number;
  score?: number;
  bestScore?: number;
  instructionsOpen: boolean;
  onToggleInstructions: () => void;
  onPause?: () => void;
  onRestart?: () => void;
};

export function GameHeader({
  game,
  level,
  score,
  bestScore,
  instructionsOpen,
  onToggleInstructions,
  onPause,
  onRestart,
}: GameHeaderProps) {
  const levelConfig = getLevelConfig(game.id, level);

  return (
    <header className="rounded-card border border-border bg-surface/50 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href="/games"
            className="inline-flex min-h-8 items-center gap-1.5 rounded-md text-xs font-semibold text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Library
          </Link>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
              {game.name}
            </h1>
            <LevelBadge level={level} maxLevel={game.maxLevel} />
            <DifficultyChip
              label={levelConfig?.difficultyLabel ?? "Intro"}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="icon"
            aria-label="How to play"
            aria-expanded={instructionsOpen}
            aria-controls="game-instructions"
            onClick={onToggleInstructions}
          >
            <CircleHelp aria-hidden="true" className="size-4" />
          </Button>
          {onPause ? (
            <Button
              variant="secondary"
              size="icon"
              aria-label="Pause game"
              onClick={onPause}
            >
              <Pause aria-hidden="true" className="size-4" />
            </Button>
          ) : null}
          {onRestart ? (
            <Button
              variant="secondary"
              size="icon"
              aria-label="Restart level"
              onClick={onRestart}
            >
              <RotateCcw aria-hidden="true" className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border/70 pt-3">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            Score
          </span>
          <span className="font-display text-lg font-semibold tabular-nums text-text">
            {score ?? "—"}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            Best
          </span>
          <span className="font-display text-lg font-semibold tabular-nums text-text-secondary">
            {bestScore ?? "—"}
          </span>
        </div>
      </div>
    </header>
  );
}

type GameInstructionsProps = {
  instructions: readonly string[];
  className?: string;
};

export function GameInstructions({
  instructions,
  className,
}: GameInstructionsProps) {
  return (
    <section
      aria-labelledby="game-instructions-heading"
      className={cn(
        "rounded-card border border-border bg-surface/40 p-5",
        className,
      )}
    >
      <h2
        id="game-instructions-heading"
        className="font-display text-base font-semibold text-text"
      >
        How to play
      </h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-text-secondary">
        {instructions.map((instruction) => (
          <li key={instruction}>{instruction}</li>
        ))}
      </ol>
    </section>
  );
}

type GameChromeProps = {
  game: GameDefinition;
  level: number;
  score?: number;
  bestScore?: number;
  onPause?: () => void;
  onRestart?: () => void;
  children: ReactNode;
  className?: string;
};

export function GameChrome({
  game,
  level,
  score,
  bestScore,
  onPause,
  onRestart,
  children,
  className,
}: GameChromeProps) {
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  return (
    <div className={cn("animate-rise", className)}>
      <GameHeader
        game={game}
        level={level}
        score={score}
        bestScore={bestScore}
        instructionsOpen={instructionsOpen}
        onToggleInstructions={() => setInstructionsOpen((open) => !open)}
        onPause={onPause}
        onRestart={onRestart}
      />

      <div id="game-instructions" hidden={!instructionsOpen}>
        <GameInstructions
          instructions={game.instructions}
          className="mt-4"
        />
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}