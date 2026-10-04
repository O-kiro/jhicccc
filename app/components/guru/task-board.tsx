"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { Panel, Pill } from "@/app/components/siswa/ui";
import { formatTenggat } from "@/lib/format";
import type { ApiTugasGuru } from "@/lib/api-guru";
import { kirim } from "./kirim";
import { Kolom, inputPortal } from "./modal";

type Tugas = ApiTugasGuru["tasks"][number];
type Form = { id: number | null; course_id: string; title: string; description: string; url: string; due_at: string };

/** ISO dengan zona → nilai input datetime-local dalam WIB ("2026-10-10T23:59"). */
function keInput(iso: string): string {
  const wib = new Date(new Date(iso).getTime() + 7 * 3600_000);
  return wib.toISOString().slice(0, 16);
}

/** Tenggat bawaan: tiga hari lagi pukul 23.59. */
function tenggatBawaan(): string {
  const d = new Date(Date.now() + 3 * 86400_000 + 7 * 3600_000);
  return `${d.toISOString().slice(0, 10)}T23:59`;
}

export function TaskBoard({ courses, tasks }: ApiTugasGuru) {
  const router = useRouter();
  const id = useId();
  const kosong = (): Form => ({
    id: null,
    course_id: courses[0] ? String(courses[0].id) : "",
    title: "",
    description: "",
    url: "",
    due_at: tenggatBawaan(),
  });

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
      ...(form.id === null ? { course_id: Number(form.course_id) } : {}),
      title: form.title,
      description: form.description.trim() || null,
      url: form.url.trim() || null,
      due_at: form.due_at,
    };
    const hasil =
      form.id === null
        ? await kirim("/api/guru/tugas", "POST", body)
        : await kirim(`/api/guru/tugas/${form.id}`, "PUT", body);
    setSibuk(false);

    if (hasil.ok) {
      setForm(null);
      router.refresh();
      return;
    }
    setGalat(hasil.galat);
    setPesan(Object.keys(hasil.galat).length === 0 ? hasil.pesan : null);
  }

  async function hapus(t: Tugas) {
    if (!window.confirm(`Hapus tugas "${t.title}"?`)) return;
    setSibuk(true);
    const hasil = await kirim(`/api/guru/tugas/${t.id}`, "DELETE");
    setSibuk(false);
    if (hasil.ok) router.refresh();
    else setPesan(hasil.pesan);
  }

  if (courses.length === 0) {
    return (
      <p className="rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
        Belum ada kursus atas nama Anda, jadi belum bisa memberi tugas. Kursus dibuat Wakasek Kurikulum dari
        panel admin (Akademik → Kursus).
      </p>
    );
  }

  return (
    <>
      {pesan && (
        <p role="alert" className="mb-4 text-sm font-semibold text-gold-strong">
          {pesan}
        </p>
      )}

      {form ? (
        <Panel className="mb-6">
          <form onSubmit={simpan} noValidate className="space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-teal">
              {form.id === null ? "Tugas baru" : "Ubah tugas"}
            </p>
            {form.id === null && (
              <Kolom label="Kelas & mapel" htmlFor={`${id}-kursus`} galat={galat.course_id}>
                <select
                  id={`${id}-kursus`}
                  value={form.course_id}
                  onChange={(e) => setForm({ ...form, course_id: e.target.value })}
                  className={inputPortal}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Kolom>
            )}
            <Kolom label="Judul" htmlFor={`${id}-judul`} galat={galat.title}>
              <input
                id={`${id}-judul`}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                maxLength={255}
                required
                placeholder="mis. Rangkuman Bab 3"
                className={inputPortal}
              />
            </Kolom>
            <Kolom label="Keterangan" htmlFor={`${id}-ket`} galat={galat.description} hint="Instruksi dan cara mengumpulkan.">
              <textarea
                id={`${id}-ket`}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                maxLength={2000}
                className={inputPortal}
              />
            </Kolom>
            <div className="grid gap-4 sm:grid-cols-2">
              <Kolom label="Tenggat (WIB)" htmlFor={`${id}-tenggat`} galat={galat.due_at}>
                <input
                  id={`${id}-tenggat`}
                  type="datetime-local"
                  value={form.due_at}
                  onChange={(e) => setForm({ ...form, due_at: e.target.value })}
                  required
                  className={inputPortal}
                />
              </Kolom>
              <Kolom label="Tautan lampiran (opsional)" htmlFor={`${id}-url`} galat={galat.url}>
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
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => setForm(null)}
                disabled={sibuk}
                className="press rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted hover:text-ink"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={sibuk}
                className="press bg-blue-gradient rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {sibuk ? "Menyimpan…" : "Simpan Tugas"}
              </button>
            </div>
          </form>
        </Panel>
      ) : (
        <button
          type="button"
          onClick={() => buka(kosong())}
          className="press bg-blue-gradient mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
        >
          <Icon name="plus" className="h-4 w-4" />
          Beri Tugas Baru
        </button>
      )}

      {tasks.length === 0 ? (
        <p className="rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
          Belum ada tugas yang diberikan.
        </p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li key={t.id}>
              <Panel className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {t.course && <Pill tone="blue">{t.course}</Pill>}
                    <Pill tone={t.completed > 0 ? "teal" : "muted"}>
                      <Icon name="check" className="h-3 w-3" />
                      {t.completed}/{t.students} selesai
                    </Pill>
                  </div>
                  <h3 className="mt-2 font-display text-base font-extrabold text-ink">{t.title}</h3>
                  {t.description && (
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">{t.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted">Tenggat {formatTenggat(t.due_at)}</p>
                </div>
                <div className="flex shrink-0 gap-2 sm:flex-col">
                  <button
                    type="button"
                    disabled={sibuk}
                    onClick={() =>
                      buka({
                        id: t.id,
                        course_id: String(t.course_id),
                        title: t.title,
                        description: t.description ?? "",
                        url: t.url ?? "",
                        due_at: keInput(t.due_at),
                      })
                    }
                    className="press rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-muted hover:border-ink/25 hover:text-ink"
                  >
                    Ubah
                  </button>
                  <button
                    type="button"
                    disabled={sibuk}
                    onClick={() => hapus(t)}
                    className="press rounded-full border border-line px-4 py-1.5 text-xs font-semibold text-muted hover:border-gold/40 hover:text-gold-strong"
                  >
                    Hapus
                  </button>
                </div>
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
