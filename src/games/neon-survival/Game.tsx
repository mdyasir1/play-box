import { GameUnavailable } from "@/components/game/game-unavailable";
import type { GameStageProps } from "@/components/game/types";

export default function NeonSurvivalGame({ level }: GameStageProps) {
  return <GameUnavailable gameId="neon-survival" level={level} />;
}