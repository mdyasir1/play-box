"use client";

import Link from "next/link";
import { ArrowUpRight, Paintbrush, Route } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import type { GameDefinition } from "@/lib/games";

type GameCardProps = {
  game: GameDefinition;
  completed: number;
  lastLevel: number;
};

export function GameCard({ game, completed, lastLevel }: GameCardProps) {
  const isZip = game.slug === "zip";
  const Icon = isZip ? Route : Paintbrush;
  const percent = Math.round((completed / game.levelCount) * 100);

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-border bg-surface p-5 transition duration-200 hover:-translate-y-1 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:p-6"
    >
      <div className="flex items-start justify-between">
        <span
          className={`grid size-14 place-items-center rounded-lg text-white ${
            isZip ? "bg-zip" : "bg-maze"
          }`}
        >
          <Icon className="size-7" aria-hidden="true" />
        </span>
        <span className="rounded-full border border-border px-2.5 py-1 font-display text-[0.65rem] font-bold tracking-[0.16em] text-text-muted">
          200 levels
        </span>
      </div>

      <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-text">
        {game.name}
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        {isZip ? "One line. Zero mercy." : "Slide until physics gives up."}
      </p>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs text-text-muted">
          <span>
            {completed}/{game.levelCount} cleared
          </span>
          <span>{percent}%</span>
        </div>
        <ProgressBar
          value={completed}
          max={game.levelCount}
          label={`${game.name} progress`}
          barClassName={isZip ? "bg-zip" : "bg-maze"}
        />
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <span className="font-display text-xs font-semibold uppercase tracking-widest text-text-muted">
          Level {String(lastLevel).padStart(3, "0")}
        </span>
        <span className="inline-flex items-center gap-1 font-display text-xs font-bold uppercase tracking-widest text-text">
          Play
          <ArrowUpRight
            className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
