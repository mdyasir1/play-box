import Image from "next/image";

import { cn } from "@/lib/utils";

type YgMarkProps = {
  className?: string;
};

export function YgMark({ className }: YgMarkProps) {
  return (
    <Image
      src="/favicon/favicon.svg"
      alt="YG — Yasir Games"
      width={64}
      height={64}
      unoptimized
      className={cn("object-contain", className)}
    />
  );
}
