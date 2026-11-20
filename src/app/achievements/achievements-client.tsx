"use client";

import { TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/platform/empty-state";
import { useLocalSnapshot } from "@/lib/persistence/hooks";
import { ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements/definitions";

import { AchievementCard } from "@/components/achievements/achievement-card";

export default function AchievementsPage() {
  const result = useLocalSnapshot();
  const definitions = ACHIEVEMENT_DEFINITIONS;
  const snapshot = result?.snapshot ?? null;

  const unlocked = definitions
    .map((definition) => ({ definition, unlockedAt: snapshot?.achievements[definition.id] }))
    .filter((entry): entry is { definition: (typeof definitions)[number]; unlockedAt: string } => Boolean(entry.unlockedAt));
  const locked = definitions.filter((definition) => !snapshot?.achievements[definition.id]);

  if (!snapshot) {
    return (
      <div aria-busy="true" className="space-y-4">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Achievements</h1>
        <Skeleton className="h-10 w-32" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 sm:h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (unlocked.length === 0) {
    return (
      <EmptyState
        className="mt-8"
        icon={TrendingUp}
        title="No achievements unlocked yet"
        description="Achievements are earned by real game results. The definitions below show what to aim for."
      />
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Achievements</h1>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
            <TrendingUp aria-hidden="true" className="size-5" />
          </span>
                    <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Achievements</h1>
        </div>
        <Badge variant="accent" className="whitespace-nowrap">{unlocked.length} unlocked</Badge>      </div>

      <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
        Progress records count only when game results are submitted. Locked achievements are not decorative; they need real progression.
      </p>

      <section aria-label="Unlocked achievements" className="mt-8 grid gap-4 sm:grid-cols-2">
        {unlocked.map(({ definition, unlockedAt }) => (
          <AchievementCard key={definition.id} definition={definition} unlockedAt={unlockedAt} />
        ))}
      </section>

      {locked.length > 0 ? (
        <section aria-label="Locked achievements" className="mt-8 grid gap-4 sm:grid-cols-2">
          {locked.slice(0, 6).map((definition) => (
            <AchievementCard key={definition.id} definition={definition} />
          ))}
        </section>
      ) : null}
    </div>
  );
}