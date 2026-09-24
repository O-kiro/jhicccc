"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { formatDate } from "@/lib/format";
import type { ApiPpdbBerkas } from "@/lib/api-ppdb";

const WARNA = {
  menunggu: "bg-gold-soft text-gold-strong",
  diterima: "bg-teal-soft text-teal",
  ditolak: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
} as const;

/**
 * Daftar berkas pendaftaran beserta unggahannya.
 *
 * Satu jenis berkas satu baris: mengunggah ulang mengganti berkas lama dan
 * mengembalikan statusnya ke "menunggu verifikasi", karena panitia harus
 * memeriksa yang baru.
 */
export default function DokumenForm({ data }: { data: ApiPpdbBerkas }) {
  const router = useRouter();
  const [sibuk, setSibuk] = useState<string | null>(null);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const berkasRef = useRef<Record<string, HTMLInputElement | null>>({});

  const maksMb = Math.round(data.max_file_kb / 1024);

  async function unggah(jenis: string, file: File) {
    setSibuk(jenis);
    setGalat((g) => ({ ...g, [jenis]: "" }));

    const form = new FormData();
    form.set("jenis", jenis);
    form.set("file", file);

    try {
      const res = await fetch("/api/ppdb/berkas", { method: "POST", body: form });
      const isi = await res.json().catch(() => null);

      if (!res.ok) {
        const pesan =
          (Array.isArray(isi?.errors?.file) ? isi.errors.file[0] : null) ??
          isi?.message ??
          "Berkas gagal diunggah.";
        setGalat((g) => ({ ...g, [jenis]: pesan }));
        return;
      }

      router.refresh();
    } catch {
      setGalat((g) => ({ ...g, [jenis]: "Server tidak dapat dihubungi." }));
    } finally {
      setSibuk(null);
      // Input dikosongkan supaya memilih berkas yang sama lagi tetap memicu
      // onChange.
      const input = berkasRef.current[jenis];
      if (input) input.value = "";
    }
  }

  async function hapus(jenis: string, id: number, label: string) {
    if (!window.confirm(`Hapus berkas "${label}"?`)) return;

    setSibuk(jenis);
    try {
      const res = await fetch(`/api/ppdb/berkas/${id}`, { method: "DELETE" });
      const isi = await res.json().catch(() => null);

      if (!res.ok) {
        setGalat((g) => ({ ...g, [jenis]: isi?.message ?? "Berkas gagal dihapus." }));
        return;
      }

      router.refresh();
    } finally {
      setSibuk(null);
    }
  }

  async function keluar() {
    await fetch("/api/ppdb/keluar", { method: "POST" }).catch(() => null);
    router.replace("/ppdb/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Identitas pendaftar */}
      <div className="rounded-card bg-surface p-6 shadow-card sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-blue">
              {data.registrant.registration_number} · Jalur {data.registrant.jalur}
            </p>
            <h2 className="mt-1 font-display text-xl font-extrabold text-ink">{data.registrant.name}</h2>
            {data.registrant.origin_school && (
              <p className="mt-0.5 text-sm text-muted">{data.registrant.origin_school}</p>
            )}
          </div>
          <button
            type="button"
            onClick={keluar}
            className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted transition-colors hover:border-ink/25 hover:text-ink"
          >
            Keluar
          </button>
        </div>

        {data.registrant.note && (
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-canvas p-3.5 text-xs leading-relaxed text-muted">
            <Icon name="ppid" className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" />
            {data.registrant.note}
          </p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Berkas wajib", nilai: `${data.summary.terunggah}/${data.summary.wajib}` },
            { label: "Diterima panitia", nilai: String(data.summary.diterima) },
            { label: "Perlu diganti", nilai: String(data.summary.ditolak) },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-canvas p-3.5">
              <p className="text-[11px] font-semibold text-muted">{s.label}</p>
              <p className="mt-1 font-display text-xl font-extrabold tabular-nums text-ink">{s.nilai}</p>
            </div>
          ))}
        </div>

        {data.summary.lengkap ? (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-teal-soft px-4 py-3 text-sm font-semibold text-teal">
            <Icon name="check" className="h-4 w-4" />
            Semua berkas wajib sudah terkirim. Panitia akan memverifikasi.
          </p>
        ) : (
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-gold-soft px-4 py-3 text-sm font-semibold text-gold-strong">
            <Icon name="clock" className="h-4 w-4" />
            {data.summary.kurang > 0
              ? `Masih kurang ${data.summary.kurang} berkas wajib.`
              : `${data.summary.ditolak} berkas perlu diganti.`}
          </p>
        )}
      </div>

      {/* Daftar berkas */}
      <ul className="mt-6 space-y-3">
        {data.documents.map((b) => {
          const doc = b.document;
          const memuat = sibuk === b.jenis;

          return (
            <li key={b.jenis} className="rounded-card bg-surface p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold leading-snug text-ink">
                    {b.label}
                    {b.wajib ? (
                      <span className="ml-1.5 text-xs font-semibold text-red-600 dark:text-red-400">wajib</span>
                    ) : (
                      <span className="ml-1.5 text-xs font-semibold text-muted">opsional</span>
                    )}
                  </p>
                  {doc ? (
                    <p className="mt-1 text-xs text-muted">
                      {doc.original_name} · {doc.size_kb} KB
                      {doc.uploaded_on ? ` · ${formatDate(doc.uploaded_on)}` : ""}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-muted">Belum diunggah · PDF, maksimal {maksMb} MB</p>
                  )}
                </div>

                {doc && (
                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${WARNA[doc.status]}`}>
                    {doc.status_label}
                  </span>
                )}
              </div>

              {doc?.status === "ditolak" && doc.note && (
                <p className="mt-3 rounded-xl bg-red-50 px-3.5 py-2.5 text-xs leading-relaxed text-red-700 dark:bg-red-950/40 dark:text-red-300">
                  Catatan panitia: {doc.note}
                </p>
              )}

              {galat[b.jenis] && (
                <p role="alert" className="mt-3 text-xs font-semibold text-red-600 dark:text-red-400">
                  {galat[b.jenis]}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    memuat
                      ? "pointer-events-none bg-canvas text-muted"
                      : "bg-blue-gradient text-white hover:-translate-y-0.5"
                  }`}
                >
                  <Icon name="download" className="h-3.5 w-3.5" />
                  {memuat ? "Mengunggah…" : doc ? "Ganti Berkas" : "Pilih Berkas PDF"}
                  <input
                    ref={(el) => {
                      berkasRef.current[b.jenis] = el;
                    }}
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    disabled={memuat}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) unggah(b.jenis, file);
                    }}
                  />
                </label>

                {doc && (
                  <>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted transition-colors hover:border-ink/25 hover:text-ink"
                    >
                      Lihat
                      <Icon name="external" className="h-3.5 w-3.5" />
                    </a>
                    {doc.status !== "diterima" && (
                      <button
                        type="button"
                        disabled={memuat}
                        onClick={() => hapus(b.jenis, doc.id, b.label)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-50"
                      >
                        Hapus
                      </button>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 text-center text-xs leading-relaxed text-muted">
        Berkas yang sudah diterima panitia tidak bisa dihapus. Bila ada yang perlu diperbaiki, hubungi
        panitia PPDB melalui halaman kontak.
      </p>
    </div>
  );
}
