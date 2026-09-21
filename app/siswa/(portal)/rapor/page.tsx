import type { Metadata } from "next";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { PageHead, Panel, PanelTitle, Pill, Progress, StatCard } from "@/app/components/siswa/ui";
import { GradeChart } from "@/app/components/siswa/grade-chart";
import { ApiError, getReportCard } from "@/lib/api";

export const metadata: Metadata = {
  title: "Rapor Digital",
  description: "Rapor Digital Madrasah — nilai, peringkat kelas, kehadiran, dan catatan guru.",
};

export default async function RaporPage() {
  let data;

  try {
    data = await getReportCard();
  } catch (error) {
    // 404 berarti rapor periode ini memang belum diterbitkan — itu keadaan
    // normal, bukan kerusakan, jadi tampilkan pesan alih-alih halaman error.
    if (error instanceof ApiError && error.status === 404) {
      return (
        <div className="mx-auto max-w-6xl">
          <PageHead eyebrow="Rapor Digital Madrasah" title="Rapor Digital Madrasah" />
          <Panel className="text-center">
            <Icon name="rdm" className="mx-auto h-10 w-10 text-muted" strokeWidth={1.2} />
            <p className="mt-4 font-display text-lg font-extrabold text-ink">
              Rapor belum tersedia
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Rapor untuk semester berjalan belum diterbitkan madrasah. Silakan cek kembali nanti
              atau hubungi wali kelas.
            </p>
          </Panel>
        </div>
      );
    }

    throw error;
  }

  const { report_card: reportCard, grade_history: gradeHistory } = data;
  const recentAssessments = data.recent_assessments;
  const teacherFeedback = data.teacher_feedback;

  const raporSummary = [
    {
      label: "Rata-Rata Rapor",
      value: reportCard.average_score.toFixed(1),
      icon: "chart" as const,
      tone: "blue" as const,
    },
    {
      label: "Peringkat Kelas",
      value: reportCard.class_rank ? `${reportCard.class_rank} of ${reportCard.class_size}` : "—",
      icon: "trophy" as const,
      tone: "gold" as const,
    },
    {
      label: "Kehadiran",
      value: `${reportCard.attendance_percentage.toFixed(1)}%`,
      icon: "attendance" as const,
      tone: "teal" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Rapor Digital Madrasah"
        title="Rapor Digital Madrasah"
        desc={`Semester ${reportCard.semester} ${reportCard.academic_year}`}
        action={
          // Tautan biasa, bukan tombol: unduhan ditangani peramban, dan
          // berkasnya dibuat server lewat /api/rapor/pdf.
          <a
            href="/api/rapor/pdf"
            className="btn-sheen bg-blue-gradient press group inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <Icon name="download" className="h-4 w-4" />
            Unduh Rapor Digital Lengkap (PDF)
          </a>
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
                    defaultValue="current"
                    className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink outline-none focus:border-blue"
                  >
                    <option value="current">
                      Semester {reportCard.semester} {reportCard.academic_year}
                    </option>
                  </select>
                </label>
              }
            >
              Sejarah Nilai
            </PanelTitle>
            <GradeChart data={gradeHistory} />
          </Panel>
        </Reveal>

        {/* Penilaian terbaru */}
        <Reveal delay={0.05}>
          <Panel as="section" className="h-full">
            <PanelTitle icon="check">Penilaian Terbaru</PanelTitle>
            <ul className="space-y-4">
              {recentAssessments.map((a) => (
                <li key={a.id}>
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
              <StaggerItem key={f.id}>
                <article className="h-full rounded-card border border-line bg-surface-2 p-5">
                  <div className="flex items-start gap-3">
                    <span className="bg-blue-gradient grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-sm font-extrabold text-white">
                      {f.name.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-display text-sm font-extrabold leading-tight text-ink">{f.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {f.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 font-serif text-sm italic leading-relaxed text-muted">
                    &ldquo;{f.body}&rdquo;
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
