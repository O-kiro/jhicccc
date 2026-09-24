"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { Panel, Pill } from "@/app/components/siswa/ui";
import type { ApiBahanAjar } from "@/lib/api-guru";
import { kirim } from "./kirim";
import { Kolom, Modal, inputPortal } from "./modal";

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

/** Koleksi LKPD dan bahan ajar milik guru sendiri. */
export function MaterialBoard({ data }: { data: ApiBahanAjar }) {
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

  return (
    <>
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => buka(kosong)}
          className="btn-sheen press inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Icon name="plus" className="h-4 w-4" />
          Buat Baru
        </button>
      </div>

      {data.materials.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface-2 p-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface text-muted">
            <Icon name="ebook" className="h-7 w-7" />
          </span>
          <p className="mt-4 font-display text-base font-extrabold text-ink">Belum ada dokumen yang dibuat.</p>
          <p className="mt-1 text-sm text-muted">
            Tambahkan LKPD atau rangkuman materi, lalu tautkan berkasnya dari Drive madrasah.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.materials.map((b) => (
            <li key={b.id}>
              <Panel className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Pill tone={b.type === "lkpd" ? "blue" : "teal"}>{b.type_label}</Pill>
                  {b.level && <span className="text-[11px] font-semibold text-muted">Kelas {b.level}</span>}
                </div>
                <h3 className="mt-3 font-display text-base font-extrabold leading-snug text-ink">{b.title}</h3>
                {b.subject && <p className="mt-1 text-xs text-muted">{b.subject}</p>}
                {b.description && (
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">{b.description}</p>
                )}

                <div className="mt-auto pt-4">
                  {b.url ? (
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal hover:underline"
                    >
                      Buka dokumen
                      <Icon name="external" className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] font-semibold text-gold-strong">Tautan belum diisi</span>
                  )}

                  <span className="mt-3 flex gap-2 border-t border-line pt-3">
                    <button
                      type="button"
                      disabled={sibuk}
                      onClick={() =>
                        buka({
                          id: b.id,
                          type: b.type,
                          title: b.title,
                          subject_id: String(data.subjects.find((s) => s.name === b.subject)?.id ?? ""),
                          level: b.level ?? "",
                          url: b.url ?? "",
                          description: b.description ?? "",
                        })
                      }
                      className="press rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-ink/25 hover:text-ink"
                    >
                      Ubah
                    </button>
                    <button
                      type="button"
                      disabled={sibuk}
                      onClick={() => hapus(b)}
                      className="press rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-gold/40 hover:text-gold-strong"
                    >
                      Hapus
                    </button>
                  </span>
                </div>
              </Panel>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={form !== null}
        onClose={() => !sibuk && setForm(null)}
        eyebrow="Bahan Ajar & LKPD"
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
                className="btn-sheen bg-blue-gradient press rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
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
