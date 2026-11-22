"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardDrive, Home, Paintbrush, Route } from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/games/zip", label: "Zip", icon: Route },
  { href: "/games/maze-paint", label: "Maze Paint", icon: Paintbrush },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
          >
            <Logo className="size-8" />
            <span className="hidden font-display text-sm font-bold tracking-[0.18em] text-text sm:inline">
              PLAYBOX
            </span>
          </Link>

          <nav aria-label="Games" className="flex items-center gap-1 rounded-xl bg-white/[0.04] p-1">
            {NAV_ITEMS.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition sm:px-3 sm:text-sm",
                    active
                      ? "bg-white/[0.1] text-text shadow-sm"
                      : "text-text-muted hover:bg-white/[0.05] hover:text-text",
                  )}
                >
                  <item.icon aria-hidden="true" className="size-3.5 sm:size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 text-xs font-medium text-text-muted sm:flex">
            <HardDrive aria-hidden="true" className="size-3.5 text-success" />
            Saved locally
          </div>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto w-full max-w-6xl flex-1 px-4 pb-14 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pt-10"
      >
        {children}
      </main>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>YASIR PLAYBOX · Two games, 200 levels, zero accounts.</p>
          <p>Progress stays on this device.</p>
        </div>
      </footer>
    </div>
  );
}
