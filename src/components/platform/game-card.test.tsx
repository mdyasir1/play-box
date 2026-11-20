import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { GameCatalogEntry } from "@/lib/games/catalog";
import { GAME_CATALOG } from "@/lib/games/catalog";
import type { GameProgress } from "@/lib/games/contracts";

import { GameCard } from "./game-card";

const baseGame = GAME_CATALOG[0];

describe("GameCard", () => {
  it("labels an in-build game honestly and links to its details", () => {
    if (!baseGame) {
      throw new Error("Game catalog is empty");
    }

    render(<GameCard game={baseGame} />);

    expect(
      screen.getByRole("heading", { name: "Reaction Rush" }),
    ).toBeInTheDocument();
    expect(screen.getByText("In build")).toBeInTheDocument();
    expect(screen.getByText("10 levels")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View details Reaction Rush" }),
    ).toHaveAttribute("href", "/games/reaction-rush");
    expect(screen.queryByText(/best score/i)).not.toBeInTheDocument();
  });

  it("shows real progress and a continue action for a playable game", () => {
    if (!baseGame) {
      throw new Error("Game catalog is empty");
    }

    const game: GameCatalogEntry = {
      ...baseGame,
      status: "Playable",
    };
    const progress: GameProgress = {
      unlockedLevel: 2,
      completedLevels: [1],
      bestScore: 900,
      perLevelBest: { 1: 900 },
      totalPlays: 3,
    };

    render(<GameCard game={game} progress={progress} />);

    expect(screen.getByText("Level 2 of 10")).toBeInTheDocument();
    expect(
      screen.getByRole("progressbar", {
        name: "Reaction Rush level progress",
      }),
    ).toHaveAttribute("aria-valuenow", "1");
    expect(screen.getByText("900")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Continue Reaction Rush" }),
    ).toHaveAttribute("href", "/games/reaction-rush/play");
  });
});