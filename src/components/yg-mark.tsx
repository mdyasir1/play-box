import Image from "next/image";

import { cn } from "@/lib/utils";

type YgMarkProps = {
  className?: string;
};

export function YgMark({ className }: YgMarkProps) {
  return (
    <Image
      src="/yg.png"
      alt="YG — Yasir Games"
      width={320}
      height={212}
      unoptimized
      className={cn("object-contain", className)}
    />
  );
}
