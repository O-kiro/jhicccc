"use client";

import { Icon } from "./icons";
import { Container, PhotoTile } from "./ui";
import { Reveal } from "./reveal";
import { principal } from "@/lib/content";

export function Principal() {
  return (
    <section id="sambutan" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Portrait */}
          <Reveal>
            <div className="relative mx-auto max-w-sm">
              <PhotoTile tone="teal" icon="users" className="aspect-[4/5] rounded-panel" glyphClassName="h-24 w-24" src={principal.photo} alt={principal.name} sizes="(max-width: 1024px) 100vw, 40vw" />
              <div className="absolute inset-x-5 -bottom-5 rounded-2xl bg-surface p-4 text-center shadow-overlay">
                <p className="font-display text-sm font-bold text-ink">{principal.name}</p>
                <p className="text-xs text-teal">{principal.role}</p>
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
            <Reveal delay={0.05}>
              <Icon name="quote" className="mt-6 h-12 w-12 text-gold/40" />
            </Reveal>
            <Reveal delay={0.1}>
              <blockquote className="mt-4 font-serif text-2xl italic leading-relaxed text-ink">
                {principal.message}
              </blockquote>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex items-center gap-3">
                <span className="h-px w-10 bg-gold" />
                <div>
                  <p className="font-display font-bold text-ink">{principal.name}</p>
                  <p className="text-sm text-muted">{principal.role}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
