import type { Metadata } from "next";
import { PortalLibraryPage } from "@/app/components/portal/library-page";
import { getLibrary, getLibraryCatalogue } from "@/lib/api";

export const metadata: Metadata = {
  title: "Perpustakaan",
  description: "Perpustakaan digital madrasah — kategori, pinjaman berjalan, buku baru, dan katalog.",
};

export default async function PerpustakaanPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string; page?: string }>;
}) {
  const { q = "", kategori = "", page = "1" } = await searchParams;
  const halaman = Math.max(1, Number.parseInt(page, 10) || 1);

  const [library, katalog] = await Promise.all([
    getLibrary(),
    getLibraryCatalogue(q.trim() || undefined, kategori || undefined, halaman),
  ]);

  return <PortalLibraryPage base="/siswa/perpustakaan" library={library} katalog={katalog} q={q} kategori={kategori} />;
}
