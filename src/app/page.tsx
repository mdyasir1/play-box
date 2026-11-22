"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { GameCard } from "@/components/game-card";
import { GAMES } from "@/lib/games";
import { useProgress } from "@/lib/use-progress";

export default function HomePage() {
  const { progress } = useProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="overflow-x-clip"
    >
      <section className="flex flex-col gap-3 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-text-muted">
            By Yasir
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Yasir&apos;s Play-Box
          </h1>
        </div>
        <p className="text-sm text-text-secondary">Two games. 200 levels each.</p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {GAMES.map((game) => (
          <GameCard
            key={game.slug}
            game={game}
            completed={progress.games[game.slug].completed.length}
            lastLevel={progress.games[game.slug].lastLevel}
          />
        ))}
      </section>

      <section className="mt-6 flex items-center justify-between text-xs text-text-muted">
        <span>Progress stays on this device.</span>
        <Link href="/login" className="underline underline-offset-4 hover:text-text">
          Sign in to sync
        </Link>
      </section>
    </motion.div>
  );
}
