import {
  BookOpen,
  Brain,
  Layers,
  Rocket,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";

import type { GameIconName } from "@/lib/games/catalog";

const GAME_ICONS: Record<GameIconName, LucideIcon> = {
  zap: Zap,
  "book-open": BookOpen,
  layers: Layers,
  brain: Brain,
  rocket: Rocket,
};

type GameIconProps = {
  name: GameIconName;
  className?: string;
  style?: CSSProperties;
  strokeWidth?: number;
};

export function GameIcon({
  name,
  className,
  style,
  strokeWidth = 1.6,
}: GameIconProps) {
  const Icon = GAME_ICONS[name];

  return (
    <Icon
      aria-hidden="true"
      className={className}
      style={style}
      strokeWidth={strokeWidth}
    />
  );
}
