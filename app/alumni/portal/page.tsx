import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { Panel, PanelTitle } from "@/app/components/siswa/ui";
import { getAlumniOverview } from "@/lib/api-alumni";
import type { IconName } from "@/lib/content";
import { cn } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Overview",
  description: "Jejaring karir, beasiswa lanjutan, dan sebaran alumni MAN Kota Batu.",
};

/** "2026-09-22T…" → "22 Sep 2026". */
function tanggalSingkat(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${d} ${bulan[m - 1]} ${y}`;
}

export default async function AlumniOverviewPage() {
  const { summary, announcements } = await getAlumniOverview();

  // Warna kotak ikon mengikuti desain Figma, tidak ikut tema.
  const stats: { label: string; value: string; note?: string; icon: IconName; kotak: string }[] = [
    {
      label: "Total Alumni Aktif",
      value: String(summary.alumni_terdata),
      note: summary.tahun ? `Kelulusan ${summary.tahun}` : undefined,
      icon: "users",
      kotak: "bg-[#e0edff] text-[#1e62d0]",
    },
    {
      label: "Lolos PTN & Kedinasan",
      value: `${summary.lanjut_studi_negeri_persen.toFixed(1)}%`,
      note: `${summary.lanjut_studi_negeri} dari ${summary.alumni_terdata} Alumni`,
      icon: "trophy",
      kotak: "bg-[#dcfce7] text-[#15803d]",
    },
    {
      label: "Program Beasiswa",
      value: `${summary.program_beasiswa} Program`,
      note: `${summary.kuota_beasiswa} kuota tersedia`,
      icon: "sparkle",
      kotak: "bg-[#fef3c7] text-[#b45309]",
    },
    {
      label: "Aktivitas Forum",
      value: `${summary.topik_forum}+ Topik`,
      note: `${summary.anggota_forum}+ Alumni Terhubung`,
      icon: "chat",
      kotak: "bg-[#d1fae5] text-[#047857]",
    },
  ];

  const modul = [
    {
      href: "/alumni/portal/beasiswa",
      icon: "trophy" as const,
      title: "Portal Beasiswa",
      desc: "Info beasiswa riset, olimpiade, tahfidz, dan bantuan pendidikan yang sedang dibuka beserta kuotanya.",
      cta: "Buka Portal Beasiswa",
      tombol: "bg-[#d97706] hover:bg-[#b45309]",
    },
    {
      href: "/alumni/portal/statistik",
      icon: "chart" as const,
      title: "Statistik & Sebaran Alumni",
      desc: "Pemetaan serapan kelulusan ke PTN, perguruan tinggi swasta, sekolah kedinasan, dan dunia kerja.",
      cta: "Lihat Data Statistik & Sebaran",
      tombol: "bg-[#2563eb] hover:bg-[#1d4ed8]",
    },
    {
      href: "/alumni/portal/forum",
      icon: "chat" as const,
      title: "Forum Alumni & Jejaring Karir",
      desc: "Silaturahmi, tips karir, persiapan kuliah, dan peluang kerja lintas angkatan.",
      cta: "Masuk ke Forum Alumni",
      tombol: "bg-[#114b3e] hover:bg-[#0c372d]",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero — kartu biru es (Figma) */}
      <Reveal>
        <section className="relative overflow-hidden rounded-panel border border-primary/15 bg-[#f0f6ff] p-7 dark:bg-primary-soft sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/5" />
          <div className="relative max-w-2xl">
            <h1 className="font-display text-[clamp(1.75rem,3.6vw,2.6rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink">
              Selamat Datang di Portal Alumni MAN Kota Batu
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#475569] dark:text-muted sm:text-base">
              Wadah silaturahmi, pusat info karir, peluang beasiswa lanjutan, dan direktori sebaran alumni MAN
              Kota Batu lintas angkatan.
            </p>
            <Link
              href="/alumni/portal/forum"
              className="press group mt-7 inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
            >
              Masuk ke Forum Alumni
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </Reveal>

      {/* Highlight 4 kartu */}
      <h2 className="mb-4 mt-10 font-display text-xl font-extrabold text-ink">
        Tentang Layanan &amp; Ruang Komunitas Alumni
      </h2>
      <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <Panel className="h-full">
              <span className={cn("grid h-11 w-11 place-items-center rounded-xl", s.kotak)}>
                <Icon name={s.icon} className="h-5 w-5" />
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.06em] text-muted">{s.label}</p>
              <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-ink">{s.value}</p>
              {s.note && <p className="mt-0.5 text-xs text-muted">{s.note}</p>}
            </Panel>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Modul utama — tombol solid berwarna */}
      <StaggerGroup className="mt-6 grid gap-4 lg:grid-cols-3">
        {modul.map((m) => (
          <StaggerItem key={m.href}>
            <Panel className="flex h-full flex-col">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon name={m.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-extrabold leading-tight text-ink">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{m.desc}</p>
              <div className="mt-auto pt-5">
                <Link
                  href={m.href}
                  className={cn(
                    "press group inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-colors",
                    m.tombol,
                  )}
                >
                  {m.cta}
                  <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </Panel>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Pemberitahuan — baris bernomor */}
      <Reveal delay={0.05}>
        <Panel as="section" className="mt-6">
          <PanelTitle icon="bell">Pemberitahuan &amp; Agenda Madrasah Terkini</PanelTitle>
          {announcements.length === 0 ? (
            <p className="rounded-xl border border-line bg-surface-2 p-5 text-sm text-muted">Belum ada pemberitahuan.</p>
          ) : (
            <ol className="divide-y divide-line">
              {announcements.map((n, i) => (
                <li key={n.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft font-display text-sm font-extrabold tabular-nums text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-sm font-extrabold leading-snug text-ink">{n.title}</span>
                    {n.body && <span className="mt-0.5 block line-clamp-1 text-xs text-muted">{n.body}</span>}
                  </span>
                  {n.published_at && (
                    <time dateTime={n.published_at} className="shrink-0 text-xs font-semibold tabular-nums text-muted">
                      {tanggalSingkat(n.published_at)}
                    </time>
                  )}
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </Reveal>
    </div>
  );
}
