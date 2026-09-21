"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";
import type { ApiForum } from "@/lib/api";

/** Batas ini sama dengan aturan validasi di Laravel. */
const JUDUL_MIN = 10;
const ISI_MIN = 20;

/**
 * Tombol dan dialog untuk membuka topik diskusi baru.
 *
 * Validasi tetap dikerjakan server; yang di sini hanya agar siswa tidak
 * menunggu satu putaran jaringan untuk tahu tulisannya masih terlalu pendek.
 */
export function NewThread({ categories }: { categories: ApiForum["categories"] }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categoryId, setCategoryId] = useState(() => categories[0]?.id ?? 0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const router = useRouter();

  const valid = title.trim().length >= JUDUL_MIN && body.trim().length >= ISI_MIN;

  function close() {
    setOpen(false);
    setError(null);
  }

  async function submit() {
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/forum/topik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          forum_category_id: categoryId,
          title: title.trim(),
          body: body.trim(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // 422 dari Laravel membawa pesan per kolom; ambil yang pertama.
        const firstField = data?.errors && Object.values(data.errors)[0];
        const detail = Array.isArray(firstField) ? firstField[0] : null;
        throw new Error(detail ?? data?.message ?? "Topik gagal dikirim.");
      }

      setTitle("");
      setBody("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Topik gagal dikirim.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={categories.length === 0}
        className="btn-sheen bg-blue-gradient press group inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
      >
        <Icon name="plus" className="h-4 w-4" />
        Mulai Topik Baru
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/50 p-5 backdrop-blur-sm"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="judul-topik-baru"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-lg rounded-card border border-line bg-surface p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <h2
                  id="judul-topik-baru"
                  className="font-display text-xl font-extrabold text-ink"
                >
                  Mulai Topik Baru
                </h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Tutup"
                  className="press grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:text-ink"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>

              <label className="mt-6 block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Kategori
                </span>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-blue"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Judul
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={150}
                  placeholder="Tulis judul yang menjelaskan isi diskusi"
                  className="mt-1.5 w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-ink outline-none placeholder:text-muted/70 focus:border-blue"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  Isi
                </span>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={5000}
                  rows={5}
                  placeholder="Jelaskan pertanyaan atau gagasanmu"
                  className="mt-1.5 w-full resize-y rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-muted/70 focus:border-blue"
                />
              </label>

              <p className="mt-2 text-[11px] text-muted">
                Judul minimal {JUDUL_MIN} karakter, isi minimal {ISI_MIN} karakter.
              </p>

              {error && (
                <p role="alert" className="mt-3 text-sm font-semibold text-gold-strong">
                  {error}
                </p>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={close}
                  disabled={sending}
                  className="press inline-flex flex-1 items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-40"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={!valid || sending}
                  className={cn(
                    "btn-sheen bg-blue-gradient press inline-flex flex-1 items-center justify-center gap-2",
                    "rounded-full px-5 py-3 text-sm font-semibold text-white",
                    "disabled:pointer-events-none disabled:opacity-50",
                  )}
                >
                  {sending ? "Mengirim…" : "Kirim Topik"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
