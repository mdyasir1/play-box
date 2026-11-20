"use client";

import {
  CalendarDays,
  ChevronRight,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { SyncStatus } from "@/components/ui/sync-status";
import { cn } from "@/lib/utils";

import { isNavItemActive, PRIMARY_NAV_ITEMS } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col overflow-y-auto border-r border-border/70 bg-bg-elevated/80 px-4 py-6 backdrop-blur-md lg:flex">
      <Link
        href="/"
        aria-label="YASIR PLAYBOX — home"
        className="rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
      >
        <Logo wordmarkClassName="text-[0.7rem]" />
      </Link>

      <nav aria-label="Primary" className="mt-8 flex flex-col gap-1">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                active
                  ? "bg-surface-active text-text"
                  : "text-text-secondary hover:bg-surface hover:text-text",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                  active
                    ? "border-accent/30 bg-accent/10 text-accent"
                    : "border-transparent text-text-muted group-hover:text-text",
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <section
        aria-labelledby="daily-card-heading"
        className="mt-8 rounded-card border border-border bg-surface/50 p-4"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-bg-elevated text-accent-blue">
            <CalendarDays aria-hidden="true" className="size-4" />
          </span>
          <Badge variant="accent">Daily</Badge>
        </div>
        <h2
          id="daily-card-heading"
          className="mt-3 font-display text-sm font-semibold text-text"
        >
          Daily Word
        </h2>
        <p className="mt-1 text-xs leading-5 text-text-muted">
          One word. A fresh start at 00:00 UTC every day.
        </p>
        <Link
          href="/games/word-master"
          className="mt-3 inline-flex min-h-8 items-center gap-1 rounded-md text-xs font-semibold text-accent transition-colors hover:text-[#c9baff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          View Word Master
          <ChevronRight aria-hidden="true" className="size-3.5" />
        </Link>
        <p className="mt-2 text-[0.68rem] text-text-muted">
          Unlocks in Phase 5
        </p>
      </section>

      <div className="mt-auto pt-6">
        <section
          aria-labelledby="profile-card-heading"
          className="rounded-card border border-border bg-surface/40 p-4"
        >
          <div className="flex items-center gap-3">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-elevated text-accent">
              <UserRound aria-hidden="true" className="size-4" />
            </span>
            <div>
              <h2
                id="profile-card-heading"
                className="text-sm font-semibold text-text"
              >
                Local profile
              </h2>
              <p className="text-xs text-text-muted">No account needed</p>
            </div>
          </div>
          <div className="mt-3 border-t border-border/70 pt-3">
            <SyncStatus status="saved" />
            <p className="mt-1 text-[0.68rem] leading-5 text-text-muted">
              Progress is saved on this device.
            </p>
          </div>
        </section>
      </div>
    </aside>
  );
}