"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Gamepad2,
  HardDrive,
  Paintbrush,
  Route,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

import { GameCard } from "@/components/game-card";
import { buttonStyles } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { GAMES } from "@/lib/games";
import { useProgress } from "@/lib/use-progress";

const FEATURES = [
  {
    icon: HardDrive,
    title: "Local by design",
    description:
      "Progress is saved in your browser. No account, no sync prompt, no personal data.",
  },
  {
    icon: ShieldCheck,
    title: "Every level verified",
    description:
      "Maze Paint levels are solver-checked. Zip levels are generated from complete Hamiltonian paths.",
  },
  {
    icon: Smartphone,
    title: "Touch and keyboard",
    description:
      "Drag the Zip path, swipe the Maze Paint board, or use the keyboard when you want precision.",
  },
] as const;

export default function HomePage() {
  const { progress } = useProgress();
  const zip = progress.games.zip;
  const maze = progress.games["maze-paint"];
  const totalCompleted = zip.completed.length + maze.completed.length;
  const totalLevels = GAMES.reduce((sum, game) => sum + game.levelCount, 0);

  return (
    <div className="animate-rise space-y-12 overflow-x-clip sm:space-y-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-accent">
            <Sparkles aria-hidden="true" className="size-3" />
            Two games · 200 levels
          </span>
          <h1 className="mt-5 max-w-2xl font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-6xl">
            A tiny arcade for a{" "}
            <span className="bg-gradient-to-r from-accent to-cyan bg-clip-text text-transparent">
              sharper mind.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
            One continuous Zip path. One roller that paints the whole maze.
            Two focused puzzles, 100 levels each, built for short sessions and
            zero distractions.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/games/zip" className={buttonStyles({ size: "lg" })}>
              Play Zip
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              href="/games/maze-paint"
              className={buttonStyles({ variant: "cyan", size: "lg" })}
            >
              Play Maze Paint
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <p className="mt-5 text-xs font-medium text-text-muted">
            No account · Local progress · Touch and keyboard
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[2rem] bg-accent/10 blur-3xl"
          />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-elevated/95 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between">
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
                Your playbox
              </span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[0.65rem] font-semibold text-success">
                Saved locally
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-display text-4xl font-bold tabular-nums">
                    {totalCompleted}
                    <span className="text-lg text-text-muted">/{totalLevels}</span>
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    levels completed
                  </p>
                </div>
                <Gamepad2 aria-hidden="true" className="size-8 text-accent/70" />
              </div>
              <ProgressBar
                value={totalCompleted}
                max={totalLevels}
                className="mt-4"
                label="Total level completion"
              />
            </div>

            <div className="mt-5 space-y-2.5">
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
                  <Route aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Zip</p>
                  <p className="text-[0.68rem] text-text-muted">
                    {zip.completed.length} of 100 complete
                  </p>
                </div>
                <span className="text-xs font-semibold tabular-nums text-text-secondary">
                  {zip.lastLevel}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-cyan/15 text-cyan">
                  <Paintbrush aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Maze Paint</p>
                  <p className="text-[0.68rem] text-text-muted">
                    {maze.completed.length} of 100 complete
                  </p>
                </div>
                <span className="text-xs font-semibold tabular-nums text-text-secondary">
                  {maze.lastLevel}
                </span>
              </div>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-[0.68rem] text-text-muted">
              <Check aria-hidden="true" className="size-3 text-success" />
              Your best results are kept per level.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="games-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-text-muted">
              The lineup
            </p>
            <h2
              id="games-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Pick your puzzle
            </h2>
          </div>
          <p className="max-w-sm text-sm text-text-secondary">
            Two complete games, not a demo. Every level is unlocked from the
            start.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {GAMES.map((game) => (
            <GameCard
              key={game.slug}
              game={game}
              completed={progress.games[game.slug].completed.length}
              lastLevel={progress.games[game.slug].lastLevel}
            />
          ))}
        </div>
      </section>

      <section aria-label="How the games work" className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-accent/20 bg-accent/[0.06] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-accent">
            <Route aria-hidden="true" className="size-4" />
            <h2 className="font-display text-lg font-bold">Zip</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Start at 1 and draw a single continuous path through every square.
            Hit the numbered cells in order, backtrack when needed, and finish
            with a full board.
          </p>
          <ol className="mt-4 space-y-2 text-xs text-text-muted">
            <li className="flex gap-2">
              <span className="font-semibold text-accent">01</span>
              Press and drag from the cell marked 1.
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-accent">02</span>
              Visit 2, 3, 4… without crossing your path.
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-accent">03</span>
              Fill every square to complete the level.
            </li>
          </ol>
        </div>

        <div className="rounded-2xl border border-cyan/20 bg-cyan/[0.055] p-5 sm:p-6">
          <div className="flex items-center gap-2 text-cyan">
            <Paintbrush aria-hidden="true" className="size-4" />
            <h2 className="font-display text-lg font-bold">Maze Paint</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-text-secondary">
            Slide the roller in a direction. It keeps going until a wall stops
            it, painting every open tile it crosses. Cover the whole maze in as
            few moves as you can.
          </p>
          <ol className="mt-4 space-y-2 text-xs text-text-muted">
            <li className="flex gap-2">
              <span className="font-semibold text-cyan">01</span>
              Swipe the board or use arrow keys.
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-cyan">02</span>
              The roller stops only at a wall.
            </li>
            <li className="flex gap-2">
              <span className="font-semibold text-cyan">03</span>
              Paint every open tile, ideally at par.
            </li>
          </ol>
        </div>
      </section>

      <section aria-labelledby="principles-heading">
        <h2
          id="principles-heading"
          className="font-display text-2xl font-bold tracking-tight sm:text-3xl"
        >
          Built the quiet way
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-surface/45 p-5"
            >
              <feature.icon aria-hidden="true" className="size-6 text-accent" />
              <h3 className="mt-3 font-display text-sm font-bold">
                {feature.title}
              </h3>
              <p className="mt-2 text-xs leading-5 text-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
