"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";
import { formatDate, geserTanggal, hariDari, tanggalTerakhirHari } from "@/lib/format";
import { Panel, PanelTitle, Pill } from "@/app/components/siswa/ui";
import type { ApiJurnal } from "@/lib/api-guru";
import { kirim } from "./kirim";
import { Kolom, Modal, inputPortal } from "./modal";

/** Isi formulir jurnal. Angka hadir disimpan sebagai teks selama diketik. */
type Draf = {
  schedule_id: number;
  date: string;
  /** "Matematika · X-B, 08:30–09:45" — hanya untuk judul dialog. */
  label: string;
  class_size: number;
  topic: string;
  note: string;
  present_count: string;
  /** Terisi saat menyunting jurnal yang sudah ada. */
  editing: boolean;
};

const tanggalPanjang = (iso: string) => `${hariDari(iso)}, ${formatDate(iso)}`;

/**
 * Jurnal mengajar: sesi yang belum dicatat, pencatatan sesi lain, dan
 * riwayat. Semua data datang dari halaman induk; di sini hanya interaksinya.
 */
export function JournalBoard({ data }: { data: ApiJurnal }) {
  const router = useRouter();
  const id = useId();

  const [draf, setDraf] = useState<Draf | null>(null);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const [menghapus, setMenghapus] = useState<number | null>(null);

  // Tanggal mengikuti hari jadwal yang dipilih — sesi Senin langsung
  // menunjuk Senin terakhir, bukan hari ini yang pasti ditolak.
  const pertama = data.schedules[0];
  const [jadwalManual, setJadwalManual] = useState(pertama?.schedule_id ?? 0);
  const [tanggalManual, setTanggalManual] = useState(
    pertama ? tanggalTerakhirHari(data.today, pertama.day) : data.today,
  );
  const paling = geserTanggal(data.today, -data.max_back_days);

  function buka(d: Omit<Draf, "topic" | "note" | "present_count" | "editing"> & Partial<Draf>) {
    setDraf({ topic: "", note: "", present_count: "", editing: false, ...d });
    setGalat({});
    setPesan(null);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    if (!draf || sibuk) return;

    setSibuk(true);
    setGalat({});
    setPesan(null);

    const hasil = await kirim("/api/guru/jurnal", "POST", {
      schedule_id: draf.schedule_id,
      date: draf.date,
      topic: draf.topic,
      note: draf.note.trim() || null,
      present_count: draf.present_count === "" ? null : Number(draf.present_count),
    });

    setSibuk(false);

    if (hasil.ok) {
      setDraf(null);
      router.refresh();
      return;
    }

    setGalat(hasil.galat);
    // Galat per kolom sudah tampil di bawah kolomnya; pesan umum hanya bila
    // sebabnya bukan isian (mis. server mati).
    setPesan(Object.keys(hasil.galat).length === 0 ? hasil.pesan : null);
  }

  async function hapus(jurnalId: number, label: string) {
    if (!window.confirm(`Hapus jurnal ${label}?`)) return;

    setMenghapus(jurnalId);
    const hasil = await kirim(`/api/guru/jurnal/${jurnalId}`, "DELETE");
    setMenghapus(null);

    if (hasil.ok) router.refresh();
    else window.alert(hasil.pesan);
  }

  const manual = data.schedules.find((s) => s.schedule_id === jadwalManual);

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        {/* Tertunda */}
        <Panel as="section" className="h-full">
          <PanelTitle
            icon="clock"
            action={<Pill tone={data.pending.length > 0 ? "gold" : "teal"}>{data.pending.length} sesi</Pill>}
          >
            Belum Dicatat
          </PanelTitle>
          {data.pending.length === 0 ? (
            <p className="flex items-start gap-2 rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              Semua sesi dalam {data.range_days} hari terakhir sudah tercatat.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {data.pending.map((p) => (
                <li
                  key={`${p.schedule_id}-${p.date}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 p-3.5"
                >
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-gold-strong">
                      {tanggalPanjang(p.date)}
                    </span>
                    <span className="mt-1 block font-semibold text-ink">
                      {p.subject} · {p.classroom}
                    </span>
                    <span className="mt-0.5 block text-xs tabular-nums text-muted">
                      {p.start}–{p.end}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      buka({
                        schedule_id: p.schedule_id,
                        date: p.date,
                        label: `${p.subject} · ${p.classroom}, ${p.start}–${p.end}`,
                        class_size: p.class_size,
                      })
                    }
                    className="btn-sheen bg-blue-gradient press inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white"
                  >
                    <Icon name="plus" className="h-3.5 w-3.5" />
                    Isi Jurnal
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Sesi lain */}
        <Panel as="section" className="h-full">
          <PanelTitle icon="calendar">Catat Sesi Lain</PanelTitle>
          {data.schedules.length === 0 ? (
            <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
              Belum ada jadwal mengajar yang terdaftar atas nama Anda.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-xs leading-relaxed text-muted">
                Untuk sesi di luar daftar — misalnya lebih dari {data.range_days} hari lalu. Paling jauh{" "}
                {data.max_back_days} hari ke belakang.
              </p>
              <Kolom label="Jadwal" htmlFor={`${id}-jadwal`}>
                <select
                  id={`${id}-jadwal`}
                  value={jadwalManual}
                  onChange={(e) => {
                    const dipilih = data.schedules.find((s) => s.schedule_id === Number(e.target.value));
                    setJadwalManual(Number(e.target.value));
                    if (dipilih) setTanggalManual(tanggalTerakhirHari(data.today, dipilih.day));
                  }}
                  className={inputPortal}
                >
                  {data.schedules.map((s) => (
                    <option key={s.schedule_id} value={s.schedule_id}>
                      {s.day_label} {s.start} — {s.subject} · {s.classroom}
                    </option>
                  ))}
                </select>
              </Kolom>
              <Kolom label="Tanggal" htmlFor={`${id}-tanggal`} hint={manual ? `Harus hari ${manual.day_label}.` : undefined}>
                <input
                  id={`${id}-tanggal`}
                  type="date"
                  value={tanggalManual}
                  min={paling}
                  max={data.today}
                  onChange={(e) => setTanggalManual(e.target.value)}
                  className={inputPortal}
                />
              </Kolom>
              <button
                type="button"
                disabled={!manual || !tanggalManual}
                onClick={() =>
                  manual &&
                  buka({
                    schedule_id: manual.schedule_id,
                    date: tanggalManual,
                    label: `${manual.subject} · ${manual.classroom}, ${manual.start}–${manual.end}`,
                    class_size: manual.class_size,
                  })
                }
                className="press inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/25 hover:bg-surface-2 disabled:opacity-50"
              >
                <Icon name="plus" className="h-4 w-4" />
                Isi Jurnal
              </button>
            </div>
          )}
        </Panel>
      </div>

      {/* Riwayat */}
      <Panel as="section" className="mt-6">
        <PanelTitle icon="book" action={<Pill tone="muted">{data.journals.length} terakhir</Pill>}>
          Riwayat Jurnal
        </PanelTitle>
        {data.journals.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
            Belum ada jurnal yang tercatat.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {data.journals.map((j) => {
              const label = `${j.subject} · ${j.classroom}, ${tanggalPanjang(j.date)}`;
              return (
                <li key={j.id} className="flex flex-wrap items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                      {tanggalPanjang(j.date)} · {j.subject} · {j.classroom}
                    </p>
                    <p className="mt-1 font-semibold leading-snug text-ink">{j.topic}</p>
                    {j.note && <p className="mt-1 text-sm leading-relaxed text-muted">{j.note}</p>}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    {j.present_count !== null && (
                      <Pill tone={j.present_count < j.class_size ? "gold" : "teal"}>
                        <Icon name="users" className="h-3 w-3" />
                        Hadir {j.present_count}/{j.class_size}
                      </Pill>
                    )}
                    <span className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          buka({
                            schedule_id: j.schedule_id,
                            date: j.date,
                            label: `${j.subject} · ${j.classroom}, ${j.start}–${j.end}`,
                            class_size: j.class_size,
                            topic: j.topic,
                            note: j.note ?? "",
                            present_count: j.present_count === null ? "" : String(j.present_count),
                            editing: true,
                          })
                        }
                        className="press rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-ink/25 hover:text-ink"
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        disabled={menghapus === j.id}
                        onClick={() => hapus(j.id, label)}
                        className="press rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-gold/40 hover:text-gold-strong disabled:opacity-50"
                      >
                        {menghapus === j.id ? "…" : "Hapus"}
                      </button>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      <Modal
        open={draf !== null}
        onClose={() => !sibuk && setDraf(null)}
        eyebrow={draf ? tanggalPanjang(draf.date) : undefined}
        title={draf ? (draf.editing ? "Ubah Jurnal" : "Isi Jurnal Mengajar") : ""}
      >
        {draf && (
          <form onSubmit={simpan} noValidate className="space-y-4">
            <p className="rounded-xl bg-surface-2 px-4 py-3 text-sm font-semibold text-ink">{draf.label}</p>
            {galat.date && <p className="text-xs font-semibold text-gold-strong">{galat.date}</p>}
            {galat.schedule_id && <p className="text-xs font-semibold text-gold-strong">{galat.schedule_id}</p>}

            <Kolom label="Materi yang diajarkan" htmlFor={`${id}-topik`} galat={galat.topic}>
              <input
                id={`${id}-topik`}
                value={draf.topic}
                onChange={(e) => setDraf({ ...draf, topic: e.target.value })}
                maxLength={255}
                required
                autoFocus
                placeholder="mis. Limit fungsi aljabar"
                className={inputPortal}
              />
            </Kolom>

            <Kolom
              label="Jumlah siswa hadir"
              htmlFor={`${id}-hadir`}
              galat={galat.present_count}
              hint={`Dari ${draf.class_size} siswa aktif. Boleh dikosongkan.`}
            >
              <input
                id={`${id}-hadir`}
                type="number"
                inputMode="numeric"
                min={0}
                max={draf.class_size}
                value={draf.present_count}
                onChange={(e) => setDraf({ ...draf, present_count: e.target.value })}
                className={cn(inputPortal, "max-w-40")}
              />
            </Kolom>

            <Kolom label="Catatan" htmlFor={`${id}-catatan`} galat={galat.note} hint="Opsional — kendala, tugas, atau tindak lanjut.">
              <textarea
                id={`${id}-catatan`}
                value={draf.note}
                onChange={(e) => setDraf({ ...draf, note: e.target.value })}
                rows={3}
                maxLength={2000}
                className={inputPortal}
              />
            </Kolom>

            {pesan && (
              <p role="alert" className="text-sm font-semibold text-gold-strong">
                {pesan}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDraf(null)}
                disabled={sibuk}
                className="press rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={sibuk || draf.topic.trim() === ""}
                className="btn-sheen bg-blue-gradient press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
              >
                {sibuk ? "Menyimpan…" : "Simpan Jurnal"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
