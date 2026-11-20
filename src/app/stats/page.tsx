import { Activity } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/platform/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Stats",
  description:
    "Your real YASIR PLAYBOX totals, personal bests, and recent activity.",
};

export default function StatsPage() {
  return (
    <div className="animate-rise">
      <Badge variant="outline">Your record</Badge>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Stats
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-text-secondary">
        Totals, personal bests, and recent activity appear here once you have
        played. Nothing on this page is estimated or invented.
      </p>

      <EmptyState
        className="mt-8"
        icon={Activity}
        title="No games played yet"
        description="Your record starts with the first completed run. Pick a game from the library to begin."
        action={
          <Button asChild>
            <Link href="/games">Browse games</Link>
          </Button>
        }
      />
    </div>
  );
}
