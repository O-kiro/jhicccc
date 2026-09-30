"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "./icons";
import { whatsappNumber } from "./floating-whatsapp";

/** Floating "back to top" button — appears after deep scroll on this long page.
 *  Sits above the mobile StickyCta bar; bottom-right corner on desktop. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Kembali ke atas"
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
          initial={{ opacity: 0, scale: 0.7, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className={`fixed z-40 grid h-11 w-11 place-items-center rounded-full border border-line bg-surface/90 text-ink shadow-overlay backdrop-blur transition-colors hover:text-teal ${
            // Menumpuk tepat di atas tombol WhatsApp (h-14) bila tombol itu tampil.
            whatsappNumber
              ? "bottom-[8.5rem] right-[1.375rem] lg:bottom-[5.5rem] lg:right-[1.875rem]"
              : "bottom-20 right-4 lg:bottom-6 lg:right-6"
          }`}
        >
          <Icon name="chevron" className="h-5 w-5 rotate-180" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
