"use client";

import { useRef } from "react";

import type { ZipLevel } from "@/games/zip/types";
import { checkpointAt } from "@/games/zip/engine";
import { cn } from "@/lib/utils";

type ZipBoardProps = {
  level: ZipLevel;
  path: number[];
  onCellAction: (cell: number) => void;
};

export function ZipBoard({ level, path, onCellAction }: ZipBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const lastCellRef = useRef<number | null>(null);
  const pathSet = new Set(path);
  const lastCell = path[path.length - 1] ?? null;
  const total = level.size * level.size;
  const cells = Array.from({ length: total }, (_, index) => index);

  const cellFromPoint = (clientX: number, clientY: number): number | null => {
    const board = boardRef.current;
    if (!board) return null;
    const rect = board.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX >= rect.right ||
      clientY < rect.top ||
      clientY >= rect.bottom
    ) {
      return null;
    }
    const col = Math.floor(((clientX - rect.left) / rect.width) * level.size);
    const row = Math.floor(((clientY - rect.top) / rect.height) * level.size);
    if (
      row < 0 ||
      row >= level.size ||
      col < 0 ||
      col >= level.size
    ) {
      return null;
    }
    return row * level.size + col;
  };

  const activatePoint = (clientX: number, clientY: number) => {
    const cell = cellFromPoint(clientX, clientY);
    if (cell === null || lastCellRef.current === cell) return;
    lastCellRef.current = cell;
    onCellAction(cell);
  };

  const points = path
    .map((cell) => {
      const row = Math.floor(cell / level.size);
      const col = cell % level.size;
      return `${col + 0.5},${row + 0.5}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-border bg-surface/45 p-2.5 shadow-[0_22px_70px_rgba(0,0,0,0.35)] sm:p-3">
      <div
        ref={boardRef}
        role="group"
        aria-label={`Zip grid, ${level.size} by ${level.size}`}
        className="relative aspect-square w-full touch-none select-none overflow-hidden rounded-xl bg-[#080c16]"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.preventDefault();
          draggingRef.current = true;
          lastCellRef.current = null;
          event.currentTarget.setPointerCapture(event.pointerId);
          activatePoint(event.clientX, event.clientY);
        }}
        onPointerMove={(event) => {
          if (!draggingRef.current) return;
          activatePoint(event.clientX, event.clientY);
        }}
        onPointerUp={() => {
          draggingRef.current = false;
          lastCellRef.current = null;
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
          lastCellRef.current = null;
        }}
      >
        <div
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: `repeat(${level.size}, minmax(0, 1fr))`,
          }}
        >
          {cells.map((cell) => {
            const checkpoint = checkpointAt(level, cell);
            const inPath = pathSet.has(cell);
            const isLast = cell === lastCell;
            const row = Math.floor(cell / level.size);
            const col = cell % level.size;
            return (
              <button
                key={cell}
                type="button"
                data-cell={cell}
                aria-label={
                  checkpoint
                    ? `Row ${row + 1}, column ${col + 1}, number ${checkpoint.value}`
                    : `Row ${row + 1}, column ${col + 1}`
                }
                aria-pressed={inPath}
                onClick={(event) => {
                  if (event.detail === 0) {
                    onCellAction(cell);
                  }
                }}
                className={cn(
                  "relative border border-white/[0.035] outline-none transition-[background-color,box-shadow] focus-visible:z-20 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus",
                  inPath ? "bg-accent/[0.17]" : "bg-white/[0.025]",
                  isLast &&
                    "bg-accent/[0.26] shadow-[inset_0_0_0_2px_rgba(180,154,255,0.75)]",
                )}
              >
                {checkpoint ? (
                  <span
                    className={cn(
                      "absolute inset-[22%] z-20 flex items-center justify-center rounded-full text-[clamp(0.6rem,2.4vmin,0.9rem)] font-bold transition",
                      inPath
                        ? "bg-accent text-[#090612] shadow-[0_0_18px_rgba(155,123,255,0.45)]"
                        : "border border-accent/40 bg-accent/12 text-accent",
                    )}
                  >
                    {checkpoint.value}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <svg
          aria-hidden="true"
          viewBox={`0 0 ${level.size} ${level.size}`}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        >
          {path.length > 1 ? (
            <polyline
              points={points}
              fill="none"
              stroke="#b49aff"
              strokeWidth={level.size >= 7 ? 0.15 : 0.18}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}
          {path.length === 1 ? (
            <circle
              cx={(path[0] ?? 0) % level.size + 0.5}
              cy={Math.floor((path[0] ?? 0) / level.size) + 0.5}
              r={0.12}
              fill="#b49aff"
            />
          ) : null}
        </svg>
      </div>

      <p className="mt-2.5 flex items-center justify-between px-1 text-[0.68rem] font-medium text-text-muted">
        <span>Start at 1 · visit numbers in order</span>
        <span className="tabular-nums">
          {path.length}/{total}
        </span>
      </p>
    </div>
  );
}
