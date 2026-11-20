"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { SyncStatus } from "@/components/ui/sync-status";
import { cn } from "@/lib/utils";

import { isNavItemActive, PRIMARY_NAV_ITEMS } from "./nav-items";

export function MobileTopBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/90 pt-[env(safe-area-inset-top)] backdrop-blur-md lg:hidden">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4">
        <Link
          href="/"
          aria-label="YASIR PLAYBOX — home"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          <Logo wordmarkClassName="hidden text-[0.68rem] min-[360px]:inline" />
        </Link>

        <SyncStatus status="saved" className="shrink-0" />
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-bg-elevated/95 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const active = isNavItemActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[0.68rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus",
                active
                  ? "text-accent"
                  : "text-text-muted hover:text-text",
              )}
            >
              <span className="relative">
                <Icon aria-hidden="true" className="size-5" />
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent"
                  />
                ) : null}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}