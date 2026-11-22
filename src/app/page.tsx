"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { GameCard } from "@/components/game-card";
import { GAMES } from "@/lib/games";
import { useProgress } from "@/lib/use-progress";

export default function HomePage() {
  const { progress } = useProgress();
  const { fullName } = useAuth();
  const firstName = fullName.split(" ")[0] || "Player";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="mx-auto max-w-5xl"
    >
      <section className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-display text-[0.65rem] font-bold tracking-[0.3em] text-hot">
            <Sparkles className="size-3" aria-hidden="true" />
            By Yasir
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Yasir&apos;s Play-Box
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Alright, {firstName}. Two games. 200 levels each. No excuses.
          </p>
        </div>
        <p className="font-display text-xs uppercase tracking-[0.2em] text-text-muted">
          Pick your poison
        </p>
      </section>

      <section aria-label="Games" className="grid gap-4 md:grid-cols-2">
        {GAMES.map((game, index) => (
          <motion.div
            key={game.slug}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.08, duration: 0.3 }}
          >
            <GameCard
              game={game}
              completed={progress.games[game.slug].completed.length}
              lastLevel={progress.games[game.slug].lastLevel}
            />
          </motion.div>
        ))}
      </section>
    </motion.div>
  );
}
