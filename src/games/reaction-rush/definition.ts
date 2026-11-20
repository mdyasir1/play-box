import type { GameDefinition } from "@/lib/games/contracts";

import { REACTION_RUSH_CONFIG_VERSION } from "./level-config";

export const REACTION_RUSH_DEFINITION = {
  id: "reaction-rush",
  name: "Reaction Rush",
  tagline: "Chase the green.",
  description:
    "Wait for the signal, then tap as fast as you can. Jump too early and the round costs you.",
  category: "reflex",
  configVersion: REACTION_RUSH_CONFIG_VERSION,
  maxLevel: 10,
  accentVar: "var(--color-warning)",
  instructions: [
    "Wait for the panel to turn green, then tap it or press Space as fast as you can.",
    "Tapping before the signal is a false start and subtracts points.",
    "Clear every required round with an average time at or under the level target.",
  ],
} as const satisfies GameDefinition;
