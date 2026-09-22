import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/styles";
import { PageHead } from "@/app/components/siswa/ui";
import { ScoreSheet } from "@/app/components/guru/score-sheet";
import { getNilai } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Penilaian",
  description: "Input nilai per kelas yang langsung masuk ke Rapor Digital siswa.",
};

export default async function NilaiPage({
  searchParams,
}: {
  searchParams: Promise<{ kelas?: string }>;
}) {
  const { kelas } = await searchParams;
  const { classes, selected, today } = await getNilai(kelas);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Penilaian"
        title={selected ? `${selected.subject} · ${selected.classroom}` : "Input Nilai"}
        desc="Nilai yang disimpan langsung muncul di Rapor Digital siswa — grafik Sejarah Nilai dan Penilaian Terbaru."
      />

      {classes.length === 0 ? (
        <p className="rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
          Belum ada kelas yang Anda ampu. Kelas diambil dari jadwal mengajar dan kursus yang disusun Wakasek
          Kurikulum.
        </p>
      ) : (
        <>
          {/* Tautan biasa: pilihan kelas ikut tersimpan di URL dan bisa dibagikan. */}
          <nav aria-label="Pilih kelas" className="mb-6 flex flex-wrap gap-2">
            {classes.map((k) => {
              const aktif = k.key === selected?.key;
              return (
                <Link
                  key={k.key}
                  href={`/guru/nilai?kelas=${encodeURIComponent(k.key)}`}
                  aria-current={aktif ? "page" : undefined}
                  className={cn(
                    "press rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    aktif ? "bg-ink text-canvas" : "border border-line text-muted hover:border-ink/25 hover:text-ink",
                  )}
                >
                  {k.subject} · {k.classroom}
                </Link>
              );
            })}
          </nav>

          {/* key: berganti kelas berarti lembar baru, bukan sisa isian kelas lain. */}
          {selected && <ScoreSheet key={selected.key} kelas={selected} today={today} />}
        </>
      )}
    </div>
  );
}
