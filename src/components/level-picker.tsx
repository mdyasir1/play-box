"use client";

import { Check, Lock } from "lucide-react";
import { useState } from "react";

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
  const [range, setRange] = useState(0);
  const ranges = Array.from({ length: Math.ceil(levelCount / 50) }, (_, index) => ({
    start: index * 50 + 1,
    end: Math.min(levelCount, (index + 1) * 50),
  }));
  const activeRange = ranges[range] ?? ranges[0]!;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={`${gameName} levels`}
      description={`${completed.length} of ${levelCount} complete`}
      className="max-w-3xl"
    >
      <div className="mb-3 flex flex-wrap gap-1.5">
        {ranges.map((item, index) => (
          <button
            key={item.start}
            type="button"
            onClick={() => setRange(index)}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs transition",
              index === range
                ? "border-text bg-text text-bg"
                : "border-border text-text-muted hover:text-text",
            )}
          >
            {item.start}–{item.end}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {Array.from(
          { length: activeRange.end - activeRange.start + 1 },
          (_, index) => {
            const level = activeRange.start + index;
          const isCurrent = level === current;
          const isComplete = completedSet.has(level);
          const isUnlocked = level === 1 || completedSet.has(level - 1);

          return (
            <button
              key={level}
              type="button"
              disabled={!isUnlocked}
              onClick={() => {
                if (!isUnlocked) return;
                onSelect(level);
                onOpenChange(false);
              }}
              aria-label={`Level ${level}${isComplete ? ", completed" : ""}${isCurrent ? ", current" : ""}${isUnlocked ? "" : ", locked"}`}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "relative flex aspect-square min-h-11 flex-col items-center justify-center rounded-md border text-xs font-medium transition",
                isCurrent
                  ? "border-text bg-text text-bg"
                  : isUnlocked
                    ? "border-border bg-surface text-text hover:border-border-strong"
                    : "border-border bg-bg text-text-muted opacity-45",
              )}
            >
              <span>{level}</span>
              {levelLabel && isUnlocked ? (
                <span
                  className={cn(
                    "mt-0.5 text-[0.6rem] font-medium",
                    isCurrent ? "text-bg" : "text-text",
                  )}
                >
                  {levelLabel(level)}
                </span>
              ) : null}
              {isComplete ? (
                <Check className="absolute right-1 top-1 size-2.5 text-success" aria-hidden="true" />
              ) : null}
              {!isUnlocked ? (
                <Lock className="absolute right-1 top-1 size-2.5" aria-hidden="true" />
              ) : null}
            </button>
          );
        },
        )}
      </div>
    </Modal>
  );
}
