import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/platform/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Unlock achievements based on real YASIR PLAYBOX results, not fabricated milestones.",
};

export default function AchievementsPage() {
  return (
    <div className="animate-rise">
      <Badge variant="outline">Milestones</Badge>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
        Achievements
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-text-secondary">
        Every achievement is tied to a real result: a cleared level, a genuine
        reaction time, a personal record. Nothing unlocks just for opening the
        app.
      </p>

      <EmptyState
        className="mt-8"
        icon={Trophy}
        title="Nothing unlocked yet"
        description="Achievements arrive with the playable game modules. Clear your first level to start the record."
        action={
          <Button asChild variant="secondary">
            <Link href="/games">See what is coming</Link>
          </Button>
        }
      />
    </div>
  );
}
