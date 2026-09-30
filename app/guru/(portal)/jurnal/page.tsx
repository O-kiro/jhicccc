import type { Metadata } from "next";
import { JournalBoard } from "@/app/components/guru/journal-board";
import { TabTautan } from "@/app/components/guru/ui";
import { getJurnal } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Jurnal Mengajar",
  description: "Riwayat jurnal mengajar: materi dan penugasan tiap sesi KBM.",
};

const pilihan = "rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink outline-none focus:border-primary";

export default async function JurnalPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; kelas?: string; mapel?: string }>;
}) {
  const data = await getJurnal(await searchParams);

  /** Tab menjaga saringan kelas/mapel yang sedang dipakai. */
  const tautanTab = (tab: "tahun_ini" | "arsip") => {
    const p = new URLSearchParams();
    if (tab === "arsip") p.set("tab", "arsip");
    if (data.filters.kelas) p.set("kelas", data.filters.kelas);
    if (data.filters.mapel) p.set("mapel", data.filters.mapel);
    const s = p.toString();
    return `/guru/jurnal${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <JournalBoard data={data}>
        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 lg:flex-row lg:items-center lg:justify-between">
          <TabTautan
            label="Periode jurnal"
            items={[
              { href: tautanTab("tahun_ini"), label: `Jurnal Tahun Ini (${data.counts.tahun_ini})`, active: data.tab === "tahun_ini" },
              { href: tautanTab("arsip"), label: `Arsip Jurnal Lama (${data.counts.arsip})`, active: data.tab === "arsip" },
            ]}
          />

          <form action="/guru/jurnal" className="flex flex-wrap items-center gap-2">
            {data.tab === "arsip" && <input type="hidden" name="tab" value="arsip" />}
            <label htmlFor="saring-kelas" className="sr-only">Kelas</label>
            <select id="saring-kelas" name="kelas" defaultValue={data.filters.kelas ?? ""} className={pilihan}>
              <option value="">Semua kelas</option>
              {data.options.kelas.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
            <label htmlFor="saring-mapel" className="sr-only">Mata pelajaran</label>
            <select id="saring-mapel" name="mapel" defaultValue={data.filters.mapel ?? ""} className={pilihan}>
              <option value="">Semua mapel</option>
              {data.options.mapel.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button
              type="submit"
              className="press rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-primary/40 hover:text-primary"
            >
              Saring
            </button>
          </form>
        </div>
      </JournalBoard>
    </div>
  );
}
