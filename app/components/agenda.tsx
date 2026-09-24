"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";
import { Badge, Container, SectionHeading } from "./ui";
import { Reveal } from "./reveal";
import type { Site } from "@/lib/site";
import { dateParts, formatDate } from "@/lib/format";

const CATS = ["Semua", "Ujian", "Ekstrakurikuler", "Keagamaan", "Umum"] as const;
type Cat = (typeof CATS)[number];

const catTone: Record<string, "teal" | "blue" | "gold" | "muted"> = {
  Ujian: "blue",
  Ekstrakurikuler: "gold",
  Keagamaan: "teal",
  Umum: "muted",
};

/** Isinya dari CMS lewat getSite(); lihat lib/site.ts. */
export function Agenda({ agenda }: { agenda: Site["agenda"] }) {
  const [cat, setCat] = useState<Cat>("Semua");
  const list = cat === "Semua" ? agenda : agenda.filter((a) => a.category === cat);

  return (
    <section id="agenda" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="07"
          eyebrow="Kalender Akademik"
          title="Agenda Kegiatan"
          desc="Jadwal kegiatan akademik, keagamaan, dan ekstrakurikuler madrasah tahun pelajaran 2026/2027."
        />

        <Reveal delay={0.05}>
          <div className="mt-12 flex flex-wrap justify-center gap-2.5">
            {CATS.map((c) => {
              const active = cat === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  aria-pressed={active}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    active
                      ? "bg-blue-gradient text-white shadow-card"
                      : "bg-surface text-muted shadow-card hover:-translate-y-0.5 hover:text-blue"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </Reveal>

        <motion.ul layout className="mx-auto mt-10 max-w-3xl space-y-3">
          <AnimatePresence mode="popLayout">
            {list.map((a) => {
              const d = dateParts(a.date);
              return (
                <motion.li
                  key={a.title}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-5 rounded-card bg-surface p-4 shadow-card"
                >
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-blue-gradient text-white">
                    <span className="font-display text-2xl font-extrabold leading-none">{d.day}</span>
                    <span className="text-[11px] uppercase tracking-wide">{d.month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display font-bold text-ink">{a.title}</h3>
                    <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-muted">
                      <Icon name="clock" className="h-3.5 w-3.5" />
                      {formatDate(a.date)}
                    </p>
                  </div>
                  <Badge tone={catTone[a.category]} className="shrink-0">
                    {a.category}
                  </Badge>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </motion.ul>
      </Container>
    </section>
  );
}
