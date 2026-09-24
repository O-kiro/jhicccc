"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";
import type { SitePopup as Popup } from "@/lib/site";

/**
 * Pop-up informasi di beranda, diatur lewat My Website → Tampilan & Pop-up.
 *
 * Muncul sekali per pop-up: setelah ditutup, id-nya diingat di peramban dan
 * tidak muncul lagi — sampai admin menerbitkan pop-up baru (id berbeda).
 */
export function SitePopup({ popup }: { popup: Popup | null }) {
  const [open, setOpen] = useState(false);
  const kunci = popup ? `makoba-popup-${popup.id}` : null;

  useEffect(() => {
    if (!kunci) return;
    // localStorage bisa melempar galat di mode privat atau saat situs
    // diblokir menyimpan data; pop-up tetap tampil dalam keadaan itu.
    let sudahDitutup = false;
    try {
      sudahDitutup = window.localStorage.getItem(kunci) === "1";
    } catch {}
    if (sudahDitutup) return;

    // Ditunda sebentar supaya tidak menutupi beranda sebelum sempat terlihat.
    const t = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(t);
  }, [kunci]);

  function tutup() {
    setOpen(false);
    if (!kunci) return;
    try {
      window.localStorage.setItem(kunci, "1");
    } catch {}
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && tutup();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!popup) return null;

  const eksternal = popup.linkUrl ? /^https?:\/\//.test(popup.linkUrl) : false;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={tutup}
          className="fixed inset-0 z-[70] grid place-items-center bg-ink/50 p-5 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-judul"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative w-full max-w-md overflow-hidden rounded-card bg-surface shadow-overlay"
          >
            <div className="bg-teal-gradient h-2" />
            <div className="p-7">
              <button
                type="button"
                onClick={tutup}
                aria-label="Tutup pengumuman"
                className="press absolute right-4 top-5 grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-colors hover:text-ink"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>

              <span className="eyebrow text-teal">
                <Icon name="bell" className="h-3.5 w-3.5" />
                Pengumuman
              </span>
              <h2 id="popup-judul" className="mt-3 pr-8 font-display text-xl font-extrabold leading-tight text-ink">
                {popup.title}
              </h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{popup.body}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {popup.linkUrl && (
                  <Link
                    href={popup.linkUrl}
                    onClick={tutup}
                    {...(eksternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="btn-sheen bg-blue-gradient press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    {popup.linkLabel || "Selengkapnya"}
                    <Icon name={eksternal ? "external" : "arrow"} className="h-4 w-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={tutup}
                  className="press inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
