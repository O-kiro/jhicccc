"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/app/components/icons";
import { cn, toneSoft } from "@/lib/styles";
import { Panel, Progress } from "./ui";
import type { ApiCourses } from "@/lib/api";

/**
 * Daftar mata pelajaran beserta filternya. Data datang dari /courses lewat
 * halaman induk; komponen ini hanya mengurus interaksi filter.
 */
type Course = ApiCourses["courses"][number];

export function CourseGrid({ filters, courses }: Pick<ApiCourses, "filters" | "courses">) {
  // Filter pertama dari server dianggap "tanpa saringan".
  const all = filters[0] ?? "All";
  const [filter, setFilter] = useState(all);
  const shown = filter === all ? courses : courses.filter((c) => c.category === filter);

  // Modul dikirim bersama daftar kursus, jadi membuka daftarnya tidak
  // memerlukan permintaan jaringan baru.
  const [opened, setOpened] = useState<Course | null>(null);

  return (
    <>
      <div role="tablist" aria-label="Filter mata pelajaran" className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={cn(
                "press rounded-full px-4 py-2 text-sm font-semibold",
                "transition-[background-color,border-color,color,transform] duration-200 ease-snap",
                active
                  ? "bg-ink text-canvas"
                  : "border border-line text-muted hover:border-ink/25 hover:text-ink",
              )}
            >
              {f}
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((c) => (
            <motion.li
              key={c.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <Panel className="card-glow flex h-full flex-col transition-shadow hover:shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", toneSoft[c.tone])}>
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] font-semibold text-muted">
                    {c.category}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-extrabold leading-tight text-ink">{c.name}</h3>
                <p className="mt-1 text-xs text-muted">{c.teacher ?? "Pengajar belum ditetapkan"}</p>

                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-muted">{c.modules} modul</span>
                    <span className="tabular-nums text-ink">{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} tone={c.tone} label={`Progres ${c.name}`} />
                </div>

                <button
                  type="button"
                  onClick={() => setOpened(c)}
                  disabled={c.module_list.length === 0}
                  className="press group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-[border-color,background-color,transform] duration-200 ease-snap hover:border-ink/25 hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-45"
                >
                  {c.module_list.length === 0 ? "Modul Belum Ada" : "Lihat Modul"}
                  {c.module_list.length > 0 && (
                    <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </button>
              </Panel>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {shown.length === 0 && (
        <p className="rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
          Belum ada mata pelajaran pada kategori ini.
        </p>
      )}

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpened(null)}
            className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/50 p-5 backdrop-blur-sm"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="judul-daftar-modul"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="my-auto w-full max-w-lg rounded-card border border-line bg-surface p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-teal">
                    {opened.module_list.length} modul
                  </p>
                  <h2
                    id="judul-daftar-modul"
                    className="mt-1 font-display text-xl font-extrabold leading-tight text-ink"
                  >
                    {opened.name}
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    {opened.teacher ?? "Pengajar belum ditetapkan"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpened(null)}
                  aria-label="Tutup"
                  className="press grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:text-ink"
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              </div>

              <ul className="mt-6 max-h-[55vh] space-y-2.5 overflow-y-auto pr-1">
                {opened.module_list.map((m) => {
                  // Modul tanpa tautan tetap ditampilkan — daftarnya jadi
                  // rencana pembelajaran, bukan sekadar kumpulan berkas.
                  const Wrapper = m.url ? "a" : "div";
                  return (
                    <li key={m.id}>
                      <Wrapper
                        {...(m.url
                          ? { href: m.url, target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className={cn(
                          "flex items-start gap-3.5 rounded-xl border border-line bg-surface-2 p-4",
                          m.url && "press transition-colors hover:border-ink/20",
                        )}
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface font-display text-xs font-extrabold tabular-nums text-muted">
                          {m.number}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold leading-snug text-ink">
                            {m.title}
                          </span>
                          {m.description && (
                            <span className="mt-1 block text-xs leading-relaxed text-muted">
                              {m.description}
                            </span>
                          )}
                          {!m.url && (
                            <span className="mt-1.5 inline-block text-[11px] font-semibold text-gold-strong">
                              Materi belum tersedia
                            </span>
                          )}
                        </span>
                        {m.url && (
                          <Icon name="external" className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                        )}
                      </Wrapper>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
