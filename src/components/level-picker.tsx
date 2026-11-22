"use client";

import { Check, X } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";

type LevelPickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameName: string;
  levelCount: number;
  current: number;
  completed: number[];
  onSelect: (level: number) => void;
  levelLabel?: (level: number) => string;
};

export function LevelPicker({
  open,
  onOpenChange,
  gameName,
  levelCount,
  current,
  completed,
  onSelect,
  levelLabel,
}: LevelPickerProps) {
  const completedSet = new Set(completed);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`${gameName} levels`}
      description="Every level is unlocked. Pick any board and keep your best result."
      className="max-w-2xl"
    >
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10">
        {Array.from({ length: levelCount }, (_, index) => {
          const level = index + 1;
          const isCurrent = level === current;
          const isCompleted = completedSet.has(level);
          return (
            <button
              key={level}
              type="button"
              onClick={() => {
                onSelect(level);
                onOpenChange(false);
              }}
              aria-label={`Level ${level}${isCompleted ? ", completed" : ""}${isCurrent ? ", current" : ""}`}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "relative flex aspect-square min-h-10 flex-col items-center justify-center rounded-xl border text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                isCurrent
                  ? "border-accent bg-accent/15 text-text"
                  : "border-white/[0.08] bg-white/[0.035] text-text-secondary hover:border-white/20 hover:bg-white/[0.08] hover:text-text",
                isCompleted && !isCurrent && "border-success/25 text-success",
              )}
            >
              <span>{level}</span>
              {levelLabel ? (
                <span className="mt-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-text-muted">
                  {levelLabel(level)}
                </span>
              ) : null}
              {isCompleted ? (
                <Check
                  aria-hidden="true"
                  className="absolute right-1 top-1 size-2.5 text-success"
                />
              ) : null}
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-accent" /> Current
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Check aria-hidden="true" className="size-3 text-success" /> Complete
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5">
          <X aria-hidden="true" className="size-3" /> Incomplete
        </span>
      </div>
    </Modal>
  );
}
