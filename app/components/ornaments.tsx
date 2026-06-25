"use client";

import { useId } from "react";

/**
 * Faint tiling of the Islamic eight-pointed star (two overlapping squares).
 * Subtle texture only — color comes from `currentColor`; control with text-* + opacity.
 */
export function GeoTexture({
  className = "",
  scale = 72,
}: {
  className?: string;
  scale?: number;
}) {
  const raw = useId();
  const id = "tex" + raw.replace(/[^a-zA-Z0-9]/g, "");
  const a = scale * 0.28;
  const s = scale * 0.44;
  const c = scale / 2;
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} width={scale} height={scale} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <rect x={a} y={a} width={s} height={s} />
            <rect x={a} y={a} width={s} height={s} transform={`rotate(45 ${c} ${c})`} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
