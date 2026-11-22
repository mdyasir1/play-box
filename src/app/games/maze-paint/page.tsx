import type { Metadata } from "next";

import { MazePaintGame } from "@/components/maze-paint-game";

export const metadata: Metadata = {
  title: "Maze Paint",
  description: "Slide the roller. Paint the maze. 200 levels.",
};

export default function MazePaintPage() {
  return <MazePaintGame />;
}
