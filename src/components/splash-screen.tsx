"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import SplitFlapText from "@/components/SplitFlapText";

const STORAGE_KEY = "yg-splash-seen";

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  const dismiss = useCallback(() => {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }, []);

  useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
    const timer = window.setTimeout(dismiss, reduceMotion ? 1200 : 4200);
    return () => window.clearTimeout(timer);
  }, [dismiss, reduceMotion]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-bg px-4"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.35 }}
        >
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-5 top-5 rounded-md border border-border px-3 py-1.5 font-display text-[0.65rem] font-bold tracking-widest text-text-muted transition hover:text-text"
          >
            Skip
          </button>

          <div className="flex w-full max-w-4xl flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.45 }}
              className="mb-5 rounded-md bg-white p-1"
            >
              <Image
                src="/yg.png"
                alt="YG — Yasir Games"
                width={100}
                height={67}
                className="h-16 w-auto sm:h-20"
                priority
              />
            </motion.div>

            <SplitFlapText
              words={["YASIR READY", "SYNC ONLINE", "SIGNAL LIVE"]}
              flipDuration={0.1}
              stagger={0.05}
              cycleDelay={1600}
              charset="alphanumeric"
              flipsPerChar={6}
              order="left"
              align="left"
              tileStyle="board"
              tileColor="#151922"
              textColor="#f5f2ea"
              glare={0}
              depth={0.5}
              tileRadius={8}
              gap={4}
              fontSize="clamp(20px, 6vw, 44px)"
              loop
              padTo={12}
              intro
              className="justify-center"
              aria-label="Yasir Play-Box splash animation"
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.6 }}
              className="mt-4 text-center font-display text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-text-muted"
            >
              A personal arcade by Yasir
            </motion.p>
            <p className="mt-2 text-center text-[0.65rem] text-hot">
              Move the cursor. Break things. We dare you.
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
