"use client";

import { motion } from "motion/react";
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

const shapes = [
  { pos: "left-[3%] top-[24%]", size: "h-24 w-24", color: "bg-teal-soft", radius: "rounded-[2rem]", delay: 0 },
  { pos: "right-[5%] top-[18%]", size: "h-36 w-36", color: "bg-blue-soft", radius: "rounded-full", delay: 0.7 },
  { pos: "right-[12%] bottom-[16%]", size: "h-20 w-20", color: "bg-gold-soft", radius: "rounded-[1.5rem]", delay: 1.2 },
  { pos: "left-[9%] bottom-[20%]", size: "h-16 w-16", color: "bg-blue-soft", radius: "rounded-full", delay: 1.7 },
];

export function Hero() {
  return (
    <section id="beranda" className="relative isolate overflow-hidden">
      <GeoTexture className="pointer-events-none absolute inset-0 -z-10 text-ink opacity-[0.04]" />

      {/* Floating pastel shapes (MetaMask layered-accent motif) */}
      {shapes.map((s, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`pointer-events-none absolute -z-10 hidden sm:block ${s.pos} ${s.size} ${s.color} ${s.radius}`}
          animate={{ y: [0, -22, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        />
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

          <motion.h1
            variants={item}
            className="display mt-8 text-[clamp(3.25rem,12vw,10rem)] leading-[0.85]"
          >
            <span className="block text-blue-gradient">Berilmu.</span>
            <span className="block text-teal">Berakhlak.</span>
            <span className="block text-gold">Berprestasi.</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-muted sm:text-xl"
          >
            {school.longName}  memadukan identitas Islami yang elegan dengan pendidikan
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
