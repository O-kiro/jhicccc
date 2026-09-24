"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";
import { Panel, Pill } from "@/app/components/siswa/ui";
import type { ApiModulAjar } from "@/lib/api-guru";
import { kirim } from "./kirim";
import { Kolom, Modal, inputPortal } from "./modal";

type Modul = ApiModulAjar["plans"][number];

type Form = {
  id: number | null;
  title: string;
  subject_id: string;
  classroom_id: string;
  time_range: string;
  url: string;
  note: string;
  status: "aktif" | "arsip";
};

const KOSONG: Form = {
  id: null,
  title: "",
  subject_id: "",
  classroom_id: "",
  time_range: "",
  url: "",
  note: "",
  status: "aktif",
};

/**
 * Daftar modul ajar beserta formulirnya. Modul rekan sejawat ikut tampil —
 * memang untuk saling meminjam perangkat — tapi tombol ubah dan hapus hanya
 * muncul pada modul sendiri.
 */
export function LessonPlanBoard({ data }: { data: ApiModulAjar }) {
  const router = useRouter();
  const id = useId();

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
      title: form.title,
      subject_id: form.subject_id ? Number(form.subject_id) : null,
      classroom_id: form.classroom_id ? Number(form.classroom_id) : null,
      time_range: form.time_range.trim() || null,
      url: form.url.trim() || null,
      note: form.note.trim() || null,
      status: form.status,
    };

    const hasil =
      form.id === null
        ? await kirim("/api/guru/modul-ajar", "POST", body)
        : await kirim(`/api/guru/modul-ajar/${form.id}`, "PUT", body);
    setSibuk(false);

    if (hasil.ok) {
      setForm(null);
      router.refresh();
      return;
    }

    setGalat(hasil.galat);
    setPesan(Object.keys(hasil.galat).length === 0 ? hasil.pesan : null);
  }

  async function hapus(m: Modul) {
    if (!window.confirm(`Hapus modul "${m.title}"?`)) return;

    setSibuk(true);
    const hasil = await kirim(`/api/guru/modul-ajar/${m.id}`, "DELETE");
    setSibuk(false);

    if (hasil.ok) router.refresh();
    else window.alert(hasil.pesan);
  }

  return (
    <>
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => buka(KOSONG)}
          className="btn-sheen bg-blue-gradient press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Icon name="plus" className="h-4 w-4" />
          Buat Modul Baru
        </button>
      </div>

      {data.plans.length === 0 ? (
        <p className="rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
          {data.tab === "rekan"
            ? "Belum ada modul dari rekan sejawat."
            : data.tab === "arsip"
              ? "Belum ada modul yang diarsipkan."
              : "Belum ada modul ajar. Buat yang pertama lewat tombol di atas."}
        </p>
      ) : (
        <Panel className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-2 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                <tr>
                  <th scope="col" className="w-12 px-5 py-3">No</th>
                  <th scope="col" className="px-5 py-3">Materi Utama</th>
                  <th scope="col" className="px-5 py-3">Kelas</th>
                  <th scope="col" className="px-5 py-3">Mapel</th>
                  <th scope="col" className="px-5 py-3">Waktu</th>
                  <th scope="col" className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.plans.map((m, i) => (
                  <tr key={m.id}>
                    <td className="px-5 py-3.5 tabular-nums text-muted">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <span className="block font-semibold leading-snug text-ink">{m.title}</span>
                      {!m.is_mine && (
                        <span className="mt-0.5 block text-xs text-muted">oleh {m.teacher}</span>
                      )}
                      {m.note && <span className="mt-1 block text-xs leading-relaxed text-muted">{m.note}</span>}
                      {m.url && (
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-teal hover:underline"
                        >
                          Buka berkas modul
                          <Icon name="external" className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-muted">{m.classroom ?? "—"}</td>
                    <td className="px-5 py-3.5 text-muted">{m.subject ?? "—"}</td>
                    <td className="px-5 py-3.5 tabular-nums text-muted">{m.time_range ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      {m.is_mine ? (
                        <span className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={sibuk}
                            onClick={() =>
                              buka({
                                id: m.id,
                                title: m.title,
                                subject_id: String(
                                  data.subjects.find((s) => s.name === m.subject)?.id ?? "",
                                ),
                                classroom_id: String(
                                  data.classrooms.find((k) => k.name === m.classroom)?.id ?? "",
                                ),
                                time_range: m.time_range ?? "",
                                url: m.url ?? "",
                                note: m.note ?? "",
                                status: m.status,
                              })
                            }
                            className="press rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-ink/25 hover:text-ink"
                          >
                            Ubah
                          </button>
                          <button
                            type="button"
                            disabled={sibuk}
                            onClick={() => hapus(m)}
                            className="press rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-gold/40 hover:text-gold-strong"
                          >
                            Hapus
                          </button>
                        </span>
                      ) : (
                        <span className="flex justify-end">
                          <Pill tone="muted">Rekan sejawat</Pill>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Modal
        open={form !== null}
        onClose={() => !sibuk && setForm(null)}
        eyebrow="Modul Ajar"
        title={form?.id === null ? "Buat Modul Baru" : "Ubah Modul"}
      >
        {form && (
          <form onSubmit={simpan} noValidate className="space-y-4">
            <Kolom label="Materi utama" htmlFor={`${id}-judul`} galat={galat.title}>
              <input
                id={`${id}-judul`}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                maxLength={255}
                required
                autoFocus
                placeholder="mis. Klasifikasi Makhluk Hidup"
                className={inputPortal}
              />
            </Kolom>

            <div className="grid gap-4 sm:grid-cols-2">
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
              <Kolom label="Kelas" htmlFor={`${id}-kelas`} galat={galat.classroom_id}>
                <select
                  id={`${id}-kelas`}
                  value={form.classroom_id}
                  onChange={(e) => setForm({ ...form, classroom_id: e.target.value })}
                  className={inputPortal}
                >
                  <option value="">— Tidak dipilih —</option>
                  {data.classrooms.map((k) => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </select>
              </Kolom>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Kolom label="Waktu" htmlFor={`${id}-waktu`} galat={galat.time_range} hint="mis. 07.45–09.15">
                <input
                  id={`${id}-waktu`}
                  value={form.time_range}
                  onChange={(e) => setForm({ ...form, time_range: e.target.value })}
                  maxLength={50}
                  className={inputPortal}
                />
              </Kolom>
              <Kolom label="Status" htmlFor={`${id}-status`} galat={galat.status}>
                <select
                  id={`${id}-status`}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as Form["status"] })}
                  className={inputPortal}
                >
                  <option value="aktif">Aktif</option>
                  <option value="arsip">Arsip</option>
                </select>
              </Kolom>
            </div>

            <Kolom
              label="Tautan berkas"
              htmlFor={`${id}-url`}
              galat={galat.url}
              hint="Google Drive atau situs lain. Pastikan bisa dibuka rekan guru."
            >
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

            <Kolom label="Catatan" htmlFor={`${id}-catatan`} galat={galat.note}>
              <textarea
                id={`${id}-catatan`}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                rows={2}
                maxLength={2000}
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
                className={cn(
                  "btn-sheen bg-blue-gradient press rounded-full px-5 py-2.5 text-sm font-semibold text-white",
                  "disabled:pointer-events-none disabled:opacity-60",
                )}
              >
                {sibuk ? "Menyimpan…" : "Simpan Modul"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
