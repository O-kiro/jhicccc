import type { Metadata } from "next";
import { Icon } from "@/app/components/icons";
import { StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn } from "@/lib/styles";
import { PageHead, Panel, Pill } from "@/app/components/siswa/ui";
import { getJadwal } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Jadwal Mengajar",
  description: "Jadwal mengajar sepekan per hari.",
};

/** 150 → "2 jam 30 menit". */
function durasi(menit: number): string {
  const jam = Math.floor(menit / 60);
  const sisa = menit % 60;
  return [jam > 0 && `${jam} jam`, sisa > 0 && `${sisa} menit`].filter(Boolean).join(" ") || "0 menit";
}

export default async function JadwalPage() {
  const { days, summary } = await getJadwal();

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Jadwal Mengajar"
        title="Jadwal Pekan Ini"
        desc={
          summary.sessions === 0
            ? "Belum ada jadwal mengajar. Jadwal disusun Wakasek Kurikulum dari panel admin."
            : `${summary.sessions} sesi di ${summary.classes} kelas — total ${durasi(summary.minutes)} tatap muka per pekan.`
        }
        action={
          summary.subjects.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {summary.subjects.map((m) => (
                <li key={m}>
                  <Pill tone="blue">{m}</Pill>
                </li>
              ))}
            </ul>
          )
        }
      />

      <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {days.map((d) => (
          <StaggerItem key={d.day}>
            <Panel
              as="section"
              className={cn("h-full", d.is_today && "border-teal/40 ring-1 ring-teal/20")}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-extrabold text-ink">{d.label}</h2>
                {d.is_today ? (
                  <Pill tone="teal">Hari ini</Pill>
                ) : (
                  <Pill tone="muted">{d.sessions.length} sesi</Pill>
                )}
              </div>

              {d.sessions.length === 0 ? (
                <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">
                  Tidak ada jadwal.
                </p>
              ) : (
                <ol className="space-y-2.5">
                  {d.sessions.map((s) => (
                    <li
                      key={s.id}
                      className={cn(
                        "rounded-xl border p-3.5",
                        s.live ? "border-teal/35 bg-teal-soft/40" : "border-line bg-surface-2",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block font-semibold leading-snug text-ink">{s.subject}</span>
                          <span className="mt-0.5 block text-xs text-muted">Kelas {s.classroom}</span>
                        </span>
                        <span className="shrink-0 text-right font-display text-xs font-extrabold tabular-nums text-ink">
                          {s.start}
                          <span className="block text-[11px] font-semibold text-muted">{s.end}</span>
                        </span>
                      </div>
                      {s.meeting_url && (
                        <a
                          href={s.meeting_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "press mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors",
                            s.live
                              ? "bg-blue-gradient text-white"
                              : "border border-line text-muted hover:border-ink/25 hover:text-ink",
                          )}
                        >
                          <Icon name={s.live ? "play" : "external"} className="h-3 w-3" />
                          {s.live ? "Buka Kelas Live" : "Tautan kelas"}
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </Panel>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
