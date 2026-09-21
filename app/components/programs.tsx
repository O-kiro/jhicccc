"use client";

import Link from "next/link";
import { Icon } from "./icons";
import { Container, SectionHeading } from "./ui";
import { GeoTexture } from "./ornaments";
import { StaggerGroup, StaggerItem } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import type { Site } from "@/lib/site";

const palette = {
  teal: { chip: "bg-teal-soft text-teal", accent: "text-teal" },
  blue: { chip: "bg-blue-soft text-blue", accent: "text-blue" },
  gold: { chip: "bg-gold-soft text-gold-strong", accent: "text-gold-strong" },
} as const;

/** Isinya dari CMS lewat getSite(); lihat lib/site.ts. */
export function Programs({ programs }: { programs: Site["programs"] }) {
  return (
    <section id="program" className="scroll-mt-24 py-20 sm:py-28">
      <Container>
        {/* Color-blocked band with an arched top (mihrab-inspired) */}
        <div className="bg-teal-gradient relative isolate overflow-hidden rounded-[2.5rem] rounded-t-[3rem] px-6 py-16 sm:rounded-t-[6rem] sm:px-12 sm:py-20">
          <GeoTexture className="pointer-events-none absolute inset-0 -z-10 text-white opacity-[0.07]" />

          <SectionHeading
            tone="onDark"
            index="02"
            eyebrow="Tiga Pilar Keunggulan"
            title="Program Unggulan"
            desc="Setiap siswa dibimbing tumbuh sesuai minat dan bakatnya melalui tiga program unggulan MAKOBA."
          />

          <StaggerGroup className="mt-14 grid gap-6 lg:grid-cols-3">
            {programs.map((p) => {
              const c = palette[p.color];
              return (
                <StaggerItem key={p.name} className="h-full">
                  <SpotlightCard className="h-full">
                    <Link
                      href={`/program/${p.slug}`}
                      className="card-glow group flex h-full flex-col rounded-card bg-surface p-8 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hover"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`grid h-16 w-16 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110 ${c.chip}`}
                        >
                          <Icon name={p.icon} className="h-8 w-8" />
                        </span>
                        <span className="rounded-md bg-canvas px-3 py-1 text-xs font-semibold text-muted">{p.tag}</span>
                      </div>
                      <h3 className="mt-6 font-display text-2xl font-extrabold text-ink">{p.name}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{p.desc}</p>
                      <ul className="mt-6 space-y-3 border-t border-line pt-6">
                        {p.points.map((pt) => (
                          <li key={pt} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                            <Icon name="check" className={`h-4 w-4 shrink-0 ${c.accent}`} />
                            {pt}
                          </li>
                        ))}
                      </ul>
                      <span className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${c.accent}`}>
                        Pelajari selengkapnya
                        <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </SpotlightCard>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </Container>
    </section>
  );
}
