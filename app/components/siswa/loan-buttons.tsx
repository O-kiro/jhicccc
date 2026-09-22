"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";

async function kirim(url: string, body?: unknown): Promise<string | null> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  if (res.ok) return null;
  const data = await res.json().catch(() => null);
  // 422 dari Sirkulasi membawa alasan yang bisa dibaca siswa (kuota, dsb.).
  const pertama = data?.errors && Object.values(data.errors as Record<string, string[]>)[0];
  return (Array.isArray(pertama) ? pertama[0] : null) ?? data?.message ?? "Permintaan gagal.";
}

/** Tombol pinjam dengan pilihan lama pinjam. */
export function BorrowButton({
  bookId,
  borrowed,
  durations,
  full,
}: {
  bookId: number;
  borrowed: boolean;
  durations: number[];
  /** Kuota sudah penuh — tombol dimatikan dengan alasannya. */
  full: boolean;
}) {
  const [hari, setHari] = useState(durations.includes(14) ? 14 : durations[0]);
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const router = useRouter();

  if (borrowed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft px-3 py-1.5 text-xs font-semibold text-teal">
        <Icon name="check" className="h-3.5 w-3.5" />
        Sedang dipinjam
      </span>
    );
  }

  async function pinjam() {
    setSibuk(true);
    setGalat(null);
    const g = await kirim(`/api/perpustakaan/pinjam/${bookId}`, { days: hari }).catch(() => "Server tidak dapat dihubungi.");
    setSibuk(false);
    if (g) setGalat(g);
    else router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={hari}
          onChange={(e) => setHari(Number(e.target.value))}
          disabled={full || sibuk}
          aria-label="Lama pinjam"
          className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink"
        >
          {durations.map((d) => (
            <option key={d} value={d}>
              {d} hari
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={pinjam}
          disabled={full || sibuk}
          title={full ? "Kuota pinjaman sudah penuh" : undefined}
          className="btn-sheen bg-blue-gradient press inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
        >
          <Icon name="bookmark" className="h-3.5 w-3.5" />
          {sibuk ? "Memproses…" : full ? "Kuota penuh" : "Pinjam"}
        </button>
      </div>
      {galat && <p className="mt-1.5 text-xs font-semibold text-gold-strong">{galat}</p>}
    </div>
  );
}

/** Tombol kembalikan untuk pinjaman milik sendiri. */
export function ReturnButton({ loanId, title, className }: { loanId: number; title: string; className?: string }) {
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const router = useRouter();

  async function kembalikan() {
    if (!window.confirm(`Kembalikan "${title}"?`)) return;
    setSibuk(true);
    setGalat(null);
    const g = await kirim(`/api/perpustakaan/kembalikan/${loanId}`).catch(() => "Server tidak dapat dihubungi.");
    setSibuk(false);
    if (g) setGalat(g);
    else router.refresh();
  }

  return (
    <span className={cn("inline-flex flex-col items-end", className)}>
      <button
        type="button"
        onClick={kembalikan}
        disabled={sibuk}
        className="press inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-teal/40 hover:text-teal disabled:opacity-50"
      >
        <Icon name="check" className="h-3 w-3" />
        {sibuk ? "…" : "Kembalikan"}
      </button>
      {galat && <span className="mt-1 text-[11px] font-semibold text-gold-strong">{galat}</span>}
    </span>
  );
}
