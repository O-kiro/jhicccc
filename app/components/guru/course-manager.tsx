"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { cn, toneSoft } from "@/lib/styles";
import { Panel, Pill, Progress } from "@/app/components/siswa/ui";
import type { ApiKelas, ApiModulGuru } from "@/lib/api-guru";
import { kirim } from "./kirim";
import { Kolom, Modal, inputPortal } from "./modal";

type Course = ApiKelas["courses"][number];

type Form = { id: number | null; title: string; description: string; url: string };

const KOSONG: Form = { id: null, title: "", description: "", url: "" };

/**
 * Kursus yang diampu, dengan kartu yang sama seperti halaman Kursus siswa.
 * Bedanya: guru melihat progres rata-rata kelas dan bisa mengelola modul —
 * modul yang disimpan langsung muncul di portal siswa.
 */
export function CourseManager({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const id = useId();

  // Disimpan ID-nya, bukan objeknya, supaya daftar di dialog ikut
  // diperbarui setelah router.refresh() membawa data baru.
  const [dibuka, setDibuka] = useState<number | null>(null);
  const course = courses.find((c) => c.id === dibuka) ?? null;

  const [form, setForm] = useState<Form | null>(null);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<string | null>(null);
  const [sibuk, setSibuk] = useState(false);

  function tutup() {
    if (sibuk) return;
    setDibuka(null);
    setForm(null);
  }

  function isi(f: Form) {
    setForm(f);
    setGalat({});
    setPesan(null);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    if (!form || !course || sibuk) return;

    setSibuk(true);
    const body = {
      title: form.title,
      description: form.description.trim() || null,
      url: form.url.trim() || null,
    };
    const hasil =
      form.id === null
        ? await kirim(`/api/guru/kelas/${course.id}/modul`, "POST", body)
        : await kirim(`/api/guru/modul/${form.id}`, "PUT", body);
    setSibuk(false);

    if (hasil.ok) {
      setForm(null);
      router.refresh();
      return;
    }

    setGalat(hasil.galat);
    setPesan(Object.keys(hasil.galat).length === 0 ? hasil.pesan : null);
  }

  async function hapus(m: ApiModulGuru) {
    const peringatan =
      m.completed > 0
        ? `Hapus "${m.title}"? Tanda selesai dari ${m.completed} siswa ikut terhapus.`
        : `Hapus "${m.title}"?`;
    if (!window.confirm(peringatan)) return;

    setSibuk(true);
    const hasil = await kirim(`/api/guru/modul/${m.id}`, "DELETE");
    setSibuk(false);

    if (hasil.ok) router.refresh();
    else setPesan(hasil.pesan);
  }

  if (courses.length === 0) {
    return (
      <p className="rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
        Belum ada kursus atas nama Anda. Kursus dibuat Wakasek Kurikulum dari panel admin (Akademik →
        Kursus).
      </p>
    );
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((c) => (
          <li key={c.id}>
            <Panel className="card-glow flex h-full flex-col transition-shadow hover:shadow-card">
              <div className="flex items-start justify-between gap-3">
                <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", toneSoft[c.tone])}>
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-muted">
                  Kelas {c.classroom ?? "—"}
                </span>
              </div>

              <h3 className="mt-4 font-display text-lg font-extrabold leading-tight text-ink">{c.subject}</h3>
              <p className="mt-1 text-xs text-muted">
                {c.semester} {c.academic_year} · {c.students} siswa terdaftar
              </p>

              <div className="mt-5">
                <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-muted">{c.modules.length} modul</span>
                  <span className="tabular-nums text-ink">rata-rata {c.average_progress}%</span>
                </div>
                <Progress value={c.average_progress} tone={c.tone} label={`Progres rata-rata ${c.subject}`} />
              </div>

              <button
                type="button"
                onClick={() => {
                  setDibuka(c.id);
                  setForm(null);
                  setPesan(null);
                }}
                className="press group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-[border-color,background-color,transform] duration-200 ease-snap hover:border-ink/25 hover:bg-surface-2"
              >
                Kelola Modul
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Panel>
          </li>
        ))}
      </ul>

      <Modal
        open={course !== null}
        onClose={tutup}
        eyebrow={course ? `Kelas ${course.classroom ?? "—"} · ${course.students} siswa` : undefined}
        title={course?.subject ?? ""}
      >
        {course && (
          <>
            {pesan && (
              <p role="alert" className="mb-4 text-sm font-semibold text-gold-strong">
                {pesan}
              </p>
            )}

            {course.modules.length === 0 && !form && (
              <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
                Belum ada modul. Tambahkan modul pertama — siswa langsung melihatnya di halaman Kursus.
              </p>
            )}

            <ul className="max-h-[45vh] space-y-2.5 overflow-y-auto pr-1">
              {course.modules.map((m) =>
                form?.id === m.id ? null : (
                  <li key={m.id} className="flex items-start gap-3.5 rounded-xl border border-line bg-surface-2 p-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface font-display text-xs font-extrabold tabular-nums text-muted">
                      {m.number}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-snug text-ink">{m.title}</span>
                      {m.description && (
                        <span className="mt-1 block text-xs leading-relaxed text-muted">{m.description}</span>
                      )}
                      <span className="mt-2 flex flex-wrap items-center gap-2">
                        <Pill tone={m.completed > 0 ? "teal" : "muted"}>
                          <Icon name="check" className="h-3 w-3" />
                          {m.completed}/{course.students} selesai
                        </Pill>
                        {m.url ? (
                          <a
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal hover:underline"
                          >
                            Buka materi
                            <Icon name="external" className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-[11px] font-semibold text-gold-strong">Tautan belum diisi</span>
                        )}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col gap-1.5">
                      <button
                        type="button"
                        disabled={sibuk}
                        onClick={() =>
                          isi({ id: m.id, title: m.title, description: m.description ?? "", url: m.url ?? "" })
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
                  </li>
                ),
              )}
            </ul>

            {form ? (
              <form onSubmit={simpan} noValidate className="mt-5 space-y-4 rounded-xl border border-teal/30 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-teal">
                  {form.id === null ? `Modul baru — nomor ${course.modules.length + 1}` : "Ubah modul"}
                </p>
                <Kolom label="Judul" htmlFor={`${id}-judul`} galat={galat.title}>
                  <input
                    id={`${id}-judul`}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    maxLength={255}
                    required
                    className={inputPortal}
                  />
                </Kolom>
                <Kolom
                  label="Tautan materi"
                  htmlFor={`${id}-url`}
                  galat={galat.url}
                  hint="Google Drive, YouTube, atau situs lain. Pastikan bisa dibuka siswa."
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
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setForm(null)}
                    disabled={sibuk}
                    className="press rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={sibuk || form.title.trim() === ""}
                    className="btn-sheen bg-blue-gradient press rounded-full px-5 py-2 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
                  >
                    {sibuk ? "Menyimpan…" : "Simpan Modul"}
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => isi(KOSONG)}
                disabled={sibuk}
                className="press mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-teal/50 hover:text-teal"
              >
                <Icon name="plus" className="h-4 w-4" />
                Tambah Modul
              </button>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
