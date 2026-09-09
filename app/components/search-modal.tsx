"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";
import {
  achievements,
  agenda,
  digitalServices,
  extracurriculars,
  facilities,
  faqs,
  news,
  programs,
} from "@/lib/content";

type Item = { label: string; group: string; href: string };

const INDEX: Item[] = [
  ...programs.map((p) => ({ label: p.name, group: "Program", href: `/program/${p.slug}` })),
  ...digitalServices.map((s) => ({ label: s.name, group: "Layanan Digital", href: s.href })),
  ...achievements.map((a) => ({ label: a.title, group: "Prestasi", href: "/#prestasi" })),
  ...news.map((n) => ({ label: n.title, group: "Berita", href: `/berita/${n.slug}` })),
  ...extracurriculars.map((e) => ({ label: e.name, group: "Ekstrakurikuler", href: "/#ekskul" })),
  ...facilities.map((f) => ({ label: f.name, group: "Fasilitas", href: "/#fasilitas" })),
  ...agenda.map((a) => ({ label: a.title, group: "Agenda", href: "/#agenda" })),
  ...faqs.map((f) => ({ label: f.q, group: "FAQ", href: "/#faq" })),
];

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return [];
    return INDEX.filter((i) => i.label.toLowerCase().includes(t)).slice(0, 8);
  }, [q]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      setQ("");
      inputRef.current?.focus();
    });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-ink/40 px-4 pt-24 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Pencarian"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Icon name="search" className="h-5 w-5 shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari berita, prestasi, program…"
                className="w-full bg-transparent py-4 text-ink outline-none placeholder:text-muted"
              />
              <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-[10px] text-muted sm:block">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {q.trim() === "" ? (
                <p className="px-3 py-6 text-center text-sm text-muted">
                  Ketik kata kunci untuk mulai mencari.
                </p>
              ) : results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted">
                  Tidak ada hasil untuk “{q}”.
                </p>
              ) : (
                <ul className="space-y-1">
                  {results.map((r, i) => (
                    <li key={`${r.href}-${i}`}>
                      <a
                        href={r.href}
                        onClick={onClose}
                        className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-teal-soft"
                      >
                        <span className="line-clamp-1 text-ink">{r.label}</span>
                        <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-muted">
                          {r.group}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
