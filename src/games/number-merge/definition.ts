import type { GameDefinition } from "@/lib/games/contracts";

import { NUMBER_MERGE_CONFIG_VERSION } from "./level-config";

export const NUMBER_MERGE_DEFINITION = {
  id: "number-merge",
  name: "Number Merge",
  tagline: "Slide. Merge. Climb.",
  description:
    "Combine matching tiles toward an ever-higher target, with undo, swipes, and keyboard control.",
  category: "puzzle",
  configVersion: NUMBER_MERGE_CONFIG_VERSION,
  maxLevel: 10,
  accentVar: "var(--color-accent)",
  instructions: [
    "Swipe or use the arrow keys to move every tile in one direction.",
    "Two matching tiles merge once per move and add their value to the score.",
    "Reach the target tile before the move limit or the board locks.",
  ],
} as const satisfies GameDefinition;
