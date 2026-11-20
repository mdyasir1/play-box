import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Dialog, DialogContent, DialogTitle } from "./dialog";
import { Button } from "./button";

describe("Dialog", () => {
  it("renders a labelled modal and can hide the close control", () => {
    render(
      <Dialog open>
        <DialogContent showClose={false}>
          <DialogTitle>Paused</DialogTitle>
          <p>Take your time.</p>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Paused");
    expect(
      screen.queryByRole("button", { name: "Close dialog" }),
    ).not.toBeInTheDocument();
  });

  it("shows a close control by default", () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
          <Button>Close</Button>
        </DialogContent>
      </Dialog>,
    );

    expect(
      screen.getByRole("button", { name: "Close dialog" }),
    ).toBeInTheDocument();
  });
});