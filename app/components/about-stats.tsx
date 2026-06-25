"use client";

import { Icon } from "./icons";
import { Button, Container, PhotoTile, SectionHeading } from "./ui";
import { GeoTexture } from "./ornaments";
import { Reveal, StaggerGroup, StaggerItem } from "./reveal";
import { Counter } from "./counter";
import { school, stats } from "@/lib/content";

const highlights = [
  "Madrasah Penyelenggara Riset resmi",
  "Tiga program unggulan: Riset, Olimpiade, Tahfidz",
  "Lingkungan Islami yang modern & bermutu",
];

export function AboutStats() {
  return (
    <section id="tentang" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual */}
          <Reveal className="order-last lg:order-first">
            <div className="relative">
              <PhotoTile tone="teal" icon="globe" className="aspect-[4/3] rounded-panel" glyphClassName="h-24 w-24" />
              <div className="absolute -bottom-6 left-6 max-w-[16rem] rounded-2xl bg-surface p-4 shadow-overlay">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-strong">
                    <Icon name="shield" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-ink">Madrasah Riset</p>
                    <p className="text-xs text-muted">{school.researchDecree}</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Copy */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="Tentang MAKOBA"
              title="Madrasah Aliyah Negeri Kota Batu"
              desc={`${school.longName} (MAKOBA) berlokasi di jantung Kota Batu, Jawa Timur — memadukan estetika Islami yang elegan dengan pendidikan modern yang ${school.motto.toLowerCase()}.`}
            />
            <Reveal delay={0.1}>
              <ul className="mt-8 space-y-3.5">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-ink">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal text-white">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9">
                <Button href="#program">Lihat Program Unggulan</Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>

      {/* Stats — dark panel */}
      <Container className="mt-20">
        <div id="data" className="relative isolate scroll-mt-24 overflow-hidden rounded-panel bg-dark px-6 py-14 text-on-dark sm:px-12">
          <GeoTexture className="pointer-events-none absolute inset-0 text-white opacity-[0.06]" />
          <StaggerGroup className="relative grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {stats.map((s) => (
              <StaggerItem key={s.label} className="text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/10 text-on-dark">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <p className="mt-4 font-display text-4xl font-extrabold tracking-tight text-gold sm:text-5xl">
                  <Counter to={s.value} suffix={s.suffix ?? ""} />
                </p>
                <p className="mt-1.5 text-sm text-on-dark/70">{s.label}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Container>
    </section>
  );
}
