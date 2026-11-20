import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { GameIcon } from "@/components/platform/game-icon";
import { Badge } from "@/components/ui/badge";
import type { GameCatalogEntry } from "@/lib/games/catalog";

type GameCardProps = {
  game: GameCatalogEntry;
};

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface/70 shadow-[0_8px_24px_rgba(0,0,0,0.24)] transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface"
    >
      <div
        className="relative flex h-28 items-center justify-center overflow-hidden border-b border-border"
        style={{
          backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${game.accent} 24%, transparent) 0%, transparent 68%)`,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <GameIcon
          name={game.icon}
          className="relative size-10 transition-transform duration-300 group-hover:scale-110"
          style={{ color: game.accent }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{game.category}</Badge>
          <Badge variant="warning">{game.status}</Badge>
        </div>

        <div className="space-y-1">
          <h3 className="font-display text-lg font-semibold tracking-tight text-text">
            {game.name}
          </h3>
          <p className="text-sm font-medium text-text-secondary">
            {game.tagline}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-text-muted">
          {game.description}
        </p>

        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-accent">
          View game
          <ChevronRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
