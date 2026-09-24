import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn, toneSoft } from "@/lib/styles";
import { Panel, PanelTitle, StatCard } from "@/app/components/siswa/ui";
import { getAlumniOverview } from "@/lib/api-alumni";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Overview",
  description: "Jejaring karir, beasiswa lanjutan, dan sebaran alumni MAN Kota Batu.",
};

export default async function AlumniOverviewPage() {
  const { alumni, summary, announcements } = await getAlumniOverview();

  const stats = [
    {
      label: "Alumni Terdata",
      value: String(summary.alumni_terdata),
      note: summary.tahun ? `Kelulusan ${summary.tahun}` : "Belum ada rekap",
      icon: "users" as const,
      tone: "blue" as const,
    },
    {
      label: "Lanjut ke PTN & Kedinasan",
      value: `${summary.lanjut_studi_negeri_persen}%`,
      note: `${summary.lanjut_studi_negeri} dari ${summary.alumni_terdata} alumni`,
      icon: "trophy" as const,
      tone: "teal" as const,
    },
    {
      label: "Program Beasiswa",
      value: String(summary.program_beasiswa),
      note: `${summary.kuota_beasiswa} kuota tersedia`,
      icon: "sparkle" as const,
      tone: "gold" as const,
    },
    {
      label: "Aktivitas Forum",
      value: String(summary.topik_forum),
      note: `${summary.anggota_forum} alumni terhubung`,
      icon: "chat" as const,
      tone: "teal" as const,
    },
  ];

  const modul = [
    {
      href: "/alumni/portal/beasiswa",
      icon: "trophy" as const,
      tone: "gold" as const,
      title: "Portal Beasiswa",
      desc: "Info beasiswa riset, tahfidz, dan bantuan pendidikan yang sedang dibuka.",
      metaLabel: "Kuota terbuka",
      meta: `${summary.kuota_beasiswa} kursi`,
      cta: "Buka Portal Beasiswa",
    },
    {
      href: "/alumni/portal/statistik",
      icon: "chart" as const,
      tone: "blue" as const,
      title: "Statistik & Sebaran Alumni",
      desc: "Pemetaan serapan kelulusan ke PTN, sekolah kedinasan, dan dunia kerja.",
      metaLabel: "Total rekap",
      meta: `${summary.alumni_terdata} alumni`,
      cta: "Lihat Data Sebaran",
    },
    {
      href: "/alumni/portal/forum",
      icon: "chat" as const,
      tone: "teal" as const,
      title: "Forum Alumni & Jejaring Karir",
      desc: "Silaturahmi, tips karir, persiapan kuliah, dan peluang lintas angkatan.",
      metaLabel: "Alumni terhubung",
      meta: `${summary.anggota_forum} anggota`,
      cta: "Masuk ke Forum Alumni",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <Reveal>
        <section className="bg-teal-gradient relative overflow-hidden rounded-panel p-7 text-on-dark sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-40 w-40 rounded-full bg-white/5" />
          <div className="relative max-w-2xl">
            <span className="eyebrow text-gold">
              <Icon name="star8" className="h-3.5 w-3.5" strokeWidth={1.4} />
              Alumni &amp; Jejaring Karir
            </span>
            <h1 className="mt-3 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-tight tracking-[-0.03em]">
              Selamat datang kembali, {alumni.name}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-on-dark/80 sm:text-base">
              Wadah silaturahmi, pusat info karir, peluang beasiswa lanjutan, dan direktori sebaran alumni
              MAN Kota Batu lintas angkatan.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold">
                <Icon name="users" className="h-4 w-4 text-gold" />
                {alumni.angkatan}
                {alumni.occupation ? ` · ${alumni.occupation}` : ""}
              </span>
              <Link
                href="/alumni/portal/forum"
                className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-sm font-semibold text-teal transition-transform hover:-translate-y-0.5"
              >
                Masuk ke Forum Alumni
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/alumni/portal/beasiswa"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                <Icon name="trophy" className="h-4 w-4" />
                Lihat Beasiswa
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <StaggerGroup className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <StatCard {...s} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal>
        <h2 className="mb-4 mt-10 font-display text-xl font-extrabold text-ink">Akses Modul Utama</h2>
      </Reveal>
      <StaggerGroup className="grid gap-4 lg:grid-cols-3">
        {modul.map((m) => (
          <StaggerItem key={m.href}>
            <Link href={m.href} className="block h-full">
              <Panel className="card-glow flex h-full flex-col transition-shadow hover:shadow-card">
                <span className={cn("grid h-11 w-11 place-items-center rounded-xl", toneSoft[m.tone])}>
                  <Icon name={m.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-extrabold leading-tight text-ink">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{m.desc}</p>
                <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
                  <span>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                      {m.metaLabel}
                    </span>
                    <span className="mt-0.5 block font-display text-base font-extrabold text-ink">{m.meta}</span>
                  </span>
                  <span className="press inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                    {m.cta}
                    <Icon name="arrow" className="h-4 w-4" />
                  </span>
                </div>
              </Panel>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <Reveal delay={0.05}>
        <Panel as="section" className="mt-6">
          <div id="pengumuman" className="scroll-mt-24" />
          <PanelTitle icon="bell">Pemberitahuan &amp; Agenda Madrasah</PanelTitle>
          {announcements.length === 0 ? (
            <p className="rounded-xl border border-line bg-surface-2 p-5 text-sm text-muted">
              Belum ada pemberitahuan.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {announcements.map((n) => (
                <li key={n.id} className="rounded-xl border border-line bg-surface-2 p-4">
                  <time
                    dateTime={n.published_at ?? undefined}
                    className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gold-strong"
                  >
                    {n.published_at ? formatDate(n.published_at) : "Tanpa tanggal"}
                  </time>
                  <h3 className="mt-1.5 font-display text-sm font-extrabold leading-snug text-ink">{n.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{n.body}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </Reveal>
    </div>
  );
}
