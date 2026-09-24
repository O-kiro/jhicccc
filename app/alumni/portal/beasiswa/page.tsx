import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn } from "@/lib/styles";
import { PageHead, Panel, Pill, Progress, StatCard } from "@/app/components/siswa/ui";
import { getBeasiswa } from "@/lib/api-alumni";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Portal Beasiswa",
  description: "Katalog beasiswa prestasi, riset, tahfidz, dan bantuan pendidikan MAN Kota Batu.",
};

/** Warna badge mengikuti status; merah hanya untuk yang benar-benar tertutup. */
const NADA = {
  dibuka: { pill: "teal" as const, kelas: "border-teal/35" },
  segera_ditutup: { pill: "gold" as const, kelas: "border-gold/40" },
  ditutup: { pill: "muted" as const, kelas: "border-line opacity-75" },
};

export default async function BeasiswaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori = "" } = await searchParams;
  const { summary, categories, selected, scholarships } = await getBeasiswa(kategori || undefined);

  const stats = [
    {
      label: "Program Aktif",
      value: String(summary.program_aktif),
      note: `dari ${summary.program_total} program terdaftar`,
      icon: "sparkle" as const,
      tone: "teal" as const,
    },
    {
      label: "Kuota Tersedia",
      value: String(summary.kuota),
      note: "kursi pada program aktif",
      icon: "users" as const,
      tone: "blue" as const,
    },
    {
      label: "Pendaftar Masuk",
      value: String(summary.pendaftar),
      note: `${summary.terverifikasi} lolos verifikasi`,
      icon: "chart" as const,
      tone: "gold" as const,
    },
    {
      label: "Penyerapan Kursi",
      value: `${summary.penyerapan}%`,
      note: `sisa ${summary.sisa_kuota} kursi`,
      icon: "trophy" as const,
      tone: "teal" as const,
    },
  ];

  const tautan = (k: string) =>
    k ? `/alumni/portal/beasiswa?kategori=${encodeURIComponent(k)}` : "/alumni/portal/beasiswa";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Portal Beasiswa"
        title="Program Beasiswa Madrasah"
        desc="Informasi program beasiswa prestasi, riset, tahfidz, dan bantuan pendidikan beserta kuotanya."
      />

      <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <StatCard {...s} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal>
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-extrabold text-ink">Katalog Program</h2>
            <span className="text-xs font-semibold text-muted">{scholarships.length} program</span>
          </div>

          {/* Tautan biasa: kategori terpilih ikut tersimpan di URL. */}
          <nav aria-label="Kategori beasiswa" className="flex flex-wrap gap-2">
            {["", ...categories].map((k) => {
              const aktif = k === (selected ?? "");
              return (
                <Link
                  key={k || "semua"}
                  href={tautan(k)}
                  aria-current={aktif ? "page" : undefined}
                  className={cn(
                    "press rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    aktif
                      ? "bg-ink text-canvas"
                      : "border border-line text-muted hover:border-ink/25 hover:text-ink",
                  )}
                >
                  {k || "Semua Program"}
                </Link>
              );
            })}
          </nav>
        </div>
      </Reveal>

      {scholarships.length === 0 ? (
        <p className="mt-6 rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
          Belum ada program pada kategori ini.
        </p>
      ) : (
        <StaggerGroup className="mt-6 grid gap-4 lg:grid-cols-2">
          {scholarships.map((b) => {
            const nada = NADA[b.status];
            const tertutup = b.status === "ditutup";
            return (
              <StaggerItem key={b.id}>
                <Panel as="article" className={cn("flex h-full flex-col border", nada.kelas)}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <Pill tone="blue">{b.category}</Pill>
                    <Pill tone={nada.pill}>{b.status_label}</Pill>
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
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                        Batas Akhir
                      </dt>
                      <dd className="mt-0.5 font-semibold text-ink">
                        {b.deadline ? formatDate(b.deadline) : "—"}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-auto pt-4">
                    {tertutup ? (
                      <p className="rounded-full bg-surface-2 px-4 py-2.5 text-center text-xs font-semibold text-muted">
                        Pendaftaran sudah ditutup
                      </p>
                    ) : b.url ? (
                      <a
                        href={b.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-sheen bg-blue-gradient press group inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                      >
                        Lihat Selengkapnya
                        <Icon name="external" className="h-4 w-4" />
                      </a>
                    ) : (
                      <p className="rounded-full border border-dashed border-line px-4 py-2.5 text-center text-xs font-semibold text-muted">
                        Pendaftaran lewat tata usaha madrasah
                      </p>
                    )}
                  </div>
                </Panel>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      )}

      <Reveal delay={0.05}>
        <Panel as="section" className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-base font-extrabold text-ink">Penyerapan Kursi Beasiswa</h2>
              <p className="mt-1 text-xs text-muted">
                {summary.terverifikasi} dari {summary.kuota} kursi sudah terisi pendaftar terverifikasi.
              </p>
            </div>
            <span className="font-display text-2xl font-extrabold tabular-nums text-ink">
              {summary.penyerapan}%
            </span>
          </div>
          <div className="mt-4">
            <Progress value={summary.penyerapan} tone="gold" label="Penyerapan kursi beasiswa" />
          </div>
        </Panel>
      </Reveal>
    </div>
  );
}
