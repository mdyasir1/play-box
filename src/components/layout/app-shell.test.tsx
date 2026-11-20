import { render, screen, within } from "@testing-library/react";
import axe from "axe-core";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const navState = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navState.pathname,
}));

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

import { AppShell } from "./app-shell";

describe("AppShell", () => {
  beforeEach(() => {
    navState.pathname = "/";
  });

  it("marks the current section in both desktop and mobile navigation", () => {
    navState.pathname = "/games/reaction-rush";

    render(
      <AppShell>
        <h1>Game</h1>
      </AppShell>,
    );

    const primary = screen.getByRole("navigation", { name: "Primary" });
    const mobile = screen.getByRole("navigation", {
      name: "Mobile primary",
    });

    expect(
      within(primary).getByRole("link", { name: "Games" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(mobile).getByRole("link", { name: "Games" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      within(primary).getByRole("link", { name: "Home" }),
    ).not.toHaveAttribute("aria-current");
  });

  it("keeps Home exact so game routes do not activate it", () => {
    navState.pathname = "/games";

    render(
      <AppShell>
        <h1>Games</h1>
      </AppShell>,
    );

    const primary = screen.getByRole("navigation", { name: "Primary" });

    expect(
      within(primary).getByRole("link", { name: "Home" }),
    ).not.toHaveAttribute("aria-current");
    expect(
      within(primary).getByRole("link", { name: "Games" }),
    ).toHaveAttribute("aria-current", "page");
  });

  it("has no critical or serious axe violations", async () => {
    const { container } = render(
      <AppShell>
        <h1>Home</h1>
      </AppShell>,
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