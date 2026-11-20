import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Link from "next/link";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders its label and handles clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Play</Button>);

    await user.click(screen.getByRole("button", { name: "Play" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("defaults to type=button to avoid accidental form submits", () => {
    render(<Button>Start</Button>);

    expect(screen.getByRole("button", { name: "Start" })).toHaveAttribute(
      "type",
      "button",
    );
  });

  it("does not fire when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Locked
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Locked" }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("supports asChild rendering for links", () => {
    render(
      <Button asChild>
        <Link href="/games">Games</Link>
      </Button>,
    );

    expect(screen.getByRole("link", { name: "Games" })).toHaveAttribute(
      "href",
      "/games",
    );
  });

  it("shows a busy state and stays disabled while loading", () => {
    render(<Button loading>Saving</Button>);

    const button = screen.getByRole("button", { name: "Saving" });

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
