"use client";

import { useRef } from "react";
import type * as React from "react";

import {
  isMazeFloor,
  mazeCellIndex,
  mazeDirectionFromSwipe,
} from "@/games/maze-paint/engine";
import type {
  MazeDirection,
  MazeLevel,
  MazeState,
} from "@/games/maze-paint/types";
import { cn } from "@/lib/utils";

type MazeBoardProps = {
  level: MazeLevel;
  state: MazeState;
  onDirection: (direction: MazeDirection) => void;
};

export function MazeBoard({ level, state, onDirection }: MazeBoardProps) {
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);
  const painted = new Set(state.painted);
  const cells: React.ReactNode[] = [];

  for (let row = 0; row < level.height; row += 1) {
    for (let col = 0; col < level.width; col += 1) {
      const index = mazeCellIndex(level, row, col);
      const floor = isMazeFloor(level, row, col);
      const isPainted = painted.has(index);
      const isRoller = row === state.row && col === state.col;

      cells.push(
        <div
          key={`${row}-${col}`}
          className={cn(
            "relative rounded-[3px] transition-colors duration-150",
            !floor && "bg-[#070a12] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025)]",
            floor && !isPainted && "bg-[#182033]",
            floor &&
              isPainted &&
              "bg-gradient-to-br from-cyan/55 to-accent/35 shadow-[inset_0_0_0_1px_rgba(76,201,240,0.18)]",
          )}
        >
          {isRoller ? (
            <span
              aria-hidden="true"
              className="absolute inset-[22%] rounded-full bg-white shadow-[0_0_0_2px_rgba(76,201,240,0.55),0_0_18px_rgba(76,201,240,0.8)]"
            />
          ) : null}
        </div>,
      );
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-surface/45 p-2.5 shadow-[0_22px_70px_rgba(0,0,0,0.35)] sm:p-3">
      <div
        role="group"
        aria-label="Maze Paint board. Swipe or use the arrow keys to slide the roller."
        tabIndex={0}
        className="w-full touch-none select-none rounded-xl bg-[#070a12] p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-focus"
        style={{ aspectRatio: `${level.width} / ${level.height}` }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          pointerRef.current = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          const start = pointerRef.current;
          pointerRef.current = null;
          if (!start || start.id !== event.pointerId) return;
          const direction = mazeDirectionFromSwipe(
            event.clientX - start.x,
            event.clientY - start.y,
          );
          if (direction) {
            onDirection(direction);
          }
        }}
        onPointerCancel={() => {
          pointerRef.current = null;
        }}
      >
        <div
          className="grid h-full w-full gap-[3px]"
          style={{
            gridTemplateColumns: `repeat(${level.width}, minmax(0, 1fr))`,
          }}
        >
          {cells}
        </div>
      </div>

      <p className="mt-2.5 flex items-center justify-between px-1 text-[0.68rem] font-medium text-text-muted">
        <span>Swipe or use arrow keys</span>
        <span className="tabular-nums">
          {painted.size}/{level.rows.join("").split(".").length - 1}
        </span>
      </p>
    </div>
  );
}
