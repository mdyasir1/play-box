import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { getLevelConfig } from "@/games/level-registry";
import { DifficultyChip } from "@/components/ui/difficulty-chip";
import { LevelBadge } from "@/components/ui/level-badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import type { GameProgress } from "@/lib/games/contracts";
import type { GameCatalogEntry } from "@/lib/games/catalog";
import { GameIcon } from "@/components/platform/game-icon";
import { cn } from "@/lib/utils";

const scoreFormatter = new Intl.NumberFormat("en-US");

type GameCardProps = {
  game: GameCatalogEntry;
  progress?: GameProgress;
  className?: string;
};

export function GameCard({ game, progress, className }: GameCardProps) {
  const playable = game.status === "Playable";
  const level = progress?.unlockedLevel ?? 1;
  const levelConfig = getLevelConfig(game.id, level);
  const completedLevels = progress?.completedLevels.length ?? 0;
  const actionLabel = playable
    ? progress && progress.totalPlays > 0
      ? "Continue"
      : "Play"
    : "View details";
  const href = playable
    ? `/games/${game.id}/play`
    : `/games/${game.id}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface/70 shadow-[0_8px_24px_rgba(0,0,0,0.24)] transition-[transform,border-color,background-color] duration-200 focus-within:ring-2 focus-within:ring-focus focus-within:ring-offset-2 focus-within:ring-offset-bg hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface",
        className,
      )}
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
          <Badge variant="outline">{game.categoryLabel}</Badge>
          <Badge variant={playable ? "success" : "warning"}>
            {game.status}
          </Badge>
        </div>

        <div className="space-y-1">
          <h3 className="font-display text-lg font-semibold tracking-tight text-text">
            <Link
              href={href}
              className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {game.name}
            </Link>
          </h3>
          <p className="text-sm font-medium text-text-secondary">
            {game.tagline}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-text-muted">
          {game.description}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          {playable ? (
            <LevelBadge level={level} maxLevel={game.maxLevel} />
          ) : (
            <span className="text-xs font-medium text-text-muted">
              {game.maxLevel} levels
            </span>
          )}
          <DifficultyChip label={levelConfig?.difficultyLabel ?? "Intro"} />
        </div>

        {playable ? (
          <div className="mt-1 space-y-2">
            <ProgressBar
              value={completedLevels}
              max={game.maxLevel}
              label={`${game.name} level progress`}
              showValue
            />
            <p className="text-xs text-text-muted">
              Best score{" "}
              <span className="font-semibold tabular-nums text-text-secondary">
                {scoreFormatter.format(progress?.bestScore ?? 0)}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-text-muted">
            Playable in Phase {game.phase}
          </p>
        )}

        <Link
          href={href}
          aria-label={`${actionLabel} ${game.name}`}
          className="relative z-10 mt-auto inline-flex min-h-9 items-center gap-1 self-start rounded-lg text-sm font-semibold text-accent transition-colors hover:text-[#c9baff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          {actionLabel}
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  );
}