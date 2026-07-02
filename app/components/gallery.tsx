"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";
import { Badge, Container, SectionHeading } from "./ui";
import { StaggerGroup, staggerItem } from "./reveal";
import { galleryItems } from "@/lib/content";
import { formatDate } from "@/lib/format";

const tone: Record<string, string> = {
  teal: "bg-teal-soft text-teal",
  blue: "bg-blue-soft text-blue",
  gold: "bg-gold-soft text-gold-strong",
};

function Media({
  t,
  layoutId,
  src,
  alt,
  sizes,
}: {
  t: string;
  layoutId: string;
  src?: string;
  alt?: string;
  sizes?: string;
}) {
  return (
    <motion.div layoutId={layoutId} className={`relative h-full w-full ${tone[t]}`}>
      <div className="absolute inset-0 grid place-items-center opacity-60">
        <Icon name="camera" className="h-12 w-12" strokeWidth={1} />
      </div>
      {src && (
        <Image
          src={src}
          alt={alt ?? ""}
          fill
          sizes={sizes ?? "(max-width: 768px) 50vw, 33vw"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </motion.div>
  );
}

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null); // tile that opened the lightbox
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the dialog on open; hand it back to the tile on close.
  useEffect(() => {
    if (selected !== null) {
      const id = requestAnimationFrame(() => closeRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    triggerRef.current?.focus();
  }, [selected]);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight") setSelected((s) => (s === null ? s : (s + 1) % galleryItems.length));
      if (e.key === "ArrowLeft") setSelected((s) => (s === null ? s : (s - 1 + galleryItems.length) % galleryItems.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  const item = selected === null ? null : galleryItems[selected];

  return (
    <section id="galeri" className="scroll-mt-24 bg-surface-2 py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="08"
          eyebrow="Dokumentasi Kegiatan"
          title="Galeri MAKOBA"
          desc="Momen kebersamaan dan kegiatan madrasah yang terdokumentasi sepanjang tahun."
        />

        <StaggerGroup className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3">
          {galleryItems.map((g, i) => (
            <motion.button
              key={g.title}
              type="button"
              variants={staggerItem}
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setSelected(i);
              }}
              className="group flex flex-col overflow-hidden rounded-card bg-surface text-left shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                  <Media t={g.tone} layoutId={`gallery-${i}`} src={g.image} alt={g.title} />
                </div>
                <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface/90 text-teal opacity-0 shadow-card backdrop-blur transition-opacity group-hover:opacity-100">
                  <Icon name="search" className="h-4 w-4" />
                </span>
              </div>
              <div className="flex items-center gap-2 p-4">
                <Badge tone="teal">{g.category}</Badge>
                <h3 className="line-clamp-1 font-display text-sm font-bold text-ink">{g.title}</h3>
              </div>
            </motion.button>
          ))}
        </StaggerGroup>
      </Container>

      {/* Lightbox */}
      <AnimatePresence>
        {item && selected !== null && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={item.title}
              className="w-full max-w-3xl overflow-hidden rounded-panel bg-surface shadow-overlay"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10]">
                <Media t={item.tone} layoutId={`gallery-${selected}`} src={item.image} alt={item.title} sizes="(max-width: 768px) 100vw, 768px" />
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Tutup"
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-surface/90 text-ink shadow-card backdrop-blur hover:text-teal"
                >
                  <Icon name="close" className="h-5 w-5" />
                </button>
              </div>
              <motion.div
                className="flex items-center justify-between gap-4 p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div>
                  <Badge tone="teal">{item.category}</Badge>
                  <h3 className="mt-2.5 font-display text-xl font-bold text-ink">{item.title}</h3>
                  <p className="text-sm text-muted">{formatDate(item.date)}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    aria-label="Sebelumnya"
                    onClick={() => setSelected((s) => (s === null ? s : (s - 1 + galleryItems.length) % galleryItems.length))}
                    className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink shadow-card hover:text-teal"
                  >
                    <Icon name="arrow" className="h-5 w-5 rotate-180" />
                  </button>
                  <button
                    type="button"
                    aria-label="Berikutnya"
                    onClick={() => setSelected((s) => (s === null ? s : (s + 1) % galleryItems.length))}
                    className="grid h-11 w-11 place-items-center rounded-full bg-surface text-ink shadow-card hover:text-teal"
                  >
                    <Icon name="arrow" className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
