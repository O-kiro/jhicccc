"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin reading-progress bar pinned to the very top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="bg-blue-gradient fixed inset-x-0 top-0 z-[55] h-1 origin-left"
    />
  );
}
