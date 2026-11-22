"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LevelTier } from "@/lib/level-meta";
import type { GameDefinition } from "@/lib/games";
import { cn } from "@/lib/utils";

type GameHeaderProps = {
  game: GameDefinition;
  level: number;
  levelCount: number;
  tier: LevelTier;
  onPrevious: () => void;
  onNext: () => void;
  onPick: () => void;
};

export function GameHeader({
  game,
  level,
  levelCount,
  tier,
  onPrevious,
  onNext,
  onPick,
}: GameHeaderProps) {
  return (
    <header>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted transition hover:text-text"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        Back to arcade
      </Link>

      <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.18em]",
                game.accent === "violet" ? "text-accent" : "text-cyan",
              )}
            >
              {game.tagline}
            </span>
            <span className="text-text-muted/50">·</span>
            <span className={cn("text-xs font-semibold", tier.className)}>
              {tier.label}
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {game.name}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
            {game.description}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface/60 p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPrevious}
            disabled={level <= 1}
            aria-label="Previous level"
          >
            <ChevronLeft aria-hidden="true" className="size-4" />
          </Button>

          <button
            type="button"
            onClick={onPick}
            className="group flex min-w-36 flex-col items-center rounded-xl px-3 py-1.5 text-center transition hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label={`Choose level. Current level ${level} of ${levelCount}`}
          >
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-text-muted">
              Level {level} of {levelCount}
            </span>
            <span className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold text-text">
              <Grid2X2
                aria-hidden="true"
                className="size-3.5 text-accent transition group-hover:text-cyan"
              />
              Choose level
            </span>
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={level >= levelCount}
            aria-label="Next level"
          >
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
