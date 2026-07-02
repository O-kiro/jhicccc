"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMounted(true);
      setDark(document.documentElement.classList.contains("dark"));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("makoba-theme", next ? "dark" : "light");
    } catch {}
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      className={`grid h-10 w-10 place-items-center rounded-full border border-line bg-surface/70 text-ink transition-colors hover:bg-teal-soft hover:text-teal ${className}`}
    >
      <span className="relative grid h-5 w-5 place-items-center">
        {mounted ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={dark ? "sun" : "moon"}
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 grid place-items-center"
            >
              <Icon name={dark ? "sun" : "moon"} className="h-5 w-5" />
            </motion.span>
          </AnimatePresence>
        ) : (
          <span className="h-5 w-5" />
        )}
      </span>
    </button>
  );
}
