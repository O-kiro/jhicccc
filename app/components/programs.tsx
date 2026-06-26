"use client";

import Link from "next/link";
import { Icon } from "./icons";
import { Container, SectionHeading } from "./ui";
import { StaggerGroup, StaggerItem } from "./reveal";
import { programs } from "@/lib/content";

const palette = {
  teal: { panel: "bg-teal-soft", icon: "text-teal", check: "text-teal" },
  blue: { panel: "bg-blue-soft", icon: "text-blue", check: "text-blue" },
  gold: { panel: "bg-gold-soft", icon: "text-gold-strong", check: "text-gold-strong" },
} as const;

export function Programs() {
  return (
    <section id="program" className="scroll-mt-24 bg-surface-2 py-24 sm:py-32">
      <Container>
        <SectionHeading
          gradient
          eyebrow="Tiga Pilar Keunggulan"
          title="Program Unggulan"
          desc="Setiap siswa dibimbing tumbuh sesuai minat dan bakatnya melalui tiga program unggulan MAKOBA."
        />

        <StaggerGroup className="mt-16 grid gap-6 lg:grid-cols-3">
          {programs.map((p) => {
            const c = palette[p.color];
            return (
              <StaggerItem key={p.name} className="h-full">
                <Link
                  href={`/program/${p.slug}`}
                  className={`card-glow group flex h-full flex-col rounded-card ${c.panel} p-8 transition-all duration-200 hover:-translate-y-1.5`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`grid h-16 w-16 place-items-center rounded-2xl bg-surface ${c.icon} shadow-card`}>
                      <Icon name={p.icon} className="h-8 w-8" />
                    </span>
                    <span className="rounded-md bg-surface/70 px-3 py-1 text-xs font-semibold text-ink">{p.tag}</span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-extrabold text-ink">{p.name}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{p.desc}</p>
                  <ul className="mt-6 space-y-3 border-t border-ink/10 pt-6">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                        <Icon name="check" className={`h-4 w-4 shrink-0 ${c.check}`} />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <span className={`mt-6 inline-flex items-center gap-1.5 text-sm font-semibold ${c.icon}`}>
                    Pelajari selengkapnya
                    <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </section>
  );
}
