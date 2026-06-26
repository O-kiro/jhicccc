"use client";

import { Icon } from "./icons";
import { Container, SectionHeading } from "./ui";
import { StaggerGroup, StaggerItem } from "./reveal";
import { facilities } from "@/lib/content";

const tones = ["teal", "blue", "gold"] as const;
const panel: Record<"teal" | "blue" | "gold", { bg: string; icon: string }> = {
  teal: { bg: "bg-teal-soft", icon: "text-teal" },
  blue: { bg: "bg-blue-soft", icon: "text-blue" },
  gold: { bg: "bg-gold-soft", icon: "text-gold-strong" },
};

export function Facilities() {
  return (
    <section id="fasilitas" className="scroll-mt-24 bg-surface-2 py-24 sm:py-32">
      <Container>
        <SectionHeading
          gradient
          eyebrow="Sarana & Prasarana"
          title="Fasilitas Madrasah"
          desc="Sarana dan prasarana yang mendukung kenyamanan belajar siswa MAKOBA."
        />

        <StaggerGroup className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f, i) => {
            const c = panel[tones[i % 3]];
            return (
              <StaggerItem key={f.name} className="h-full">
                <article className={`card-glow group flex h-full flex-col rounded-card ${c.bg} p-7 transition-all duration-200 hover:-translate-y-1.5`}>
                  <span className={`grid h-14 w-14 place-items-center rounded-2xl bg-surface ${c.icon} shadow-card`}>
                    <Icon name={f.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold text-ink">{f.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{f.desc}</p>
                </article>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
