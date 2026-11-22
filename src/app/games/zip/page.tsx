import type { Metadata } from "next";

import { ZipGame } from "@/components/zip-game";

export const metadata: Metadata = {
  title: "Zip",
  description:
    "Draw one continuous path through every square and visit the numbers in order. 100 levels.",
};

export default function ZipPage() {
  return <ZipGame />;
}
