"use client";

import { useId, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { Pill } from "@/app/components/siswa/ui";
import { cn } from "@/lib/styles";
import type { ApiBahanAjar } from "@/lib/api-guru";
import { kirim } from "./kirim";
import { Kolom, Modal, inputPortal } from "./modal";
import { HeaderCard, TombolAksi, tabel, tombolTambah } from "./ui";

type Bahan = ApiBahanAjar["materials"][number];

type Form = {
  id: number | null;
  type: string;
  title: string;
  subject_id: string;
  level: string;
  url: string;
  description: string;
};

/** Koleksi LKPD dan bahan ajar milik guru sendiri, sebagai tabel (Figma). */
export function MaterialBoard({ data, children }: { data: ApiBahanAjar; children?: ReactNode }) {
  const router = useRouter();
  const id = useId();

  const kosong: Form = {
    id: null,
    type: data.selected ?? Object.keys(data.types)[0] ?? "lkpd",
    title: "",
    subject_id: "",
    level: "",
    url: "",
    description: "",
  };

  const [form, setForm] = useState<Form | null>(null);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  function buka(f: Form) {
    setForm(f);
    setGalat({});
    setPesan(null);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    if (!form || sibuk) return;

    setSibuk(true);
    const body = {
      type: form.type,
      title: form.title,
      subject_id: form.subject_id ? Number(form.subject_id) : null,
      level: form.level.trim() || null,
      url: form.url.trim() || null,
      description: form.description.trim() || null,
    };

    const hasil =
      form.id === null
        ? await kirim("/api/guru/bahan-ajar", "POST", body)
        : await kirim(`/api/guru/bahan-ajar/${form.id}`, "PUT", body);
    setSibuk(false);

    if (hasil.ok) {
      setForm(null);
      router.refresh();
      return;
    }

    setGalat(hasil.galat);
    setPesan(Object.keys(hasil.galat).length === 0 ? hasil.pesan : null);
  }

  async function hapus(b: Bahan) {
    if (!window.confirm(`Hapus "${b.title}"?`)) return;

    setSibuk(true);
    const hasil = await kirim(`/api/guru/bahan-ajar/${b.id}`, "DELETE");
    setSibuk(false);

    if (hasil.ok) router.refresh();
    else window.alert(hasil.pesan);
  }

  const ubah = (b: Bahan) =>
    buka({
      id: b.id,
      type: b.type,
      title: b.title,
      subject_id: String(data.subjects.find((s) => s.name === b.subject)?.id ?? ""),
      level: b.level ?? "",
      url: b.url ?? "",
      description: b.description ?? "",
    });

  return (
    <>
      <HeaderCard
        icon="ebook"
        title="Koleksi Bahan Ajar"
        desc="Kelola Modul Pembelajaran Siswa"
        action={
          <button type="button" onClick={() => buka(kosong)} className={tombolTambah()}>
            <Icon name="plus" className="h-4 w-4" />
            Buat Baru
          </button>
        }
      >
        {children}

        {data.materials.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-line bg-surface-2 p-10 text-center">
            <Icon name="ebook" className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 font-display text-base font-extrabold text-ink">Belum ada bahan ajar.</p>
            <p className="mt-1 text-sm text-muted">Tambahkan LKPD atau rangkuman materi, lalu tautkan berkasnya dari Drive madrasah.</p>
          </div>
        ) : (
          <div className={tabel.wrap}>
            <table className={tabel.table}>
              <thead className={tabel.thead}>
                <tr>
                  <th scope="col" className={cn(tabel.th, "w-12")}>No</th>
                  <th scope="col" className={tabel.th}>Judul</th>
                  <th scope="col" className={tabel.th}>Kelas</th>
                  <th scope="col" className={tabel.th}>Materi</th>
                  <th scope="col" className={cn(tabel.th, "text-right")}>Aksi</th>
                </tr>
              </thead>
              <tbody className={tabel.tbody}>
                {data.materials.map((b, i) => (
                  <tr key={b.id}>
                    <td className={cn(tabel.td, "font-display font-extrabold tabular-nums text-ink")}>{i + 1}</td>
                    <td className={tabel.td}>
                      <span className="block font-semibold leading-snug text-ink">{b.title}</span>
                      {b.subject && <span className="mt-0.5 block text-xs text-muted">{b.subject}</span>}
                      {b.url ? (
                        <a
                          href={b.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                        >
                          Buka dokumen
                          <Icon name="external" className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="mt-1.5 block text-[11px] font-semibold text-gold-strong">Tautan belum diisi</span>
                      )}
                    </td>
                    <td className={cn(tabel.td, "whitespace-nowrap text-ink")}>{b.level ?? "—"}</td>
                    <td className={tabel.td}>
                      <Pill tone={b.type === "lkpd" ? "blue" : "gold"}>{b.type_label}</Pill>
                      {b.description && <span className="mt-1.5 block text-xs leading-relaxed text-muted">{b.description}</span>}
                    </td>
                    <td className={tabel.td}>
                      <span className="flex justify-end gap-2">
                        <TombolAksi jenis="edit" label={`Ubah ${b.title}`} disabled={sibuk} onClick={() => ubah(b)} />
                        <TombolAksi jenis="trash" label={`Hapus ${b.title}`} disabled={sibuk} onClick={() => hapus(b)} />
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
        eyebrow="Bahan Ajar"
        title={form?.id === null ? "Buat Dokumen Baru" : "Ubah Dokumen"}
      >
        {form && (
          <form onSubmit={simpan} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Kolom label="Jenis" htmlFor={`${id}-jenis`} galat={galat.type}>
                <select
                  id={`${id}-jenis`}
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className={inputPortal}
                >
                  {Object.entries(data.types).map(([kunci, label]) => (
                    <option key={kunci} value={kunci}>{label}</option>
                  ))}
                </select>
              </Kolom>
              <Kolom label="Tingkat kelas" htmlFor={`${id}-level`} galat={galat.level} hint="mis. X, XI, XII">
                <input
                  id={`${id}-level`}
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  maxLength={20}
                  className={inputPortal}
                />
              </Kolom>
            </div>

            <Kolom label="Judul" htmlFor={`${id}-judul`} galat={galat.title}>
              <input
                id={`${id}-judul`}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                maxLength={255}
                required
                autoFocus
                className={inputPortal}
              />
            </Kolom>

            <Kolom label="Mata pelajaran" htmlFor={`${id}-mapel`} galat={galat.subject_id}>
              <select
                id={`${id}-mapel`}
                value={form.subject_id}
                onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                className={inputPortal}
              >
                <option value="">— Tidak dipilih —</option>
                {data.subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </Kolom>

            <Kolom label="Tautan dokumen" htmlFor={`${id}-url`} galat={galat.url} hint="Google Drive atau situs lain.">
              <input
                id={`${id}-url`}
                type="url"
                inputMode="url"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://"
                className={inputPortal}
              />
            </Kolom>

            <Kolom label="Keterangan" htmlFor={`${id}-ket`} galat={galat.description}>
              <textarea
                id={`${id}-ket`}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                maxLength={1000}
                className={inputPortal}
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
                disabled={sibuk || form.title.trim() === ""}
                className="press rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-strong disabled:pointer-events-none disabled:opacity-60"
              >
                {sibuk ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
