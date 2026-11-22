"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, Undo2 } from "lucide-react";

import { GameHeader } from "@/components/game-header";
import { GamePageShell } from "@/components/game-page-shell";
import { LevelPicker } from "@/components/level-picker";
import { ResultDialog } from "@/components/result-dialog";
import { ZipBoard } from "@/components/zip-board";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  beginZip,
  extendZip,
  nextCheckpoint,
  zipErrorMessage,
  zipIsComplete,
} from "@/games/zip/engine";
import { ZIP_LEVELS } from "@/games/zip/levels";
import { formatDuration } from "@/lib/format";
import { getGame } from "@/lib/games";
import { zipTier } from "@/lib/level-meta";
import { useProgress } from "@/lib/use-progress";

const GAME_SLUG = "zip";
const GAME = getGame(GAME_SLUG);

export function ZipGame() {
  const { progress, ready, completeLevel, chooseLevel } = useProgress();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const levelNumber = Math.min(
    GAME.levelCount,
    Math.max(1, selectedLevel ?? 1),
  );
  const level = ZIP_LEVELS[levelNumber - 1];

  const [path, setPath] = useState<number[]>([]);
  const pathRef = useRef<number[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [won, setWon] = useState(false);
  const wonRef = useRef(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const resetBoard = useCallback(() => {
    pathRef.current = [];
    setPath([]);
    setMessage(null);
    setStartedAt(null);
    startedAtRef.current = null;
    setElapsed(0);
    setWon(false);
    wonRef.current = false;
    setFinalScore(null);
  }, []);

  useEffect(() => {
    if (ready && selectedLevel === null) {
      setSelectedLevel(progress.games.zip.lastLevel);
    }
  }, [ready, selectedLevel, progress.games.zip.lastLevel]);

  useEffect(() => {
    if (level) {
      resetBoard();
    }
  }, [level?.id, resetBoard, level]);

  useEffect(() => {
    if (startedAt === null || won) {
      return;
    }
    const tick = () => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    };
    tick();
    const interval = window.setInterval(tick, 500);
    return () => window.clearInterval(interval);
  }, [startedAt, won]);

  const finish = useCallback(() => {
    if (wonRef.current) {
      return;
    }
    wonRef.current = true;
    const started = startedAtRef.current;
    const score =
      started === null
        ? 0
        : Math.max(1, Math.round((Date.now() - started) / 1000));
    setFinalScore(score);
    setElapsed(score);
    setWon(true);
    if (level) {
      completeLevel(GAME_SLUG, level.number, score);
    }
  }, [completeLevel, level]);

  const commitPath = useCallback(
    (next: number[]) => {
      if (pathRef.current.length === 0) {
        const now = Date.now();
        startedAtRef.current = now;
        setStartedAt(now);
      }
      pathRef.current = next;
      setPath(next);
      setMessage(null);
      if (level && zipIsComplete(level, next)) {
        finish();
      }
    },
    [finish, level],
  );

  const handleCellAction = useCallback(
    (cell: number) => {
      if (wonRef.current || !level) {
        return;
      }

      const current = pathRef.current;
      const last = current[current.length - 1];
      if (cell === last) {
        return;
      }
      if (
        current.length > 1 &&
        cell === current[current.length - 2]
      ) {
        const next = current.slice(0, -1);
        pathRef.current = next;
        setPath(next);
        setMessage(null);
        return;
      }

      const result =
        current.length === 0
          ? beginZip(level, cell)
          : extendZip(level, current, cell);

      if (!result.accepted) {
        const error = zipErrorMessage(result.reason);
        if (error) {
          setMessage(error);
        }
        return;
      }

      commitPath(result.path);
    },
    [commitPath, level],
  );

  const undo = () => {
    if (wonRef.current) return;
    const next = pathRef.current.slice(0, -1);
    pathRef.current = next;
    setPath(next);
    setMessage(null);
    if (next.length === 0) {
      startedAtRef.current = null;
      setStartedAt(null);
      setElapsed(0);
    }
  };

  const goToLevel = useCallback(
    (nextLevel: number) => {
      const clamped = Math.min(
        GAME.levelCount,
        Math.max(1, nextLevel),
      );
      setSelectedLevel(clamped);
      chooseLevel(GAME_SLUG, clamped);
      setPickerOpen(false);
    },
    [chooseLevel],
  );

  if (!level) {
    return null;
  }

  const total = level.size * level.size;
  const next = nextCheckpoint(level, path);
  const best = progress.games.zip.bestScores[String(level.number)];
  const tier = zipTier(level.size);
  const completed = progress.games.zip.completed;
  const displayBest =
    best === undefined
      ? null
      : Math.min(best, finalScore ?? best);

  const board = (
    <div>
      <ZipBoard
        level={level}
        path={path}
        onCellAction={handleCellAction}
      />
      <div
        role="status"
        aria-live="polite"
        className="mt-3 min-h-6 px-1 text-sm font-medium text-text-secondary"
      >
        {message ? (
          <span className="text-warning">{message}</span>
        ) : zipIsComplete(level, path) ? (
          <span className="text-success">Path complete. Nicely done.</span>
        ) : (
          <span>
            {next
              ? `Next number: ${next.value}.`
              : "All numbers visited — fill the remaining squares."}
          </span>
        )}
      </div>
    </div>
  );

  const side = (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Run</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <ProgressBar
            value={path.length}
            max={total}
            label="Zip board filled"
          />
          <dl className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.035] px-3 py-2.5">
              <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                Filled
              </dt>
              <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums">
                {path.length}/{total}
              </dd>
            </div>
            <div className="rounded-xl bg-white/[0.035] px-3 py-2.5">
              <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                Next
              </dt>
              <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums">
                {next?.value ?? "—"}
              </dd>
            </div>
            <div className="rounded-xl bg-white/[0.035] px-3 py-2.5">
              <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                Time
              </dt>
              <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums">
                {formatDuration(elapsed)}
              </dd>
            </div>
            <div className="rounded-xl bg-white/[0.035] px-3 py-2.5">
              <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-text-muted">
                Best
              </dt>
              <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-success">
                {formatDuration(displayBest)}
              </dd>
            </div>
          </dl>

          <div className="mt-3 flex gap-2">
            <Button
              variant="secondary"
              onClick={undo}
              disabled={path.length === 0 || won}
              className="flex-1"
            >
              <Undo2 aria-hidden="true" className="size-4" />
              Undo
            </Button>
            <Button
              variant="ghost"
              onClick={resetBoard}
              className="flex-1"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Restart
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to play</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-3 text-xs leading-5 text-text-secondary">
          <p>
            Start on <strong className="text-text">1</strong>, then draw one
            continuous path through every square.
          </p>
          <p>
            Numbers must be visited in order. Backtrack by re-entering the
            previous cell, or use Undo.
          </p>
          <p className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-text-muted">
            Keyboard: Tab to a cell and press Enter or Space to extend the path.
          </p>
        </CardContent>
      </Card>
    </>
  );

  return (
    <GamePageShell
      header={
        <GameHeader
          game={GAME}
          level={level.number}
          levelCount={GAME.levelCount}
          tier={tier}
          onPrevious={() => goToLevel(level.number - 1)}
          onNext={() => goToLevel(level.number + 1)}
          onPick={() => setPickerOpen(true)}
        />
      }
      board={board}
      side={side}
      overlays={
        <>
          <LevelPicker
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            gameName={GAME.name}
            levelCount={GAME.levelCount}
            current={level.number}
            completed={completed}
            onSelect={goToLevel}
            levelLabel={(numberValue) =>
              `${ZIP_LEVELS[numberValue - 1]?.size ?? 0}×${ZIP_LEVELS[numberValue - 1]?.size ?? 0}`
            }
          />
          <ResultDialog
            open={won}
            onOpenChange={setWon}
            gameName={GAME.name}
            level={level.number}
            levelCount={GAME.levelCount}
            stats={[
              { label: "Your time", value: formatDuration(finalScore) },
              { label: "Best time", value: formatDuration(displayBest) },
              { label: "Grid", value: `${level.size} × ${level.size}` },
              { label: "Numbers", value: String(level.checkpoints.length) },
            ]}
            onNext={() => goToLevel(level.number + 1)}
            onReplay={() => {
              setWon(false);
              resetBoard();
            }}
            onLevels={() => {
              setWon(false);
              setPickerOpen(true);
            }}
          />
        </>
      }
    />
  );
}
