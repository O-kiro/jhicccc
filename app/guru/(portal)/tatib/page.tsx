import type { Metadata } from "next";
import { PageHead } from "@/app/components/siswa/ui";
import { TatibBoard } from "@/app/components/guru/tatib-board";
import { getTatib } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Lapor Tatib",
  description: "Laporkan poin kedisiplinan siswa; laporannya masuk ke modul Kesiswaan.",
};

export default async function TatibPage() {
  const data = await getTatib();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Lapor Tatib"
        title="Lapor Poin Kedisiplinan"
        desc="Catat pelanggaran maupun penghargaan siswa. Laporan langsung masuk ke modul Kesiswaan di panel madrasah."
      />
      <TatibBoard data={data} />
    </div>
  );
}
