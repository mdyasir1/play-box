import type { Metadata } from "next";

import { MazePaintGame } from "@/components/maze-paint-game";

export const metadata: Metadata = {
  title: "Maze Paint",
  description:
    "Slide the roller until it hits a wall and paint every open tile. 100 levels.",
};

export default function MazePaintPage() {
  return <MazePaintGame />;
}
