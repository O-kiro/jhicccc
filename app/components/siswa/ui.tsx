"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Icon } from "@/app/components/icons";
import type { IconName } from "@/lib/content";
import { cn, toneBar, toneSoft, toneText } from "@/lib/styles";

/** Kartu dasar portal — surface + hairline, senada dengan kartu situs publik. */
export function Panel({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag className={cn("rounded-card border border-line bg-surface p-5 sm:p-6", className)}>
      {children}
    </Tag>
  );
}

export function PanelTitle({
  children,
  icon,
  action,
}: {
  children: ReactNode;
  icon?: IconName;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
        {icon && <Icon name={icon} className="h-[18px] w-[18px] text-teal" />}
        {children}
      </h2>
      {action}
    </div>
  );
}

/** Judul halaman portal (bukan .display raksasa milik situs publik). */
export function PageHead({
  eyebrow,
  title,
  desc,
  action,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className="mt-2 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink">
          {title}
        </h1>
        {desc && <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  note,
  icon,
  tone,
}: {
  label: string;
  value: string;
  note?: string;
  icon: IconName;
  tone: "teal" | "blue" | "gold";
}) {
  return (
    <Panel className="card-glow transition-shadow hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-extrabold tabular-nums text-ink">{value}</p>
          {note && <p className={cn("mt-1 text-xs font-semibold", toneText[tone])}>{note}</p>}
        </div>
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", toneSoft[tone])}>
          <Icon name={icon} className="h-5 w-5" />
        </span>
      </div>
    </Panel>
  );
}

export function Progress({
  value,
  tone = "teal",
  className,
  label,
}: {
  value: number;
  tone?: "teal" | "blue" | "gold";
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-line", className)}
    >
      <div className={cn("h-full rounded-full transition-[width] duration-700", toneBar[tone])} style={{ width: `${value}%` }} />
    </div>
  );
}

/** "01:42:03" dari jumlah detik — dipakai countdown ujian & sisa waktu CBT. */
export function formatClock(total: number): string {
  const safe = Math.max(0, total);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * Hitung mundur. Render pertama memakai `seconds` apa adanya supaya markup
 * server & klien identik; detik baru berjalan setelah hydrate.
 */
export function Countdown({ seconds, className }: { seconds: number; className?: string }) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    // Hitung dari deadline, bukan dekrementasi, supaya tidak melenceng
    // saat tab di-throttle browser.
    const deadline = Date.now() + seconds * 1000;
    const id = setInterval(() => {
      setLeft(Math.max(0, Math.round((deadline - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, [seconds]);

  return (
    <time className={cn("tabular-nums", className)} dateTime={`PT${Math.max(0, left)}S`}>
      {formatClock(left)}
    </time>
  );
}

export function Pill({
  children,
  tone = "teal",
  className,
}: {
  children: ReactNode;
  tone?: "teal" | "blue" | "gold" | "muted";
  className?: string;
}) {
  const tones = {
    teal: "bg-teal-soft text-teal",
    blue: "bg-blue-soft text-blue",
    gold: "bg-gold-soft text-gold-strong",
    muted: "bg-surface-2 text-muted",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
