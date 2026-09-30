import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { MaterialBoard } from "@/app/components/guru/material-board";
import { getBahanAjar } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Bahan Ajar",
  description: "Koleksi bahan ajar dan LKPD untuk modul pembelajaran siswa.",
};

export default async function BahanAjarPage() {
  const data = await getBahanAjar();

  return (
    <div className="mx-auto max-w-6xl">
      <MaterialBoard data={data}>
        {/* Kelas & Materi tidak lagi punya menu sendiri (redesain Figma);
            modul kursus yang dibaca siswa tetap dikelola di sana. */}
        <Link
          href="/guru/kelas"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          Kelola modul kursus yang dibaca siswa (Kelas &amp; Materi)
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </MaterialBoard>
    </div>
  );
}
