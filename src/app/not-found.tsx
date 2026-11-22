import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[55dvh] max-w-md flex-col items-center justify-center text-center">
      <p className="font-display text-6xl font-bold text-accent/40">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">
        That page is not in the playbox
      </h1>
      <p className="mt-3 text-sm text-text-secondary">
        Try one of the two games instead — all 200 levels are ready.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link href="/" className={buttonStyles()}>
          Back home
        </Link>
        <Link
          href="/games/zip"
          className={buttonStyles({ variant: "secondary" })}
        >
          Play Zip
        </Link>
      </div>
    </div>
  );
}
