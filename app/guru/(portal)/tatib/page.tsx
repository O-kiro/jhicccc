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
    // Redesain: Lapor Tatib dipertahankan 100% — termasuk warna teal
    // aslinya, yang di bagian lain portal guru sudah diganti biru.
    <div className="warna-asli mx-auto max-w-6xl">
      <PageHead
        eyebrow="Lapor Tatib"
        title="Lapor Poin Kedisiplinan"
        desc="Catat pelanggaran maupun penghargaan siswa. Laporan langsung masuk ke modul Kesiswaan di panel madrasah."
      />
      <TatibBoard data={data} />
    </div>
  );
}
