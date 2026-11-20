"use client";

import { useMemo, useState } from "react";
import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/platform/empty-state";
import { GameCard } from "@/components/platform/game-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalSnapshot } from "@/lib/persistence/hooks";
import { GAME_CATALOG } from "@/lib/games/catalog";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "Reflex", label: "Reflex" },
  { value: "Word", label: "Word" },
  { value: "Puzzle", label: "Puzzle" },
  { value: "Memory", label: "Memory" },
  { value: "Action", label: "Action" },
] as const;

export default function GamesPage() {
  const result = useLocalSnapshot();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const snapshot = result?.snapshot ?? null;

  const filteredGames = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return GAME_CATALOG.filter((game) => {
      if (category !== "all" && game.categoryLabel !== category) {
        return false;
      }
      if (!normalizedSearch) {
        return true;
      }
      return (
        game.name.toLowerCase().includes(normalizedSearch) ||
        game.description.toLowerCase().includes(normalizedSearch) ||
        game.categoryLabel.toLowerCase().includes(normalizedSearch) ||
        game.tagline.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [category, search]);

  if (!snapshot) {
    return (
      <div className="animate-rise space-y-4">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Games library</h1>
        <Skeleton className="h-10 w-32" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 sm:h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-rise space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Badge variant="warning">Modules in build</Badge>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">Games library</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-text-secondary">
            Five focused single-player games, each with ten levels of real progression. Playable modules are being added one by one and will appear here as they pass testing.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search games"
            placeholder="Search games"
            type="search"
            className="h-11 min-h-11 w-full rounded-xl border border-border bg-surface/70 px-4 text-sm text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:w-56"
          />
          <div role="group" aria-label="Category filters" className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                aria-pressed={category === filter.value}
                onClick={() => setCategory(filter.value)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${category === filter.value ? "border-accent/40 bg-accent/10 text-accent" : "border-border bg-surface/50 text-text-muted hover:border-border-strong hover:text-text"}`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map((game) => (
          <GameCard key={game.id} game={game} progress={snapshot.games[game.id]} />
        ))}
      </div>

      {filteredGames.length === 0 ? (
        <EmptyState icon={Gamepad2} title="No games match" description="Try another name or category." />
      ) : null}

      <Card>
        <CardHeader><CardTitle>Module details</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-text-secondary">Each card lists the real level curve, difficulty label, and any saved progress. Playable links become active as engines ship.</p></CardContent>
      </Card>
    </div>
  );
}