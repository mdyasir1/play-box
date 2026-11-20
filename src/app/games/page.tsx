import type { Metadata } from "next";

import { GameCard } from "@/components/platform/game-card";
import { Badge } from "@/components/ui/badge";
import { GAME_CATALOG } from "@/lib/games/catalog";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Browse the five YASIR PLAYBOX single-player games: reflex, word, puzzle, memory, and action.",
};

export default function GamesPage() {
  return (
    <div className="animate-rise">
      <div className="max-w-2xl">
        <Badge variant="warning">Modules in build</Badge>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Games library
        </h1>
        <p className="mt-3 text-base leading-7 text-text-secondary">
          Five focused single-player games, each with ten levels of real
          progression. Playable modules are being added one by one and will
          appear here as they pass testing.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAME_CATALOG.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}
