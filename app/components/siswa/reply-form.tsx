"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";

/** Batas ini sama dengan aturan validasi di Laravel. */
const ISI_MIN = 2;

/**
 * Formulir balasan. Tanpa parentId membalas topiknya; dengan parentId
 * membalas balasan tertentu dan tampil ringkas di bawahnya.
 */
export function ReplyForm({
  threadId,
  parentId,
  mention,
  onDone,
}: {
  threadId: number;
  parentId?: number;
  /** Nama yang dibalas; diawali ke isi supaya jelas siapa yang ditanggapi. */
  mention?: string;
  onDone?: () => void;
}) {
  const [body, setBody] = useState(mention ? `@${mention.replace(/^@/, "")} ` : "");
  const ringkas = parentId !== undefined;
  const areaRef = useRef<HTMLTextAreaElement>(null);
  // Unik per formulir: formulir utama dan bersarang bisa tampil bersamaan.
  const areaId = useId();

  // Formulir balasan-bersarang dibuka karena diklik, jadi langsung siap diketik.
  useEffect(() => {
    if (!ringkas) return;
    const el = areaRef.current;
    el?.focus();
    el?.setSelectionRange(el.value.length, el.value.length);
  }, [ringkas]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const valid = body.trim().length >= ISI_MIN;

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!valid || sending) return;

    setSending(true);
    setError(null);

    try {
      const res = await fetch(`/api/forum/topik/${threadId}/balas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim(), parent_id: parentId }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const firstField = data?.errors && Object.values(data.errors)[0];
        const detail = Array.isArray(firstField) ? firstField[0] : null;
        throw new Error(detail ?? data?.message ?? "Balasan gagal dikirim.");
      }

      setBody("");
      onDone?.();
      // Halaman dirender server, jadi balasan baru ikut terbawa saat disegarkan.
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Balasan gagal dikirim.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className={ringkas ? "mt-3" : "mt-6"}>
      <label htmlFor={areaId} className="sr-only">
        {ringkas ? `Balas ${mention ?? "balasan ini"}` : "Tulis balasan"}
      </label>
      <textarea
        id={areaId}
        ref={areaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={5000}
        rows={ringkas ? 2 : 4}
        placeholder={ringkas ? "Tulis tanggapan…" : "Tulis balasanmu…"}
        className="w-full resize-y rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-muted/70 focus:border-blue"
      />

      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-gold-strong">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-4">
        {ringkas ? (
          <button
            type="button"
            onClick={onDone}
            disabled={sending}
            className="press text-xs font-semibold text-muted transition-colors hover:text-ink disabled:opacity-40"
          >
            Batal
          </button>
        ) : (
          <p className="text-[11px] text-muted">Balasan tampil dengan namamu.</p>
        )}
        <button
          type="submit"
          disabled={!valid || sending}
          className={
            "btn-sheen bg-blue-gradient press inline-flex items-center gap-2 rounded-full font-semibold text-white disabled:pointer-events-none disabled:opacity-50 " +
            (ringkas ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm")
          }
        >
          {sending ? "Mengirim…" : ringkas ? "Balas" : "Kirim Balasan"}
          {!sending && <Icon name="arrow" className={ringkas ? "h-3.5 w-3.5" : "h-4 w-4"} />}
        </button>
      </div>
    </form>
  );
}
