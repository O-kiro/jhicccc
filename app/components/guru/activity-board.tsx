"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, hariDari } from "@/lib/format";
import { Panel, PanelTitle, Pill } from "@/app/components/siswa/ui";
import type { ApiJurnalHarian } from "@/lib/api-guru";
import { kirim, kirimBerkas } from "./kirim";
import { Kolom, inputPortal } from "./modal";

/**
 * Jurnal harian: kegiatan di luar jam mengajar, boleh dilampiri bukti foto.
 * Formulirnya memakai FormData supaya berkasnya ikut terkirim.
 */
export function ActivityBoard({ data }: { data: ApiJurnalHarian }) {
  const router = useRouter();
  const id = useId();

  const [tanggal, setTanggal] = useState(data.today);
  const [kelas, setKelas] = useState("");
  const [uraian, setUraian] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<{ ok: boolean; teks: string } | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const [menghapus, setMenghapus] = useState<number | null>(null);

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    if (sibuk) return;

    setSibuk(true);
    setGalat({});
    setPesan(null);

    const form = new FormData();
    form.set("date", tanggal);
    form.set("activity", uraian);
    if (kelas) form.set("classroom_id", kelas);
    if (foto) form.set("photo", foto);

    const hasil = await kirimBerkas("/api/guru/jurnal-harian", form);
    setSibuk(false);

    if (hasil.ok) {
      setUraian("");
      setFoto(null);
      setPesan({ ok: true, teks: "Kegiatan tercatat." });
      router.refresh();
      return;
    }

    setGalat(hasil.galat);
    setPesan(Object.keys(hasil.galat).length === 0 ? { ok: false, teks: hasil.pesan } : null);
  }

  async function hapus(kegiatanId: number) {
    if (!window.confirm("Hapus kegiatan ini?")) return;

    setMenghapus(kegiatanId);
    const hasil = await kirim(`/api/guru/jurnal-harian/${kegiatanId}`, "DELETE");
    setMenghapus(null);

    if (hasil.ok) router.refresh();
    else window.alert(hasil.pesan);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <Panel as="section" className="h-fit">
        <PanelTitle icon="plus">Tambah Kegiatan</PanelTitle>
        <form onSubmit={simpan} noValidate className="space-y-4">
          <Kolom label="Tanggal" htmlFor={`${id}-tanggal`} galat={galat.date}>
            <input
              id={`${id}-tanggal`}
              type="date"
              value={tanggal}
              max={data.today}
              onChange={(e) => setTanggal(e.target.value)}
              className={inputPortal}
            />
          </Kolom>

          <Kolom label="Kelas" htmlFor={`${id}-kelas`} galat={galat.classroom_id} hint="Kosongkan bila bukan kegiatan kelas.">
            <select
              id={`${id}-kelas`}
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              className={inputPortal}
            >
              <option value="">— Tidak terkait kelas —</option>
              {data.classrooms.map((k) => (
                <option key={k.id} value={k.id}>{k.name}</option>
              ))}
            </select>
          </Kolom>

          <Kolom label="Uraian kegiatan" htmlFor={`${id}-uraian`} galat={galat.activity}>
            <textarea
              id={`${id}-uraian`}
              value={uraian}
              onChange={(e) => setUraian(e.target.value)}
              rows={3}
              maxLength={2000}
              required
              placeholder="mis. Mendampingi kerja kelompok di laboratorium."
              className={inputPortal}
            />
          </Kolom>

          <Kolom
            label="Bukti foto"
            htmlFor={`${id}-foto`}
            galat={galat.photo}
            hint={`Opsional. Maksimal ${Math.round(data.max_photo_kb / 1024)} MB.`}
          >
            <input
              id={`${id}-foto`}
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink"
            />
          </Kolom>

          {pesan && (
            <p
              role={pesan.ok ? "status" : "alert"}
              className={`text-sm font-semibold ${pesan.ok ? "text-teal" : "text-gold-strong"}`}
            >
              {pesan.teks}
            </p>
          )}

          <button
            type="submit"
            disabled={sibuk || uraian.trim() === ""}
            className="btn-sheen bg-blue-gradient press inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
          >
            {sibuk ? "Menyimpan…" : "Simpan Kegiatan"}
          </button>
        </form>
      </Panel>

      <Panel as="section">
        <PanelTitle
          icon="attendance"
          action={<Pill tone="muted">{data.counts.tahun_ini} tahun ini · {data.counts.arsip} arsip</Pill>}
        >
          Riwayat Kegiatan
        </PanelTitle>

        {data.activities.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
            Belum ada kegiatan yang dicatat pada rentang ini.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {data.activities.map((a) => (
              <li key={a.id} className="flex flex-wrap items-start gap-4 py-4 first:pt-0 last:pb-0">
                {a.photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.photo_url}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-xl border border-line object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                    {hariDari(a.date)}, {formatDate(a.date)}
                    {a.classroom ? ` · ${a.classroom}` : ""}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink">{a.activity}</p>
                </div>
                <button
                  type="button"
                  disabled={menghapus === a.id}
                  onClick={() => hapus(a.id)}
                  className="press shrink-0 rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-gold/40 hover:text-gold-strong disabled:opacity-50"
                >
                  {menghapus === a.id ? "…" : "Hapus"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
