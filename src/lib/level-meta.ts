export type LevelTier = {
  label: string;
  className: string;
};

export function zipTier(size: number): LevelTier {
  if (size <= 4) {
    return { label: "Warm-up", className: "text-success" };
  }
  if (size <= 5) {
    return { label: "Easy", className: "text-cyan" };
  }
  if (size <= 6) {
    return { label: "Steady", className: "text-accent" };
  }
  if (size <= 7) {
    return { label: "Tricky", className: "text-warning" };
  }
  return { label: "Expert", className: "text-danger" };
}

export function mazeTier(size: number): LevelTier {
  if (size <= 6) {
    return { label: "Warm-up", className: "text-success" };
  }
  if (size <= 7) {
    return { label: "Steady", className: "text-cyan" };
  }
  return { label: "Tricky", className: "text-warning" };
}
