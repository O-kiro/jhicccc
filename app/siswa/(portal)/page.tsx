import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn } from "@/lib/styles";
import { Panel, PanelTitle, Pill, StatCard } from "@/app/components/siswa/ui";
import { overviewQuote } from "@/lib/siswa";
import { getOverview } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Overview",
  description: "Ringkasan akademik, jadwal hari ini, dan pengumuman madrasah.",
};

export default async function OverviewPage() {
  const { student, summary, today_schedule: todaySchedule, announcements } = await getOverview();

  // Kartu ringkasan dirakit dari respons API; nilai yang belum ada
  // ditampilkan sebagai "—" alih-alih angka palsu.
  const overviewStats = [
    {
      label: "Rata-Rata Rapor",
      value: summary.average_score !== null ? summary.average_score.toFixed(1) : "—",
      note: "Semester berjalan",
      icon: "chart" as const,
      tone: "blue" as const,
    },
    {
      label: "Kehadiran",
      value: summary.attendance_percentage !== null ? summary.attendance_percentage.toFixed(1) : "—",
      note: (summary.attendance_percentage ?? 0) >= 95 ? "Good" : "Perlu perhatian",
      icon: "attendance" as const,
      tone: "teal" as const,
    },
    {
      label: "Daily Streak",
      value: String(summary.streak_days),
      note: "hari berturut-turut",
      icon: "flame" as const,
      tone: "gold" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Sapaan + streak */}
      <Reveal>
        <section className="bg-teal-gradient relative overflow-hidden rounded-panel p-7 text-on-dark sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-40 w-40 rounded-full bg-white/5" />
          <div className="relative max-w-2xl">
            <span className="eyebrow text-gold">
              <Icon name="star8" className="h-3.5 w-3.5" strokeWidth={1.4} />
              Portal Akademik
            </span>
            <h1 className="mt-3 font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-extrabold leading-tight tracking-[-0.03em]">
              Assalamu&rsquo;alaikum, {student.name}
            </h1>
            <p className="mt-4 font-serif text-base italic leading-relaxed text-on-dark/80 sm:text-lg">
              &ldquo;{overviewQuote}&rdquo;
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-semibold">
                <Icon name="flame" className="h-4 w-4 text-gold" />
                Daily Streak: {summary.streak_days} Hari
              </span>
              <Link
                href="/siswa/kursus"
                className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-sm font-semibold text-teal transition-transform hover:-translate-y-0.5"
              >
                Lanjutkan Belajar
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#jadwal"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                <Icon name="calendar" className="h-4 w-4" />
                Lihat Jadwal
              </a>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Ringkasan */}
      <StaggerGroup className="mt-6 grid gap-4 sm:grid-cols-3">
        {overviewStats.map((s) => (
          <StaggerItem key={s.label}>
            <StatCard {...s} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* Jadwal hari ini */}
        <Reveal>
          <Panel as="section" className="h-full">
            <div id="jadwal" className="scroll-mt-24" />
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
                    "flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border p-3.5 transition-colors sm:flex-nowrap",
                    slot.live
                      ? "border-teal/35 bg-teal-soft/40"
                      : "border-line bg-surface-2 hover:border-ink/15",
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
                        <Pill tone="teal">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
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
                      className="btn-sheen bg-blue-gradient inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
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

        {/* Pengumuman */}
        <Reveal delay={0.05}>
          <Panel as="section" className="h-full">
            <PanelTitle icon="bell">Pengumuman</PanelTitle>
            <ul className="space-y-1">
              {announcements.map((n, i) => (
                <li key={n.id}>
                  <article
                    className={cn(
                      "group py-3.5",
                      i !== announcements.length - 1 && "border-b border-line",
                    )}
                  >
                    <time dateTime={n.published_at ?? undefined} className="text-[11px] font-semibold uppercase tracking-[0.06em] text-gold-strong">
                      {n.published_at ? formatDate(n.published_at) : "Tanpa tanggal"}
                    </time>
                    <h3 className="mt-1.5 font-display text-sm font-extrabold text-ink transition-colors group-hover:text-blue">
                      {n.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{n.body}</p>
                  </article>
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}
