import Link from "next/link";

import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center text-center">
      <p className="font-display text-5xl text-text-muted">404</p>
      <h1 className="mt-3 font-display text-2xl font-semibold">Not in the box</h1>
      <p className="mt-2 text-sm text-text-secondary">
        That page doesn&apos;t belong to Yasir&apos;s Play-Box.
      </p>
      <Link href="/" className={`${buttonStyles()} mt-6`}>
        Back home
      </Link>
    </div>
  );
}
