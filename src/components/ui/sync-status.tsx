import {
  Clock3,
  CloudCheck,
  HardDrive,
  WifiOff,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type SyncStatusKind = "saved" | "synced" | "pending" | "offline";

const STATUS_CONFIG: Record<
  SyncStatusKind,
  { label: string; icon: LucideIcon }
> = {
  saved: { label: "Saved locally", icon: HardDrive },
  synced: { label: "Synced", icon: CloudCheck },
  pending: { label: "Waiting to sync", icon: Clock3 },
  offline: { label: "Offline", icon: WifiOff },
};

type SyncStatusProps = {
  status: SyncStatusKind;
  showLabel?: boolean;
  className?: string;
};

export function SyncStatus({
  status,
  showLabel = true,
  className,
}: SyncStatusProps) {
  const { label, icon: Icon } = STATUS_CONFIG[status];

  return (
    <span
      role="status"
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 text-xs font-medium text-text-muted",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className={showLabel ? undefined : "sr-only"}>{label}</span>
    </span>
  );
}