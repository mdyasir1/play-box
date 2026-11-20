import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { GamePlay } from "@/components/game/game-play";
import { GAME_CATALOG, getGameById } from "@/lib/games/catalog";

type GamePlayPageProps = {
  params: Promise<{ gameId: string }>;
};

export function generateStaticParams() {
  return GAME_CATALOG.map((game) => ({ gameId: game.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: GamePlayPageProps): Promise<Metadata> {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    return { title: "Game not found" };
  }

  return {
    title: `${game.name} — Play`,
    description: game.description,
  };
}

export default async function GamePlayPage({ params }: GamePlayPageProps) {
  const { gameId } = await params;
  const game = getGameById(gameId);

  if (!game) {
    notFound();
  }

  return <GamePlay game={game} level={1} />;
}