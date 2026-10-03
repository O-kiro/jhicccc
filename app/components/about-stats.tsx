"use client";

import { Icon } from "./icons";
import { Button, Container, PhotoTile, SectionHeading } from "./ui";
import { Reveal } from "./reveal";
import { school } from "@/lib/content";
import type { Site } from "@/lib/site";

const highlights = [
  "Madrasah Penyelenggara Riset resmi",
  "Tiga program unggulan: Riset, Olimpiade, Tahfidz",
  "Lingkungan Islami yang modern & bermutu",
];

/**
 * Tentang MAKOBA. Revisi Figma: foto gedung asli dengan lencana lokasi di
 * pojok kiri bawah; panel statistik gelap di bawahnya dihapus (angkanya sudah
 * tampil di hero).
 */
export function AboutStats({ profile }: { profile: Site["profile"] }) {
  // Belum diisi admin → foto bawaan lib/content.ts.
  const fotoGedung = profile.buildingPhoto ?? school.buildingPhoto;

  return (
    <section id="tentang" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual */}
          <Reveal className="order-last lg:order-first">
            <div className="relative">
              <PhotoTile
                tone="teal"
                icon="globe"
                className="aspect-[4/3] rounded-panel"
                glyphClassName="h-24 w-24"
                src={fotoGedung}
                alt={`Gedung ${school.longName}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute bottom-4 left-4 flex max-w-[16rem] items-center gap-3 rounded-2xl bg-surface/95 p-3 pr-4 shadow-overlay backdrop-blur">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-soft text-blue">
                  <Icon name="pin" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">Kota Batu, Jawa Timur</p>
                  <p className="truncate text-xs text-muted">Jl. Patimura No. 25, Temas</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Copy */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="Tentang MAKOBA"
              title="Madrasah Aliyah Negeri Kota Batu"
              desc={`${school.longName} (MAKOBA) berlokasi di jantung Kota Batu, Jawa Timur memadukan estetika Islami yang elegan dengan pendidikan modern yang maju, bermutu, dan mendunia.`}
            />
            <Reveal delay={0.1}>
              <ul className="mt-8 space-y-3.5">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-ink">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal text-white">
                      <Icon name="check" className="h-4 w-4" />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-9">
                <Button href="/#program">Lihat Program Unggulan</Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
