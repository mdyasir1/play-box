"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogOut, Paintbrush, Route, User } from "lucide-react";
import type { ReactNode } from "react";

import { useAuth } from "@/components/auth-provider";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/games/zip", label: "Zip", icon: Route },
  { href: "/games/maze-paint", label: "Maze Paint", icon: Paintbrush },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-dvh">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="size-8" />
            <span className="hidden font-display text-lg tracking-tight text-text sm:inline">
              Yasir&apos;s
            </span>
          </Link>

          <nav aria-label="Main" className="flex items-center gap-0.5">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-md transition sm:size-auto sm:px-3 sm:py-2",
                    active
                      ? "bg-surface text-text"
                      : "text-text-muted hover:text-text",
                  )}
                >
                  <item.icon className="size-4 sm:hidden" aria-hidden="true" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden text-xs text-text-muted sm:inline">
                  {user.email ?? "Account"}
                </span>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="inline-flex size-9 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-border-strong hover:text-text"
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                aria-label="Sign in"
                className="inline-flex size-9 items-center justify-center rounded-md border border-border text-text transition hover:border-border-strong sm:size-auto sm:px-3"
              >
                <User className="size-4 sm:hidden" aria-hidden="true" />
                <span className="hidden text-xs font-medium sm:inline">Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-8 sm:px-6 sm:pt-10"
      >
        {children}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-display text-sm text-text">Yasir&apos;s Play-Box</p>
          <p>Made by Yasir · Two games, 200 levels each</p>
        </div>
      </footer>
    </div>
  );
}
