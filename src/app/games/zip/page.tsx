import type { Metadata } from "next";

import { ZipGame } from "@/components/zip-game";

export const metadata: Metadata = {
  title: "Zip",
  description: "One line through every square. 200 levels.",
};

export default function ZipPage() {
  return <ZipGame />;
}
