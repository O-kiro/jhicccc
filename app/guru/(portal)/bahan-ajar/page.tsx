import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/styles";
import { PageHead } from "@/app/components/siswa/ui";
import { MaterialBoard } from "@/app/components/guru/material-board";
import { getBahanAjar } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Bahan Ajar & LKPD",
  description: "Koleksi lembar kerja dan rangkuman materi siswa.",
};

export default async function BahanAjarPage({
  searchParams,
}: {
  searchParams: Promise<{ jenis?: string }>;
}) {
  const { jenis = "" } = await searchParams;
  const data = await getBahanAjar(jenis || undefined);
  const total = Object.values(data.counts).reduce((n, v) => n + v, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Bahan Ajar & LKPD"
        title="Koleksi LKPD & Bahan Ajar"
        desc="Kelola lembar kerja dan rangkuman materi siswa. Berkasnya ditautkan dari Drive madrasah, bukan diunggah ulang."
      />

      <nav aria-label="Jenis dokumen" className="mb-5 flex flex-wrap gap-2">
        {[["", `Semua (${total})`], ...Object.entries(data.types).map(([k, l]) => [k, `${l} (${data.counts[k] ?? 0})`])].map(
          ([kunci, label]) => {
            const aktif = kunci === (data.selected ?? "");
            return (
              <Link
                key={kunci || "semua"}
                href={kunci ? `/guru/bahan-ajar?jenis=${kunci}` : "/guru/bahan-ajar"}
                aria-current={aktif ? "page" : undefined}
                className={cn(
                  "press rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  aktif ? "bg-ink text-canvas" : "border border-line text-muted hover:border-ink/25 hover:text-ink",
                )}
              >
                {label}
              </Link>
            );
          },
        )}
      </nav>

      <MaterialBoard data={data} />
    </div>
  );
}
