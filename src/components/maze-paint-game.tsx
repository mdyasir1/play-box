"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCcw,
  Undo2,
} from "lucide-react";

import { GameHeader } from "@/components/game-header";
import { GamePageShell } from "@/components/game-page-shell";
import { LevelPicker } from "@/components/level-picker";
import { MazeBoard } from "@/components/maze-board";
import { ResultDialog } from "@/components/result-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import {
  createMazeState,
  mazeDirectionFromKey,
  mazeDirectionLabel,
  mazeFloorCount,
  mazeIsComplete,
  mazePaintedCount,
  slideMaze,
} from "@/games/maze-paint/engine";
import { MAZE_LEVELS } from "@/games/maze-paint/levels";
import type { MazeDirection, MazeState } from "@/games/maze-paint/types";
import { formatDuration, formatScore } from "@/lib/format";
import { getGame } from "@/lib/games";
import { isLevelUnlocked } from "@/lib/progress";
import { mazeTier } from "@/lib/level-meta";
import { useProgress } from "@/lib/use-progress";

const GAME_SLUG = "maze-paint";
const GAME = getGame(GAME_SLUG);

const DIRECTIONS: Array<{
  direction: MazeDirection;
  icon: typeof ArrowUp;
  className: string;
}> = [
  { direction: "up", icon: ArrowUp, className: "col-start-2 row-start-1" },
  { direction: "left", icon: ArrowLeft, className: "col-start-1 row-start-2" },
  { direction: "down", icon: ArrowDown, className: "col-start-2 row-start-2" },
  { direction: "right", icon: ArrowRight, className: "col-start-3 row-start-2" },
];

export function MazePaintGame() {
  const { progress, ready, completeLevel, chooseLevel } = useProgress();
  const savedLevel = progress.games["maze-paint"].lastLevel;
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const levelNumber = Math.min(
    GAME.levelCount,
    Math.max(1, selectedLevel ?? 1),
  );
  const level = MAZE_LEVELS[levelNumber - 1];

  const [state, setState] = useState<MazeState | null>(() =>
    level ? createMazeState(level) : null,
  );
  const stateRef = useRef<MazeState | null>(state);
  const [history, setHistory] = useState<MazeState[]>([]);
  const historyRef = useRef<MazeState[]>([]);
  const [moves, setMoves] = useState(0);
  const movesRef = useRef(0);
  const [message, setMessage] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const wonRef = useRef(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);

  const resetBoard = useCallback(() => {
    if (!level) return;
    const fresh = createMazeState(level);
    stateRef.current = fresh;
    setState(fresh);
    historyRef.current = [];
    setHistory([]);
    movesRef.current = 0;
    setMoves(0);
    setMessage(null);
    setWon(false);
    wonRef.current = false;
    setFinalScore(null);
    startedAtRef.current = null;
    setStartedAt(null);
    setElapsed(0);
  }, [level]);

  useEffect(() => {
    if (ready && selectedLevel === null) setSelectedLevel(savedLevel);
  }, [ready, selectedLevel, savedLevel]);

  useEffect(() => {
    resetBoard();
  }, [level, resetBoard]);

  useEffect(() => {
    if (startedAt === null || won) return;
    const tick = () => setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    tick();
    const interval = window.setInterval(tick, 500);
    return () => window.clearInterval(interval);
  }, [startedAt, won]);

  const finish = useCallback(
    (score: number) => {
      if (wonRef.current || !level) return;
      wonRef.current = true;
      setFinalScore(score);
      setWon(true);
      completeLevel(GAME_SLUG, level.number, score);
    },
    [completeLevel, level],
  );

  const move = useCallback(
    (direction: MazeDirection) => {
      if (wonRef.current || !level || !stateRef.current) return;
      const result = slideMaze(level, stateRef.current, direction);
      if (!result.moved) {
        setMessage("Blocked there — try another direction.");
        return;
      }
      if (movesRef.current === 0) {
        const now = Date.now();
        startedAtRef.current = now;
        setStartedAt(now);
      }
      historyRef.current = [...historyRef.current, stateRef.current];
      setHistory(historyRef.current);
      stateRef.current = result.state;
      setState(result.state);
      const nextMoves = movesRef.current + 1;
      movesRef.current = nextMoves;
      setMoves(nextMoves);
      setMessage(null);
      if (mazeIsComplete(level, result.state)) finish(nextMoves);
    },
    [finish, level],
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (pickerOpen || wonRef.current) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      const direction = mazeDirectionFromKey(event.key);
      if (!direction) return;
      event.preventDefault();
      move(direction);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [move, pickerOpen]);

  const undo = () => {
    if (wonRef.current) return;
    const previous = historyRef.current[historyRef.current.length - 1];
    if (!previous) return;
    historyRef.current = historyRef.current.slice(0, -1);
    setHistory(historyRef.current);
    stateRef.current = previous;
    setState(previous);
    const nextMoves = Math.max(0, movesRef.current - 1);
    movesRef.current = nextMoves;
    setMoves(nextMoves);
    setMessage(null);
    if (nextMoves === 0) {
      startedAtRef.current = null;
      setStartedAt(null);
      setElapsed(0);
    }
  };

  const goToLevel = useCallback(
    (nextLevel: number) => {
      if (!isLevelUnlocked(progress, GAME_SLUG, nextLevel)) return;
      const clamped = Math.min(GAME.levelCount, Math.max(1, nextLevel));
      setSelectedLevel(clamped);
      chooseLevel(GAME_SLUG, clamped);
      setPickerOpen(false);
    },
    [chooseLevel, progress],
  );

  if (!level || !state) return null;

  const floorCount = mazeFloorCount(level);
  const paintedCount = mazePaintedCount(level, state);
  const best = progress.games["maze-paint"].bestScores[String(level.number)];
  const displayBest = best === undefined ? null : Math.min(best, finalScore ?? best);
  const nextUnlocked = isLevelUnlocked(progress, GAME_SLUG, level.number + 1);

  const board = (
    <div>
      <MazeBoard level={level} state={state} onDirection={move} />
      <div
        role="status"
        aria-live="polite"
        className="mt-3 min-h-5 px-1 text-xs text-text-secondary"
      >
        {message ? (
          <span className="text-warning">{message}</span>
        ) : mazeIsComplete(level, state) ? (
          <span className="text-success">Every tile painted.</span>
        ) : (
          <span>
            Painted {paintedCount} of {floorCount} tiles.
          </span>
        )}
      </div>
    </div>
  );

  const side = (
    <Card>
      <CardHeader>
        <CardTitle>Run</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ProgressBar
          value={paintedCount}
          max={floorCount}
          label="Maze painted"
          barClassName="bg-cyan"
        />
        <dl className="mt-4 grid grid-cols-2 gap-2">
          {[
            { label: "Painted", value: `${paintedCount}/${floorCount}` },
            { label: "Moves", value: `${moves} / ${level.par}` },
            { label: "Time", value: formatDuration(elapsed) },
            { label: "Best", value: formatScore(displayBest) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-md border border-border px-3 py-2">
              <dt className="text-[0.6rem] uppercase tracking-wider text-text-muted">
                {stat.label}
              </dt>
              <dd className="mt-0.5 font-display text-lg tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-4 flex justify-center">
          <div className="grid grid-cols-3 grid-rows-2 gap-1.5">
            {DIRECTIONS.map(({ direction, icon: Icon, className }) => (
              <Button
                key={direction}
                variant="secondary"
                size="icon"
                aria-label={mazeDirectionLabel(direction)}
                onClick={() => move(direction)}
                disabled={won}
                className={className}
              >
                <Icon className="size-4" aria-hidden="true" />
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Button
            variant="secondary"
            onClick={undo}
            disabled={history.length === 0 || won}
            className="flex-1"
          >
            <Undo2 className="size-4" aria-hidden="true" />
            Undo
          </Button>
          <Button variant="ghost" onClick={resetBoard} className="flex-1">
            <RotateCcw className="size-4" aria-hidden="true" />
            Restart
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <GamePageShell
      header={
        <GameHeader
          game={GAME}
          level={level.number}
          levelCount={GAME.levelCount}
          tier={mazeTier(level.width)}
          nextUnlocked={nextUnlocked}
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
            completed={progress.games["maze-paint"].completed}
            onSelect={goToLevel}
            levelLabel={(value) =>
              `${MAZE_LEVELS[value - 1]?.width ?? 0}×${MAZE_LEVELS[value - 1]?.height ?? 0}`
            }
          />
          <ResultDialog
            open={won}
            onOpenChange={setWon}
            gameName={GAME.name}
            level={level.number}
            levelCount={GAME.levelCount}
            stats={[
              { label: "Your moves", value: formatScore(finalScore) },
              { label: "Best moves", value: formatScore(displayBest) },
              { label: "Par", value: String(level.par) },
              { label: "Tiles", value: String(floorCount) },
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
