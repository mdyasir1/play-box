export type AchievementDefinition = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
};

export const ACHIEVEMENT_DEFINITIONS: readonly AchievementDefinition[] = [
  {
    id: "platform_ready",
    title: "Platform ready",
    description: "Open a game details page and confirm its engine state.",
    sortOrder: 1,
  },
  {
    id: "competent_start",
    title: "Competent start",
    description: "Reach three completed levels across YASIR PLAYBOX.",
    sortOrder: 2,
  },
  {
    id: "explorer",
    title: "Explorer",
    description: "Reach five completed levels across YASIR PLAYBOX.",
    sortOrder: 3,
  },
  {
    id: "reaction_ready",
    title: "Reaction ready",
    description: "Win Reaction Rush once a level is playable.",
    sortOrder: 4,
  },
  {
    id: "number_merge_explorer",
    title: "Number merge explorer",
    description: "Clear Number Merge level 5 once the engine ships.",
    sortOrder: 5,
  },
  {
    id: "first_mission",
    title: "First mission",
    description: "Open the library and return to a game later.",
    sortOrder: 6,
  },
] as const satisfies readonly AchievementDefinition[];
