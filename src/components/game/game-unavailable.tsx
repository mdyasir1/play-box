import { Gamepad2 } from "lucide-react";

import { getLevelConfig } from "@/games/level-registry";
import { GameIcon } from "@/components/platform/game-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DifficultyChip } from "@/components/ui/difficulty-chip";
import { LevelBadge } from "@/components/ui/level-badge";
import type { GameId } from "@/lib/games/contracts";
import { getGameById } from "@/lib/games/catalog";

type GameUnavailableProps = {
  gameId: GameId;
  level: number;
};

export function GameUnavailable({ gameId, level }: GameUnavailableProps) {
  const game = getGameById(gameId);

  if (!game) {
    return null;
  }

  const levelConfig = getLevelConfig(gameId, level);

  return (
    <section
      aria-labelledby="game-stage-title"
      className="flex min-h-[24rem] flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface/30 p-6 text-center"
    >
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl border border-border bg-bg-elevated">
        <GameIcon
          name={game.icon}
          className="size-7"
          style={{ color: game.accent }}
        />
      </span>

      <Badge variant="warning">
        <Gamepad2 aria-hidden="true" className="size-3" />
        Engine in build
      </Badge>

      <h2
        id="game-stage-title"
        className="mt-4 font-display text-xl font-semibold tracking-tight text-text sm:text-2xl"
      >
        {game.name} is not playable yet
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
        The shared game shell, level curve, and controls are ready. The playable
        engine arrives in Phase {game.phase}. No progress is recorded yet.
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <LevelBadge level={level} maxLevel={game.maxLevel} />
        <DifficultyChip label={levelConfig?.difficultyLabel ?? "Intro"} />
      </div>

      <Button disabled className="mt-6">
        Start disabled
      </Button>
    </section>
  );
}