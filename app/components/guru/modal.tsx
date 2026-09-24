"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/app/components/icons";

/**
 * Dialog portal — tampilannya sama dengan daftar modul di halaman Kursus
 * siswa. Tertutup lewat tombol ×, klik di luar kotak, atau Escape.
 */
export function Modal({
  open,
  onClose,
  eyebrow,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  const id = useId();

  // Disimpan di ref supaya pemanggil boleh mengirim fungsi baru tiap render
  // tanpa memasang ulang pendengar Escape.
  const tutupRef = useRef(onClose);
  useEffect(() => {
    tutupRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const tutup = (e: KeyboardEvent) => {
      if (e.key === "Escape") tutupRef.current();
    };
    document.addEventListener("keydown", tutup);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tutup);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/50 p-5 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={id}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="my-auto w-full max-w-lg rounded-card border border-line bg-surface p-7"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="min-w-0">
                {eyebrow && (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-teal">{eyebrow}</p>
                )}
                <h2 id={id} className="mt-1 font-display text-xl font-extrabold leading-tight text-ink">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="press grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:text-ink"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Kolom formulir berlabel dengan pesan galatnya. */
export function Kolom({
  label,
  htmlFor,
  galat,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  galat?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {galat ? (
        <p className="mt-1.5 text-xs font-semibold text-gold-strong">{galat}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>
      )}
    </div>
  );
}

export const inputPortal =
  "w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-blue disabled:opacity-60";
