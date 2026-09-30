"use client";

import { Icon } from "./icons";
import { Container, PhotoTile, SectionHeading } from "./ui";
import { StaggerGroup, StaggerItem } from "./reveal";
import type { Site } from "@/lib/site";

const tones = ["teal", "blue", "gold"] as const;

/**
 * Isinya dari CMS lewat getSite(); lihat lib/site.ts.
 *
 * Figma: tiap kartu berupa foto asli fasilitas. Selama fotonya belum ada,
 * panel pastel berikon tetap tampil sebagai pengganti.
 */
export function Facilities({ facilities }: { facilities: Site["facilities"] }) {
  return (
    <section id="fasilitas" className="scroll-mt-24 bg-surface-2 py-24 sm:py-32">
      <Container>
        <SectionHeading
          gradient
          index="07"
          eyebrow="Sarana & Prasarana"
          title="Fasilitas Madrasah"
          desc="Sarana dan prasarana yang mendukung kenyamanan belajar siswa MAKOBA."
        />

        <StaggerGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f, i) => {
            const span = i === 0 ? "lg:col-span-2" : i === facilities.length - 1 ? "lg:col-span-3" : "";
            return (
              <StaggerItem key={f.name} className={`h-full ${span}`}>
                <article className="group relative h-72 overflow-hidden rounded-card shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hover">
                  <PhotoTile
                    tone={tones[i % 3]}
                    icon={f.icon}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    glyphClassName="h-16 w-16"
                    src={f.image}
                    alt={f.name}
                    sizes={span ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 100vw, 33vw"}
                  />
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 p-6">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white backdrop-blur">
                      <Icon name={f.icon} className="h-6 w-6" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-xl font-bold text-white">{f.name}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/80">{f.desc}</p>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
