"use client";

import { motion } from "framer-motion";
import { Music2, Pause, Play, SkipForward, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { NAAT_TRACKS } from "@/lib/naats";

export function NaatPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const track = NAAT_TRACKS[index]!;

  const playAt = useCallback((nextIndex: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const safeIndex = nextIndex % NAAT_TRACKS.length;
    setIndex(safeIndex);
    audio.src = NAAT_TRACKS[safeIndex]!.src;
    audio.currentTime = 0;
    void audio.play().then(
      () => {
        setPlaying(true);
        setStarted(true);
      },
      () => setPlaying(false),
    );
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => playAt(index + 1);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [index, playAt]);

  useEffect(() => {
    if (started) return;
    const startOnce = () => playAt(0);
    window.addEventListener("pointerdown", startOnce, { once: true });
    window.addEventListener("keydown", startOnce, { once: true });
    return () => {
      window.removeEventListener("pointerdown", startOnce);
      window.removeEventListener("keydown", startOnce);
    };
  }, [playAt, started]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    if (!audio.src) {
      playAt(index);
      return;
    }
    void audio.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute("src");
    audio.load();
    setPlaying(false);
    setStarted(true);
    setIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-lg border border-border bg-bg-elevated/95 px-3 py-2 shadow-2xl backdrop-blur sm:left-auto sm:right-4 sm:translate-x-0"
    >
      <audio ref={audioRef} preload="none" />
      <div className="flex items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-maze-soft text-maze">
          <Music2 className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.7rem] font-semibold text-text">
            {started ? track.title : "Naat queue armed"}
          </p>
          <p className="truncate text-[0.62rem] text-text-muted">
            {started ? `${track.artist} · ${index + 1}/${NAAT_TRACKS.length}` : "Tap anywhere to start"}
          </p>
        </div>
        <button
          type="button"
          onClick={toggle}
          className="grid size-9 place-items-center rounded-md bg-surface text-text transition hover:bg-surface-hover"
          aria-label={playing ? "Pause naat" : "Play naat"}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </button>
        <button
          type="button"
          onClick={() => playAt(index + 1)}
          className="hidden size-9 place-items-center rounded-md border border-border text-text-secondary transition hover:text-text sm:grid"
          aria-label="Next naat"
          title="Next naat"
        >
          <SkipForward className="size-4" />
        </button>
        <button
          type="button"
          onClick={stop}
          className="grid size-9 place-items-center rounded-md border border-danger/40 text-danger transition hover:bg-danger/10"
          aria-label="Stop naat"
          title="Stop naat"
        >
          <Square className="size-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
