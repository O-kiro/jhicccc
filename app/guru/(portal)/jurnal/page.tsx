import type { Metadata } from "next";
import { PageHead } from "@/app/components/siswa/ui";
import { JournalBoard } from "@/app/components/guru/journal-board";
import { getJurnal } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Jurnal Mengajar",
  description: "Catat materi dan kehadiran tiap sesi mengajar.",
};

export default async function JurnalPage() {
  const data = await getJurnal();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Jurnal Mengajar"
        title="Catatan Tiap Sesi"
        desc="Materi dan kehadiran yang Anda catat di sini langsung terpantau di modul Jurnal KBM milik Wakasek Kurikulum."
      />
      <JournalBoard data={data} />
    </div>
  );
}
