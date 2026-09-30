"use client";

import { useId, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";
import { formatDate, geserTanggal, hariDari, tanggalTerakhirHari } from "@/lib/format";
import type { ApiJurnal } from "@/lib/api-guru";
import { kirim } from "./kirim";
import { Kolom, Modal, inputPortal } from "./modal";
import { HeaderCard, TombolAksi, tabel, tanggalTabel, tombolTambah } from "./ui";

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
 * Jurnal mengajar (redesain Figma): satu kartu tabel riwayat penuh. Tombol
 * "Buat Jurnal Baru" membuka pemilih sesi — sesi yang belum dicatat, atau
 * jadwal dan tanggal lain — lalu formulir jurnalnya.
 *
 * Menyimpan ulang sesi yang sama memperbarui jurnalnya (lihat
 * JurnalController::store), jadi tombol ubah memakai formulir yang sama.
 */
export function JournalBoard({ data, children }: { data: ApiJurnal; children?: ReactNode }) {
  const router = useRouter();
  const id = useId();

  const [memilih, setMemilih] = useState(false);
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
  const manual = data.schedules.find((s) => s.schedule_id === jadwalManual);

  function buka(d: Omit<Draf, "topic" | "note" | "present_count" | "editing"> & Partial<Draf>) {
    setMemilih(false);
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

  return (
    <>
      <HeaderCard
        icon="book"
        title="Riwayat Jurnal Mengajar"
        desc="Catatan harian KBM."
        action={
          <button
            type="button"
            onClick={() => setMemilih(true)}
            disabled={data.schedules.length === 0}
            className={tombolTambah("gold")}
          >
            <Icon name="plus" className="h-4 w-4" />
            Buat Jurnal Baru
          </button>
        }
      >
        {data.pending.length > 0 && (
          <button
            type="button"
            onClick={() => setMemilih(true)}
            className="mt-4 flex w-full items-center gap-2 rounded-xl border border-gold/40 bg-gold-soft/40 px-4 py-3 text-left text-sm font-semibold text-gold-strong"
          >
            <Icon name="clock" className="h-4 w-4 shrink-0" />
            {data.pending.length} sesi dalam {data.range_days} hari terakhir belum dicatat — isi sekarang
          </button>
        )}

        {children}

        {data.journals.length === 0 ? (
          <p className="mt-5 rounded-xl border border-line bg-surface-2 p-5 text-sm text-muted">
            Belum ada jurnal yang tercatat pada saringan ini.
          </p>
        ) : (
          <div className={tabel.wrap}>
            <table className={tabel.table}>
              <thead className={tabel.thead}>
                <tr>
                  <th scope="col" className={tabel.th}>Tanggal</th>
                  <th scope="col" className={tabel.th}>Kelas</th>
                  <th scope="col" className={tabel.th}>Materi Disampaikan</th>
                  <th scope="col" className={tabel.th}>Penugasan / PR</th>
                  <th scope="col" className={cn(tabel.th, "text-right")}>Aksi</th>
                </tr>
              </thead>
              <tbody className={tabel.tbody}>
                {data.journals.map((j) => {
                  const label = `${j.subject} · ${j.classroom}, ${tanggalPanjang(j.date)}`;
                  return (
                    <tr key={j.id}>
                      <td className={cn(tabel.td, "whitespace-nowrap font-display font-extrabold tabular-nums text-ink")}>
                        {tanggalTabel(j.date)}
                      </td>
                      <td className={cn(tabel.td, "whitespace-nowrap")}>
                        <span className="block font-semibold text-ink">{j.classroom}</span>
                        <span className="block text-xs text-muted">{j.subject}</span>
                        {j.present_count !== null && (
                          <span className="mt-0.5 block text-[11px] text-muted">
                            Hadir {j.present_count}/{j.class_size}
                          </span>
                        )}
                      </td>
                      <td className={cn(tabel.td, "text-ink")}>{j.topic}</td>
                      <td className={cn(tabel.td, "text-muted")}>{j.note ?? "—"}</td>
                      <td className={tabel.td}>
                        <span className="flex justify-end gap-2">
                          <TombolAksi
                            jenis="edit"
                            label={`Ubah jurnal ${label}`}
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
                          />
                          <TombolAksi
                            jenis="trash"
                            label={`Hapus jurnal ${label}`}
                            disabled={menghapus === j.id}
                            onClick={() => hapus(j.id, label)}
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </HeaderCard>

      {/* Langkah 1: pilih sesi yang akan dijurnal */}
      <Modal open={memilih} onClose={() => setMemilih(false)} eyebrow="Jurnal Mengajar" title="Buat Jurnal Baru">
        <div className="space-y-5">
          {data.pending.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Belum dicatat</p>
              <ul className="space-y-2">
                {data.pending.map((p) => (
                  <li key={`${p.schedule_id}-${p.date}`}>
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
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 p-3 text-left transition-colors hover:border-primary/40"
                    >
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-gold-strong">
                          {tanggalPanjang(p.date)}
                        </span>
                        <span className="mt-0.5 block text-sm font-semibold text-ink">
                          {p.subject} · {p.classroom}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-muted">
                        {p.start}–{p.end}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Sesi lain</p>
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
            <Kolom
              label="Tanggal"
              htmlFor={`${id}-tanggal`}
              hint={manual ? `Harus hari ${manual.day_label}. Paling jauh ${data.max_back_days} hari ke belakang.` : undefined}
            >
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
              className="press inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-strong disabled:opacity-50"
            >
              Lanjut Isi Jurnal
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Modal>

      {/* Langkah 2: isi jurnal */}
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

            <Kolom label="Materi disampaikan" htmlFor={`${id}-topik`} galat={galat.topic}>
              <input
                id={`${id}-topik`}
                value={draf.topic}
                onChange={(e) => setDraf({ ...draf, topic: e.target.value })}
                maxLength={255}
                required
                autoFocus
                placeholder="mis. Enzim pada tubuh manusia"
                className={inputPortal}
              />
            </Kolom>

            <Kolom label="Penugasan / PR" htmlFor={`${id}-catatan`} galat={galat.note} hint="Opsional.">
              <textarea
                id={`${id}-catatan`}
                value={draf.note}
                onChange={(e) => setDraf({ ...draf, note: e.target.value })}
                rows={3}
                maxLength={2000}
                placeholder="mis. Menyebutkan 6 enzim di tubuh manusia dan fungsinya"
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
                className="press inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-strong disabled:pointer-events-none disabled:opacity-60"
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
