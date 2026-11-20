import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Toast } from "./toast";

describe("Toast", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("announces one polite message and auto-dismisses after four seconds", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();

    render(
      <Toast open message="Progress saved" onDismiss={onDismiss} />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Progress saved");

    act(() => {
      vi.advanceTimersByTime(4_000);
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("can be dismissed manually", () => {
    const onDismiss = vi.fn();

    render(
      <Toast open message="Progress saved" onDismiss={onDismiss} />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Dismiss notification" }),
    );

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders an empty live region when closed", () => {
    render(<Toast open={false} message="Hidden" onDismiss={vi.fn()} />);

    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
});