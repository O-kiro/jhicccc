"use client";

import { motion } from "motion/react";

// Re-mounts on every navigation → fades the incoming page in.
// Opacity-only (no transform) so fixed-position overlays like the gallery
// lightbox keep positioning against the viewport.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
