"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type Shard = {
  id: string;
  points: string;
  cx: number;
  cy: number;
  near: number;
  burstX: number;
  burstY: number;
  rotate: number;
  initialX: number;
};

const WIDTH = 900;
const HEIGHT = 300;
const COLS = 6;
const ROWS = 3;
const CRACK_RADIUS = 165;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function ShatterText({
  onShatter,
  autoplay = true,
  autoplayDelay = 1500,
}: {
  onShatter?: () => void;
  autoplay?: boolean;
  autoplayDelay?: number;
}) {
  const rawId = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [shattered, setShattered] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  const shards = useMemo<Shard[]>(() => {
    const random = seededRandom(20261122);
    const points: Array<Array<{ x: number; y: number }>> = [];
    for (let row = 0; row <= ROWS; row += 1) {
      const line: Array<{ x: number; y: number }> = [];
      for (let col = 0; col <= COLS; col += 1) {
        const edgeX = col === 0 || col === COLS;
        const edgeY = row === 0 || row === ROWS;
        line.push({
          x: (col * WIDTH) / COLS + (edgeX ? 0 : (random() - 0.5) * 34),
          y: (row * HEIGHT) / ROWS + (edgeY ? 0 : (random() - 0.5) * 30),
        });
      }
      points.push(line);
    }

    const result: Shard[] = [];
    for (let row = 0; row < ROWS; row += 1) {
      for (let col = 0; col < COLS; col += 1) {
        const corners = [
          points[row]![col]!,
          points[row]![col + 1]!,
          points[row + 1]![col + 1]!,
          points[row + 1]![col]!,
        ];
        const cx = corners.reduce((sum, point) => sum + point.x, 0) / 4;
        const cy = corners.reduce((sum, point) => sum + point.y, 0) / 4;
        const angle = Math.atan2(cy - HEIGHT / 2, cx - WIDTH / 2);
        result.push({
          id: `${rawId}-${row}-${col}`,
          points: corners.map((point) => `${point.x},${point.y}`).join(" "),
          cx,
          cy,
          near: 0,
          burstX: Math.cos(angle) * (90 + random() * 120),
          burstY: Math.sin(angle) * (70 + random() * 90) - 40,
          rotate: (random() - 0.5) * 90,
          initialX: (random() - 0.5) * 40,
        });
      }
    }
    return result;
  }, [rawId]);

  const shatter = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    setShattered(true);
    window.setTimeout(() => onShatter?.(), reduceMotion ? 80 : 850);
  };

  useEffect(() => {
    if (!autoplay || reduceMotion) return;
    const timer = window.setTimeout(shatter, autoplayDelay);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, autoplayDelay, reduceMotion]);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || shattered) return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPointer({
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    });
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={() => setPointer(null)}
      onClick={shatter}
      className="relative h-[240px] w-full cursor-pointer select-none sm:h-[300px]"
      role="button"
      tabIndex={0}
      aria-label="Shatter Yasir's Play-Box title"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") shatter();
      }}
    >
      <span className="sr-only">Yasir&apos;s Play-Box</span>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {shards.map((shard) => (
            <clipPath key={shard.id} id={shard.id} clipPathUnits="userSpaceOnUse">
              <polygon points={shard.points} />
            </clipPath>
          ))}
        </defs>

        {shards.map((shard) => {
          const distance = pointer
            ? Math.hypot(shard.cx - pointer.x, shard.cy - pointer.y)
            : Number.POSITIVE_INFINITY;
          const near = reduceMotion
            ? 0
            : Math.max(0, 1 - distance / CRACK_RADIUS);
          const offsetX = shattered
            ? shard.burstX
            : (shard.cx - WIDTH / 2) * near * 0.045;
          const offsetY = shattered
            ? shard.burstY
            : (shard.cy - HEIGHT / 2) * near * 0.08;
          const rotation = shattered ? shard.rotate : near * (shard.cx > WIDTH / 2 ? 4 : -4);

          return (
            <motion.g
              key={shard.id}
              style={{ transformOrigin: `${shard.cx}px ${shard.cy}px` }}
              initial={{ x: shard.initialX, y: 45, opacity: 0 }}
              animate={{
                x: offsetX,
                y: offsetY,
                rotate: rotation,
                opacity: shattered ? 0 : 1,
              }}
              transition={{
                duration: reduceMotion ? 0.01 : shattered ? 0.8 : 0.85,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              <g clipPath={`url(#${shard.id})`}>
                <text
                  x={WIDTH / 2}
                  y={118}
                  textAnchor="middle"
                  fontFamily="var(--font-chakra)"
                  fontSize="86"
                  fontWeight="700"
                  letterSpacing="4"
                  fill="var(--color-text)"
                >
                  YASIR&apos;S
                </text>
                <text
                  x={WIDTH / 2}
                  y="218"
                  textAnchor="middle"
                  fontFamily="var(--font-chakra)"
                  fontSize="86"
                  fontWeight="700"
                  letterSpacing="10"
                  fill="var(--color-accent)"
                >
                  PLAY-BOX
                </text>
              </g>
              <polygon
                points={shard.points}
                fill="none"
                stroke="var(--color-hot)"
                strokeWidth={near > 0 ? 1.2 : 0.5}
                strokeOpacity={shattered ? 0 : 0.18 + near * 0.55}
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
