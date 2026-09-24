"use client";

import { Icon } from "./icons";
import { Container, SectionHeading } from "./ui";
import { StaggerGroup, StaggerItem } from "./reveal";
import type { Site } from "@/lib/site";

const tones = ["teal", "blue", "gold"] as const;
const iconTone: Record<string, string> = {
  teal: "bg-teal-soft text-teal",
  blue: "bg-blue-soft text-blue",
  gold: "bg-gold-soft text-gold-strong",
};

/** Isinya dari CMS lewat getSite(); lihat lib/site.ts. */
export function Extracurriculars({ extracurriculars }: { extracurriculars: Site["extracurriculars"] }) {
  return (
    <section id="ekskul" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="05"
          eyebrow="Pengembangan Bakat"
          title="Ekstrakurikuler"
          desc="Ragam kegiatan untuk mengasah minat, bakat, dan karakter siswa di luar kelas."
        />

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {extracurriculars.map((e, i) => (
            <StaggerItem key={e.name} className="h-full">
              <article className="card-glow group flex h-full items-start gap-4 rounded-card bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hover">
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110 ${iconTone[tones[i % 3]]}`}
                >
                  <Icon name={e.icon} className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-base font-bold text-ink">{e.name}</h3>
                  <span className="mt-0.5 inline-block text-xs font-semibold text-teal">{e.category}</span>
                  <p className="mt-1.5 text-sm text-muted">{e.desc}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
