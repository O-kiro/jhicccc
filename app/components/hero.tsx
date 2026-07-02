"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Icon } from "./icons";
import { Button, Container } from "./ui";
import { GeoTexture } from "./ornaments";
import { Counter } from "./counter";
import { school, stats } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
// Headline lines rise out of an overflow mask, one after another.
const line = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.8, ease: EASE } },
};

const HEADLINE = [
  { text: "Berilmu.", className: "text-blue-gradient" },
  { text: "Berakhlak.", className: "text-teal" },
  { text: "Berprestasi.", className: "text-gold" },
];

const shapes = [
  { pos: "left-[3%] top-[24%]", size: "h-24 w-24", color: "bg-teal-soft", radius: "rounded-[2rem]", delay: 0, depth: -70 },
  { pos: "right-[5%] top-[18%]", size: "h-36 w-36", color: "bg-blue-soft", radius: "rounded-full", delay: 0.7, depth: 50 },
  { pos: "right-[12%] bottom-[16%]", size: "h-20 w-20", color: "bg-gold-soft", radius: "rounded-[1.5rem]", delay: 1.2, depth: -40 },
  { pos: "left-[9%] bottom-[20%]", size: "h-16 w-16", color: "bg-blue-soft", radius: "rounded-full", delay: 1.7, depth: 90 },
];

/** Outer layer drifts with scroll (parallax depth), inner layer keeps floating. */
function FloatingShape({ shape }: { shape: (typeof shapes)[number] }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, shape.depth]);
  return (
    <motion.div
      aria-hidden
      style={reduce ? undefined : { y }}
      className={`pointer-events-none absolute -z-10 hidden sm:block ${shape.pos}`}
    >
      <motion.div
        className={`${shape.size} ${shape.color} ${shape.radius}`}
        animate={{ y: [0, -22, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: shape.delay }}
      />
    </motion.div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const starY = useTransform(scrollY, [0, 900], [0, 120]);

  return (
    <section id="beranda" className="relative isolate overflow-hidden">
      <GeoTexture className="pointer-events-none absolute inset-0 -z-10 text-ink opacity-[0.05]" />

      {/* Big slow-rotating eight-point star — Islamic geometry signature */}
      <motion.div
        aria-hidden
        style={reduce ? undefined : { y: starY }}
        className="pointer-events-none absolute -z-10 right-[6%] top-[15%] hidden text-teal/15 lg:block"
      >
        <Icon name="star8" className="animate-spin-slow h-80 w-80" strokeWidth={0.6} />
      </motion.div>

      {/* Floating pastel shapes (MetaMask layered-accent motif) */}
      {shapes.map((s) => (
        <FloatingShape key={s.pos} shape={s} />
      ))}

      <Container className="flex min-h-[92vh] flex-col items-center justify-center py-32 text-center">
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-center">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-teal shadow-card"
          >
            <Icon name="star8" className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
            Madrasah Maju Bermutu dan Mendunia
          </motion.span>

          <h1 className="display mt-8 text-[clamp(3.25rem,12vw,10rem)] leading-[0.85]">
            {HEADLINE.map((l) => (
              // Mask per line; tiny padding keeps descenders out of the clip.
              <span key={l.text} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <motion.span variants={line} className={`block ${l.className}`}>
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted sm:text-xl"
          >
            {school.longName} memadukan identitas Islami yang elegan dengan pendidikan
            modern berbasis riset di jantung Kota Batu.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/ppdb" size="lg">
              Daftar PPDB 2026
            </Button>
            <Button href="#program" size="lg" variant="outline" icon={false}>
              Jelajahi Program Unggulan
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-16 grid w-full max-w-2xl grid-cols-2 gap-y-8 sm:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <Counter
                  to={s.value}
                  className="block font-display text-3xl font-extrabold text-ink sm:text-4xl"
                />
                <div className="mt-1 text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
