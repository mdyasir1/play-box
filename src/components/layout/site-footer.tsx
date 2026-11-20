import Link from "next/link";

import { Logo } from "@/components/brand/logo";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-2">
          <Logo />
          <p className="text-sm text-text-muted">
            Your Personal Arcade. Five single-player games, one pocket.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link
            href="/games"
            className="text-sm text-text-secondary transition-colors hover:text-text"
          >
            Games
          </Link>
          <Link
            href="/stats"
            className="text-sm text-text-secondary transition-colors hover:text-text"
          >
            Stats
          </Link>
          <Link
            href="/achievements"
            className="text-sm text-text-secondary transition-colors hover:text-text"
          >
            Achievements
          </Link>
        </nav>
      </div>
      <div className="safe-bottom mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
        <p className="text-xs text-text-muted">
          Foundation build · Games are being added phase by phase.
        </p>
      </div>
    </footer>
  );
}
