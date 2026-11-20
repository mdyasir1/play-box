import { Activity } from "lucide-react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DifficultyChip } from "./difficulty-chip";
import { LevelBadge } from "./level-badge";
import { ProgressBar } from "./progress-bar";
import { StatTile } from "./stat-tile";

describe("LevelBadge", () => {
  it("shows a compact badge with a full accessible level label", () => {
    render(<LevelBadge level={4} maxLevel={10} />);

    expect(screen.getByText("LV 4")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Level 4 of 10")).toBeInTheDocument();
  });

  it("clamps out-of-range levels", () => {
    render(<LevelBadge level={12} maxLevel={10} />);

    expect(screen.getByText("Level 10 of 10")).toBeInTheDocument();
  });
});

describe("ProgressBar", () => {
  it("exposes progressbar semantics and a value label", () => {
    render(
      <ProgressBar
        value={3}
        max={6}
        label="Level progress"
        showValue
      />,
    );

    const bar = screen.getByRole("progressbar", {
      name: "Level progress",
    });

    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "6");
    expect(bar).toHaveAttribute("aria-valuenow", "3");
    expect(bar).toHaveAttribute("aria-valuetext", "3 of 6");
    expect(screen.getByText("3/6")).toBeInTheDocument();
  });

  it("clamps values above the maximum", () => {
    render(<ProgressBar value={9} max={6} label="Progress" />);

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "6",
    );
  });
});

describe("StatTile", () => {
  it("renders a label, value, context, and decorative icon", () => {
    render(
      <StatTile
        label="Games played"
        value={12}
        context="Across five games"
        icon={Activity}
      />,
    );

    expect(screen.getByText("Games played")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Across five games")).toBeInTheDocument();
    expect(screen.getByText("Games played")).toBeInTheDocument();
  });
});

describe("DifficultyChip", () => {
  it("pairs the difficulty text with a non-color label", () => {
    render(<DifficultyChip label="Hard" />);

    expect(screen.getByText("Hard")).toBeInTheDocument();
    expect(screen.getByText("difficulty")).toBeInTheDocument();
  });
});