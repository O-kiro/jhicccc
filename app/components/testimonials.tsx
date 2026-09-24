"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "./icons";
import { Container, SectionHeading } from "./ui";
import type { Site } from "@/lib/site";

const variants = {
  enter: (d: number) => ({ x: d > 0 ? 64 : -64, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? -64 : 64, opacity: 0 }),
};

/** Isinya dari CMS lewat getSite(); lihat lib/site.ts. */
export function Testimonials({ testimonials }: { testimonials: Site["testimonials"] }) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [engaged, setEngaged] = useState(false); // hovering or focused inside
  const n = testimonials.length;
  const reduce = useReducedMotion();

  const paginate = useCallback((d: number) => {
    setState(([i]) => [(i + d + n) % n, d]);
  }, [n]);

  useEffect(() => {
    // Don't auto-advance when the user prefers reduced motion or is reading/interacting.
    if (reduce || engaged) return;
    const id = setInterval(() => paginate(1), 7000);
    return () => clearInterval(id);
  }, [paginate, reduce, engaged]);

  const t = testimonials[index];

  return (
    <section id="testimoni" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="09"
          eyebrow="Suara Mereka"
          title="Apa Kata Mereka"
          desc="Cerita dari alumni, wali murid, dan siswa tentang pengalaman bersama MAKOBA."
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div
            className="relative overflow-hidden rounded-panel bg-surface p-8 shadow-card sm:p-12"
            onMouseEnter={() => setEngaged(true)}
            onMouseLeave={() => setEngaged(false)}
            onFocusCapture={() => setEngaged(true)}
            onBlurCapture={() => setEngaged(false)}
          >
            <Icon name="quote" className="h-12 w-12 text-gold/40" />
            <div className="relative min-h-[12rem]">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.figure
                  key={index}
                  custom={dir}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70) paginate(1);
                    else if (info.offset.x > 70) paginate(-1);
                  }}
                  className="cursor-grab touch-pan-y active:cursor-grabbing"
                >
                  <blockquote className="font-serif text-xl italic leading-relaxed text-ink sm:text-2xl">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-7 flex items-center gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-teal-soft font-display text-lg font-extrabold text-teal">
                      {t.name.charAt(0)}
                    </span>
                    <span>
                      <span className="block font-display font-bold text-ink">{t.name}</span>
                      <span className="block text-sm text-muted">{t.role}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="Sebelumnya"
              onClick={() => paginate(-1)}
              className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink shadow-card transition-all hover:-translate-y-0.5 hover:text-teal"
            >
              <Icon name="arrow" className="h-5 w-5 rotate-180" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Testimoni ${i + 1}`}
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-teal" : "w-2 bg-line hover:bg-teal/50"}`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Berikutnya"
              onClick={() => paginate(1)}
              className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink shadow-card transition-all hover:-translate-y-0.5 hover:text-teal"
            >
              <Icon name="arrow" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
