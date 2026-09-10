"use client";

import { useState } from "react";
import { Icon } from "@/app/components/icons";

const JALUR = ["Prestasi", "Reguler 1", "Reguler 2"] as const;
type Jalur = (typeof JALUR)[number];

const BERKAS = [
  "Fotokopi Ijazah atau SKL (SMP / MTs)",
  "Fotokopi Raport Semester 1 - 5",
  "Fotokopi Kartu Keluarga",
  "Fotokopi Akta Kelahiran",
  "Sertifikat Prestasi",
  "Pas Foto",
];

export default function DokumenForm() {
  const [jalur, setJalur] = useState<Jalur>("Prestasi");
  const [sent, setSent] = useState(false);
  const [files, setFiles] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-2xl rounded-card bg-surface p-10 text-center shadow-card">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal-soft text-teal">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold text-ink">Berkas Terkirim</h3>
        <p className="mt-2 text-sm text-muted">Dokumen jalur {jalur} berhasil diunggah. Panitia akan melakukan verifikasi.</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 text-sm font-semibold text-blue hover:underline"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-card bg-surface p-6 shadow-card sm:p-8">
      {/* Tab jalur */}
      <div className="flex gap-2 rounded-full bg-canvas p-1">
        {JALUR.map((j) => (
          <button
            key={j}
            type="button"
            onClick={() => setJalur(j)}
            aria-pressed={jalur === j}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
              jalur === j
                ? "bg-blue-gradient text-white shadow-card"
                : "text-muted hover:text-blue"
            }`}
          >
            {j}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <h3 className="font-display font-bold text-ink">Berkas yang diunggah (semua wajib format .PDF):</h3>
        <ol className="space-y-3">
          {BERKAS.map((b, i) => (
            <li key={b} className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 px-4 py-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-soft text-xs font-bold text-blue">
                {i + 1}
              </span>
              <span className="flex-1 text-sm text-ink">{b}</span>
              <label className="shrink-0 cursor-pointer rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold text-ink hover:border-blue hover:text-blue">
                Pilih file
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]?.name;
                    if (f) setFiles((prev) => ({ ...prev, [b]: f }));
                  }}
                />
              </label>
              {files[b] && <span className="hidden text-xs text-teal sm:block">{files[b]}</span>}
            </li>
          ))}
        </ol>
        {Object.keys(files).length > 0 && (
          <p className="text-xs text-muted">{Object.keys(files).length} berkas dipilih (format .PDF).</p>
        )}

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5"
        >
          Kirim
          <Icon name="arrow" className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
