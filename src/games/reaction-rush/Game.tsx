import { GameUnavailable } from "@/components/game/game-unavailable";
import type { GameStageProps } from "@/components/game/types";

export default function ReactionRushGame({ level }: GameStageProps) {
  return <GameUnavailable gameId="reaction-rush" level={level} />;
}