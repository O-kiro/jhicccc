"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";
import { formatDate } from "@/lib/format";
import { Panel, PanelTitle, Pill } from "@/app/components/siswa/ui";
import type { ApiNilai } from "@/lib/api-guru";
import { kirim } from "./kirim";
import { Kolom, inputPortal } from "./modal";

type Kelas = NonNullable<ApiNilai["selected"]>;

/**
 * Lembar nilai satu kelas: satu judul + tanggal, satu nilai per siswa.
 * Memilih penilaian dari riwayat memuat nilainya ke lembar untuk disunting;
 * judul dan tanggal yang sama berarti menimpa, bukan menggandakan.
 */
export function ScoreSheet({ kelas, today }: { kelas: Kelas; today: string }) {
  const router = useRouter();
  const id = useId();

  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState(today);
  const [nilai, setNilai] = useState<Record<number, string>>({});
  const [menyunting, setMenyunting] = useState(false);
  const [galat, setGalat] = useState<Record<string, string>>({});
  const [pesan, setPesan] = useState<{ ok: boolean; teks: string } | null>(null);
  const [sibuk, setSibuk] = useState(false);

  const terisi = kelas.students.filter((s) => (nilai[s.id] ?? "") !== "").length;

  function muat(p: Kelas["assessments"][number]) {
    setJudul(p.title);
    setTanggal(p.assessed_on);
    setNilai(Object.fromEntries(Object.entries(p.scores).map(([k, v]) => [Number(k), String(v)])));
    setMenyunting(true);
    setGalat({});
    setPesan(null);
    document.getElementById(`${id}-lembar`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function kosongkan() {
    setJudul("");
    setTanggal(today);
    setNilai({});
    setMenyunting(false);
    setGalat({});
    setPesan(null);
  }

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    if (sibuk) return;

    setSibuk(true);
    setGalat({});
    setPesan(null);

    const hasil = await kirim<{ saved: number; removed: number }>("/api/guru/nilai", "POST", {
      kelas: kelas.key,
      title: judul,
      assessed_on: tanggal,
      scores: kelas.students.map((s) => {
        const v = (nilai[s.id] ?? "").trim();
        return { student_id: s.id, score: v === "" ? null : Number(v) };
      }),
    });

    setSibuk(false);

    if (hasil.ok) {
      const { saved, removed } = hasil.data;
      setPesan({
        ok: true,
        teks: `${saved} nilai tersimpan${removed > 0 ? `, ${removed} dihapus` : ""}. Siswa sudah bisa melihatnya di Rapor Digital.`,
      });
      setMenyunting(true);
      router.refresh();
      return;
    }

    setGalat(hasil.galat);
    const perKolom = Object.keys(hasil.galat).some((k) => k === "title" || k === "assessed_on");
    setPesan(perKolom ? null : { ok: false, teks: Object.values(hasil.galat)[0] ?? hasil.pesan });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Panel as="section">
        <div id={`${id}-lembar`} className="scroll-mt-24" />
        <PanelTitle
          icon="rdm"
          action={
            <Pill tone={menyunting ? "gold" : "muted"}>{menyunting ? "Menyunting" : "Penilaian baru"}</Pill>
          }
        >
          Lembar Nilai
        </PanelTitle>

        <form onSubmit={simpan} noValidate>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <Kolom label="Judul penilaian" htmlFor={`${id}-judul`} galat={galat.title}>
              <input
                id={`${id}-judul`}
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                maxLength={100}
                placeholder="mis. Ulangan Harian 2"
                className={inputPortal}
              />
            </Kolom>
            <Kolom label="Tanggal" htmlFor={`${id}-tanggal`} galat={galat.assessed_on}>
              <input
                id={`${id}-tanggal`}
                type="date"
                value={tanggal}
                max={today}
                onChange={(e) => setTanggal(e.target.value)}
                className={inputPortal}
              />
            </Kolom>
          </div>

          {kelas.students.length === 0 ? (
            <p className="mt-5 rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
              Belum ada siswa aktif di kelas {kelas.classroom}.
            </p>
          ) : (
            <div className="mt-5 overflow-hidden rounded-xl border border-line">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                  <tr>
                    <th scope="col" className="w-10 px-4 py-2.5">
                      #
                    </th>
                    <th scope="col" className="px-4 py-2.5">
                      Siswa
                    </th>
                    <th scope="col" className="w-28 px-4 py-2.5 text-right">
                      Nilai
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {kelas.students.map((s, i) => {
                    const v = nilai[s.id] ?? "";
                    const salah = v !== "" && (Number(v) < 0 || Number(v) > 100);
                    return (
                      <tr key={s.id}>
                        <td className="px-4 py-2.5 tabular-nums text-muted">{i + 1}</td>
                        <td className="px-4 py-2.5">
                          <label htmlFor={`${id}-n-${s.id}`} className="block font-semibold text-ink">
                            {s.name}
                          </label>
                          <span className="text-[11px] text-muted">NISN {s.nisn}</span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <input
                            id={`${id}-n-${s.id}`}
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={100}
                            value={v}
                            onChange={(e) => setNilai({ ...nilai, [s.id]: e.target.value })}
                            aria-invalid={salah || undefined}
                            className={cn(
                              inputPortal,
                              "w-20 px-3 py-2 text-right tabular-nums",
                              salah && "border-gold-strong",
                            )}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-3 text-xs text-muted">
            Nilai 0–100. Kosongkan untuk siswa yang belum dinilai — saat menyunting, mengosongkan nilai berarti
            menghapusnya.
          </p>

          {pesan && (
            <p
              role={pesan.ok ? "status" : "alert"}
              className={cn(
                "mt-4 flex items-start gap-2 text-sm font-semibold",
                pesan.ok ? "text-teal" : "text-gold-strong",
              )}
            >
              <Icon name={pesan.ok ? "check" : "ppid"} className="mt-0.5 h-4 w-4 shrink-0" />
              {pesan.teks}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-semibold text-muted">
              {terisi} dari {kelas.students.length} siswa terisi
            </span>
            <span className="flex gap-3">
              {(menyunting || judul !== "" || terisi > 0) && (
                <button
                  type="button"
                  onClick={kosongkan}
                  disabled={sibuk}
                  className="press rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:text-ink"
                >
                  Penilaian Baru
                </button>
              )}
              <button
                type="submit"
                disabled={sibuk || judul.trim() === "" || kelas.students.length === 0}
                className="btn-sheen bg-blue-gradient press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
              >
                {sibuk ? "Menyimpan…" : "Simpan Nilai"}
              </button>
            </span>
          </div>
        </form>
      </Panel>

      <Panel as="section" className="h-fit">
        <PanelTitle icon="chart">Riwayat Penilaian</PanelTitle>
        {kelas.assessments.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
            Belum ada nilai {kelas.subject} untuk kelas {kelas.classroom}.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {kelas.assessments.map((p) => (
              <li key={`${p.assessed_on}-${p.title}`}>
                <button
                  type="button"
                  onClick={() => muat(p)}
                  className="press flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 p-3.5 text-left transition-colors hover:border-ink/20"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-ink">{p.title || "Tanpa judul"}</span>
                    <span className="mt-0.5 block text-xs text-muted">
                      {formatDate(p.assessed_on)} · {p.count} siswa
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-display text-lg font-extrabold tabular-nums text-ink">
                      {p.average.toFixed(1)}
                    </span>
                    <span className="block text-[11px] font-semibold text-muted">rata-rata</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-muted">Pilih salah satu untuk menyunting nilainya.</p>
      </Panel>
    </div>
  );
}
