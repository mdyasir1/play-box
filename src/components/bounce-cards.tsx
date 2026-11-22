"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type BounceCardItem = {
  href: string;
  title: string;
  kicker: string;
  completed: number;
  levelCount: number;
  lastLevel: number;
  tone: "zip" | "maze";
};

type BounceCardsProps = {
  images: string[];
  cards: BounceCardItem[];
  containerWidth?: number;
  containerHeight?: number;
  cardSize?: number;
  spread?: number;
  rotation?: number;
  arc?: number;
  pushDistance?: number;
  hoverScale?: number;
  bounciness?: number;
  animationDelay?: number;
  animationStagger?: number;
  borderWidth?: number;
  borderColor?: string;
  radius?: number;
  shadow?: boolean;
  enableHover?: boolean;
};

export function BounceCards({
  images,
  cards,
  containerWidth = 560,
  containerHeight = 340,
  cardSize = 220,
  spread = 88,
  rotation = 10,
  arc = 0,
  pushDistance = 70,
  hoverScale = 1.06,
  bounciness = 0.6,
  animationDelay = 0.25,
  animationStagger = 0.08,
  borderWidth = 4,
  borderColor = "#ffffff",
  radius = 22,
  shadow = true,
  enableHover = true,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [isNarrow, setIsNarrow] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setIsNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const count = cards.length;
  const middle = (count - 1) / 2;
  const isMobile = isNarrow;
  const size = isMobile
    ? Math.min(cardSize, width ? width * 0.42 : 150)
    : Math.min(cardSize, width ? width * 0.46 : cardSize);
  const gap = Math.min(spread, width ? width * 0.22 : spread);
  const stackGap = 14;
  const mobileHeight = size * count + stackGap * (count - 1) + 8;
  const damping = 12 + (1 - bounciness) * 26;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full"
      style={{
        height: isMobile ? mobileHeight : containerHeight,
        maxWidth: containerWidth,
        overflow: "hidden",
      }}
    >
      {cards.map((card, index) => {
        const offset = (index - middle) * gap * 2;
        const baseRotate = isMobile ? 0 : (index - middle) * rotation;
        const isHovered = hovered === index;
        const push =
          hovered === null || isHovered || isMobile
            ? 0
            : index < hovered
              ? -pushDistance
              : pushDistance;
        const x = isMobile ? 0 : offset + push;
        const y = isMobile
          ? (index - middle) * (size + stackGap)
          : isHovered
            ? -16
            : Math.abs(index - middle) * arc;
        const scale = isHovered ? hoverScale : 1;
        const rotate = isHovered && !isMobile ? baseRotate * 0.35 : baseRotate;
        const image = images[index] ?? "";

        return (
          <motion.div
            key={card.href}
            layout
            className="absolute left-1/2 top-1/2"
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              zIndex: isHovered ? 20 : 10 + index,
              borderRadius: radius,
              borderWidth,
              borderColor,
              borderStyle: "solid",
              overflow: "hidden",
              boxShadow: shadow ? "0 24px 60px rgba(0,0,0,0.45)" : undefined,
            }}
            initial={{ opacity: 0, x, y: y + 70, scale: 0.75, rotate: baseRotate * 2 }}
            animate={{ opacity: 1, x, y, scale, rotate }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping,
              delay: animationDelay + index * animationStagger,
            }}
            onHoverStart={() => enableHover && setHovered(index)}
            onHoverEnd={() => enableHover && setHovered(null)}
          >
            <Link
              href={card.href}
              className="relative block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              aria-label={`${card.title}, level ${card.lastLevel}`}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes={`${Math.round(size)}px`}
                className="object-cover"
                aria-hidden="true"
                unoptimized
              />
              <div className="absolute inset-x-0 bottom-0 bg-[#0e1013]/94 px-3 py-2.5 text-white">
                <p className="font-display text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white/60">
                  {card.kicker}
                </p>
                <h2 className="mt-0.5 font-display text-lg font-bold leading-tight">
                  {card.title}
                </h2>
                <div className="mt-1.5 flex items-center justify-between text-[0.6rem] font-semibold text-white/70">
                  <span>{card.completed} / {card.levelCount}</span>
                  <span>LV {String(card.lastLevel).padStart(3, "0")}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
