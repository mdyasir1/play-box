"use client";

import { Home, RotateCcw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
        Unexpected error
      </p>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary">
        This page hit an unexpected problem. Try again, or return to the arcade
        and choose a game.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Try again
        </Button>
        <Button asChild variant="secondary">
          <Link href="/">
            <Home aria-hidden="true" className="size-4" />
            Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
