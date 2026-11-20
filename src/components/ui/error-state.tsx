import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "./button";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  description: string;
  title?: string;
  onRetry?: () => void;
  backHref?: string;
  backLabel?: string;
  className?: string;
};

export function ErrorState({
  description,
  title = "Something went wrong",
  onRetry,
  backHref,
  backLabel = "Back",
  className,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-danger/30 bg-danger/5 px-6 py-12 text-center",
        className,
      )}
    >
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl border border-danger/30 bg-danger/10 text-danger">
        <AlertTriangle aria-hidden="true" className="size-5" />
      </span>
      <h2 className="font-display text-lg font-semibold tracking-tight text-text">
        {title}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
        {description}
      </p>

      {onRetry || backHref ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {onRetry ? (
            <Button onClick={onRetry}>
              <RotateCcw aria-hidden="true" className="size-4" />
              Try again
            </Button>
          ) : null}
          {backHref ? (
            <Button asChild variant="secondary">
              <Link href={backHref}>
                <ArrowLeft aria-hidden="true" className="size-4" />
                {backLabel}
              </Link>
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}