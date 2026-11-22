"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings2 } from "lucide-react";
import type { ReactNode } from "react";

import { useAuth } from "@/components/auth-provider";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, fullName, signOut } = useAuth();
  const onLogin = pathname.startsWith("/login");

  return (
    <div className="min-h-dvh">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href={onLogin ? "/login" : "/"} className="flex items-center gap-2.5">
            <Logo className="size-8 text-text" />
            <span className="font-display text-base font-bold tracking-tight text-text sm:text-lg">
              {onLogin ? "Yasir's Play-Box" : "YASIR'S"}
            </span>
          </Link>

          {onLogin ? (
            <ThemeToggle />
          ) : (
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <div className="hidden text-right sm:block">
                    <p className="text-[0.65rem] uppercase tracking-widest text-text-muted">
                      Player
                    </p>
                    <p className="font-display text-xs font-semibold text-text">
                      {fullName || user.email || "Unknown player"}
                    </p>
                  </div>
                  <Link
                    href="/settings"
                    aria-label="Settings"
                    title="Settings"
                    className="grid size-9 place-items-center rounded-md border border-border text-text-secondary transition hover:border-border-strong hover:text-text"
                  >
                    <Settings2 className="size-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    aria-label="Sign out"
                    title="Sign out"
                    className="grid size-9 place-items-center rounded-md border border-border text-text-secondary transition hover:border-border-strong hover:text-text"
                  >
                    <LogOut className="size-4" />
                  </button>
                </>
              ) : null}
              <ThemeToggle />
            </div>
          )}
        </div>
      </header>

      <main
        id="main"
        className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-8 sm:px-6 sm:pt-10"
      >
        {children}
      </main>
    </div>
  );
}
