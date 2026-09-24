"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { formatDate } from "@/lib/format";
import { Panel, PanelTitle, Pill } from "@/app/components/siswa/ui";
import type { ApiTatib } from "@/lib/api-guru";
import { kirim } from "./kirim";
import { Kolom, inputPortal } from "./modal";

/**
 * Lapor poin kedisiplinan. Daftar siswa disaring per kelas lebih dulu supaya
 * tidak menggulung ratusan nama dalam satu dropdown.
 */
export function TatibBoard({ data }: { data: ApiTatib }) {
  const router = useRouter();
  const id = useId();

  const [kelas, setKelas] = useState("");
  const [siswa, setSiswa] = useState("");
  const [aturan, setAturan] = useState("");
  const [tanggal, setTanggal] = useState(data.today);
  const [catatan, setCatatan] = useState("");
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<{ ok: boolean; teks: string } | null>(null);
  const [sibuk, setSibuk] = useState(false);

  const siswaTampil = kelas
    ? data.students.filter((s) => String(s.classroom_id) === kelas)
    : data.students;
  const aturanTerpilih = data.rules.find((r) => String(r.id) === aturan);

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    if (sibuk) return;

    setSibuk(true);
    setGalat({});
    setPesan(null);

    const hasil = await kirim<{ points: number }>("/api/guru/tatib", "POST", {
      student_id: Number(siswa),
      discipline_rule_id: Number(aturan),
      occurred_on: tanggal,
      note: catatan.trim() || null,
    });

    setSibuk(false);

    if (hasil.ok) {
      setCatatan("");
      setSiswa("");
      setAturan("");
      setPesan({ ok: true, teks: `Laporan tercatat (${hasil.data.points} poin).` });
      router.refresh();
      return;
    }

    setGalat(hasil.galat);
    setPesan(Object.keys(hasil.galat).length === 0 ? { ok: false, teks: hasil.pesan } : null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
      <Panel as="section" className="h-fit">
        <PanelTitle icon="flag">Formulir Lapor Poin</PanelTitle>

        {data.students.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
            Belum ada siswa di kelas yang Anda ampu.
          </p>
        ) : (
          <form onSubmit={simpan} noValidate className="space-y-4">
            <Kolom label="Filter kelas" htmlFor={`${id}-kelas`} hint="Mempersempit daftar siswa di bawah.">
              <select
                id={`${id}-kelas`}
                value={kelas}
                onChange={(e) => {
                  setKelas(e.target.value);
                  setSiswa("");
                }}
                className={inputPortal}
              >
                <option value="">Semua kelas yang saya ampu</option>
                {data.classrooms.map((k) => (
                  <option key={k.id} value={k.id}>{k.name}</option>
                ))}
              </select>
            </Kolom>

            <Kolom label="Siswa" htmlFor={`${id}-siswa`} galat={galat.student_id}>
              <select
                id={`${id}-siswa`}
                value={siswa}
                onChange={(e) => setSiswa(e.target.value)}
                required
                className={inputPortal}
              >
                <option value="">— Pilih siswa —</option>
                {siswaTampil.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}{s.classroom ? ` — ${s.classroom}` : ""}
                  </option>
                ))}
              </select>
            </Kolom>

            <Kolom label="Jenis tindakan" htmlFor={`${id}-aturan`} galat={galat.discipline_rule_id}>
              <select
                id={`${id}-aturan`}
                value={aturan}
                onChange={(e) => setAturan(e.target.value)}
                required
                className={inputPortal}
              >
                <option value="">— Pilih aturan tatib —</option>
                {data.rules.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.code}] {r.title} ({r.points > 0 ? "+" : ""}{r.points} poin)
                  </option>
                ))}
              </select>
            </Kolom>

            {aturanTerpilih && (
              <p className="flex items-center gap-2 rounded-xl bg-surface-2 px-3.5 py-2.5 text-xs text-muted">
                <Icon name={aturanTerpilih.kind === "penghargaan" ? "trophy" : "ppid"} className="h-3.5 w-3.5" />
                {aturanTerpilih.kind === "penghargaan" ? "Penghargaan" : "Pelanggaran"} ·{" "}
                {aturanTerpilih.category ?? "Umum"} · {aturanTerpilih.points} poin
              </p>
            )}

            <Kolom label="Tanggal kejadian" htmlFor={`${id}-tanggal`} galat={galat.occurred_on}>
              <input
                id={`${id}-tanggal`}
                type="date"
                value={tanggal}
                min={data.earliest}
                max={data.today}
                onChange={(e) => setTanggal(e.target.value)}
                className={inputPortal}
              />
            </Kolom>

            <Kolom label="Keterangan" htmlFor={`${id}-catatan`} galat={galat.note}>
              <textarea
                id={`${id}-catatan`}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Misal: Ketahuan saat jam istirahat di kantin…"
                className={inputPortal}
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
              disabled={sibuk || siswa === "" || aturan === ""}
              className="btn-sheen bg-blue-gradient press inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
            >
              {sibuk ? "Mengirim…" : "Kirim Laporan Kedisiplinan"}
            </button>
          </form>
        )}
      </Panel>

      <Panel as="section">
        <PanelTitle icon="attendance" action={<Pill tone="muted">{data.reports.length} laporan</Pill>}>
          Riwayat Laporan Saya
        </PanelTitle>

        {data.reports.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
            Belum ada laporan yang Anda kirim.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                <tr>
                  <th scope="col" className="pb-2.5">Siswa</th>
                  <th scope="col" className="pb-2.5">Tindakan</th>
                  <th scope="col" className="pb-2.5 text-right">Poin</th>
                  <th scope="col" className="pb-2.5 text-right">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.reports.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3">
                      <span className="block font-semibold text-ink">{r.student}</span>
                      <span className="text-xs text-muted">{r.classroom ?? "—"}</span>
                    </td>
                    <td className="py-3">
                      <span className="block text-muted">{r.rule}</span>
                      {r.note && <span className="mt-0.5 block text-xs text-muted">{r.note}</span>}
                    </td>
                    <td className="py-3 text-right">
                      <Pill tone={r.kind === "penghargaan" ? "teal" : "gold"}>{r.points}</Pill>
                    </td>
                    <td className="py-3 text-right text-xs text-muted">{formatDate(r.occurred_on)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
