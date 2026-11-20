import { ArrowRight, Gauge, Gamepad2, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Splash } from "@/components/brand/splash";
import { GameCard } from "@/components/platform/game-card";
import { HowItWorksDialog } from "@/components/platform/how-it-works-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GAME_CATALOG } from "@/lib/games/catalog";

const FEATURES = [
  {
    icon: Gauge,
    title: "Real progression",
    description:
      "Ten levels per game, each with a measurable difficulty step and a saved best score.",
  },
  {
    icon: ShieldCheck,
    title: "No account needed",
    description:
      "Progress lives on your device first. No email, no sign-up, no personal data.",
  },
  {
    icon: Gamepad2,
    title: "Built for one hand",
    description:
      "Touch-first controls, safe-area spacing, and layouts designed for a phone screen.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <Splash />

      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div className="animate-rise">
          <Badge variant="accent">Your personal arcade</Badge>

          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Your Personal{" "}
            <span className="bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-transparent">
              Arcade.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
            Five focused single-player games, ten levels each. Sharpen your
            reflexes, words, logic, memory, and nerve — in short sessions built
            for your phone.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/games">
                Browse games
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            <HowItWorksDialog />
          </div>

          <p className="mt-6 text-sm text-text-muted">
            No account. No ads. No noise.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="animate-rise relative mx-auto w-full max-w-sm [animation-delay:120ms] lg:max-w-none"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-accent/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-card border border-border bg-bg-elevated p-6 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                Arcade lineup
              </span>
              <Badge variant="warning">In build</Badge>
            </div>

            <div className="mt-5 space-y-2.5">
              {GAME_CATALOG.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between rounded-xl border border-border/70 bg-surface/70 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: game.accent }}
                    />
                    <span className="text-sm font-medium text-text">
                      {game.name}
                    </span>
                  </div>
                  <span className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-text-muted">
                    {game.category}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-border/70 bg-surface/50 px-3 py-3">
                <p className="font-display text-xl font-semibold text-text">5</p>
                <p className="text-xs text-text-muted">games</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-surface/50 px-3 py-3">
                <p className="font-display text-xl font-semibold text-text">
                  10
                </p>
                <p className="text-xs text-text-muted">levels each</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 sm:mt-24" aria-labelledby="lineup-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
              The lineup
            </p>
            <h2
              id="lineup-heading"
              className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl"
            >
              Five ways to play
            </h2>
          </div>
          <Link
            href="/games"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-[#c9baff]"
          >
            Open library
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAME_CATALOG.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      <section className="mt-16 sm:mt-20" aria-label="Platform principles">
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-card border border-border bg-surface/40 p-5"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl border border-border bg-bg-elevated text-accent">
                <feature.icon aria-hidden="true" className="size-4" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-text">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
