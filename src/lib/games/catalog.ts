import { GAME_DEFINITIONS } from "@/games/definitions";
import type {
  GameCategory,
  GameDefinition,
  GameIconName,
  GameId,
} from "@/lib/games/contracts";

export type {
  GameCategory,
  GameIconName,
  GameId,
} from "@/lib/games/contracts";

type GameUiMeta = {
  icon: GameIconName;
  phase: number;
  status: "In build" | "Playable";
};

const CATEGORY_LABELS: Record<GameCategory, string> = {
  reflex: "Reflex",
  word: "Word",
  puzzle: "Puzzle",
  memory: "Memory",
  action: "Action",
};

const UI_META = {
  "reaction-rush": { icon: "zap", phase: 4, status: "In build" },
  "word-master": { icon: "book-open", phase: 5, status: "In build" },
  "number-merge": { icon: "layers", phase: 6, status: "In build" },
  "memory-challenge": { icon: "brain", phase: 7, status: "In build" },
  "neon-survival": { icon: "rocket", phase: 8, status: "In build" },
} as const satisfies Record<GameId, GameUiMeta>;

export type GameCatalogEntry = GameDefinition & {
  categoryLabel: string;
  icon: GameIconName;
  accent: string;
  phase: number;
  status: "In build" | "Playable";
};

export const GAME_CATALOG: readonly GameCatalogEntry[] = GAME_DEFINITIONS.map(
  (game): GameCatalogEntry => ({
    ...game,
    categoryLabel: CATEGORY_LABELS[game.category],
    icon: UI_META[game.id].icon,
    accent: game.accentVar,
    phase: UI_META[game.id].phase,
    status: UI_META[game.id].status,
  }),
);

export function getGameById(gameId: string): GameCatalogEntry | undefined {
  return GAME_CATALOG.find((game) => game.id === gameId);
}
