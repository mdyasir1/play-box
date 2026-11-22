"use client";

import { ArrowRight, Check, Grid2X2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type ResultStat = { label: string; value: string };

type ResultDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameName: string;
  level: number;
  levelCount: number;
  stats: ResultStat[];
  onNext: () => void;
  onReplay: () => void;
  onLevels: () => void;
};

export function ResultDialog({
  open,
  onOpenChange,
  gameName,
  level,
  levelCount,
  stats,
  onNext,
  onReplay,
  onLevels,
}: ResultDialogProps) {
  const isLast = level >= levelCount;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isLast ? "All levels complete" : `Level ${level} complete`}
      description={isLast ? `${gameName} is complete.` : undefined}
    >
      <div className="flex items-center gap-3 rounded-md border border-border bg-surface p-3">
        <span className="inline-flex size-9 items-center justify-center rounded-full bg-success/15 text-success">
          <Check className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium">Solved</p>
          <p className="text-xs text-text-muted">Saved for {gameName}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-border px-3 py-2">
            <dt className="text-[0.6rem] uppercase tracking-wider text-text-muted">
              {stat.label}
            </dt>
            <dd className="mt-0.5 font-display text-lg">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {isLast ? null : (
          <Button onClick={onNext} className="flex-1">
            Next level
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        )}
        <Button variant="secondary" onClick={onReplay} className="flex-1">
          <RotateCcw className="size-4" aria-hidden="true" />
          Replay
        </Button>
        <Button variant="ghost" onClick={onLevels} className="flex-1">
          <Grid2X2 className="size-4" aria-hidden="true" />
          Levels
        </Button>
      </div>
    </Modal>
  );
}
