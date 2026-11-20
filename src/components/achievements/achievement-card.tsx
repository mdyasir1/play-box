import { Archive, BadgeCheck, Cross } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { AchievementDefinition } from "@/lib/achievements/definitions";

type AchievementCardProps = {
  definition: AchievementDefinition;
  unlockedAt?: string;
};

function formatUnlock(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

export function AchievementCard({ definition, unlockedAt }: AchievementCardProps) {
  const isUnlocked = Boolean(unlockedAt);
  const Icon = isUnlocked ? BadgeCheck : Cross;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex size-9 items-center justify-center rounded-xl border ${
              isUnlocked
                ? "border-success/30 bg-success/10 text-success"
                : "border-border bg-bg-elevated text-text-muted"
            }`}
          >
            <Icon aria-hidden="true" className="size-4" />
          </span>
          <div>
            <CardTitle>{definition.title}</CardTitle>
            <CardDescription>
              {definition.description}
              {unlockedAt ? ` · Unlocked ${formatUnlock(unlockedAt)}` : ""}
              </CardDescription>
          </div>
        </div>
        <Badge variant={isUnlocked ? "success" : "outline"}>
          <Archive aria-hidden="true" className="size-3" />
          {isUnlocked ? "Unlocked" : "Locked"}
        </Badge>
      </CardHeader>
      {!isUnlocked ? (
        <CardContent className="text-sm text-text-muted">
          Locked until the corresponding game result is recorded.
        </CardContent>
      ) : null}
    </Card>
  );
}