import { cn } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
  label?: string;
};

export function ProgressBar({
  value,
  max,
  className,
  barClassName,
  label,
}: ProgressBarProps) {
  const percent = max <= 0 ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-white/[0.08]",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-accent to-cyan transition-[width] duration-300",
          barClassName,
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
