"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SPLASH_KEY = "ypb:v1:splash-seen";
const EXIT_MS = 220;

export function Splash() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const exitTimer = useRef<number | null>(null);

  const dismiss = useCallback(() => {
    setLeaving(true);

    try {
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      // Storage can be unavailable in private mode; the splash still dismisses.
    }

    if (exitTimer.current !== null) {
      window.clearTimeout(exitTimer.current);
    }

    exitTimer.current = window.setTimeout(() => setVisible(false), EXIT_MS);
  }, []);

  useEffect(() => {
    let seen = false;

    try {
      seen = sessionStorage.getItem(SPLASH_KEY) === "1";
    } catch {
      seen = false;
    }

    if (seen) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const holdMs = reducedMotion ? 700 : 1700;
    let holdTimer: number | null = null;

    const frame = window.requestAnimationFrame(() => {
      setVisible(true);
      holdTimer = window.setTimeout(dismiss, holdMs);
    });

    return () => {
      window.cancelAnimationFrame(frame);

      if (holdTimer !== null) {
        window.clearTimeout(holdTimer);
      }

      if (exitTimer.current !== null) {
        window.clearTimeout(exitTimer.current);
        exitTimer.current = null;
      }
    };
  }, [dismiss]);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="YASIR PLAYBOX launch screen"
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-bg transition-opacity duration-200",
        leaving && "pointer-events-none opacity-0",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_40%_at_50%_45%,rgba(124,92,255,0.18),transparent_70%),radial-gradient(35%_25%_at_72%_58%,rgba(76,201,240,0.10),transparent_70%)]"
      />

      <div className="relative flex flex-col items-center px-6 text-center">
        <div className="relative mb-7 flex items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute size-36 rounded-full border border-accent/25 animate-splash-ring sm:size-44"
          />
          <span
            aria-hidden="true"
            className="absolute size-24 rounded-full border border-accent-blue/20"
          />
          <Logo
            showWordmark={false}
            markClassName="size-20 animate-splash-mark sm:size-24"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-4 -left-10 w-8 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent blur-md animate-splash-sheen"
          />
        </div>

        <div className="animate-splash-text space-y-2">
          <p className="font-display text-2xl font-bold tracking-[0.22em] text-text sm:text-3xl">
            YASIR PLAYBOX
          </p>
          <p className="text-sm font-medium tracking-[0.08em] text-text-secondary">
            Your Personal Arcade.
          </p>
        </div>

        <p role="status" className="sr-only">
          YASIR PLAYBOX is ready.
        </p>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={dismiss}
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))]"
      >
        Skip intro
      </Button>
    </div>
  );
}
