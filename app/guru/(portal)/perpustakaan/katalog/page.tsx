import type { Metadata } from "next";
import { CatalogueView } from "@/app/components/portal/catalogue-view";
import { getLibraryCatalogue } from "@/lib/api";

export const metadata: Metadata = {
  title: "Katalog Buku",
  description: "Seluruh koleksi perpustakaan digital madrasah.",
};

export default async function KatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kategori?: string }>;
}) {
  const { q = "", kategori = "" } = await searchParams;
  const katalog = await getLibraryCatalogue(q.trim() || undefined, kategori || undefined);

  return <CatalogueView base="/guru" q={q} kategori={kategori} katalog={katalog} />;
}
