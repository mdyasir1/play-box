export default function Loading() {
  return (
    <div className="animate-rise space-y-5">
      <div className="h-4 w-24 animate-pulse rounded bg-surface" />
      <div className="h-10 w-2/3 animate-pulse rounded bg-surface" />
      <div className="h-72 animate-pulse rounded-lg border border-border bg-surface" />
    </div>
  );
}
