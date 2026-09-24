import type { Metadata } from "next";
import { LibraryView } from "@/app/components/portal/library-view";
import { getLibrary } from "@/lib/api";

export const metadata: Metadata = {
  title: "Perpustakaan",
  description: "Perpustakaan digital madrasah — koleksi, pinjaman berjalan, dan bacaan terakhir.",
};

export default async function PerpustakaanPage() {
  return <LibraryView base="/siswa" data={await getLibrary()} />;
}
