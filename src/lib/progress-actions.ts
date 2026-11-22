"use server";

import { Prisma } from "@prisma/client";

import type { GameSlug } from "./games";
import { getPrisma } from "./prisma";
import { getAuthUser } from "./supabase/server";
import type { RemoteGameProgress } from "./progress";

export async function getRemoteProgressAction(
  game: GameSlug,
): Promise<RemoteGameProgress | null> {
  const user = await getAuthUser();
  if (!user) return null;
  const prisma = getPrisma();
  if (!prisma) return null;

  try {
    const row = await prisma.progress.findUnique({
      where: { userId_game: { userId: user.id, game } },
    });
    if (!row) return null;
    return {
      currentLevel: row.currentLevel,
      completed: row.completed,
      bestScores: row.bestScores as Record<string, number>,
    };
  } catch {
    return null;
  }
}

export async function saveRemoteProgressAction(
  game: GameSlug,
  currentLevel: number,
  completed: number[],
  bestScores: Record<string, number>,
): Promise<boolean> {
  const user = await getAuthUser();
  if (!user) return false;
  const prisma = getPrisma();
  if (!prisma) return false;

  try {
    const data = {
      currentLevel,
      completed,
      bestScores: bestScores as Prisma.InputJsonValue,
    };
    await prisma.progress.upsert({
      where: { userId_game: { userId: user.id, game } },
      update: data,
      create: { ...data, userId: user.id, game },
    });
    return true;
  } catch {
    return false;
  }
}
