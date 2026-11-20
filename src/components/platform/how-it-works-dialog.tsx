"use client";

import { CloudOff, Gamepad2, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const STEPS = [
  {
    icon: Gamepad2,
    title: "Pick a game",
    description:
      "Five focused single-player games, each built for short sessions and touch-first controls.",
  },
  {
    icon: TrendingUp,
    title: "Clear levels",
    description:
      "Every game has ten levels. Each one raises a real difficulty parameter, not just the level number.",
  },
  {
    icon: CloudOff,
    title: "Keep your progress",
    description:
      "Levels and best scores are saved on your device first, then backed up when a connection is available.",
  },
] as const;

export function HowItWorksDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">How it works</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How YASIR PLAYBOX works</DialogTitle>
          <DialogDescription>
            A small arcade with long-term progression, designed to stay out of
            your way.
          </DialogDescription>
        </DialogHeader>

        <ul className="mt-6 space-y-4">
          {STEPS.map((step) => (
            <li key={step.title} className="flex gap-3">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-accent">
                <step.icon aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-text">{step.title}</p>
                <p className="mt-0.5 text-sm leading-6 text-text-secondary">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <DialogFooter>
          <div className="text-xs text-text-muted">
            No account required in this phase.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
