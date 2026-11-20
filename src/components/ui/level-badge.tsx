import { cn } from "@/lib/utils";

type LevelBadgeProps = {
  level: number;
  maxLevel?: number;
  className?: string;
};

export function LevelBadge({
  level,
  maxLevel = 10,
  className,
}: LevelBadgeProps) {
  const safeMax = Math.max(1, Math.trunc(maxLevel));
  const safeLevel = Math.min(safeMax, Math.max(1, Math.trunc(level)));

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-[0.7rem] font-semibold leading-5 text-text-secondary",
        className,
      )}
    >
      <span aria-hidden="true">LV {safeLevel}</span>
      <span className="sr-only">
        Level {safeLevel} of {safeMax}
      </span>
    </span>
  );
}