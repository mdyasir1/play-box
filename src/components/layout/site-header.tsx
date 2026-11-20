import Link from "next/link";

import { Logo } from "@/components/brand/logo";

const NAV_LINKS = [
  { href: "/games", label: "Games" },
  { href: "/stats", label: "Stats" },
  { href: "/achievements", label: "Achievements" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="YASIR PLAYBOX — home"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <Logo wordmarkClassName="hidden lg:inline" />
        </Link>

        <nav aria-label="Primary" className="flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus sm:px-3"
            >
              <span className="hidden min-[420px]:inline">{link.label}</span>
              <span className="min-[420px]:hidden">
                {link.label === "Achievements" ? "Awards" : link.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
