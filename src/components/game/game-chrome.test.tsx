import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { GAME_DEFINITION_BY_ID } from "@/games/definitions";

import { GameChrome } from "./game-chrome";
import { GameUnavailable } from "./game-unavailable";
import { PauseOverlay } from "./pause-overlay";
import { ResultPanel } from "./result-panel";

vi.mock("next/link", () => ({
  default: function MockLink({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children: ReactNode;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

const game = GAME_DEFINITION_BY_ID["reaction-rush"];

describe("GameChrome", () => {
  it("shows the game header, controls, and toggleable instructions", async () => {
    const user = userEvent.setup();
    const onPause = vi.fn();
    const onRestart = vi.fn();

    render(
      <GameChrome
        game={game}
        level={2}
        score={640}
        bestScore={900}
        onPause={onPause}
        onRestart={onRestart}
      >
        <p>Play area</p>
      </GameChrome>,
    );

    expect(
      screen.getByRole("heading", { name: "Reaction Rush", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Level 2 of 10")).toBeInTheDocument();
    expect(screen.getByText("640")).toBeInTheDocument();
    expect(screen.getByText("900")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Library" })).toHaveAttribute(
      "href",
      "/games",
    );

    const help = screen.getByRole("button", { name: "How to play" });
    expect(help).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("heading", { name: "How to play" }),
    ).not.toBeInTheDocument();

    await user.click(help);
    expect(
      screen.getByRole("heading", { name: "How to play" }),
    ).toBeInTheDocument();
    expect(help).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: "Pause game" }));
    expect(onPause).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Restart level" }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("has no critical or serious axe violations", async () => {
    const { container } = render(
      <main>
        <GameChrome game={game} level={1}>
          <p>Play area</p>
        </GameChrome>
      </main>,
    );

    const results = await axe.run(container, {
      rules: {
        "color-contrast": { enabled: false },
      },
    });
    const serious = results.violations.filter(
      (violation) =>
        violation.impact === "critical" || violation.impact === "serious",
    );

    expect(serious).toEqual([]);
  });
});

describe("PauseOverlay", () => {
  it("offers resume, restart, and quit actions", async () => {
    const user = userEvent.setup();
    const onResume = vi.fn();
    const onRestart = vi.fn();
    const onQuit = vi.fn();

    render(
      <PauseOverlay
        open
        onResume={onResume}
        onRestart={onRestart}
        onQuit={onQuit}
      />,
    );

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Paused");

    await user.click(screen.getByRole("button", { name: "Resume" }));
    expect(onResume).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Restart level" }));
    expect(onRestart).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Quit to library" }));
    expect(onQuit).toHaveBeenCalledTimes(1);
  });

  it("resumes when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onResume = vi.fn();

    render(
      <PauseOverlay
        open
        onResume={onResume}
        onRestart={vi.fn()}
        onQuit={vi.fn()}
      />,
    );

    await user.keyboard("{Escape}");

    expect(onResume).toHaveBeenCalledTimes(1);
  });
});

describe("ResultPanel", () => {
  it("shows a win, new best, replay, next level, and library link", async () => {
    const user = userEvent.setup();
    const onReplay = vi.fn();
    const onNext = vi.fn();

    render(
      <ResultPanel
        gameName="Reaction Rush"
        level={1}
        won
        score={900}
        bestScore={900}
        isNewBest
        nextLevel={2}
        onReplay={onReplay}
        onNext={onNext}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Level complete" }),
    ).toBeInTheDocument();
    expect(screen.getByText("New best")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Replay" }));
    expect(onReplay).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Next level" }));
    expect(onNext).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("link", { name: "Back to library" }),
    ).toHaveAttribute("href", "/games");
  });

  it("states the missed requirement on a loss and offers no next level", () => {
    render(
      <ResultPanel
        gameName="Reaction Rush"
        level={2}
        won={false}
        score={700}
        requirement="Average 412 ms — needed ≤ 400 ms."
        onReplay={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Level failed" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Average 412 ms — needed ≤ 400 ms."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Next level" }),
    ).not.toBeInTheDocument();
  });
});

describe("GameUnavailable", () => {
  it("is honest that the engine is not playable yet", () => {
    render(<GameUnavailable gameId="reaction-rush" level={3} />);

    expect(
      screen.getByRole("heading", {
        name: "Reaction Rush is not playable yet",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Engine in build")).toBeInTheDocument();
    expect(screen.getByText("Level 3 of 10")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Start disabled" }),
    ).toBeDisabled();
  });
});