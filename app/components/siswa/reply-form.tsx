"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";

/** Batas ini sama dengan aturan validasi di Laravel. */
const ISI_MIN = 2;

export function ReplyForm({ threadId }: { threadId: number }) {
  const [body, setBody] = useState("");
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
        body: JSON.stringify({ body: body.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const firstField = data?.errors && Object.values(data.errors)[0];
        const detail = Array.isArray(firstField) ? firstField[0] : null;
        throw new Error(detail ?? data?.message ?? "Balasan gagal dikirim.");
      }

      setBody("");
      // Halaman dirender server, jadi balasan baru ikut terbawa saat disegarkan.
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Balasan gagal dikirim.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <label htmlFor="balasan" className="sr-only">
        Tulis balasan
      </label>
      <textarea
        id="balasan"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={5000}
        rows={4}
        placeholder="Tulis balasanmu…"
        className="w-full resize-y rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm leading-relaxed text-ink outline-none placeholder:text-muted/70 focus:border-blue"
      />

      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-gold-strong">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-[11px] text-muted">Balasan tampil dengan namamu.</p>
        <button
          type="submit"
          disabled={!valid || sending}
          className="btn-sheen bg-blue-gradient press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
        >
          {sending ? "Mengirim…" : "Kirim Balasan"}
          {!sending && <Icon name="arrow" className="h-4 w-4" />}
        </button>
      </div>
    </form>
  );
}
