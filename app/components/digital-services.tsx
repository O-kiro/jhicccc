"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icons";
import { Container, SectionHeading } from "./ui";
import { Reveal, StaggerGroup, StaggerItem } from "./reveal";
import { SpotlightCard } from "./spotlight-card";
import { digitalServices } from "@/lib/content";

const iconTone: Record<string, string> = {
  teal: "bg-teal-soft text-teal",
  blue: "bg-blue-soft text-blue",
  gold: "bg-gold-soft text-gold-strong",
};

// Bento rhythm: wide tiles on the first and last rows, compact tiles between.
const WIDE = new Set([0, 1, 6, 7]);
const cardBase =
  "card-glow flex h-full rounded-card bg-surface shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hover";

/** System tiles go to the system's LOGIN page (new tab); info tiles stay internal. */
function TileLink({
  href,
  external,
  className,
  children,
}: {
  href: string;
  external: boolean;
  className: string;
  children: ReactNode;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function DigitalServices() {
  return (
    <section id="layanan" className="scroll-mt-24 bg-surface-2 py-24 sm:py-32">
      <Container>
        <SectionHeading
          gradient
          index="01"
          eyebrow="Satu Pintu Layanan"
          title="Layanan Digital MAKOBA"
          desc="Akses cepat ke seluruh layanan akademik dan administrasi madrasah dalam satu tempat."
        />

        <StaggerGroup className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {digitalServices.map((s, i) => {
            const tint = iconTone[s.tone];
            const wide = WIDE.has(i);
            const href = s.login?.href ?? s.href;
            const external = href.startsWith("http");
            const actionIcon = external ? "external" : "arrow";
            const actionLabel = s.login ? "Masuk" : "Buka";
            return (
              <StaggerItem key={s.name} className={wide ? "col-span-2" : ""}>
                <SpotlightCard className="h-full">
                  {wide ? (
                    <TileLink href={href} external={external} className={`group items-center gap-5 p-6 ${cardBase}`}>
                      <span
                        className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110 ${tint}`}
                      >
                        <Icon name={s.icon} className="h-8 w-8" />
                      </span>
                      <span className="min-w-0">
                        <h3 className="font-display text-lg font-bold text-ink">{s.name}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{s.desc}</p>
                      </span>
                      <Icon
                        name={actionIcon}
                        className="ml-auto h-5 w-5 shrink-0 text-teal transition-transform group-hover:translate-x-1"
                      />
                    </TileLink>
                  ) : (
                    <TileLink href={href} external={external} className={`group flex-col p-6 ${cardBase}`}>
                      <span
                        className={`grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110 ${tint}`}
                      >
                        <Icon name={s.icon} className="h-7 w-7" />
                      </span>
                      <h3 className="mt-5 font-display text-lg font-bold text-ink">{s.name}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal">
                        {actionLabel}
                        <Icon name={actionIcon} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </TileLink>
                  )}
                </SpotlightCard>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <p className="inline-flex items-center gap-2 text-sm text-muted">
              <Icon name="shield" className="h-4 w-4 shrink-0 text-teal" />
              Khusus untuk siswa, guru, dan staff sekolah. Gunakan akun resmi sekolah untuk masuk.
            </p>
            <Link
              href="/layanan"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue"
            >
              Pelajari detail tiap layanan
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
