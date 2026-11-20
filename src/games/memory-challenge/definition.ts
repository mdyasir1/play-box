import type { GameDefinition } from "@/lib/games/contracts";

import { MEMORY_CHALLENGE_CONFIG_VERSION } from "./level-config";

export const MEMORY_CHALLENGE_DEFINITION = {
  id: "memory-challenge",
  name: "Memory Challenge",
  tagline: "Watch. Repeat. Remember.",
  description:
    "Follow the glowing pads as the sequence grows longer and the playback gets faster.",
  category: "memory",
  configVersion: MEMORY_CHALLENGE_CONFIG_VERSION,
  maxLevel: 10,
  accentVar: "var(--color-accent-blue)",
  instructions: [
    "Watch the pads light up in order.",
    "Repeat the sequence by tapping the pads in the same order.",
    "Every success adds one step until you reach the level target.",
  ],
} as const satisfies GameDefinition;
