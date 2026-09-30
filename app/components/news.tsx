"use client";

import Link from "next/link";
import { Icon } from "./icons";
import { Badge, Button, Container, PhotoTile, SectionHeading } from "./ui";
import { Reveal } from "./reveal";
import type { Site } from "@/lib/site";
import { formatDate } from "@/lib/format";

/** Isinya dari CMS lewat getSite(); lihat lib/site.ts. */
export function News({ news }: { news: Site["news"] }) {
  const [featured, ...rest] = news;

  return (
    <section id="berita" className="scroll-mt-24 bg-surface-2 py-24 sm:py-32">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            align="left"
            index="05"
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
            {/* Figma: banner besar, teks menumpang di atas foto kegiatan */}
            <Link href={`/berita/${featured?.slug}`} className="group block h-full overflow-hidden rounded-card shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hover">
              <PhotoTile
                tone={featured.tone}
                icon="trophy"
                className="h-full min-h-[24rem]"
                glyphClassName="h-16 w-16"
                src={featured.image}
                alt={featured.title}
                sizes="(max-width: 1024px) 100vw, 50vw"
              >
                <span aria-hidden className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />
                <span className="absolute left-5 top-5">
                  <Badge tone={featured.tone}>{featured.category}</Badge>
                </span>
                <div className="absolute inset-x-0 bottom-0 flex flex-col p-7">
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/80">
                    <Icon name="calendar" className="h-3.5 w-3.5" /> {formatDate(featured.date)}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold leading-snug text-white">
                    {featured.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-white/80">{featured.excerpt}</p>
                </div>
              </PhotoTile>
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

        {/* Figma: kartu ajakan Instagram, biru tua solid dengan tombol putih */}
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-card bg-[#0b3563] p-6 text-white shadow-card sm:flex-row sm:items-center sm:p-8">
            <div>
              <h3 className="font-display text-xl font-bold text-white">Ingin Info Lebih Cepat?</h3>
              <p className="mt-1 text-sm text-white/75">Ikuti Instagram resmi kami!!</p>
            </div>
            <a
              href="https://www.instagram.com/mankotabatuofficial/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0b3563] shadow-card transition-all hover:-translate-y-0.5"
            >
              Follow Sekarang
              <Icon name="external" className="h-4 w-4" />
            </a>
          </div>
        </Reveal>

        {/* Mobile path to the full news index (the header link is sm+ only) */}
        <Reveal className="mt-8 sm:hidden">
          <Button href="/berita" variant="outline" className="w-full">
            Semua berita
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
