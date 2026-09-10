import type { Metadata } from "next";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { PageHead, Panel, PanelTitle, Pill, Progress, StatCard } from "@/app/components/siswa/ui";
import { GradeChart } from "@/app/components/siswa/grade-chart";
import { raporSummary, recentAssessments, student, teacherFeedback } from "@/lib/siswa";

export const metadata: Metadata = {
  title: "Rapor Digital",
  description: "Rapor Digital Madrasah — nilai, peringkat kelas, kehadiran, dan catatan guru.",
};

export default function RaporPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Rapor Digital Madrasah"
        title="Rapor Digital Madrasah"
        desc={`${student.semester} • Kelas ${student.kelas}`}
        action={
          <button
            type="button"
            className="btn-sheen bg-blue-gradient group inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <Icon name="download" className="h-4 w-4" />
            Unduh Rapor Digital Lengkap (PDF)
          </button>
        }
      />

      <StaggerGroup className="grid gap-4 sm:grid-cols-3">
        {raporSummary.map((s) => (
          <StaggerItem key={s.label}>
            <StatCard {...s} />
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Sejarah nilai */}
        <Reveal>
          <Panel as="section" className="h-full">
            <PanelTitle
              icon="chart"
              action={
                <label className="flex items-center gap-2 text-xs font-semibold text-muted">
                  <span className="sr-only">Pilih periode</span>
                  <select
                    defaultValue="ganjil-2025"
                    className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink outline-none focus:border-blue"
                  >
                    <option value="ganjil-2025">Semester Ganjil 2025</option>
                    <option value="genap-2024">Semester Genap 2024</option>
                  </select>
                </label>
              }
            >
              Sejarah Nilai
            </PanelTitle>
            <GradeChart />
          </Panel>
        </Reveal>

        {/* Penilaian terbaru */}
        <Reveal delay={0.05}>
          <Panel as="section" className="h-full">
            <PanelTitle icon="check">Penilaian Terbaru</PanelTitle>
            <ul className="space-y-4">
              {recentAssessments.map((a) => (
                <li key={a.subject}>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-ink">{a.subject}</span>
                    <span className="font-display text-sm font-extrabold tabular-nums text-blue">{a.score}</span>
                  </div>
                  <Progress value={a.score} tone="blue" label={`Nilai ${a.subject}`} />
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
      </div>

      {/* Catatan guru */}
      <Reveal>
        <Panel as="section" className="mt-6">
          <PanelTitle
            icon="quote"
            action={<Pill tone="muted">{teacherFeedback.length} catatan</Pill>}
          >
            Teacher Feedback
          </PanelTitle>
          <StaggerGroup className="grid gap-4 md:grid-cols-2">
            {teacherFeedback.map((f) => (
              <StaggerItem key={f.name}>
                <article className="h-full rounded-card border border-line bg-surface-2 p-5">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-gradient grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-sm font-extrabold text-white">
                      {f.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-extrabold leading-tight text-ink">{f.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {f.role} &middot; {f.when}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 font-serif text-sm italic leading-relaxed text-muted">
                    &ldquo;{f.text}&rdquo;
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Panel>
      </Reveal>
    </div>
  );
}
