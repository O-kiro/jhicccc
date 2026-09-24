import type { Metadata } from "next";
import { Icon } from "@/app/components/icons";
import { PageHead, Panel } from "@/app/components/siswa/ui";
import { RdmBoard } from "@/app/components/guru/rdm-board";
import { getRdm } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "RDM",
  description: "Unggah berkas rapor digital madrasah dan tulis catatan untuk siswa.",
};

export default async function RdmPage() {
  const data = await getRdm();
  // Tahun ajaran kelas yang diampu dipakai sebagai isian awal.
  const tahunAjaran = data.classrooms[0]?.academic_year ?? "";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="RDM"
        title="Rapor Digital Madrasah"
        desc="Unggah berkas rapor per kelas, lalu tulis catatan guru yang akan dibaca siswa di Rapor Digital mereka."
      />

      <Panel className="mb-6 flex items-start gap-3 border-teal/30 bg-teal-soft/20">
        <Icon name="help" className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
        <p className="text-xs leading-relaxed text-muted">
          Catatan yang Anda tulis di halaman ini langsung muncul di bagian <strong>Catatan Guru</strong> pada
          Rapor Digital siswa yang bersangkutan.
        </p>
      </Panel>

      <RdmBoard data={data} tahunAjaran={tahunAjaran} />
    </div>
  );
}
