"use client";

import { motion } from "framer-motion";

import { BounceCards } from "@/components/bounce-cards";
import { useAuth } from "@/components/auth-provider";
import { useProgress } from "@/lib/use-progress";

const IMAGES = ["/games/zip-art.svg", "/games/maze-art.svg"];

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
      <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
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

      <section aria-label="Games">
        <BounceCards
          images={IMAGES}
          cards={[
            {
              href: "/games/zip",
              title: "Zip",
              kicker: "200 levels",
              completed: progress.games.zip.completed.length,
              levelCount: 200,
              lastLevel: progress.games.zip.lastLevel,
              tone: "zip",
            },
            {
              href: "/games/maze-paint",
              title: "Maze Paint",
              kicker: "200 levels",
              completed: progress.games["maze-paint"].completed.length,
              levelCount: 200,
              lastLevel: progress.games["maze-paint"].lastLevel,
              tone: "maze",
            },
          ]}
          containerWidth={560}
          containerHeight={360}
          cardSize={260}
          spread={100}
          rotation={10}
          pushDistance={70}
          hoverScale={1.06}
          bounciness={0.6}
          borderWidth={4}
          borderColor="var(--color-border-strong)"
          radius={22}
          shadow
          enableHover
        />
      </section>
    </motion.div>
  );
}
