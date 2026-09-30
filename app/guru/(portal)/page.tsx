import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn } from "@/lib/styles";
import { Panel, PanelTitle } from "@/app/components/siswa/ui";
import { getGuruOverview } from "@/lib/api-guru";
import { getSite } from "@/lib/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Overview",
  description: "Beranda Portal Guru: akses cepat, jadwal hari ini, dan berita madrasah.",
};

const AKSES_CEPAT = [
  { href: "/guru/modul-ajar", icon: "book" as const, title: "Modul Ajar", desc: "Susun Modul Ajar" },
  {
    href: "/guru/nilai",
    icon: "users" as const,
    title: "Penilaian Kelas",
    desc: "Input nilai formatif, sumatif, dan absensi siswa.",
  },
];

/** Ornamen garis-garis buku di sisi kanan banner (dekoratif). */
function OrnamenBuku() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 200"
      className="pointer-events-none absolute -right-6 top-1/2 hidden h-56 -translate-y-1/2 text-white/15 sm:block"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
    >
      <path d="M30 40c30-12 60-12 90 0v130c-30-12-60-12-90 0z" />
      <path d="M120 40c30-12 60-12 90 0v130c-30-12-60-12-90 0z" />
      {[70, 95, 120, 145].map((y) => (
        <g key={y}>
          <path d={`M45 ${y - 6}c20-7 40-7 60 0`} />
          <path d={`M135 ${y - 6}c20-7 40-7 60 0`} />
        </g>
      ))}
    </svg>
  );
}

export default async function GuruOverviewPage() {
  const [{ today_schedule: todaySchedule, academic_year: tahunAjaran }, { news }] = await Promise.all([
    getGuruOverview(),
    getSite(),
  ]);

  return (
    <div className="mx-auto max-w-6xl">
      {/* Hero banner */}
      <Reveal>
        <section className="relative overflow-hidden rounded-panel bg-primary p-7 text-white sm:p-10">
          <OrnamenBuku />
          <div className="relative max-w-2xl">
            <h1 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-tight tracking-[-0.03em]">
              Selamat Datang di Portal Guru
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
              Ini adalah ruang kerja pribadi Anda. Di sini Anda dapat merancang perangkat pembelajaran, melihat
              jadwal mengajar, dan mengelola administrasi kelas dengan lebih mudah dan cepat.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
              <Icon name="calendar" className="h-4 w-4" />
              Tahun Ajaran Aktif: {tahunAjaran}
            </span>
          </div>
        </section>
      </Reveal>

      {/* Akses cepat pembelajaran */}
      <h2 className="mt-8 font-display text-lg font-extrabold text-ink">Akses Cepat Pembelajaran</h2>
      <StaggerGroup className="mt-3 grid gap-4 sm:grid-cols-2">
        {AKSES_CEPAT.map((a) => (
          <StaggerItem key={a.href}>
            <Link
              href={a.href}
              className="group flex h-full items-center gap-4 rounded-card border border-line bg-surface p-5 transition-colors hover:border-primary/40"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon name={a.icon} className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-base font-extrabold text-ink">{a.title}</span>
                <span className="mt-0.5 block text-sm text-muted">{a.desc}</span>
              </span>
              <Icon name="arrow" className="h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* Jadwal hari ini */}
        <Reveal>
          <Panel as="section" className="h-full">
            <PanelTitle
              icon="calendar"
              action={
                <Link href="/guru/jadwal" className="text-sm font-semibold text-primary hover:underline">
                  Kalender
                </Link>
              }
            >
              Jadwal Hari Ini
            </PanelTitle>
            {todaySchedule.length === 0 && (
              <p className="rounded-xl border border-line bg-surface-2 p-5 text-sm text-muted">
                Tidak ada jadwal mengajar hari ini.
              </p>
            )}
            <ol className="space-y-2.5">
              {todaySchedule.map((slot) => (
                <li
                  key={slot.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-l-4 border-line border-l-primary bg-surface-2 p-3.5 sm:flex-nowrap"
                >
                  <span className="w-[120px] shrink-0 font-display text-sm font-extrabold tabular-nums text-ink">
                    {slot.start} - {slot.end}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-display font-extrabold text-ink">{slot.classroom}</span>{" "}
                    <span className="text-sm text-muted">({slot.subject})</span>
                  </span>
                </li>
              ))}
            </ol>
          </Panel>
        </Reveal>

        {/* NEWS — berita situs dari CMS */}
        <Reveal delay={0.05}>
          <Panel as="section" className="flex h-full flex-col">
            <PanelTitle icon="megaphone">NEWS</PanelTitle>
            {news.length === 0 && (
              <p className="rounded-xl border border-line bg-surface-2 p-5 text-sm text-muted">Belum ada berita.</p>
            )}
            <ul className="space-y-1">
              {news.slice(0, 3).map((n, i, daftar) => (
                <li key={n.slug}>
                  <Link
                    href={`/berita/${n.slug}`}
                    className={cn("group block py-3.5", i !== daftar.length - 1 && "border-b border-line")}
                  >
                    <time dateTime={n.date} className="text-[11px] font-semibold uppercase tracking-[0.06em] text-primary">
                      {formatDate(n.date)}
                    </time>
                    <h3 className="mt-1.5 font-display text-sm font-extrabold text-ink transition-colors group-hover:text-primary">
                      {n.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{n.excerpt}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4">
              <Link
                href="/berita"
                className="press inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary/40 hover:text-primary"
              >
                Lihat Semua Berita
                <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}
