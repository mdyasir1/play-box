import { GameUnavailable } from "@/components/game/game-unavailable";
import type { GameStageProps } from "@/components/game/types";

export default function WordMasterGame({ level }: GameStageProps) {
  return <GameUnavailable gameId="word-master" level={level} />;
}