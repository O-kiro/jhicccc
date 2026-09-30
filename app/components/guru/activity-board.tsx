"use client";

import { useId, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";
import type { ApiJurnalHarian } from "@/lib/api-guru";
import { kirim, kirimBerkas } from "./kirim";
import { Kolom, Modal, inputPortal } from "./modal";
import { HeaderCard, TombolAksi, tabel, tanggalTabel, tombolTambah } from "./ui";

type Kegiatan = ApiJurnalHarian["activities"][number];

type Form = { id: number | null; tanggal: string; kelas: string; uraian: string; fotoLama: string | null };

/**
 * Jurnal harian: kegiatan di luar jam mengajar, boleh dilampiri bukti foto.
 * Satu kartu tabel penuh (redesain Figma); tambah dan ubah lewat dialog.
 * Formulirnya memakai FormData supaya berkas fotonya ikut terkirim.
 */
export function ActivityBoard({ data, children }: { data: ApiJurnalHarian; children?: ReactNode }) {
  const router = useRouter();
  const id = useId();

  const [form, setForm] = useState<Form | null>(null);
  const [foto, setFoto] = useState<File | null>(null);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);
  const [menghapus, setMenghapus] = useState<number | null>(null);

  function buka(f: Form) {
    setForm(f);
    setFoto(null);
    setGalat({});
    setPesan(null);
  }

  const ubah = (a: Kegiatan) =>
    buka({
      id: a.id,
      tanggal: a.date,
      kelas: a.classroom_id ? String(a.classroom_id) : "",
      uraian: a.activity,
      fotoLama: a.photo_url,
    });

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    if (!form || sibuk) return;

    setSibuk(true);
    setGalat({});
    setPesan(null);

    const isi = new FormData();
    isi.set("date", form.tanggal);
    isi.set("activity", form.uraian);
    if (form.kelas) isi.set("classroom_id", form.kelas);
    if (foto) isi.set("photo", foto);

    const hasil = await kirimBerkas(
      form.id === null ? "/api/guru/jurnal-harian" : `/api/guru/jurnal-harian/${form.id}`,
      isi,
    );
    setSibuk(false);

    if (hasil.ok) {
      setForm(null);
      router.refresh();
      return;
    }

    setGalat(hasil.galat);
    setPesan(Object.keys(hasil.galat).length === 0 ? hasil.pesan : null);
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
    <>
      <HeaderCard
        icon="edit"
        title="Jurnal Harian Guru & Tendik"
        desc="Catatan kegiatan sekolah di luar jam mengajar kelas."
        action={
          <button
            type="button"
            onClick={() => buka({ id: null, tanggal: data.today, kelas: "", uraian: "", fotoLama: null })}
            className={tombolTambah()}
          >
            <Icon name="plus" className="h-4 w-4" />
            Tambah Kegiatan
          </button>
        }
      >
        {children}

        {data.activities.length === 0 ? (
          <p className="mt-5 rounded-xl border border-line bg-surface-2 p-5 text-sm text-muted">
            Belum ada kegiatan yang dicatat pada rentang ini.
          </p>
        ) : (
          <div className={tabel.wrap}>
            <table className={tabel.table}>
              <thead className={tabel.thead}>
                <tr>
                  <th scope="col" className={cn(tabel.th, "w-12")}>No</th>
                  <th scope="col" className={tabel.th}>Kelas</th>
                  <th scope="col" className={tabel.th}>Uraian Kegiatan</th>
                  <th scope="col" className={tabel.th}>Tanggal</th>
                  <th scope="col" className={tabel.th}>Bukti Foto</th>
                  <th scope="col" className={cn(tabel.th, "text-right")}>Aksi</th>
                </tr>
              </thead>
              <tbody className={tabel.tbody}>
                {data.activities.map((a, i) => (
                  <tr key={a.id}>
                    <td className={cn(tabel.td, "font-display font-extrabold tabular-nums text-ink")}>{i + 1}</td>
                    <td className={cn(tabel.td, "whitespace-nowrap text-ink")}>{a.classroom ?? "—"}</td>
                    <td className={cn(tabel.td, "whitespace-pre-line leading-relaxed text-ink")}>{a.activity}</td>
                    <td className={cn(tabel.td, "whitespace-nowrap tabular-nums text-muted")}>{tanggalTabel(a.date)}</td>
                    <td className={tabel.td}>
                      {a.photo_url ? (
                        <a href={a.photo_url} target="_blank" rel="noopener noreferrer" aria-label="Buka bukti foto">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={a.photo_url}
                            alt=""
                            className="h-12 w-16 rounded-lg border border-line object-cover"
                          />
                        </a>
                      ) : (
                        <span className="grid h-12 w-16 place-items-center rounded-lg border border-dashed border-line text-muted">
                          <Icon name="camera" className="h-4 w-4" />
                        </span>
                      )}
                    </td>
                    <td className={tabel.td}>
                      <span className="flex justify-end gap-2">
                        <TombolAksi jenis="edit" label="Ubah kegiatan" onClick={() => ubah(a)} />
                        <TombolAksi
                          jenis="trash"
                          label="Hapus kegiatan"
                          disabled={menghapus === a.id}
                          onClick={() => hapus(a.id)}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </HeaderCard>

      <Modal
        open={form !== null}
        onClose={() => !sibuk && setForm(null)}
        eyebrow="Jurnal Harian"
        title={form?.id === null ? "Tambah Kegiatan" : "Ubah Kegiatan"}
      >
        {form && (
          <form onSubmit={simpan} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Kolom label="Tanggal" htmlFor={`${id}-tanggal`} galat={galat.date}>
                <input
                  id={`${id}-tanggal`}
                  type="date"
                  value={form.tanggal}
                  max={data.today}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  className={inputPortal}
                />
              </Kolom>
              <Kolom label="Kelas" htmlFor={`${id}-kelas`} galat={galat.classroom_id} hint="Kosongkan bila bukan kegiatan kelas.">
                <select
                  id={`${id}-kelas`}
                  value={form.kelas}
                  onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                  className={inputPortal}
                >
                  <option value="">— Tidak terkait kelas —</option>
                  {data.classrooms.map((k) => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </select>
              </Kolom>
            </div>

            <Kolom label="Uraian kegiatan" htmlFor={`${id}-uraian`} galat={galat.activity}>
              <textarea
                id={`${id}-uraian`}
                value={form.uraian}
                onChange={(e) => setForm({ ...form, uraian: e.target.value })}
                rows={3}
                maxLength={2000}
                required
                autoFocus
                placeholder="mis. Kelas tambahan persiapan olimpiade."
                className={inputPortal}
              />
            </Kolom>

            <Kolom
              label="Bukti foto"
              htmlFor={`${id}-foto`}
              galat={galat.photo}
              hint={
                form.fotoLama
                  ? "Kosongkan untuk mempertahankan foto sekarang."
                  : `Opsional. Maksimal ${Math.round(data.max_photo_kb / 1024)} MB.`
              }
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
              <p role="alert" className="text-sm font-semibold text-gold-strong">
                {pesan}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setForm(null)}
                disabled={sibuk}
                className="press rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={sibuk || form.uraian.trim() === ""}
                className="press rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-strong disabled:pointer-events-none disabled:opacity-60"
              >
                {sibuk ? "Menyimpan…" : "Simpan Kegiatan"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
