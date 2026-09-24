import type { Metadata } from "next";
import { PageHead } from "@/app/components/siswa/ui";
import { ActivityBoard } from "@/app/components/guru/activity-board";
import { getJurnalHarian } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Jurnal Harian",
  description: "Catatan kegiatan guru dan tendik di luar jam mengajar kelas.",
};

export default async function JurnalHarianPage({
  searchParams,
}: {
  searchParams: Promise<{ dari?: string; sampai?: string }>;
}) {
  const { dari = "", sampai = "" } = await searchParams;
  const data = await getJurnalHarian(dari || undefined, sampai || undefined);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Jurnal Harian"
        title="Jurnal Harian Guru & Tendik"
        desc="Catatan kegiatan sekolah di luar jam mengajar kelas, boleh dilampiri bukti foto."
      />

      {/* Rentang tanggal lewat URL: hasil saringan bisa dibagikan. */}
      <form action="/guru/jurnal-harian" className="mb-6 flex flex-wrap items-end gap-3">
        <span>
          <label htmlFor="dari" className="mb-1.5 block text-xs font-semibold text-muted">Dari tanggal</label>
          <input
            id="dari"
            type="date"
            name="dari"
            defaultValue={data.filters.dari ?? ""}
            max={data.today}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink outline-none focus:border-blue"
          />
        </span>
        <span>
          <label htmlFor="sampai" className="mb-1.5 block text-xs font-semibold text-muted">Sampai tanggal</label>
          <input
            id="sampai"
            type="date"
            name="sampai"
            defaultValue={data.filters.sampai ?? ""}
            max={data.today}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink outline-none focus:border-blue"
          />
        </span>
        <button
          type="submit"
          className="press rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
        >
          Saring
        </button>
      </form>

      <ActivityBoard data={data} />
    </div>
  );
}
