import type { Metadata } from "next";
import { ActivityBoard } from "@/app/components/guru/activity-board";
import { TabTautan } from "@/app/components/guru/ui";
import { getJurnalHarian } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Jurnal Harian",
  description: "Catatan kegiatan sekolah di luar jam mengajar kelas.",
};

const tanggalInput =
  "rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink outline-none focus:border-primary";

export default async function JurnalHarianPage({
  searchParams,
}: {
  searchParams: Promise<{ dari?: string; sampai?: string; tab?: string }>;
}) {
  const { dari = "", sampai = "", tab = "" } = await searchParams;
  const data = await getJurnalHarian(dari || undefined, sampai || undefined, tab || undefined);

  /** Tab menjaga rentang tanggal yang sedang dipakai. */
  const tautanTab = (t: "tahun_ini" | "arsip") => {
    const p = new URLSearchParams();
    if (t === "arsip") p.set("tab", "arsip");
    if (data.filters.dari) p.set("dari", data.filters.dari);
    if (data.filters.sampai) p.set("sampai", data.filters.sampai);
    const s = p.toString();
    return `/guru/jurnal-harian${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <ActivityBoard data={data}>
        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Rentang tanggal lewat URL: hasil saringan bisa dibagikan. */}
          <form action="/guru/jurnal-harian" className="flex flex-wrap items-center gap-2">
            {data.tab === "arsip" && <input type="hidden" name="tab" value="arsip" />}
            <label htmlFor="dari" className="sr-only">Dari tanggal</label>
            <input id="dari" type="date" name="dari" defaultValue={data.filters.dari ?? ""} max={data.today} className={tanggalInput} />
            <span className="text-sm text-muted">s/d</span>
            <label htmlFor="sampai" className="sr-only">Sampai tanggal</label>
            <input id="sampai" type="date" name="sampai" defaultValue={data.filters.sampai ?? ""} max={data.today} className={tanggalInput} />
            <button
              type="submit"
              className="press rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-primary/40 hover:text-primary"
            >
              Saring
            </button>
          </form>

          <TabTautan
            label="Periode kegiatan"
            items={[
              { href: tautanTab("tahun_ini"), label: `Tahun Ini (${data.counts.tahun_ini})`, active: data.tab === "tahun_ini" },
              { href: tautanTab("arsip"), label: `Arsip Lama (${data.counts.arsip})`, active: data.tab === "arsip" },
            ]}
          />
        </div>
      </ActivityBoard>
    </div>
  );
}
