"use client";

import { MotionConfig } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  // reducedMotion="user" makes every motion component respect the OS setting.
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
