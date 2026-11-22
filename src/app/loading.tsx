export default function Loading() {
  return (
    <div className="animate-rise space-y-8">
      <div className="h-5 w-32 animate-pulse rounded-full bg-white/[0.06]" />
      <div className="h-12 w-2/3 animate-pulse rounded-xl bg-white/[0.06]" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-56 animate-pulse rounded-2xl bg-white/[0.045]" />
        <div className="h-56 animate-pulse rounded-2xl bg-white/[0.045]" />
      </div>
    </div>
  );
}
