"use client";

import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center text-center">
      <h1 className="font-display text-2xl font-semibold">Something slipped</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Your progress is safe. Try again.
      </p>
      <div className="mt-6 flex gap-2">
        <button type="button" onClick={reset} className={buttonStyles()}>
          Try again
        </button>
        <Link href="/" className={buttonStyles({ variant: "secondary" })}>
          Home
        </Link>
      </div>
    </div>
  );
}
