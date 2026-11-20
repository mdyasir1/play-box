import type { DifficultyLabel } from "@/lib/games/contracts";

import { Badge, type BadgeProps } from "./badge";

const DIFFICULTY_VARIANT: Record<
  DifficultyLabel,
  NonNullable<BadgeProps["variant"]>
> = {
  Intro: "blue",
  Easy: "success",
  Normal: "accent",
  Hard: "warning",
  Expert: "danger",
  Master: "danger",
};

type DifficultyChipProps = {
  label: DifficultyLabel;
  className?: string;
};

export function DifficultyChip({ label, className }: DifficultyChipProps) {
  return (
    <Badge variant={DIFFICULTY_VARIANT[label]} className={className}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {label}
      <span className="sr-only"> difficulty</span>
    </Badge>
  );
}