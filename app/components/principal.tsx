"use client";

import { Icon } from "./icons";
import { Container, PhotoTile } from "./ui";
import { Reveal } from "./reveal";
import { principal } from "@/lib/content";
import type { Site } from "@/lib/site";

/**
 * Isinya dari CMS lewat getSite(). Tiap bagian yang belum diisi admin jatuh ke
 * nilai bawaan lib/content.ts, bukan dibiarkan kosong — jadi seksi ini tetap
 * utuh walau panel baru diisi sebagian.
 */
export function Principal({ profile }: { profile: Site["profile"] }) {
  const nama = profile.principalName ?? principal.name;
  const jabatan = profile.principalRole ?? principal.role;
  const sambutan = profile.principalMessage ?? principal.message;
  const foto = profile.principalPhoto ?? principal.photo;

  return (
    <section id="sambutan" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Portrait */}
          <Reveal>
            <div className="relative mx-auto max-w-sm">
              {/* Figma: foto formal berlatar putih, tanpa panel hijau */}
              <PhotoTile
                icon="users"
                texture={false}
                className="aspect-[4/5] rounded-panel border border-line bg-white! text-muted!"
                glyphClassName="h-24 w-24"
                src={foto}
                alt={nama}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-x-5 -bottom-5 rounded-2xl bg-surface p-4 text-center shadow-overlay">
                <p className="font-display text-sm font-bold text-ink">{nama}</p>
                <p className="text-xs text-teal">{jabatan}</p>
              </div>
            </div>
          </Reveal>

          {/* Message */}
          <div>
            <Reveal>
              <span className="eyebrow">
                <Icon name="star8" className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
                Sambutan Kepala Madrasah
              </span>
            </Reveal>
            {/* Figma: sambutan dibungkus kartu putih membulat, ikon kutip transparan */}
            <Reveal delay={0.05}>
              <figure className="relative mt-6 overflow-hidden rounded-panel bg-surface p-8 shadow-card sm:p-10">
                <Icon name="quote" className="pointer-events-none absolute right-6 top-6 h-20 w-20 text-blue/10" strokeWidth={1.2} />
                <blockquote className="relative font-serif text-xl italic leading-relaxed text-ink sm:text-2xl">
                  {sambutan}
                </blockquote>
                <figcaption className="relative mt-8 flex items-center gap-3">
                  <span className="h-px w-10 bg-gold" />
                  <span>
                    <span className="block font-display font-bold text-ink">{principal.name}</span>
                    <span className="block text-sm text-muted">{principal.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
