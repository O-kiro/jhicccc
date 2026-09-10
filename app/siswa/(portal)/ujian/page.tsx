import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn } from "@/lib/styles";
import { Countdown, PageHead, Panel, PanelTitle, Pill } from "@/app/components/siswa/ui";
import { examResults, examRules, upcomingExams } from "@/lib/siswa";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Ujian",
  description: "Pusat ujian & evaluasi — jadwal CBT, hasil penilaian, dan simulasi.",
};

export default function UjianPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Pusat Ujian & Evaluasi"
        title="Computer Based Test"
        desc="Kelola penilaian akademik Anda, pantau hasil kinerja, dan ikuti sesi latihan CBT."
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          {/* Ujian mendatang */}
          <Reveal>
            <Panel as="section">
              <PanelTitle icon="calendar">Ujian Mendatang</PanelTitle>
              <StaggerGroup className="space-y-3">
                {upcomingExams.map((exam) => {
                  const featured = exam.startsInSeconds !== undefined;
                  return (
                    <StaggerItem key={exam.title}>
                      <article
                        className={cn(
                          "rounded-card border p-5 transition-colors",
                          featured ? "border-blue/35 bg-blue-soft/35" : "border-line bg-surface-2 hover:border-ink/15",
                        )}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-teal">
                              {exam.subject}
                            </span>
                            <h3 className="mt-1 font-display text-lg font-extrabold text-ink">{exam.title}</h3>
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
                              <Icon name="clock" className="h-3.5 w-3.5" />
                              {exam.when}
                            </p>
                          </div>
                          {exam.priority && (
                            <Pill tone="gold">
                              <Icon name="flag" className="h-3 w-3" />
                              Prioritas {exam.priority}
                            </Pill>
                          )}
                        </div>

                        {featured && (
                          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-blue/20 pt-4">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                              Mulai dalam
                              <Countdown
                                seconds={exam.startsInSeconds!}
                                className="ml-2 font-display text-xl font-extrabold tracking-normal text-blue"
                              />
                            </p>
                            <Link
                              href="/siswa/cbt"
                              className="btn-sheen bg-blue-gradient group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                            >
                              Masuk Ke Dalam Ujian
                              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </div>
                        )}
                      </article>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
            </Panel>
          </Reveal>

          {/* Hasil ujian */}
          <Reveal>
            <Panel as="section">
              <PanelTitle icon="chart">Hasil Ujian</PanelTitle>
              <ul className="space-y-3">
                {examResults.map((r) => (
                  <li
                    key={r.subject}
                    className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-surface-2 p-4"
                  >
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-teal-soft font-display text-xl font-extrabold tabular-nums text-teal">
                      {r.score}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-sm font-extrabold uppercase tracking-[0.04em] text-ink">
                        {r.subject}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted">
                        Selesai pada {formatDate(r.finishedOn)} &middot; Nilai {r.score}%
                      </span>
                    </span>
                    <Pill tone="teal">
                      <Icon name="check" className="h-3 w-3" />
                      Selesai
                    </Pill>
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>

          {/* Simulasi */}
          <Reveal>
            <Panel as="section" className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
                  <Icon name="cbt" className="h-[18px] w-[18px] text-teal" />
                  Simulasi CBT
                </h2>
                <p className="mt-1.5 text-sm text-muted">
                  Latihan dengan antarmuka yang sama persis dengan ujian sesungguhnya.
                </p>
              </div>
              <Link
                href="/siswa/cbt"
                className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-gold-strong"
              >
                Mulai Simulasi
                <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Panel>
          </Reveal>
        </div>

        {/* Kolom kanan — aturan & bantuan */}
        <div className="space-y-6">
          <Reveal delay={0.05}>
            <Panel as="section">
              <PanelTitle icon="shield">Aturan Ujian</PanelTitle>
              <ol className="space-y-3.5">
                {examRules.map((rule, i) => (
                  <li key={rule} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-gold-soft font-display text-xs font-extrabold text-gold-strong">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{rule}</p>
                  </li>
                ))}
              </ol>
              <p className="mt-5 flex items-start gap-2 rounded-xl bg-surface-2 p-3.5 text-xs leading-relaxed text-muted">
                <Icon name="wifi" className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                Pastikan perangkat sudah terhubung ke jaringan madrasah sebelum sesi dimulai.
              </p>
            </Panel>
          </Reveal>

          <Reveal delay={0.1}>
            <Panel as="section" className="bg-blue-gradient border-transparent text-white">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
                <Icon name="help" className="h-[18px] w-[18px]" />
                Admin
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Jika ada masalah saat sesi CBT berlangsung, hubungi admin madrasah agar sesi dapat
                dipulihkan.
              </p>
              <Link
                href="/kontak"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold transition-colors hover:bg-white/25"
              >
                <Icon name="phone" className="h-3.5 w-3.5" />
                Hubungi Admin
              </Link>
            </Panel>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
