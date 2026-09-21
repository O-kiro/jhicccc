"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";
import { Countdown } from "./ui";
import type { ApiExamSession, ApiStudent } from "@/lib/api";

type Status = "sudah" | "belum" | "ragu" | "aktif";

type Answer = { choice: string | null; flagged: boolean };

/** Hasil penilaian dari server; kunci jawaban tetap tidak ikut terkirim. */
type Result = {
  score: number;
  correct: number;
  total_questions: number;
};

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
 * Sesi CBT. Soal, sisa waktu, dan jawaban yang sudah tersimpan datang dari
 * /exam-session; tiap perubahan dikirim balik ke server supaya sesi bisa
 * dilanjutkan kalau halaman tertutup di tengah ujian.
 */
export function ExamRunner({
  session,
  student,
}: {
  session: ApiExamSession;
  student: ApiStudent;
}) {
  const { exam, questions } = session;

  // Mulai dari soal pertama yang belum terjawab, bukan selalu nomor 1.
  const [current, setCurrent] = useState(
    () => questions.find((q) => !session.answers[q.number]?.choice)?.number ?? 1,
  );

  const [answers, setAnswers] = useState<Record<number, Answer>>(() =>
    Object.fromEntries(
      questions.map((q) => [
        q.number,
        session.answers[q.number] ?? { choice: null, flagged: false },
      ]),
    ),
  );

  // Gagal simpan ditampilkan, tidak ditelan: kalau jaringan putus di tengah
  // ujian, siswa harus tahu jawabannya belum tercatat.
  const [saveError, setSaveError] = useState(false);

  // Mengakhiri ujian tidak bisa dibatalkan, jadi selalu lewat konfirmasi.
  const [stage, setStage] = useState<"ujian" | "konfirmasi" | "mengirim" | "selesai">("ujian");
  const [result, setResult] = useState<Result | null>(null);
  const [finishError, setFinishError] = useState<string | null>(null);
  const router = useRouter();

  const byNumber = useMemo(
    () => new Map(questions.map((q) => [q.number, q])),
    [questions],
  );

  /** Menulis perubahan ke state lalu meneruskannya ke server. */
  function save(number: number, next: Answer) {
    setAnswers((a) => ({ ...a, [number]: next }));

    const id = byNumber.get(number)?.id;
    if (id === undefined) return;

    fetch("/api/ujian/jawaban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: id, choice: next.choice, flagged: next.flagged }),
    })
      .then((r) => setSaveError(!r.ok))
      .catch(() => setSaveError(true));
  }

  /** Mengirim ujian dan menampilkan nilainya. */
  async function finish() {
    setStage("mengirim");
    setFinishError(null);

    try {
      const res = await fetch("/api/ujian/selesai", { method: "POST" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message ?? "Ujian gagal dikirim.");
      }

      setResult(data as Result);
      setStage("selesai");
      // Daftar Hasil Ujian di halaman sebelumnya kini basi.
      router.refresh();
    } catch (error) {
      setFinishError(error instanceof Error ? error.message : "Ujian gagal dikirim.");
      setStage("konfirmasi");
    }
  }

  const statusOf = (n: number): Status => {
    if (n === current) return "aktif";
    if (answers[n]?.flagged) return "ragu";
    return answers[n]?.choice ? "sudah" : "belum";
  };

  const answered = useMemo(
    () => Object.values(answers).filter((a) => a.choice && !a.flagged).length,
    [answers],
  );

  const question = byNumber.get(current);
  const isFlagged = answers[current]?.flagged ?? false;
  const selected = answers[current]?.choice ?? null;

  function toggleFlag() {
    save(current, { choice: selected, flagged: !isFlagged });
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Bar sesi */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3.5 sm:px-8">
          <div className="min-w-0">
            <p className="font-display text-sm font-extrabold leading-tight text-ink">
              {exam.subject}
            </p>
            <p className="truncate text-[11px] text-muted">{exam.title}</p>
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
                seconds={exam.remaining_seconds}
                className="font-display text-sm font-extrabold"
              />
            </div>
          </div>
        </div>
      </header>

      {saveError && (
        <p
          role="alert"
          className="mx-auto flex max-w-7xl items-center gap-2 px-5 pt-4 text-sm font-semibold text-gold-strong sm:px-8"
        >
          <Icon name="shield" className="h-4 w-4 shrink-0" />
          Jawaban terakhir belum tersimpan. Periksa koneksi, lalu pilih ulang.
        </p>
      )}

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[1.7fr_1fr] lg:items-start">
        {/* Soal */}
        <section className="rounded-card border border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-xl font-extrabold text-ink">Pertanyaan Ke-{current}</h1>
            <span className="rounded-full bg-blue-soft px-3 py-1 text-[11px] font-semibold text-blue">
              {question?.type}
            </span>
          </div>

          <p className="mt-6 text-pretty text-[15px] leading-relaxed text-ink">{question?.body}</p>

          <div role="radiogroup" aria-label="Pilihan jawaban" className="mt-7 space-y-3">
            {question?.options.map((opt) => {
              const picked = selected === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  role="radio"
                  aria-checked={picked}
                  onClick={() => save(current, { choice: opt.key, flagged: isFlagged })}
                  className={cn(
                    "press flex w-full items-center gap-4 rounded-xl border p-4 text-left",
                    "transition-[border-color,background-color,transform] duration-200 ease-snap",
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
              className="press inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-[border-color,background-color,transform] duration-200 ease-snap hover:border-ink/25 hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
            >
              <Icon name="chevron" className="h-4 w-4 rotate-90" />
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={toggleFlag}
              aria-pressed={isFlagged}
              className={cn(
                "press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold",
                "transition-[background-color,border-color,color,transform] duration-200 ease-snap",
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
              disabled={current === exam.total_questions}
              onClick={() => setCurrent((n) => Math.min(exam.total_questions, n + 1))}
              className="btn-sheen bg-blue-gradient press lift ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-40"
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
              {answered}/{exam.total_questions}
            </span>
          </div>

          <ul className="mt-5 grid grid-cols-8 gap-2">
            {questions.map(({ number: n }) => (
              <li key={n}>
                <button
                  type="button"
                  onClick={() => setCurrent(n)}
                  aria-label={`Soal nomor ${n}`}
                  aria-current={n === current ? "true" : undefined}
                  className={cn(
                    "press grid h-9 w-full place-items-center rounded-lg font-display text-xs font-extrabold tabular-nums",
                    // Navigator ini diklik cepat dan berulang; batasi properti
                    // yang ditransisikan agar tiap klik tidak memicu kerja ekstra.
                    "transition-[background-color,color,transform] duration-150 ease-snap",
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
            <button
              type="button"
              onClick={() => setStage("konfirmasi")}
              className="btn-sheen press inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-strong"
            >
              <Icon name="check" className="h-4 w-4" />
              Selesai Ujian
            </button>
          </motion.div>

          <p className="mt-4 flex items-start gap-2 rounded-xl bg-surface-2 p-3 text-[11px] leading-relaxed text-muted">
            <Icon name="shield" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal" />
            Jangan berpindah tab atau membuka aplikasi lain selama sesi berlangsung.
          </p>
        </aside>
      </div>

      <AnimatePresence>
        {stage !== "ujian" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-5 backdrop-blur-sm"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="judul-dialog-ujian"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-md rounded-card border border-line bg-surface p-7"
            >
              {stage === "selesai" && result ? (
                <>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-teal-soft text-teal">
                    <Icon name="check" className="h-7 w-7" />
                  </span>
                  <h2
                    id="judul-dialog-ujian"
                    className="mt-5 text-center font-display text-xl font-extrabold text-ink"
                  >
                    Ujian Terkirim
                  </h2>
                  <p className="mt-6 text-center font-display text-5xl font-extrabold tabular-nums text-teal">
                    {result.score}
                  </p>
                  <p className="mt-2 text-center text-sm text-muted">
                    {result.correct} benar dari {result.total_questions} soal
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push("/siswa/ujian")}
                    className="btn-sheen bg-blue-gradient press mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
                  >
                    Kembali ke Halaman Ujian
                    <Icon name="arrow" className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold-soft text-gold-strong">
                    <Icon name="flag" className="h-7 w-7" />
                  </span>
                  <h2
                    id="judul-dialog-ujian"
                    className="mt-5 text-center font-display text-xl font-extrabold text-ink"
                  >
                    Kirim Ujian Sekarang?
                  </h2>
                  <p className="mt-2 text-center text-sm leading-relaxed text-muted">
                    Setelah dikirim, jawaban tidak bisa diubah lagi.
                  </p>

                  <dl className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-line bg-surface-2 p-3.5 text-center">
                      <dt className="text-[11px] font-semibold text-muted">Terjawab</dt>
                      <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums text-ink">
                        {answered}
                      </dd>
                    </div>
                    <div className="rounded-xl border border-line bg-surface-2 p-3.5 text-center">
                      <dt className="text-[11px] font-semibold text-muted">Belum / ragu</dt>
                      <dd className="mt-1 font-display text-2xl font-extrabold tabular-nums text-gold-strong">
                        {exam.total_questions - answered}
                      </dd>
                    </div>
                  </dl>

                  {finishError && (
                    <p role="alert" className="mt-4 text-center text-sm font-semibold text-gold-strong">
                      {finishError}
                    </p>
                  )}

                  <div className="mt-7 flex gap-3">
                    <button
                      type="button"
                      disabled={stage === "mengirim"}
                      onClick={() => setStage("ujian")}
                      className="press inline-flex flex-1 items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
                    >
                      Periksa Lagi
                    </button>
                    <button
                      type="button"
                      disabled={stage === "mengirim"}
                      onClick={finish}
                      className="btn-sheen press inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-strong disabled:pointer-events-none disabled:opacity-60"
                    >
                      {stage === "mengirim" ? "Mengirim…" : "Kirim"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
