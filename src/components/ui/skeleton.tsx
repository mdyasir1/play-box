import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-surface/70", className)}
    />
  );
}

type SkeletonTextProps = {
  lines?: number;
  className?: string;
};

export function SkeletonText({ lines = 3, className }: SkeletonTextProps) {
  return (
    <div aria-hidden="true" className={cn("space-y-2", className)}>
      {Array.from({ length: Math.max(1, lines) }, (_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "h-3",
            index === lines - 1 ? "w-2/3" : "w-full",
          )}
        />
      ))}
    </div>
  );
}