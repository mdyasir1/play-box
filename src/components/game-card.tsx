"use client";

import Link from "next/link";
import { ArrowRight, Check, Route, Sparkles } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import type { GameDefinition } from "@/lib/games";
import { cn } from "@/lib/utils";

function ZipPreview() {
  const cells = Array.from({ length: 16 }, (_, index) => index);
  const path = [0, 1, 2, 3, 7, 6, 5, 4, 8, 9, 10, 11, 15, 14, 13, 12];
  const pathSet = new Set(path);
  const checkpoints: Record<number, number> = { 0: 1, 6: 2, 10: 3, 12: 4 };
  const points = path
    .map((cell) => {
      const row = Math.floor(cell / 4);
      const col = cell % 4;
      return `${col * 25 + 12.5},${row * 25 + 12.5}`;
    })
    .join(" ");

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0e19] p-2.5">
      <div className="relative h-full w-full">
        <div className="grid h-full w-full grid-cols-4 grid-rows-4">
          {cells.map((cell) => {
            const checkpoint = checkpoints[cell];
            return (
              <div
                key={cell}
                className={cn(
                  "relative m-[1px] rounded-md border border-white/[0.05]",
                  pathSet.has(cell)
                    ? "bg-accent/20"
                    : "bg-white/[0.035]",
                )}
              >
                {checkpoint ? (
                  <span className="absolute inset-0 flex items-center justify-center rounded-full bg-accent text-[0.62rem] font-bold text-[#090612]">
                    {checkpoint}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        >
          <polyline
            points={points}
            fill="none"
            stroke="#b49aff"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        </svg>
      </div>
    </div>
  );
}

const MAZE_ROWS = [
  "######",
  "##...#",
  "#....#",
  "#.###.",
  "#....#",
  "######",
];

function MazePreview() {
  const painted = new Set([
    "2,1",
    "2,2",
    "2,3",
    "2,4",
    "3,1",
    "4,1",
    "4,2",
  ]);

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0e19] p-2.5">
      <div className="grid h-full w-full grid-cols-6 grid-rows-6 gap-[2px]">
        {MAZE_ROWS.join("").split("").map((cell, index) => {
          const row = Math.floor(index / 6);
          const col = index % 6;
          const key = `${row},${col}`;
          const isFloor = cell === ".";
          const isPainted = isFloor && painted.has(key);
          const isStart = row === 2 && col === 1;
          return (
            <div
              key={key}
              className={cn(
                "relative rounded-[3px]",
                !isFloor && "bg-white/[0.055]",
                isFloor && !isPainted && "bg-[#182033]",
                isPainted && "bg-cyan/55",
              )}
            >
              {isStart ? (
                <span className="absolute inset-[22%] rounded-full bg-white shadow-[0_0_14px_rgba(255,255,255,0.65)]" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type GameCardProps = {
  game: GameDefinition;
  completed: number;
  lastLevel: number;
};

export function GameCard({ game, completed, lastLevel }: GameCardProps) {
  const isZip = game.slug === "zip";
  const percent = Math.round((completed / game.levelCount) * 100);

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface/55 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:p-5"
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute -right-16 -top-16 size-44 rounded-full blur-3xl transition group-hover:opacity-90",
          isZip ? "bg-accent/15" : "bg-cyan/12",
        )}
      />

      <div className="relative flex gap-4">
        <div className="w-24 shrink-0 sm:w-28">
          {isZip ? <ZipPreview /> : <MazePreview />}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex size-7 items-center justify-center rounded-lg",
                    isZip
                      ? "bg-accent/15 text-accent"
                      : "bg-cyan/15 text-cyan",
                  )}
                >
                  {isZip ? (
                    <Route aria-hidden="true" className="size-4" />
                  ) : (
                    <Sparkles aria-hidden="true" className="size-4" />
                  )}
                </span>
                <h3 className="font-display text-lg font-bold tracking-tight">
                  {game.name}
                </h3>
              </div>
              <p className="mt-1.5 text-xs font-medium text-text-muted">
                {game.tagline}
              </p>
            </div>
            <ArrowRight
              aria-hidden="true"
              className="mt-1 size-4 shrink-0 text-text-muted transition group-hover:translate-x-0.5 group-hover:text-text"
            />
          </div>

          <p className="mt-2 line-clamp-2 text-xs leading-5 text-text-secondary">
            {game.description}
          </p>

          <div className="mt-3">
            <div className="flex items-center justify-between text-[0.65rem] font-semibold text-text-muted">
              <span>
                {completed} / {game.levelCount} complete
              </span>
              <span>{percent}%</span>
            </div>
            <ProgressBar
              value={completed}
              max={game.levelCount}
              className="mt-1.5 h-1.5"
              barClassName={isZip ? undefined : "from-cyan to-accent"}
              label={`${game.name} completion`}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-[0.65rem]">
            <span className="text-text-muted">
              Level {lastLevel} of {game.levelCount}
            </span>
            {completed === game.levelCount ? (
              <span className="inline-flex items-center gap-1 font-semibold text-success">
                <Check aria-hidden="true" className="size-3" /> Mastered
              </span>
            ) : (
              <span className="font-semibold text-text-secondary">
                {completed > 0 ? "Continue" : "Start playing"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
