"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Icon } from "./icons";
import { Badge, Container, SectionHeading } from "./ui";
import { Reveal } from "./reveal";
import { Counter } from "./counter";
import { achievements } from "@/lib/content";

const LEVELS = ["Semua", "Kota", "Provinsi", "Nasional", "Internasional"] as const;
type Level = (typeof LEVELS)[number];
// Figma displays uppercase: KOTA · PROVINSI · NASIONAL · INTERNASIONAL
const levelLabel: Record<string, string> = {
  Semua: "SEMUA",
  Kota: "KOTA",
  Provinsi: "PROVINSI",
  Nasional: "NASIONAL",
  Internasional: "INTERNASIONAL",
};

const levelTone: Record<string, "teal" | "blue" | "gold" | "muted"> = {
  Internasional: "gold",
  Nasional: "blue",
  Provinsi: "teal",
  Kota: "muted",
};

// Medal-tier top border — gold for the highest level, down to neutral.
const tierAccent: Record<string, string> = {
  Internasional: "border-gold",
  Nasional: "border-blue",
  Provinsi: "border-teal",
  Kota: "border-line",
};

export function Achievements() {
  const [filter, setFilter] = useState<Level>("Semua");
  const [hover, setHover] = useState(false);
  const [pressing, setPressing] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  // Stable wrapper for visibility tracking — the track itself remounts per filter.
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.3 });
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });
  const reduce = useReducedMotion();
  const list = filter === "Semua" ? achievements : achievements.filter((a) => a.level === filter);

  const paused = hover || pressing || !inView;

  const scroll = (dir: number) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  // Autoplay — advances one page, loops at the end; pauses on interaction.
  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + el.clientWidth * 0.9, behavior: "smooth" });
    }, 3800);
    return () => clearInterval(id);
  }, [paused, reduce, filter]);

  // Mouse drag-to-scroll (touch devices use native swipe).
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setPressing(true);
    if (e.pointerType !== "mouse") return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const el = trackRef.current;
    if (el) el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    setPressing(false);
    if (!drag.current.active) return;
    drag.current.active = false;
    trackRef.current?.releasePointerCapture?.(e.pointerId);
  };

  return (
    <section id="prestasi" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            gradient
            index="03"
            align="left"
            eyebrow="Papan Prestasi"
            title="Prestasi Membanggakan"
            desc="Rekam jejak prestasi siswa MAKOBA dari tingkat kota hingga internasional."
          />
          <Reveal delay={0.1}>
            <div className="flex items-center gap-4 rounded-card bg-surface px-6 py-4 shadow-card">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-soft text-gold-strong">
                <Icon name="trophy" className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-3xl font-extrabold leading-none text-ink">
                  <Counter to={achievements.length} suffix="+" />
                </p>
                <p className="text-xs text-muted">Prestasi terdokumentasi</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Filter chips + carousel controls */}
        <Reveal delay={0.05}>
          <div className="mt-12 flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2.5">
              {LEVELS.map((lvl) => {
                const active = filter === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFilter(lvl)}
                    aria-pressed={active}
                    className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                      active
                        ? "bg-blue-gradient text-white shadow-card"
                        : "bg-surface text-muted shadow-card hover:-translate-y-0.5 hover:text-blue"
                    }`}
                  >
                    {levelLabel[lvl] ?? lvl}
                  </button>
                );
              })}
            </div>
            <div className="hidden shrink-0 items-center gap-2 sm:flex">
              <button
                type="button"
                aria-label="Prestasi sebelumnya"
                onClick={() => scroll(-1)}
                className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink shadow-card transition-all hover:-translate-y-0.5 hover:text-blue"
              >
                <Icon name="arrow" className="h-5 w-5 rotate-180" />
              </button>
              <button
                type="button"
                aria-label="Prestasi berikutnya"
                onClick={() => scroll(1)}
                className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink shadow-card transition-all hover:-translate-y-0.5 hover:text-blue"
              >
                <Icon name="arrow" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Carousel: autoplay + drag (mouse) + native swipe (touch) */}
        <div ref={wrapRef}>
          <motion.div
            key={filter}
            ref={trackRef}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className="mt-8 flex cursor-grab snap-x snap-mandatory select-none gap-5 overflow-x-auto scroll-smooth pb-4 active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {list.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.06, 0.42), ease: [0.22, 1, 0.36, 1] }}
                className={`flex shrink-0 basis-[85%] snap-start flex-col rounded-card border-t-4 ${tierAccent[a.level]} bg-surface p-6 shadow-card sm:basis-[47%] lg:basis-[31.5%]`}
              >
                <div className="flex items-center justify-between">
                  <Badge tone={levelTone[a.level]}>{a.level}</Badge>
                  <span className="text-xs text-muted">{a.year}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold leading-snug text-ink">{a.title}</h3>
                <p className="mt-1.5 text-sm font-medium text-teal">{a.student}</p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="sparkle" className="h-3.5 w-3.5 text-gold" />
                    {a.field}
                  </span>
                  <span className="line-clamp-1">{a.organizer}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>

        <p className="mt-2 text-center text-xs text-muted sm:hidden">Geser untuk melihat lainnya →</p>

        {/* Figma CTA card: Prestasi Man Kota Batu */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-card bg-dark p-6 text-on-dark shadow-card sm:flex-row sm:items-center sm:p-8">
            <div>
              <h3 className="font-display text-xl font-bold text-on-dark">Prestasi MAN Kota Batu</h3>
              <p className="mt-1 text-sm text-on-dark/70">Prestasi membanggakan dari para siswa dan siswi.</p>
            </div>
            <a href="/#prestasi" className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-surface px-6 py-3 text-sm font-semibold text-blue shadow-card transition-all hover:-translate-y-0.5">
              Lihat Semua Prestasi
              <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
