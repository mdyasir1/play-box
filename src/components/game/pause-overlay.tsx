"use client";

import { Pause, Play, RotateCcw, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type PauseOverlayProps = {
  open: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
};

export function PauseOverlay({
  open,
  onResume,
  onRestart,
  onQuit,
}: PauseOverlayProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onResume();
        }
      }}
    >
      <DialogContent showClose={false} className="max-w-sm text-center">
        <DialogHeader className="items-center text-center">
          <span className="mx-auto mb-1 inline-flex size-11 items-center justify-center rounded-2xl border border-border bg-surface text-accent">
            <Pause aria-hidden="true" className="size-5" />
          </span>
          <DialogTitle>Paused</DialogTitle>
          <DialogDescription>
            The level timer and game state are stopped.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={onResume}>
            <Play aria-hidden="true" className="size-4" />
            Resume
          </Button>
          <Button variant="secondary" onClick={onRestart}>
            <RotateCcw aria-hidden="true" className="size-4" />
            Restart level
          </Button>
          <Button variant="ghost" onClick={onQuit}>
            <LogOut aria-hidden="true" className="size-4" />
            Quit to library
          </Button>
        </div>

        <p className="mt-3 text-xs text-text-muted">
          Press Escape to resume.
        </p>
      </DialogContent>
    </Dialog>
  );
}