"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";
import { Container, SectionHeading } from "./ui";
import { Reveal } from "./reveal";
import { faqs } from "@/lib/content";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-surface-2 py-24 sm:py-32">
      <Container>
        <SectionHeading
          index="10"
          eyebrow="Pertanyaan Umum"
          title="Frequently Asked Questions"
          desc="Jawaban atas pertanyaan yang sering diajukan calon siswa, wali murid, dan masyarakat."
        />

        <div className="mx-auto mt-16 max-w-3xl space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={Math.min(i * 0.04, 0.2)}>
                <div className="overflow-hidden rounded-card bg-surface shadow-card">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-display text-[15px] font-bold text-ink">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isOpen ? "bg-teal text-white" : "bg-teal-soft text-teal"}`}
                    >
                      <Icon name="chevron" className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <p className="px-6 pb-6 text-[15px] leading-relaxed text-muted">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
