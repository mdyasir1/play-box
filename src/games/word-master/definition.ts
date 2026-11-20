import type { GameDefinition } from "@/lib/games/contracts";

import { WORD_MASTER_CONFIG_VERSION } from "./level-config";

export const WORD_MASTER_DEFINITION = {
  id: "word-master",
  name: "Word Master",
  tagline: "Six tries. Five letters.",
  description:
    "Deduce the hidden word with color-coded clues, a daily challenge, and a keyboard built for thumbs.",
  category: "word",
  configVersion: WORD_MASTER_CONFIG_VERSION,
  maxLevel: 10,
  accentVar: "var(--color-success)",
  instructions: [
    "Guess the hidden five-letter word within six attempts.",
    "Green means the right letter in the right place; yellow means the right letter in the wrong place; grey means the letter is not in the word.",
    "Hints reveal one unresolved position. Hints never consume an attempt.",
  ],
} as const satisfies GameDefinition;
