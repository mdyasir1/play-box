"use client";

import { motion } from "framer-motion";
import { Music2, Square, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { NAAT_TRACKS } from "@/lib/naats";

let audioUnlocked = false;

export function NaatPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [stopped, setStopped] = useState(false);
  const track = NAAT_TRACKS[index]!;

  const playAt = useCallback((nextIndex: number) => {
    const audio = audioRef.current;
    if (!audio || !audioUnlocked) return;
    const safeIndex = nextIndex % NAAT_TRACKS.length;
    setIndex(safeIndex);
    setStopped(false);
    audio.src = NAAT_TRACKS[safeIndex]!.src;
    audio.currentTime = 0;
    audio.muted = false;
    void audio.play().then(
      () => {
        setPlaying(true);
        setMuted(false);
      },
      () => {
        setPlaying(false);
        setMuted(true);
      },
    );
  }, []);

  useEffect(() => {
    const unlock = () => {
      audioUnlocked = true;
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    if (!audioUnlocked) return;
    const audio = audioRef.current;
    playAt(0);
    return () => {
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    };
  }, [playAt]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => playAt(index + 1);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [index, playAt]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted || stopped || !audio.src) {
      playAt(index);
      return;
    }
    audio.muted = true;
    audio.pause();
    setPlaying(false);
    setMuted(true);
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.removeAttribute("src");
    audio.load();
    setPlaying(false);
    setStopped(true);
    setIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-3 right-3 z-50 flex items-center gap-1 rounded-full border border-border bg-bg-elevated/95 p-1 shadow-2xl backdrop-blur sm:bottom-4 sm:right-4 sm:gap-2 sm:p-2"
    >
      <audio ref={audioRef} preload="none" />
      <span className="hidden size-8 shrink-0 place-items-center rounded-full bg-maze-soft text-maze sm:grid sm:size-9">
        <Music2 className="size-4" aria-hidden="true" />
      </span>
      <div className="hidden min-w-0 max-w-[160px] sm:block">
        <p className="truncate text-[0.68rem] font-semibold text-text">
          {stopped ? "Naats stopped" : track.title}
        </p>
        <p className="truncate text-[0.6rem] text-text-secondary">
          {stopped
            ? "Your silence is loud"
            : playing
              ? `${index + 1}/${NAAT_TRACKS.length} · now playing`
              : `${index + 1}/${NAAT_TRACKS.length} · ${track.artist}`}
        </p>
      </div>
      <button
        type="button"
        onClick={toggleMute}
        className="grid size-8 shrink-0 place-items-center rounded-full border border-border text-text transition hover:border-border-strong hover:bg-surface-hover sm:size-9"
        aria-label={muted || stopped ? "Unmute naat" : "Mute naat"}
        title={muted || stopped ? "Unmute naat" : "Mute naat"}
      >
        {muted || stopped ? (
          <VolumeX className="size-4" />
        ) : (
          <Volume2 className="size-4" />
        )}
      </button>
      <button
        type="button"
        onClick={stop}
        className="grid size-8 shrink-0 place-items-center rounded-full border border-danger/40 text-danger transition hover:bg-danger/10 sm:size-9"
        aria-label="Stop naat"
        title="Stop naat"
      >
        <Square className="size-3.5" />
      </button>
    </motion.div>
  );
}
