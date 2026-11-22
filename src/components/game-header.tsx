"use client";

import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Grid2X2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { GameDefinition } from "@/lib/games";
import type { LevelTier } from "@/lib/level-meta";

type GameHeaderProps = {
  game: GameDefinition;
  level: number;
  levelCount: number;
  tier: LevelTier;
  nextUnlocked: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onPick: () => void;
};

export function GameHeader({
  game,
  level,
  levelCount,
  tier,
  nextUnlocked,
  onPrevious,
  onNext,
  onPick,
}: GameHeaderProps) {
  return (
    <header>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-text-muted transition hover:text-text"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Yasir&apos;s Play-Box
      </Link>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {game.name}
            </h1>
            <span className={`text-xs font-medium ${tier.className}`}>{tier.label}</span>
          </div>
          <p className="mt-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-hot">
            {game.slug === "zip"
              ? "One line. No shortcuts. We checked."
              : "Walls are not suggestions."}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            Level {String(level).padStart(3, "0")} of {levelCount}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-border bg-surface p-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={level <= 1}
            aria-label="Previous level"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <button
            type="button"
            onClick={onPick}
            className="flex items-center gap-2 rounded px-3 py-2 text-xs font-medium text-text transition hover:bg-surface-hover"
            aria-label={`Choose level. Current level ${level} of ${levelCount}`}
          >
            <Grid2X2 className="size-3.5 text-accent" aria-hidden="true" />
            Choose level
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={!nextUnlocked || level >= levelCount}
            aria-label="Next level"
            title={nextUnlocked ? "Next level" : "Complete this level to unlock"}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  );
}
