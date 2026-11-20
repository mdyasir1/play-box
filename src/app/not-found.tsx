import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="font-display text-5xl font-bold tracking-tight text-accent">
        404
      </p>
      <h1 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-text-secondary">
        That route is not part of the arcade. Head back and pick a game from the
        library.
      </p>
      <Button asChild className="mt-7">
        <Link href="/games">
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to games
        </Link>
      </Button>
    </div>
  );
}
