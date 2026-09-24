"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { formatDate } from "@/lib/format";
import { Panel, PanelTitle, Pill } from "@/app/components/siswa/ui";
import type { ApiRdm } from "@/lib/api-guru";
import { kirim, kirimBerkas } from "./kirim";
import { Kolom, inputPortal } from "./modal";

/**
 * RDM: mengunggah berkas rapor per kelas, dan menulis catatan guru untuk
 * siswa. Catatannya langsung terbaca siswa di Rapor Digital-nya.
 */
export function RdmBoard({ data, tahunAjaran }: { data: ApiRdm; tahunAjaran: string }) {
  const router = useRouter();
  const id = useId();

  const [kelas, setKelas] = useState(String(data.classrooms[0]?.id ?? ""));
  const [tahun, setTahun] = useState(tahunAjaran);
  const [semester, setSemester] = useState(data.semesters[0] ?? "Ganjil");
  const [berkas, setBerkas] = useState<File | null>(null);
  const [catatanBerkas, setCatatanBerkas] = useState("");
  const [galatUnggah, setGalatUnggah] = useState<Record<string, string>>({});
  const [pesanUnggah, setPesanUnggah] = useState<{ ok: boolean; teks: string } | null>(null);
  const [mengunggah, setMengunggah] = useState(false);

  const [siswa, setSiswa] = useState(String(data.students[0]?.id ?? ""));
  const [peran, setPeran] = useState("Guru Mapel");
  const [isi, setIsi] = useState("");
  const [suntingId, setSuntingId] = useState<number | null>(null);
  const [galatCatatan, setGalatCatatan] = useState<Record<string, string>>({});
  const [pesanCatatan, setPesanCatatan] = useState<{ ok: boolean; teks: string } | null>(null);
  const [menyimpan, setMenyimpan] = useState(false);

  async function unggah(e: React.FormEvent) {
    e.preventDefault();
    if (mengunggah || !berkas) return;

    setMengunggah(true);
    setGalatUnggah({});
    setPesanUnggah(null);

    const form = new FormData();
    form.set("classroom_id", kelas);
    form.set("academic_year", tahun);
    form.set("semester", semester);
    form.set("file", berkas);
    if (catatanBerkas.trim()) form.set("note", catatanBerkas.trim());

    const hasil = await kirimBerkas("/api/guru/rdm", form);
    setMengunggah(false);

    if (hasil.ok) {
      setBerkas(null);
      setCatatanBerkas("");
      setPesanUnggah({ ok: true, teks: "Berkas rapor terunggah." });
      router.refresh();
      return;
    }

    setGalatUnggah(hasil.galat);
    setPesanUnggah(Object.keys(hasil.galat).length === 0 ? { ok: false, teks: hasil.pesan } : null);
  }

  async function hapusBerkas(berkasId: number, nama: string) {
    if (!window.confirm(`Hapus berkas "${nama}"?`)) return;

    const hasil = await kirim(`/api/guru/rdm/${berkasId}`, "DELETE");
    if (hasil.ok) router.refresh();
    else window.alert(hasil.pesan);
  }

  function kosongkanCatatan() {
    setSuntingId(null);
    setIsi("");
    setGalatCatatan({});
    setPesanCatatan(null);
  }

  async function simpanCatatan(e: React.FormEvent) {
    e.preventDefault();
    if (menyimpan) return;

    setMenyimpan(true);
    setGalatCatatan({});
    setPesanCatatan(null);

    const body = { student_id: Number(siswa), role: peran, body: isi };
    const hasil =
      suntingId === null
        ? await kirim("/api/guru/rdm/catatan", "POST", body)
        : await kirim(`/api/guru/rdm/catatan/${suntingId}`, "PUT", body);
    setMenyimpan(false);

    if (hasil.ok) {
      kosongkanCatatan();
      setPesanCatatan({ ok: true, teks: "Catatan tersimpan dan langsung terbaca siswa." });
      router.refresh();
      return;
    }

    setGalatCatatan(hasil.galat);
    setPesanCatatan(Object.keys(hasil.galat).length === 0 ? { ok: false, teks: hasil.pesan } : null);
  }

  async function hapusCatatan(catatanId: number) {
    if (!window.confirm("Hapus catatan ini?")) return;

    const hasil = await kirim(`/api/guru/rdm/catatan/${catatanId}`, "DELETE");
    if (hasil.ok) {
      if (suntingId === catatanId) kosongkanCatatan();
      router.refresh();
    } else {
      window.alert(hasil.pesan);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Panel as="section" className="h-fit">
          <PanelTitle icon="download">Unggah Berkas Rapor</PanelTitle>

          {data.classrooms.length === 0 ? (
            <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
              Belum ada kelas yang Anda ampu, jadi belum ada rapor yang bisa diunggah.
            </p>
          ) : (
            <form onSubmit={unggah} noValidate className="space-y-4">
              <Kolom label="Kelas" htmlFor={`${id}-kelas`} galat={galatUnggah.classroom_id}>
                <select
                  id={`${id}-kelas`}
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className={inputPortal}
                >
                  {data.classrooms.map((k) => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </select>
              </Kolom>

              <div className="grid gap-4 sm:grid-cols-2">
                <Kolom label="Tahun ajaran" htmlFor={`${id}-tahun`} galat={galatUnggah.academic_year}>
                  <input
                    id={`${id}-tahun`}
                    value={tahun}
                    onChange={(e) => setTahun(e.target.value)}
                    maxLength={20}
                    className={inputPortal}
                  />
                </Kolom>
                <Kolom label="Semester" htmlFor={`${id}-semester`} galat={galatUnggah.semester}>
                  <select
                    id={`${id}-semester`}
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className={inputPortal}
                  >
                    {data.semesters.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Kolom>
              </div>

              <Kolom
                label="Berkas"
                htmlFor={`${id}-berkas`}
                galat={galatUnggah.file}
                hint={`PDF atau Excel (.xlsx/.xls), maksimal ${Math.round(data.max_file_kb / 1024)} MB.`}
              >
                <input
                  id={`${id}-berkas`}
                  type="file"
                  accept=".pdf,.xlsx,.xls"
                  onChange={(e) => setBerkas(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-muted file:mr-3 file:rounded-full file:border-0 file:bg-surface-2 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink"
                />
              </Kolom>

              <Kolom label="Catatan" htmlFor={`${id}-catatan-berkas`} galat={galatUnggah.note}>
                <input
                  id={`${id}-catatan-berkas`}
                  value={catatanBerkas}
                  onChange={(e) => setCatatanBerkas(e.target.value)}
                  maxLength={1000}
                  placeholder="Opsional"
                  className={inputPortal}
                />
              </Kolom>

              {pesanUnggah && (
                <p
                  role={pesanUnggah.ok ? "status" : "alert"}
                  className={`text-sm font-semibold ${pesanUnggah.ok ? "text-teal" : "text-gold-strong"}`}
                >
                  {pesanUnggah.teks}
                </p>
              )}

              <button
                type="submit"
                disabled={mengunggah || !berkas}
                className="btn-sheen bg-blue-gradient press inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
              >
                {mengunggah ? "Mengunggah…" : "Unggah"}
              </button>
            </form>
          )}
        </Panel>

        <Panel as="section">
          <PanelTitle icon="rdm" action={<Pill tone="muted">{data.uploads.length} berkas</Pill>}>
            Berkas Terunggah
          </PanelTitle>

          {data.uploads.length === 0 ? (
            <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
              Belum ada berkas rapor yang diunggah.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {data.uploads.map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">{b.original_name}</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {b.classroom} · {b.semester} {b.academic_year} · {b.size_kb} KB
                      {b.uploaded_on ? ` · ${formatDate(b.uploaded_on)}` : ""}
                    </span>
                    {b.note && <span className="mt-1 block text-xs text-muted">{b.note}</span>}
                  </span>
                  <span className="flex shrink-0 gap-2">
                    <a
                      href={b.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="press inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-ink/25 hover:text-ink"
                    >
                      Buka
                      <Icon name="external" className="h-3 w-3" />
                    </a>
                    <button
                      type="button"
                      onClick={() => hapusBerkas(b.id, b.original_name)}
                      className="press rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-gold/40 hover:text-gold-strong"
                    >
                      Hapus
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Panel as="section" className="h-fit">
          <PanelTitle icon="chat">{suntingId === null ? "Tulis Catatan untuk Siswa" : "Ubah Catatan"}</PanelTitle>

          {data.students.length === 0 ? (
            <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
              Belum ada siswa di kelas yang Anda ampu.
            </p>
          ) : (
            <form onSubmit={simpanCatatan} noValidate className="space-y-4">
              <Kolom label="Siswa" htmlFor={`${id}-siswa`} galat={galatCatatan.student_id}>
                <select
                  id={`${id}-siswa`}
                  value={siswa}
                  onChange={(e) => setSiswa(e.target.value)}
                  className={inputPortal}
                >
                  {data.students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}{s.classroom ? ` — ${s.classroom}` : ""}
                    </option>
                  ))}
                </select>
              </Kolom>

              <Kolom label="Peran Anda" htmlFor={`${id}-peran`} galat={galatCatatan.role} hint="mis. Wali Kelas, Guru Mapel">
                <input
                  id={`${id}-peran`}
                  value={peran}
                  onChange={(e) => setPeran(e.target.value)}
                  maxLength={50}
                  className={inputPortal}
                />
              </Kolom>

              <Kolom label="Isi catatan" htmlFor={`${id}-isi`} galat={galatCatatan.body}>
                <textarea
                  id={`${id}-isi`}
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  required
                  className={inputPortal}
                />
              </Kolom>

              {pesanCatatan && (
                <p
                  role={pesanCatatan.ok ? "status" : "alert"}
                  className={`text-sm font-semibold ${pesanCatatan.ok ? "text-teal" : "text-gold-strong"}`}
                >
                  {pesanCatatan.teks}
                </p>
              )}

              <div className="flex gap-3">
                {suntingId !== null && (
                  <button
                    type="button"
                    onClick={kosongkanCatatan}
                    className="press rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  disabled={menyimpan || isi.trim() === ""}
                  className="btn-sheen bg-blue-gradient press inline-flex flex-1 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
                >
                  {menyimpan ? "Menyimpan…" : "Kirim Catatan"}
                </button>
              </div>
            </form>
          )}
        </Panel>

        <Panel as="section">
          <PanelTitle icon="users" action={<Pill tone="muted">{data.feedback.length} catatan</Pill>}>
            Daftar Catatan
          </PanelTitle>

          {data.feedback.length === 0 ? (
            <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
              Belum ada catatan yang Anda tulis.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {data.feedback.map((c) => (
                <li key={c.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{c.student}</span>
                    <span className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSuntingId(c.id);
                          setSiswa(String(c.student_id));
                          setPeran(c.role);
                          setIsi(c.body);
                          setPesanCatatan(null);
                        }}
                        className="press rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-ink/25 hover:text-ink"
                      >
                        Ubah
                      </button>
                      <button
                        type="button"
                        onClick={() => hapusCatatan(c.id)}
                        className="press rounded-full border border-line px-3 py-1 text-[11px] font-semibold text-muted transition-colors hover:border-gold/40 hover:text-gold-strong"
                      >
                        Hapus
                      </button>
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                    {c.role}{c.created_on ? ` · ${formatDate(c.created_on)}` : ""}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
