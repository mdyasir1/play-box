import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  className?: string;
  barClassName?: string;
};

export function ProgressBar({
  value,
  max,
  label,
  className,
  barClassName,
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-hover", className)}
    >
      <div
        className={cn("h-full rounded-full bg-accent transition-[width] duration-300", barClassName)}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
