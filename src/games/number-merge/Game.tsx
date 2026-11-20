import { GameUnavailable } from "@/components/game/game-unavailable";
import type { GameStageProps } from "@/components/game/types";

export default function NumberMergeGame({ level }: GameStageProps) {
  return <GameUnavailable gameId="number-merge" level={level} />;
}