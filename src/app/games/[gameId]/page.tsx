import {
  ArrowLeft,
  Gauge,
  Keyboard,
  Smartphone,
  Target,
  Trophy,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GameIcon } from "@/components/platform/game-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getGameById, GAME_CATALOG } from "@/lib/games/catalog";

type GamePageProps = {
  params: Promise<{ gameId: string }>;
};

const MODULE_FEATURES = [
  {
    icon: Target,
    title: "Ten real levels",
    description:
      "A measurable difficulty step per level, tuned and capped so late levels stay playable.",
  },
  {
    icon: Gauge,
    title: "Saved best score",
    description:
      "Personal bests and unlocked levels are written locally before anything else happens.",
  },
  {
    icon: Smartphone,
    title: "Touch-first controls",
    description:
      "Designed for a phone in one hand, with safe-area spacing and no hover-only actions.",
  },
  {
    icon: Keyboard,
    title: "Keyboard parity",
    description:
      "Every control is reachable from a physical keyboard for desktop play.",
  },
] as const;

export function generateStaticParams() {
  return GAME_CATALOG.map((game) => ({ gameId: game.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    return { title: "Game not found" };
  }

  return {
    title: game.name,
    description: game.description,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    notFound();
  }

  return (
    <div className="animate-rise">
      <Link
        href="/games"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-text"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All games
      </Link>

      <div className="mt-6 overflow-hidden rounded-card border border-border bg-surface/60">
        <div
          className="relative flex min-h-44 items-end p-6 sm:p-8"
          style={{
            backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${game.accent} 26%, transparent) 0%, transparent 70%)`,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:26px_26px]"
          />
          <div className="relative">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="outline">{game.categoryLabel}</Badge>
              <Badge variant="warning">{game.status}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl border border-border bg-bg-elevated">
                <GameIcon
                  name={game.icon}
                  className="size-7"
                  style={{ color: game.accent }}
                />
              </span>
              <div>
                <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                  {game.name}
                </h1>
                <p className="mt-1 text-sm font-medium text-text-secondary">
                  {game.tagline}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border p-6 sm:p-8">
          <p className="max-w-2xl text-base leading-7 text-text-secondary">
            {game.description}
          </p>

          <div className="mt-6 rounded-xl border border-warning/25 bg-warning/5 px-4 py-3">
            <p className="text-sm font-semibold text-[#ffe1a0]">
              This module is in build.
            </p>
            <p className="mt-1 text-sm leading-6 text-text-secondary">
              The playable version is not available yet. It will be enabled here
              once its engine, level curve, and tests are complete.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/games">Back to library</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/achievements">
                <Trophy aria-hidden="true" className="size-4" />
                Achievements
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-10" aria-labelledby="module-heading">
        <h2
          id="module-heading"
          className="font-display text-xl font-semibold tracking-tight"
        >
          What this module includes
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {MODULE_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex gap-3 rounded-card border border-border bg-surface/40 p-4"
            >
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-bg-elevated text-accent">
                <feature.icon aria-hidden="true" className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-text">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
