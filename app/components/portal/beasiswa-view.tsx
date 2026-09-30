import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn } from "@/lib/styles";
import { HeaderCard } from "@/app/components/guru/ui";
import type { ApiBeasiswa } from "@/lib/api-alumni";
import { formatDate } from "@/lib/format";

/**
 * Warna kartu menurut status (redesain Figma): garis atas, penanda status,
 * dan tombol. Nilai tetap, tidak ikut tema — hijau/amber/merah adalah makna.
 */
const STATUS = {
  dibuka: {
    garis: "border-t-[#0d5c3a]",
    penanda: <span className="text-sm font-semibold text-[#0d5c3a] dark:text-[#34a98a]">Pendaftaran Dibuka</span>,
    tombol: "bg-[#0d5c3a] hover:bg-[#0a4a2e]",
  },
  segera_ditutup: {
    garis: "border-t-[#d97706]",
    penanda: (
      <span className="rounded-md bg-[#d97706]/15 px-2 py-0.5 text-[11px] font-extrabold tracking-wide text-[#d97706]">
        SEGERA DITUTUP
      </span>
    ),
    tombol: "bg-[#d97706] hover:bg-[#b45309]",
  },
  ditutup: {
    garis: "border-t-[#e11d48]",
    penanda: (
      <span className="rounded-md bg-[#e11d48]/12 px-2 py-0.5 text-[11px] font-extrabold tracking-wide text-[#e11d48]">
        DITUTUP
      </span>
    ),
    tombol: "",
  },
} as const;

/**
 * Katalog beasiswa — sama untuk portal alumni dan portal siswa. Endpoint-nya
 * pun berisi katalog yang sama; yang berbeda hanya `base`, alamat halaman
 * beasiswa portal yang sedang dipakai (untuk tautan filter kategori).
 */
export function BeasiswaView({ base, data }: { base: string; data: ApiBeasiswa }) {
  const { categories, selected, scholarships } = data;

  const tautan = (k: string) => (k ? `${base}?kategori=${encodeURIComponent(k)}` : base);

  return (
    <div className="mx-auto max-w-6xl">
      <HeaderCard
        icon="trophy"
        title="Portal Program Beasiswa"
        desc="Kelola informasi, pendaftaran, dan verifikasi program beasiswa prestasi & bantuan pendidikan siswa MAN Kota Batu."
      >
        {/* Tautan biasa: kategori terpilih ikut tersimpan di URL. */}
        <nav aria-label="Kategori beasiswa" className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
          {["", ...categories].map((k) => {
            const aktif = k === (selected ?? "");
            return (
              <Link
                key={k || "semua"}
                href={tautan(k)}
                scroll={false}
                aria-current={aktif ? "page" : undefined}
                className={cn(
                  "press rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  aktif ? "bg-primary text-white" : "border border-line text-muted hover:border-primary/40 hover:text-primary",
                )}
              >
                {k || "Semua Program"}
              </Link>
            );
          })}
        </nav>
      </HeaderCard>

      {scholarships.length === 0 ? (
        <p className="mt-6 rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
          Belum ada program pada kategori ini.
        </p>
      ) : (
        <StaggerGroup className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scholarships.map((b) => {
            const s = STATUS[b.status];
            const tertutup = b.status === "ditutup";
            return (
              <StaggerItem key={b.id}>
                <article
                  className={cn(
                    "flex h-full flex-col rounded-card border border-t-4 border-line bg-surface p-5 sm:p-6",
                    s.garis,
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">{b.category}</span>
                    {s.penanda}
                  </div>

                  <h3 className="mt-3 font-display text-lg font-extrabold leading-tight text-ink">{b.name}</h3>

                  {b.benefits && (
                    <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-muted">
                      <Icon name="sparkle" className="mt-0.5 h-4 w-4 shrink-0 text-gold-strong" />
                      {b.benefits}
                    </p>
                  )}
                  {b.target && (
                    <p className="mt-1.5 flex items-start gap-2 text-xs leading-relaxed text-muted">
                      <Icon name="users" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {b.target}
                    </p>
                  )}

                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-4 text-sm">
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Kuota</dt>
                      <dd className="mt-0.5 font-display font-extrabold tabular-nums text-ink">
                        {tertutup ? "—" : `${b.quota} kursi`}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">Batas Akhir</dt>
                      <dd className="mt-0.5 font-semibold text-ink">{b.deadline ? formatDate(b.deadline) : "—"}</dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-5">
                    {tertutup ? (
                      <span
                        aria-disabled="true"
                        className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-[#e11d48]/80 px-4 py-2.5 text-sm font-extrabold tracking-wide text-white"
                      >
                        DITUTUP
                      </span>
                    ) : b.url ? (
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "press group inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                          s.tombol,
                        )}
                      >
                        Lihat Selengkapnya
                        <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    ) : (
                      <p className="rounded-full border border-dashed border-line px-4 py-2.5 text-center text-xs font-semibold text-muted">
                        Pendaftaran lewat tata usaha madrasah
                      </p>
                    )}
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      )}
    </div>
  );
}
