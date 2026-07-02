"use client";

import { Icon } from "./icons";
import { Container, SectionHeading } from "./ui";
import { StaggerGroup, StaggerItem } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { facilities } from "@/lib/content";

const tones = ["teal", "blue", "gold"] as const;
const panel: Record<"teal" | "blue" | "gold", { bg: string; icon: string }> = {
  teal: { bg: "bg-teal-soft", icon: "text-teal" },
  blue: { bg: "bg-blue-soft", icon: "text-blue" },
  gold: { bg: "bg-gold-soft", icon: "text-gold-strong" },
};

const cardBase = "card-glow group h-full rounded-card p-7 transition-all duration-200 hover:-translate-y-1.5";

export function Facilities() {
  return (
    <section id="fasilitas" className="scroll-mt-24 bg-surface-2 py-24 sm:py-32">
      <Container>
        <SectionHeading
          gradient
          index="06"
          eyebrow="Sarana & Prasarana"
          title="Fasilitas Madrasah"
          desc="Sarana dan prasarana yang mendukung kenyamanan belajar siswa MAKOBA."
        />

        <StaggerGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f, i) => {
            const c = panel[tones[i % 3]];
            const span = i === 0 ? "lg:col-span-2" : i === facilities.length - 1 ? "lg:col-span-3" : "";
            const wide = i === 0 || i === facilities.length - 1;
            return (
              <StaggerItem key={f.name} className={`h-full ${span}`}>
                <SpotlightCard className="h-full">
                  {wide ? (
                    <article className={`flex items-center gap-5 ${c.bg} ${cardBase}`}>
                      <span
                        className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-surface ${c.icon} shadow-card transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110`}
                      >
                        <Icon name={f.icon} className="h-8 w-8" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display text-xl font-bold text-ink">{f.name}</h3>
                        <p className="mt-1 text-[15px] leading-relaxed text-ink/70">{f.desc}</p>
                      </div>
                    </article>
                  ) : (
                    <article className={`flex flex-col ${c.bg} ${cardBase}`}>
                      <span
                        className={`grid h-14 w-14 place-items-center rounded-2xl bg-surface ${c.icon} shadow-card transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110`}
                      >
                        <Icon name={f.icon} className="h-7 w-7" />
                      </span>
                      <h3 className="mt-6 font-display text-xl font-bold text-ink">{f.name}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{f.desc}</p>
                    </article>
                  )}
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
