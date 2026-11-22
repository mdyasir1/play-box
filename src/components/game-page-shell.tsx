import type { ReactNode } from "react";

export function GamePageShell({
  header,
  board,
  side,
  overlays,
}: {
  header: ReactNode;
  board: ReactNode;
  side: ReactNode;
  overlays?: ReactNode;
}) {
  return (
    <div className="animate-rise">
      {header}
      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section aria-label="Game board" className="min-w-0">
          {board}
        </section>
        <aside className="space-y-4">{side}</aside>
      </div>
      {overlays}
    </div>
  );
}
