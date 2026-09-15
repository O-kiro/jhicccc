"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/app/components/icons";
import { cn, toneSoft } from "@/lib/styles";
import { Panel, Progress } from "./ui";
import { courseFilters, courses } from "@/lib/siswa";

export function CourseGrid() {
  const [filter, setFilter] = useState<(typeof courseFilters)[number]>("All");
  const shown = filter === "All" ? courses : courses.filter((c) => c.category === filter);

  return (
    <>
      <div role="tablist" aria-label="Filter mata pelajaran" className="mb-6 flex flex-wrap gap-2">
        {courseFilters.map((f) => {
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
              key={c.name}
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
                <p className="mt-1 text-xs text-muted">{c.teacher}</p>

                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold">
                    <span className="text-muted">{c.modules} modul</span>
                    <span className="tabular-nums text-ink">{c.progress}%</span>
                  </div>
                  <Progress value={c.progress} tone={c.tone} label={`Progres ${c.name}`} />
                </div>

                <button
                  type="button"
                  className="press group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-[border-color,background-color,transform] duration-200 ease-snap hover:border-ink/25 hover:bg-surface-2"
                >
                  View Modules
                  <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Panel>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
