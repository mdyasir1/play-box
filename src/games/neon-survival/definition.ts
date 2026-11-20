import type { GameDefinition } from "@/lib/games/contracts";

import { NEON_SURVIVAL_CONFIG_VERSION } from "./level-config";

export const NEON_SURVIVAL_DEFINITION = {
  id: "neon-survival",
  name: "Neon Survival",
  tagline: "Stay in the light.",
  description:
    "Dodge a neon barrage, grab power-ups, and survive the clock on touch or keyboard.",
  category: "action",
  configVersion: NEON_SURVIVAL_CONFIG_VERSION,
  maxLevel: 10,
  accentVar: "var(--color-danger)",
  instructions: [
    "Steer the ship with touch or the arrow keys.",
    "Avoid every obstacle. A shield absorbs one collision.",
    "Survive until the level timer reaches zero.",
  ],
} as const satisfies GameDefinition;
