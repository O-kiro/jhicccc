"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { Panel, Pill } from "@/app/components/siswa/ui";
import { cn } from "@/lib/styles";
import { formatTenggat } from "@/lib/format";
import type { ApiTugas } from "@/lib/api";

type Tugas = ApiTugas["tasks"][number];

/**
 * Daftar tugas siswa: yang belum selesai di atas (tenggat terdekat dulu),
 * yang sudah selesai di bawah. Tanda selesai hanya catatan pribadi siswa —
 * pengumpulan tugasnya tetap lewat cara yang diminta guru.
 */
export function TaskList({ tasks }: { tasks: Tugas[] }) {
  const router = useRouter();
  const [sibuk, setSibuk] = useState<number | null>(null);
  const [galat, setGalat] = useState<string | null>(null);

  async function tandai(t: Tugas) {
    setSibuk(t.id);
    setGalat(null);
    const res = await fetch(`/api/tugas/${t.id}/toggle`, { method: "POST" }).catch(() => null);
    setSibuk(null);
    if (res?.ok) router.refresh();
    else setGalat("Gagal menyimpan. Coba lagi.");
  }

  if (tasks.length === 0) {
    return (
      <p className="rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
        Belum ada tugas. Tugas yang diberikan guru akan muncul di sini.
      </p>
    );
  }

  const urut = [...tasks.filter((t) => !t.completed), ...tasks.filter((t) => t.completed)];

  return (
    <>
      {galat && (
        <p role="alert" className="mb-4 text-sm font-semibold text-gold-strong">
          {galat}
        </p>
      )}
      <ul className="space-y-3">
        {urut.map((t) => (
          <li key={t.id}>
            <Panel className={cn("flex items-start gap-4", t.completed && "opacity-60")}>
              <button
                type="button"
                onClick={() => tandai(t)}
                disabled={sibuk === t.id}
                aria-pressed={t.completed}
                aria-label={t.completed ? `Batalkan tanda selesai: ${t.title}` : `Tandai selesai: ${t.title}`}
                className={cn(
                  "press mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 transition-colors disabled:opacity-50",
                  t.completed ? "border-teal bg-teal text-white" : "border-line hover:border-teal",
                )}
              >
                {t.completed && <Icon name="check" className="h-4 w-4" />}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {t.subject && <Pill tone={t.tone}>{t.subject}</Pill>}
                  {t.overdue && <Pill tone="gold">Lewat tenggat</Pill>}
                </div>
                <h3 className={cn("mt-2 font-display text-base font-extrabold text-ink", t.completed && "line-through")}>
                  {t.title}
                </h3>
                {t.description && (
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">{t.description}</p>
                )}
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="clock" className="h-3.5 w-3.5" />
                    Tenggat {formatTenggat(t.due_at)}
                  </span>
                  {t.teacher && <span>{t.teacher}</span>}
                  {t.url && (
                    <a
                      href={t.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-teal hover:underline"
                    >
                      Buka lampiran
                      <Icon name="external" className="h-3 w-3" />
                    </a>
                  )}
                </p>
              </div>
            </Panel>
          </li>
        ))}
      </ul>
    </>
  );
}
