import { ArrowRight, RotateCcw, Trophy, XCircle } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ResultPanelProps = {
  gameName: string;
  level: number;
  won: boolean;
  score: number;
  bestScore?: number;
  isNewBest?: boolean;
  requirement?: string;
  nextLevel?: number;
  onReplay: () => void;
  onNext?: () => void;
};

export function ResultPanel({
  gameName,
  level,
  won,
  score,
  bestScore,
  isNewBest = false,
  requirement,
  nextLevel,
  onReplay,
  onNext,
}: ResultPanelProps) {
  const Icon = won ? Trophy : XCircle;
  const summary = won
    ? `Level ${level} complete. Score ${score}.`
    : `Level ${level} failed. ${requirement ?? "The level requirement was not met."}`;

  return (
    <section
      aria-labelledby="result-heading"
      className="rounded-card border border-border bg-surface/70 p-6 text-center sm:p-8"
    >
      <span
        className={
          won
            ? "mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-2xl border border-success/30 bg-success/10 text-success"
            : "mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-2xl border border-danger/30 bg-danger/10 text-danger"
        }
      >
        <Icon aria-hidden="true" className="size-5" />
      </span>

      <p className="sr-only" aria-live="polite">
        {summary}
      </p>

      <h2
        id="result-heading"
        className="font-display text-2xl font-bold tracking-tight text-text"
      >
        {won ? "Level complete" : "Level failed"}
      </h2>

      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {won
          ? `${gameName} · Level ${level} cleared.`
          : (requirement ?? "The level requirement was not met.")}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            Score
          </p>
          <p className="font-display text-2xl font-semibold tabular-nums text-text">
            {score}
          </p>
        </div>
        {bestScore !== undefined ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              Best
            </p>
            <p className="font-display text-2xl font-semibold tabular-nums text-text-secondary">
              {bestScore}
            </p>
          </div>
        ) : null}
        {won && isNewBest ? (
          <Badge variant="success">
            <Trophy aria-hidden="true" className="size-3" />
            New best
          </Badge>
        ) : null}
      </div>

      <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
        <Button onClick={onReplay}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Replay
        </Button>
        {won && nextLevel !== undefined && onNext ? (
          <Button variant="secondary" onClick={onNext}>
            Next level
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        ) : null}
        <Button asChild variant="ghost">
          <Link href="/games">Back to library</Link>
        </Button>
      </div>
    </section>
  );
}