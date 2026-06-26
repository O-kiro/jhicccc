"use client";

import Link from "next/link";
import { Icon } from "./icons";
import { Badge, Container, PhotoTile, SectionHeading } from "./ui";
import { Reveal } from "./reveal";
import { news } from "@/lib/content";
import { formatDate } from "@/lib/format";

export function News() {
  const [featured, ...rest] = news;

  return (
    <section id="berita" className="scroll-mt-24 bg-surface-2 py-24 sm:py-32">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            align="left"
            eyebrow="Kabar Terbaru"
            title="Berita & Informasi"
            desc="Ikuti perkembangan kegiatan, prestasi, dan pengumuman terbaru dari MAKOBA."
          />
          <Reveal delay={0.1} className="hidden shrink-0 sm:block">
            <Link href="/berita" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
              Semua berita
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {/* Featured */}
          <Reveal>
            <Link href={`/berita/${featured.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hover">
              <PhotoTile tone={featured.tone} icon="trophy" className="aspect-[16/9]" glyphClassName="h-16 w-16" src={featured.image} alt={featured.title}>
                <span className="absolute left-4 top-4">
                  <Badge tone={featured.tone}>{featured.category}</Badge>
                </span>
              </PhotoTile>
              <div className="flex flex-1 flex-col p-7">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                  <Icon name="calendar" className="h-3.5 w-3.5" /> {formatDate(featured.date)}
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-ink group-hover:text-teal">
                  {featured.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{featured.excerpt}</p>
              </div>
            </Link>
          </Reveal>

          {/* List */}
          <div className="flex flex-col gap-4">
            {rest.map((n, idx) => (
              <Reveal key={n.title} delay={idx * 0.08}>
                <Link href={`/berita/${n.slug}`} className="group flex gap-4 rounded-card bg-surface p-3 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-hover">
                  <PhotoTile
                    tone={n.tone}
                    icon="sparkle"
                    className="h-24 w-28 shrink-0 rounded-2xl"
                    glyphClassName="h-8 w-8"
                    src={n.image}
                    alt={n.title}
                    sizes="112px"
                  />
                  <div className="flex min-w-0 flex-col justify-center py-1">
                    <span className="inline-flex items-center gap-2 text-xs text-muted">
                      <Badge tone="teal">{n.category}</Badge>
                      {formatDate(n.date)}
                    </span>
                    <h3 className="mt-2 line-clamp-2 font-display text-base font-bold text-ink group-hover:text-teal">
                      {n.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
