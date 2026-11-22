"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import { YgMark } from "@/components/yg-mark";

const STORAGE_KEY = "yg-splash-seen";
const TOP = "YASIR'S";
const BOTTOM = "PLAY-BOX";

const letter = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (window.sessionStorage.getItem(STORAGE_KEY)) return;
    setVisible(true);
    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
      setVisible(false);
    }, reduceMotion ? 700 : 2200);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const dismiss = () => {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.4 }}
        >
          <button
            type="button"
            onClick={dismiss}
            className="absolute right-5 top-5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-text-muted transition hover:text-text"
          >
            Skip
          </button>

          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.5 }}
            >
              <YgMark className="size-14" />
            </motion.div>

            <div className="flex flex-col items-center gap-1 text-center">
              <span className="sr-only">Yasir&apos;s Play-Box</span>
              <motion.div
                aria-hidden="true"
                className="flex font-display text-3xl tracking-[0.14em] text-text sm:text-4xl"
                variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
                initial="hidden"
                animate="visible"
              >
                {TOP.split("").map((character, index) => (
                  <motion.span key={`${character}-${index}`} variants={letter}>
                    {character}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div
                aria-hidden="true"
                className="flex font-display text-4xl tracking-[0.2em] text-accent sm:text-5xl"
                variants={{ visible: { transition: { staggerChildren: 0.045, delayChildren: 0.25 } } }}
                initial="hidden"
                animate="visible"
              >
                {BOTTOM.split("").map((character, index) => (
                  <motion.span key={`${character}-${index}`} variants={letter}>
                    {character}
                  </motion.span>
                ))}
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduceMotion ? 0 : 0.9 }}
                className="mt-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-text-muted"
              >
                A personal arcade by Yasir
              </motion.p>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
