import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn } from "@/lib/styles";
import { Panel, PanelTitle, Pill, StatCard } from "@/app/components/siswa/ui";
import { getOverview, type ApiTone } from "@/lib/api";
import { getSite } from "@/lib/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Overview",
  description: "Ringkasan akademik, jadwal hari ini, dan berita madrasah.",
};

/** Garis tepi kartu jadwal mengikuti warna bidang studi. */
const GARIS: Record<ApiTone, string> = {
  teal: "border-l-teal",
  blue: "border-l-primary",
  gold: "border-l-gold",
};

export default async function OverviewPage() {
  const [{ student, quote, summary, today_schedule: todaySchedule }, { news }] = await Promise.all([
    getOverview(),
    // Seksi NEWS memakai berita situs (CMS), menggantikan pengumuman lama.
    getSite(),
  ]);

  const kehadiran = summary.attendance_percentage;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Sapaan — biru utama (portal-siswa.md §3A) */}
      <Reveal>
        <section className="relative overflow-hidden rounded-panel bg-primary p-7 text-white sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-40 w-40 rounded-full bg-white/5" />
          <div className="relative max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/75">
              Portal Akademik
            </span>
            <h1 className="mt-3 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-tight tracking-[-0.03em]">
              Assalamu&rsquo;alaikum, {student.name}
            </h1>
            {quote && (
              <p className="mt-4 font-serif text-base italic leading-relaxed text-white/85 sm:text-lg">
                &ldquo;{quote.body}&rdquo;
                {quote.source && (
                  <span className="mt-1 block text-sm not-italic text-white/65">&mdash; {quote.source}</span>
                )}
              </p>
            )}
          </div>
        </section>
      </Reveal>

      {/* Ringkasan: Kehadiran & Tugas */}
      <StaggerGroup className="mt-6 grid gap-4 sm:grid-cols-2">
        <StaggerItem>
          <StatCard
            label="Kehadiran"
            value={kehadiran !== null ? kehadiran.toFixed(1) : "—"}
            note={kehadiran === null ? "Belum ada rekap" : kehadiran >= 95 ? "Good" : "Perlu perhatian"}
            icon="attendance"
            tone="teal"
          />
        </StaggerItem>
        <StaggerItem>
          <Link href="/siswa/tugas" className="block rounded-card transition-transform hover:-translate-y-0.5">
            <StatCard
              label="Tugas"
              value={String(summary.active_tasks ?? 0)}
              note="Belum selesai — lihat semua"
              icon="check"
              tone="blue"
            />
          </Link>
        </StaggerItem>
      </StaggerGroup>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* Jadwal hari ini */}
        <Reveal>
          <Panel as="section" className="h-full">
            <PanelTitle icon="calendar" action={<Pill tone="muted">{todaySchedule.length} sesi</Pill>}>
              Jadwal Hari Ini
            </PanelTitle>
            {todaySchedule.length === 0 && (
              <p className="rounded-xl border border-line bg-surface-2 p-5 text-sm text-muted">
                Tidak ada jadwal pelajaran hari ini.
              </p>
            )}
            <ol className="space-y-2.5">
              {todaySchedule.map((slot) => (
                <li
                  key={slot.id}
                  className={cn(
                    "flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-l-4 p-3.5 transition-colors sm:flex-nowrap",
                    GARIS[slot.tone] ?? "border-l-primary",
                    slot.live ? "border-primary/35 bg-primary-soft/40" : "border-line bg-surface-2",
                  )}
                >
                  <span className="w-[104px] shrink-0 font-display text-sm font-extrabold tabular-nums text-ink">
                    {slot.start}
                    <span className="block text-[11px] font-semibold text-muted">s/d {slot.end}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ink">{slot.subject}</span>
                      {slot.live && (
                        <Pill tone="blue">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                          </span>
                          LIVE NOW
                        </Pill>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted">{slot.teacher}</span>
                  </span>
                  {slot.live && slot.meeting_url && (
                    <a
                      href={slot.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-strong"
                    >
                      <Icon name="play" className="h-3.5 w-3.5" />
                      Gabung Kelas
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </Panel>
        </Reveal>

        {/* NEWS — berita sekolah dari CMS */}
        <Reveal delay={0.05}>
          <Panel as="section" className="flex h-full flex-col">
            <PanelTitle icon="bell">News</PanelTitle>
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
