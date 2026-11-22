import { PrismaClient } from "@prisma/client";

let client: PrismaClient | null = null;

export function getPrisma(): PrismaClient | null {
  if (!process.env.DATABASE_URL || !process.env.DIRECT_URL) return null;
  if (!client) {
    client = new PrismaClient();
  }
  return client;
}
