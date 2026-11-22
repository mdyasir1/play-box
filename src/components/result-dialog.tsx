"use client";

import { ArrowRight, Grid2X2, RotateCcw, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type ResultStat = {
  label: string;
  value: string;
};

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
      description={
        isLast
          ? `${gameName} is fully cleared. Replay any board whenever you want.`
          : `${gameName} level ${level} is solved. Ready for the next one?`
      }
    >
      <div className="flex items-center gap-3 rounded-xl border border-success/25 bg-success/10 p-3">
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
          <Trophy aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-text">Clean finish</p>
          <p className="text-xs text-text-secondary">
            Your result is saved on this device.
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/[0.07] bg-white/[0.035] px-3 py-2.5"
          >
            <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
              {stat.label}
            </dt>
            <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-text">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {isLast ? null : (
          <Button onClick={onNext} className="flex-1">
            Next level
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        )}
        <Button variant="secondary" onClick={onReplay} className="flex-1">
          <RotateCcw aria-hidden="true" className="size-4" />
          Replay
        </Button>
        <Button variant="ghost" onClick={onLevels} className="flex-1">
          <Grid2X2 aria-hidden="true" className="size-4" />
          Levels
        </Button>
      </div>
    </Modal>
  );
}
