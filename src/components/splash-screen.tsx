"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useCallback, useState } from "react";

import { ShatterText } from "@/components/shatter-text";
import { YgMark } from "@/components/yg-mark";

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
    const timer = window.setTimeout(dismiss, reduceMotion ? 900 : 3200);
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
              className="mb-4"
            >
              <YgMark className="size-12 text-text" />
            </motion.div>

            {reduceMotion ? (
              <h1 className="text-center font-display text-3xl font-bold tracking-widest text-text sm:text-5xl">
                Yasir&apos;s Play-Box
              </h1>
            ) : (
              <ShatterText autoplay onShatter={dismiss} />
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.6 }}
              className="mt-2 text-center font-display text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-text-muted"
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
