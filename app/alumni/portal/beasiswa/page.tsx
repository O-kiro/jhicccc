import type { Metadata } from "next";
import { BeasiswaView } from "@/app/components/portal/beasiswa-view";
import { getBeasiswa } from "@/lib/api-alumni";

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

  return <BeasiswaView base="/alumni/portal/beasiswa" data={await getBeasiswa(kategori || undefined)} />;
}
