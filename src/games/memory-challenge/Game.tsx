import { GameUnavailable } from "@/components/game/game-unavailable";
import type { GameStageProps } from "@/components/game/types";

export default function MemoryChallengeGame({ level }: GameStageProps) {
  return <GameUnavailable gameId="memory-challenge" level={level} />;
}