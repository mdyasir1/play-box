export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="animate-pulse">
      <span className="sr-only">Loading page</span>
      <div className="h-4 w-24 rounded-full bg-surface" />
      <div className="mt-4 h-9 w-64 max-w-full rounded-lg bg-surface" />
      <div className="mt-3 h-4 w-full max-w-lg rounded bg-surface/70" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-72 rounded-card border border-border bg-surface/50"
          />
        ))}
      </div>
    </div>
  );
}
