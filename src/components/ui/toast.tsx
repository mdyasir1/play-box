"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

type ToastProps = {
  open: boolean;
  message: string;
  onDismiss: () => void;
  durationMs?: number;
  className?: string;
};

export function Toast({
  open,
  message,
  onDismiss,
  durationMs = 4_000,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const timer = window.setTimeout(onDismiss, durationMs);

    return () => window.clearTimeout(timer);
  }, [durationMs, onDismiss, open]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4 lg:bottom-6",
        className,
      )}
    >
      {open ? (
        <div className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-border bg-bg-elevated px-4 py-2.5 shadow-[0_16px_48px_rgba(0,0,0,0.42)]">
          <p className="flex-1 text-sm leading-6 text-text-secondary">
            {message}
          </p>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={onDismiss}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : null}
    </div>
  );
}