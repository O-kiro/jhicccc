"use client";

import { motion } from "motion/react";
import { Icon } from "./icons";
import { Button, Container } from "./ui";
import { GeoTexture } from "./ornaments";
import { Reveal } from "./reveal";
import { Countdown } from "./countdown";
import { ppdbInfo } from "@/lib/content";

const jalur = [
  { icon: "trophy", label: "Jalur Prestasi" },
  { icon: "heart", label: "Jalur Afirmasi" },
  { icon: "users", label: "Jalur Reguler" },
] as const;

export function CtaPpdb() {
  return (
    <section id="ppdb" className="scroll-mt-24 py-16">
      <Container>
        <div className="relative isolate overflow-hidden rounded-panel bg-dark px-6 py-20 text-center text-on-dark sm:px-12 sm:py-24">
          <GeoTexture className="pointer-events-none absolute inset-0 text-white opacity-[0.06]" />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute right-10 top-10 text-white/10"
            animate={{ y: [0, -16, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon name="star8" className="h-20 w-20" strokeWidth={1} />
          </motion.div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-6 bottom-8 text-white/10"
            animate={{ y: [0, 14, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Icon name="star8" className="h-12 w-12" strokeWidth={1} />
          </motion.div>

          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-on-dark">
              <Icon name="sparkle" className="h-3.5 w-3.5 text-gold" />
              PPDB Tahun Pelajaran 2026 / 2027
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mx-auto mt-6 max-w-3xl text-balance font-extrabold text-on-dark text-[clamp(2rem,5vw,4rem)]">
              Wujudkan Masa Depan Gemilang di <span className="text-gold">MAN Kota Batu</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-lg text-on-dark/70">
              Bergabunglah dengan keluarga besar MAKOBA — madrasah riset yang membentuk generasi
              berilmu, berakhlak, dan berprestasi.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mx-auto mt-10 max-w-md">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-on-dark/60">
                Gelombang 1 ditutup dalam
              </p>
              <Countdown deadlineISO={ppdbInfo.deadlineISO} />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/ppdb" size="lg" variant="light">
                Daftar Sekarang
              </Button>
              <Button href="/kontak" size="lg" variant="outlineDark" icon={false}>
                Hubungi Kami
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {jalur.map((j) => (
                <span key={j.label} className="inline-flex items-center gap-2 text-sm text-on-dark/85">
                  <Icon name={j.icon} className="h-4 w-4 text-gold" />
                  {j.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
