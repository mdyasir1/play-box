"use client";

import { ChartColumn, Gamepad2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatTile } from "@/components/ui/stat-tile";
import { useLocalSnapshot } from "@/lib/persistence/hooks";

export default function StatsPage() {
  const result = useLocalSnapshot();
  const snapshot = result?.snapshot ?? null;

  if (!snapshot) {
    return (
      <div className="animate-rise space-y-5">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Stats</h1>
        <Skeleton className="h-10 w-28" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 sm:h-32" />
          ))}
        </div>
        <Skeleton className="h-28 sm:h-32" />
      </div>
    );
  }

  const perGame = Object.values(snapshot.games);
  const totalPlays = perGame.reduce((sum, game) => sum + game.totalPlays, 0);
  const completedLevels = perGame.flatMap((game) => game.completedLevels).sort((a, b) => a - b);
  const bestScore = perGame.reduce((max, game) => Math.max(max, game.bestScore), 0);
  const activeGames = perGame.filter((game) => game.totalPlays > 0).length;
  const readyGames = perGame.filter((game) => game.totalPlays === 0 && game.unlockedLevel === 1).length;
  const activity = snapshot.activity.slice(0, 5);

  return (
    <div className="animate-rise">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
          <ChartColumn aria-hidden="true" className="size-5" />
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Stats</h1>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Games played" value={totalPlays} icon={Gamepad2} />
        <StatTile label="Completed levels" value={completedLevels.length} icon={Gamepad2} />
        <StatTile label="Best score" value={bestScore === 0 ? "—" : bestScore} icon={ChartColumn} />
        <StatTile label="Games with progress" value={activeGames} icon={Gamepad2} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <StatTile label="Ready for first play" value={readyGames} />
        <StatTile label="Highest unlocked level" value={Math.max(...perGame.map((game) => game.unlockedLevel))} />
        <StatTile label="Activity entries stored" value={snapshot.activity.length} />
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {activity.length === 0 ? (
            <p className="text-sm text-text-muted">Your record starts with the first completed run.</p>
          ) : (
            activity.map((entry) => (
              <div key={entry.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border/70 bg-surface/50 px-3 py-2.5">
                <span className="text-sm font-semibold text-text">{entry.gameId}</span>
                <Badge variant={entry.result === "win" ? "success" : "warning"}>{entry.result === "win" ? "Win" : "Loss"}</Badge>
                <span className="text-xs text-text-muted">Level {entry.level}</span>
                <span className="ml-auto font-semibold tabular-nums text-text">{entry.score}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader><CardTitle>Progress by game</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(snapshot.games).map(([gameId, game]) => {
            const gameLabel = gameId.replace(/-/g, " ");
            return (
              <div key={gameId} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-semibold text-text">
                  <span>{gameLabel}</span>
                  <span className="text-text-muted">Level {game.unlockedLevel}</span>
                </div>
                <ProgressBar value={game.completedLevels.length} max={game.unlockedLevel} label={`${gameLabel} completed levels`} showValue />
                <p className="text-xs text-text-muted">
                  {game.totalPlays === 0 ? "Not started" : `${game.totalPlays} play${game.totalPlays === 1 ? "" : "s"}, best ${game.bestScore}`}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}