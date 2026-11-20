import { cn } from "@/lib/utils";

type ProgressBarTone = "accent" | "blue" | "success" | "warning" | "danger";

const TONE_CLASSES: Record<ProgressBarTone, string> = {
  accent: "bg-accent",
  blue: "bg-accent-blue",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

type ProgressBarProps = {
  value: number;
  max: number;
  label: string;
  tone?: ProgressBarTone;
  showValue?: boolean;
  showLabel?: boolean;
  className?: string;
};

export function ProgressBar({
  value,
  max,
  label,
  tone = "accent",
  showValue = false,
  showLabel = false,
  className,
}: ProgressBarProps) {
  const safeMax = Math.max(1, Math.trunc(max));
  const safeValue = Math.min(safeMax, Math.max(0, Math.trunc(value)));
  const percent = (safeValue / safeMax) * 100;

  return (
    <div className={cn("w-full", className)}>
      {showLabel || showValue ? (
        <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
          {showLabel ? (
            <span className="font-medium text-text-secondary">{label}</span>
          ) : (
            <span />
          )}
          {showValue ? (
            <span className="font-semibold tabular-nums text-text-muted">
              {safeValue}/{safeMax}
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
        aria-valuetext={`${safeValue} of ${safeMax}`}
        className="h-2 w-full overflow-hidden rounded-full bg-surface"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-200",
            TONE_CLASSES[tone],
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}