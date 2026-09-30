import type { Metadata } from "next";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { PageHead, Panel, PanelTitle, Pill } from "@/app/components/siswa/ui";
import { Avatar } from "@/app/components/siswa/avatar";
import { getOverview, getRanking } from "@/lib/api";
import { cn } from "@/lib/styles";
import { formatDate, waktuRelatif } from "@/lib/format";

export const metadata: Metadata = {
  title: "Ranking",
  description: "Ranking kelas dari Excel wali kelas, dan catatan guru.",
};

/** Nama dibandingkan tanpa beda huruf besar-kecil dan spasi berlebih. */
const rapikan = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

/**
 * Hanya dua fungsi: ranking kelas — isi Excel yang diunggah guru lewat RDM,
 * ditampilkan langsung sebagai tabel — dan Teacher Feedback.
 */
export default async function RankingPage() {
  const [{ sheet, teacher_feedback: teacherFeedback }, { student: me }] = await Promise.all([
    getRanking(),
    // Sudah diambil layout (cache per render), jadi tanpa permintaan tambahan.
    getOverview(),
  ]);

  const [kepala, ...isi] = sheet?.rows ?? [];
  const namaSaya = rapikan(me.name);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead eyebrow="Ranking & Evaluasi Guru" title="Ranking Digital Madrasah" />

      {/* Ranking kelas — Excel dari guru, tampil sebagai tabel */}
      <Reveal>
        <Panel as="section">
          <PanelTitle
            icon="trophy"
            action={sheet ? <Pill tone="muted">Semester {sheet.semester} {sheet.academic_year}</Pill> : undefined}
          >
            {sheet?.title ?? `Ranking Kelas${me.kelas ? ` ${me.kelas}` : ""}`}
          </PanelTitle>

          {!sheet ? (
            <div className="rounded-xl border border-dashed border-line p-8 text-center">
              <Icon name="trophy" className="mx-auto h-9 w-9 text-muted" strokeWidth={1.2} />
              <p className="mt-3 font-display text-base font-extrabold text-ink">Ranking belum diunggah</p>
              <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted">
                Ranking kelas akan tampil di sini setelah wali kelas mengunggah berkas Excel-nya.
              </p>
            </div>
          ) : !sheet.rows || sheet.rows.length === 0 ? (
            <p className="rounded-xl border border-line bg-surface-2 p-5 text-sm text-muted">
              Berkas ranking tidak dapat ditampilkan. Silakan hubungi wali kelas.
            </p>
          ) : (
            <>
              <div className="max-h-[70vh] overflow-auto rounded-xl border border-line">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 z-10 bg-primary text-white">
                    <tr>
                      {kepala.map((sel, k) => (
                        <th key={k} scope="col" className="whitespace-nowrap px-4 py-3 text-left font-semibold">
                          {sel}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {isi.map((baris, i) => {
                      const milikSaya = baris.some((sel) => rapikan(sel) === namaSaya);
                      return (
                        <tr
                          key={i}
                          aria-current={milikSaya ? "true" : undefined}
                          className={cn(
                            "border-t border-line",
                            milikSaya ? "bg-primary-soft font-semibold text-ink" : i % 2 ? "bg-surface-2" : "bg-surface",
                          )}
                        >
                          {baris.map((sel, k) => (
                            <td key={k} className="whitespace-nowrap px-4 py-2.5 text-ink tabular-nums">
                              {sel}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted">
                {sheet.teacher ? `Diunggah oleh ${sheet.teacher}` : "Diunggah wali kelas"}
                {sheet.uploaded_on ? ` · ${formatDate(sheet.uploaded_on)}` : ""}
                {sheet.note ? ` · ${sheet.note}` : ""}
              </p>
            </>
          )}
        </Panel>
      </Reveal>

      {/* Teacher Feedback — apresiasi wali kelas dan guru mapel */}
      <Reveal>
        <Panel as="section" className="mt-6">
          <PanelTitle icon="quote" action={<Pill tone="muted">{teacherFeedback.length} catatan</Pill>}>
            Teacher Feedback
          </PanelTitle>
          {teacherFeedback.length === 0 && (
            <p className="rounded-xl border border-line bg-surface-2 p-5 text-sm text-muted">
              Belum ada catatan dari guru.
            </p>
          )}
          <StaggerGroup className="grid gap-4 md:grid-cols-2">
            {teacherFeedback.map((f) => (
              <StaggerItem key={f.id}>
                <article className="h-full rounded-card border border-line bg-surface-2 p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={f.name} photo={f.photo} />
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-extrabold leading-tight text-ink">{f.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted">{f.role}</p>
                    </div>
                    {f.created_at && (
                      <time dateTime={f.created_at} className="shrink-0 text-[11px] text-muted">
                        {waktuRelatif(f.created_at)}
                      </time>
                    )}
                  </div>
                  <p className="mt-4 font-serif text-sm italic leading-relaxed text-muted">&ldquo;{f.body}&rdquo;</p>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Panel>
      </Reveal>
    </div>
  );
}
