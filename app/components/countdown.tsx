"use client";

import { useEffect, useState } from "react";

type TimeLeft = { days: number; hours: number; mins: number; secs: number };

function timeLeft(target: number): TimeLeft {
  let d = Math.max(0, target - Date.now());
  const days = Math.floor(d / 86_400_000);
  d -= days * 86_400_000;
  const hours = Math.floor(d / 3_600_000);
  d -= hours * 3_600_000;
  const mins = Math.floor(d / 60_000);
  d -= mins * 60_000;
  const secs = Math.floor(d / 1000);
  return { days, hours, mins, secs };
}

export function Countdown({ deadlineISO }: { deadlineISO: string }) {
  const target = new Date(deadlineISO).getTime();
  // null until mounted to avoid SSR/client time mismatch
  const [t, setT] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setT(timeLeft(target));
    const id = setInterval(() => setT(timeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: { label: string; value?: number }[] = [
    { label: "Hari", value: t?.days },
    { label: "Jam", value: t?.hours },
    { label: "Menit", value: t?.mins },
    { label: "Detik", value: t?.secs },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
      {units.map((u) => (
        <div key={u.label} className="rounded-2xl bg-white/10 px-2 py-4 text-center backdrop-blur">
          <div className="font-display text-3xl font-extrabold tabular-nums sm:text-4xl">
            {u.value === undefined ? "––" : String(u.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-wide text-on-dark/70">{u.label}</div>
        </div>
      ))}
    </div>
  );
}
