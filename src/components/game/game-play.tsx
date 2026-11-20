"use client";

import type { GameDefinition } from "@/lib/games/contracts";

import { GameChrome } from "./game-chrome";
import { GameHost } from "./game-host";

type GamePlayProps = {
  game: GameDefinition;
  level: number;
};

export function GamePlay({ game, level }: GamePlayProps) {
  return (
    <GameChrome game={game} level={level}>
      <GameHost gameId={game.id} level={level} />
    </GameChrome>
  );
}