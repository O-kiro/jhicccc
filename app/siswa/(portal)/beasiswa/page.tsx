import type { Metadata } from "next";
import { BeasiswaView } from "@/app/components/portal/beasiswa-view";
import { getScholarships } from "@/lib/api";

export const metadata: Metadata = {
  title: "Portal Beasiswa",
  description: "Katalog beasiswa prestasi, riset, tahfidz, dan bantuan pendidikan MAN Kota Batu.",
};

export default async function BeasiswaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori = "" } = await searchParams;

  return <BeasiswaView base="/siswa/beasiswa" data={await getScholarships(kategori || undefined)} />;
}
