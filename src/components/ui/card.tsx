import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "paper-edge rounded-lg border border-border bg-surface",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("border-b border-border px-4 py-3", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-base font-semibold tracking-tight text-text">
      {children}
    </h2>
  );
}

export function CardContent({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("px-4 py-4", className)}>{children}</div>;
}
