"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border text-text-secondary transition hover:border-border-strong hover:text-text"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {mounted ? (
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -35, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.18 }}
        >
          {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </motion.span>
      ) : (
        <span className="size-4" />
      )}
    </button>
  );
}
