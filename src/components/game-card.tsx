"use client";

import Link from "next/link";
import { ArrowRight, Paintbrush, Route } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import type { GameDefinition } from "@/lib/games";
import { cn } from "@/lib/utils";

type GameCardProps = {
  game: GameDefinition;
  completed: number;
  lastLevel: number;
};

export function GameCard({ game, completed, lastLevel }: GameCardProps) {
  const isZip = game.slug === "zip";
  const Icon = isZip ? Route : Paintbrush;

  return (
    <Link
      href={`/games/${game.slug}`}
      className="paper-edge group rounded-lg border border-border bg-surface p-5 transition hover:border-border-strong"
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-md",
            isZip ? "bg-accent-soft text-accent" : "bg-cyan-soft text-cyan",
          )}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span className="text-xs text-text-muted">{game.levelCount} levels</span>
      </div>

      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
        {game.name}
      </h3>
      <p className="mt-1 text-xs text-text-muted">
        {completed} of {game.levelCount} complete
      </p>

      <ProgressBar
        value={completed}
        max={game.levelCount}
        label={`${game.name} progress`}
        className="mt-4"
        barClassName={isZip ? undefined : "bg-cyan"}
      />

      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="text-text-secondary">Level {lastLevel}</span>
        <ArrowRight
          className="size-4 text-text-muted transition group-hover:translate-x-1 group-hover:text-text"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}
