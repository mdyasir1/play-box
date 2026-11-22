export type GameSlug = "zip" | "maze-paint";

export interface GameDefinition {
  slug: GameSlug;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  levelCount: number;
  accent: "violet" | "cyan";
}

export const GAMES: readonly GameDefinition[] = [
  {
    slug: "zip",
    name: "Zip",
    shortName: "Zip",
    tagline: "One path. Every square.",
    description:
      "Draw a single continuous path that fills the whole grid and visits the numbers in order.",
    levelCount: 100,
    accent: "violet",
  },
  {
    slug: "maze-paint",
    name: "Maze Paint",
    shortName: "Maze Paint",
    tagline: "Slide. Paint. Repeat.",
    description:
      "Slide your roller until it hits a wall. Paint every open tile in the maze in as few moves as you can.",
    levelCount: 100,
    accent: "cyan",
  },
] as const;

export function getGame(slug: GameSlug): GameDefinition {
  const game = GAMES.find((entry) => entry.slug === slug);
  if (!game) {
    throw new Error(`Unknown game: ${slug}`);
  }
  return game;
}
