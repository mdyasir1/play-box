import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ErrorState } from "./error-state";
import { Skeleton, SkeletonText } from "./skeleton";
import { SyncStatus } from "./sync-status";

describe("ErrorState", () => {
  it("announces the error and offers retry and back actions", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <ErrorState
        title="Could not load progress"
        description="Your saved data is still on this device."
        onRetry={onRetry}
        backHref="/games"
        backLabel="Back to games"
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Could not load progress")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("link", { name: "Back to games" }),
    ).toHaveAttribute("href", "/games");
  });

  it("can render a message without actions", () => {
    render(<ErrorState description="No action is available." />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

describe("Skeleton", () => {
  it("hides decorative blocks from assistive technology", () => {
    const { container } = render(
      <div>
        <Skeleton className="h-8" />
        <SkeletonText lines={2} />
      </div>,
    );

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});

describe("SyncStatus", () => {
  it("labels every sync state with an icon and text", () => {
    const { rerender } = render(<SyncStatus status="saved" />);
    expect(screen.getByText("Saved locally")).toBeInTheDocument();

    rerender(<SyncStatus status="synced" />);
    expect(screen.getByText("Synced")).toBeInTheDocument();

    rerender(<SyncStatus status="pending" />);
    expect(screen.getByText("Waiting to sync")).toBeInTheDocument();

    rerender(<SyncStatus status="offline" />);
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("keeps an accessible name when the label is visually hidden", () => {
    render(<SyncStatus status="pending" showLabel={false} />);

    expect(screen.getByText("Waiting to sync")).toHaveClass("sr-only");
  });
});