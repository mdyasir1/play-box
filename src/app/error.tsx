"use client";

import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[55dvh] max-w-md flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-warning">
        Something went wrong
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
        The arcade hit a snag
      </h1>
      <p className="mt-3 text-sm leading-6 text-text-secondary">
        Your saved progress is safe. Try the page again or return home.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={reset} className={buttonStyles()}>
          Try again
        </button>
        <Link
          href="/"
          className={buttonStyles({ variant: "secondary" })}
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
