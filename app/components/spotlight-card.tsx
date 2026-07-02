"use client";

import type { ReactNode } from "react";

/**
 * Wraps a card and paints a soft gold highlight that follows the cursor.
 * Cursor position is written to CSS vars (no React re-render); the overlay
 * sits on top at low opacity so content stays readable and clickable.
 */
export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <div className={`group relative ${className}`} onMouseMove={onMove}>
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-card opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--gold) 18%, transparent), transparent 62%)",
        }}
      />
    </div>
  );
}
