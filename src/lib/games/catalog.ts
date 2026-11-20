export type GameCategory = "Reflex" | "Word" | "Puzzle" | "Memory" | "Action";

export type GameIconName =
  | "zap"
  | "book-open"
  | "layers"
  | "brain"
  | "rocket";

export type GameCatalogEntry = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: GameCategory;
  icon: GameIconName;
  accent: string;
  phase: number;
  status: "In build" | "Playable";
};

export const GAME_CATALOG = [
  {
    id: "reaction-rush",
    name: "Reaction Rush",
    tagline: "Chase the green.",
    description:
      "Wait for the signal, then tap as fast as you can. Jump too early and the round costs you.",
    category: "Reflex",
    icon: "zap",
    accent: "var(--color-warning)",
    phase: 4,
    status: "In build",
  },
  {
    id: "word-master",
    name: "Word Master",
    tagline: "Six tries. Five letters.",
    description:
      "Deduce the hidden word with color-coded clues, a daily challenge, and a keyboard built for thumbs.",
    category: "Word",
    icon: "book-open",
    accent: "var(--color-success)",
    phase: 5,
    status: "In build",
  },
  {
    id: "number-merge",
    name: "Number Merge",
    tagline: "Slide. Merge. Climb.",
    description:
      "Combine matching tiles toward an ever-higher target, with undo, swipes, and keyboard control.",
    category: "Puzzle",
    icon: "layers",
    accent: "var(--color-accent)",
    phase: 6,
    status: "In build",
  },
  {
    id: "memory-challenge",
    name: "Memory Challenge",
    tagline: "Watch. Repeat. Remember.",
    description:
      "Follow the glowing pads as the sequence grows longer and the playback gets faster.",
    category: "Memory",
    icon: "brain",
    accent: "var(--color-accent-blue)",
    phase: 7,
    status: "In build",
  },
  {
    id: "neon-survival",
    name: "Neon Survival",
    tagline: "Stay in the light.",
    description:
      "Dodge a neon barrage, grab power-ups, and survive the clock on touch or keyboard.",
    category: "Action",
    icon: "rocket",
    accent: "var(--color-danger)",
    phase: 8,
    status: "In build",
  },
] as const satisfies readonly GameCatalogEntry[];

export type GameId = (typeof GAME_CATALOG)[number]["id"];

export function getGameById(gameId: string): GameCatalogEntry | undefined {
  return GAME_CATALOG.find((game) => game.id === gameId);
}
