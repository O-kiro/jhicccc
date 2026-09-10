"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";
import { Countdown } from "./ui";
import { examSession, questionStates, student } from "@/lib/siswa";

type Status = "sudah" | "belum" | "ragu" | "aktif";

const LEGEND: { status: Exclude<Status, "aktif"> | "aktif"; label: string; dot: string }[] = [
  { status: "sudah", label: "Sudah", dot: "bg-teal" },
  { status: "belum", label: "Belum", dot: "bg-line" },
  { status: "ragu", label: "Ragu-ragu", dot: "bg-gold" },
  { status: "aktif", label: "Aktif", dot: "bg-blue" },
];

const BUBBLE: Record<Status, string> = {
  sudah: "bg-teal-soft text-teal hover:brightness-95",
  belum: "border border-line bg-surface text-muted hover:border-ink/25",
  ragu: "bg-gold-soft text-gold-strong hover:brightness-95",
  aktif: "bg-blue-gradient text-white ring-2 ring-blue/30",
};

/**
 * Prototipe sesi CBT. Isi soal tetap memakai contoh dari design-siswa.md;
 * navigator, penandaan ragu-ragu, dan pemilihan jawaban sudah berfungsi.
 */
export function ExamRunner() {
  const [current, setCurrent] = useState(examSession.currentNumber);

  // Kondisi awal diturunkan dari data statis → markup server & klien sama.
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const seed: Record<number, string> = {};
    questionStates.forEach((s, i) => {
      if (s === "sudah") seed[i + 1] = "A";
    });
    seed[examSession.currentNumber] = examSession.selected;
    return seed;
  });
  const [flagged, setFlagged] = useState<number[]>(() =>
    questionStates.flatMap((s, i) => (s === "ragu" ? [i + 1] : [])),
  );

  const statusOf = (n: number): Status => {
    if (n === current) return "aktif";
    if (flagged.includes(n)) return "ragu";
    return answers[n] ? "sudah" : "belum";
  };

  const answered = useMemo(
    () => Object.keys(answers).filter((n) => !flagged.includes(Number(n))).length,
    [answers, flagged],
  );

  function toggleFlag() {
    setFlagged((f) => (f.includes(current) ? f.filter((n) => n !== current) : [...f, current]));
  }

  const isFlagged = flagged.includes(current);
  const selected = answers[current];

  return (
    <div className="min-h-screen bg-canvas">
      {/* Bar sesi */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3.5 sm:px-8">
          <div className="min-w-0">
            <p className="font-display text-sm font-extrabold leading-tight text-ink">
              {examSession.subject}
            </p>
            <p className="truncate text-[11px] text-muted">{examSession.title}</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-xs font-semibold text-ink">{student.name}</p>
              <p className="text-[11px] tabular-nums text-muted">NISN: {student.nisn}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gold-soft px-4 py-2 text-gold-strong">
              <Icon name="clock" className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.06em]">Sisa</span>
              <Countdown
                seconds={examSession.remainingSeconds}
                className="font-display text-sm font-extrabold"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1.7fr_1fr] lg:items-start">
        {/* Soal */}
        <section className="rounded-card border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-xl font-extrabold text-ink">Pertanyaan Ke-{current}</h1>
            <span className="rounded-full bg-blue-soft px-3 py-1 text-[11px] font-semibold text-blue">
              {examSession.type}
            </span>
          </div>

          <p className="mt-6 text-pretty text-[15px] leading-relaxed text-ink">
            {examSession.question}
          </p>

          <div role="radiogroup" aria-label="Pilihan jawaban" className="mt-7 space-y-3">
            {examSession.options.map((opt) => {
              const picked = selected === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="radio"
                  aria-checked={picked}
                  onClick={() => setAnswers((a) => ({ ...a, [current]: opt.key }))}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors",
                    picked
                      ? "border-blue bg-blue-soft/50"
                      : "border-line bg-surface-2 hover:border-ink/20",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-8 w-8 shrink-0 place-items-center rounded-lg font-display text-sm font-extrabold transition-colors",
                      picked ? "bg-blue text-white" : "bg-surface text-muted",
                    )}
                  >
                    {opt.key}
                  </span>
                  <span className={cn("text-sm", picked ? "font-semibold text-ink" : "text-muted")}>
                    {opt.text}
                  </span>
                  {picked && <Icon name="check" className="ml-auto h-4 w-4 shrink-0 text-blue" />}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <button
              type="button"
              disabled={current === 1}
              onClick={() => setCurrent((n) => Math.max(1, n - 1))}
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/25 hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
            >
              <Icon name="chevron" className="h-4 w-4 rotate-90" />
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={toggleFlag}
              aria-pressed={isFlagged}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
                isFlagged
                  ? "bg-gold text-white hover:bg-gold-strong"
                  : "border border-line text-muted hover:border-gold/40 hover:text-gold-strong",
              )}
            >
              <Icon name="flag" className="h-4 w-4" />
              Ragu-ragu
            </button>
            <button
              type="button"
              disabled={current === examSession.totalQuestions}
              onClick={() => setCurrent((n) => Math.min(examSession.totalQuestions, n + 1))}
              className="btn-sheen bg-blue-gradient ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40"
            >
              Selanjutnya
              <Icon name="chevron" className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </section>

        {/* Navigator */}
        <aside className="rounded-card border border-line bg-surface p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-extrabold text-ink">Navigasi Soal</h2>
            <span className="text-[11px] font-semibold tabular-nums text-muted">
              {answered}/{examSession.totalQuestions}
            </span>
          </div>

          <ul className="mt-5 grid grid-cols-8 gap-2">
            {Array.from({ length: examSession.totalQuestions }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => setCurrent(n)}
                  aria-label={`Soal nomor ${n}`}
                  aria-current={n === current ? "true" : undefined}
                  className={cn(
                    "grid h-9 w-full place-items-center rounded-lg font-display text-xs font-extrabold tabular-nums transition-all",
                    BUBBLE[statusOf(n)],
                  )}
                >
                  {n}
                </button>
              </li>
            ))}
          </ul>

          <ul className="mt-6 grid grid-cols-2 gap-2.5 border-t border-line pt-5">
            {LEGEND.map((l) => (
              <li key={l.status} className="flex items-center gap-2 text-[11px] font-semibold text-muted">
                <span className={cn("h-2.5 w-2.5 rounded-full", l.dot)} />
                {l.label}
              </li>
            ))}
          </ul>

          <motion.div whileHover={{ y: -2 }} className="mt-6">
            <Link
              href="/siswa/ujian"
              className="btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-strong"
            >
              <Icon name="check" className="h-4 w-4" />
              Selesai Ujian
            </Link>
          </motion.div>

          <p className="mt-4 flex items-start gap-2 rounded-xl bg-surface-2 p-3 text-[11px] leading-relaxed text-muted">
            <Icon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
            Jangan berpindah tab atau membuka aplikasi lain selama sesi berlangsung.
          </p>
        </aside>
      </div>
    </div>
  );
}
