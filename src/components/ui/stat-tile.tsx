import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatTileProps = {
  label: string;
  value: ReactNode;
  context?: ReactNode;
  icon?: LucideIcon;
  className?: string;
};

export function StatTile({
  label,
  value,
  context,
  icon: Icon,
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface/70 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
          {label}
        </p>
        {Icon ? (
          <span className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-bg-elevated text-accent">
            <Icon aria-hidden="true" className="size-4" />
          </span>
        ) : null}
      </div>

      <p className="mt-2 font-display text-2xl font-semibold tabular-nums tracking-tight text-text">
        {value}
      </p>

      {context ? (
        <p className="mt-1 text-xs leading-5 text-text-muted">{context}</p>
      ) : null}
    </div>
  );
}