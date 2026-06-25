"use client";

import { Icon } from "./icons";
import { Container, SectionHeading } from "./ui";
import { StaggerGroup, StaggerItem } from "./reveal";
import { digitalServices } from "@/lib/content";

const tones = ["teal", "blue", "gold"] as const;
const iconTone: Record<string, string> = {
  teal: "bg-teal-soft text-teal",
  blue: "bg-blue-soft text-blue",
  gold: "bg-gold-soft text-gold-strong",
};

export function DigitalServices() {
  return (
    <section id="layanan" className="scroll-mt-24 bg-surface-2 py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Satu Pintu Layanan"
          title="Layanan Digital MAKOBA"
          desc="Akses cepat ke seluruh layanan akademik dan administrasi madrasah dalam satu tempat."
        />

        <StaggerGroup className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {digitalServices.map((s, i) => (
            <StaggerItem key={s.name}>
              <a
                href={s.href}
                className="group flex h-full flex-col rounded-card bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hover"
              >
                <span className={`grid h-14 w-14 place-items-center rounded-2xl ${iconTone[tones[i % 3]]}`}>
                  <Icon name={s.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">{s.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal">
                  Buka
                  <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  );
}
