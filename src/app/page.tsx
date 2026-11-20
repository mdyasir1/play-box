"use client";

import type { SVGProps } from "react";
import { ArrowRight, Clock, Gamepad2, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Splash } from "@/components/brand/splash";
import { GameCard } from "@/components/platform/game-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/platform/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/components/ui/stat-tile";
import { GAME_CATALOG } from "@/lib/games/catalog";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements/definitions";
import { useLocalSnapshot } from "@/lib/persistence/hooks";

const FEATURES = [
  { icon: GaugeIcon, title: "Real progression", description: "Ten levels per game, each with a measurable difficulty step and a saved best score." },
  { icon: ShieldCheck, title: "No account needed", description: "Progress lives on your device first. No email, no sign-up, no personal data." },
  { icon: Gamepad2, title: "Built for one hand", description: "Touch-first controls, safe-area spacing, and layouts designed for a phone screen." },
] as const;

function GaugeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M6 12h6" strokeLinecap="round" />
      <circle cx="12" cy="4" r="1" fill="currentColor" />
      <path d="M16.7 6.9l1.8 1.8M4.5 8a4.5 4.5 0 0 1 15 9Z" />
    </svg>
  );
}

export default function HomePage() {
  const result = useLocalSnapshot();
  const snapshot = result?.snapshot ?? null;

  if (!snapshot) {
    return (
      <div className="animate-rise space-y-8">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Your Personal Arcade
        </h1>
        <Skeleton className="h-10 w-44" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-40 sm:h-44" />
          ))}
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const perGame = snapshot.games;
  const stats = {
    totalPlays: Object.values(perGame).reduce((sum, game) => sum + game.totalPlays, 0),
    completedLevels: Object.values(perGame).flatMap((game) => game.completedLevels).length,
    bestScore: Object.values(perGame).reduce((max, game) => Math.max(max, game.bestScore), 0),
    activeGames: Object.values(perGame).filter((game) => game.totalPlays > 0).length,
    bestGames: Object.entries(perGame)
      .filter(([, game]) => game.bestScore > 0)
      .sort(([, a], [, b]) => b.bestScore - a.bestScore)
      .slice(0, 3),
  };

  const featured = GAME_CATALOG[0] ?? GAME_CATALOG.find(Boolean)!;
  const playableFeatured = featured.status === "Playable";
  const achievementCount = Object.keys(snapshot.achievements).filter((id) =>
    ACHIEVEMENT_DEFINITIONS.some((achievement) => achievement.id === id),
  ).length;

  return (
    <>
      <Splash />

      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div className="animate-rise">
          <Badge variant="accent" className="w-fit">Your personal arcade</Badge>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            Your Personal{" "}
            <span className="bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-transparent">Arcade.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
            Five focused single-player games, ten levels each. Sharpen your reflexes, words, logic, memory, and nerve — in short sessions built for your phone.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/games">
                Browse games
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
            {playableFeatured ? (
              <Button asChild size="lg">
                <Link href={`/games/${featured.id}/play`}>
                  Continue playing
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" variant="secondary">
                <Link href={`/games/${featured.id}`}>{featured.status} first</Link>
              </Button>
            )}
          </div>

          <p className="mt-6 text-sm text-text-muted">No account. No ads. No noise.</p>
        </div>

        <div aria-hidden="true" className="animate-rise relative mx-auto w-full max-w-sm lg:max-w-none">
          <div className="absolute inset-x-0 -inset-y-6 rounded-[2rem] bg-accent/10 blur-3xl" />
          <div className="relative overflow-hidden rounded-card border border-border bg-bg-elevated p-6 shadow-[0_24px_64px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Arcade lineup</span>
              <Badge variant="warning">In build</Badge>
            </div>
            <div className="mt-5 space-y-2.5">
              {GAME_CATALOG.map((game) => (
                <div key={game.id} className="flex items-center justify-between rounded-xl border border-border/70 bg-surface/70 px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="size-2 rounded-full" style={{ backgroundColor: game.accent }} />
                    <span className="text-sm font-medium text-text">{game.name}</span>
                  </div>
                  <span className="text-[0.68rem] font-medium uppercase tracking-[0.12em] text-text-muted">{game.categoryLabel}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-border/70 bg-surface/50 px-3 py-3"><p className="font-display text-xl font-semibold text-text">5</p><p className="text-xs text-text-muted">games</p></div>
              <div className="rounded-xl border border-border/70 bg-surface/50 px-3 py-3"><p className="font-display text-xl font-semibold text-text">10</p><p className="text-xs text-text-muted">levels each</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Games played" value={stats.totalPlays} icon={Gamepad2} />
        <StatTile label="Completed levels" value={stats.completedLevels} />
              <StatTile label="Best score" value={stats.bestScore === 0 ? "—" : stats.bestScore} icon={TrendingUp} />
        <StatTile label="Games with progress" value={stats.activeGames} />
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Personal bests</CardTitle></CardHeader>
          <CardContent>
            {stats.bestGames.length === 0 ? (
              <EmptyState icon={TrendingUp} title="No bests yet" description="Best scores appear when a game records a win." />
            ) : (
              <div className="space-y-3">
                {stats.bestGames.map(([gameId, game]) => (
                  <div key={gameId} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-text">{gameId.replace(/-/g, " ")}</span>
                    <span className="font-semibold tabular-nums text-text">{game.bestScore}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {snapshot.activity.length === 0 ? (
              <EmptyState icon={Clock} title="No activity yet" description="Completes will appear here with their game and score." />
            ) : (
              snapshot.activity.slice(0, 5).map((entry) => (
                <div key={entry.id} className="rounded-xl border border-border/70 bg-surface/50 px-3 py-2.5">
                  <p className="text-sm font-medium text-text">{entry.gameId}</p>
                  <p className="text-xs text-text-muted">Level {entry.level} · {entry.score}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Achievement highlights</CardTitle></CardHeader>
          <CardContent>
            <Badge variant="accent">{achievementCount} unlocked</Badge>
            <EmptyState icon={Clock} title="Unlock achievements" description="Earnments are real game results; daily challenges start in Phase 5." />
            <Link href="/achievements" className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent">
              View all achievements
            </Link>
          </CardContent>
        </Card>
      </section>

      <Card className="mt-8">
        <CardHeader><CardTitle>Daily challenge</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-text-secondary">
            One five-letter word is selected daily. The UTC boundary resets the challenge at 00:00 UTC.
          </p>
          <Badge variant="warning">Offline daily mode planned</Badge>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary">
              <Link href="/games/word-master">Open Word Master</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/games/word-master/play">Practice while it is ready</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="mt-10 sm:mt-12" aria-labelledby="lineup-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">The lineup</p><h2 id="lineup-heading" className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">Five ways to play</h2></div>
          <Link href="/games" className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-[#c9baff]">Open library<ArrowRight aria-hidden="true" className="size-4" /></Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GAME_CATALOG.map((game) => (
            <GameCard key={game.id} game={game} progress={snapshot.games[game.id]} />
          ))}
        </div>
      </section>

      <section className="mt-16 sm:mt-20" aria-label="Platform principles">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Platform principles</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-card border border-border bg-surface/40 p-5">
              <feature.icon className="size-10 text-accent" />
              <h3 className="mt-4 font-display text-base font-semibold text-text">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}