"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui";

/** Mobile-only bottom bar that slides in after the hero, driving PPDB sign-ups. */
export function StickyCta() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Don't show on the PPDB page itself.
  if (pathname.startsWith("/ppdb")) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 px-4 py-3 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto flex max-w-md items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-bold text-ink">PPDB 2026 / 2027 Dibuka</p>
              <p className="truncate text-xs text-muted">Jalur Prestasi · Afirmasi · Reguler</p>
            </div>
            <Button href="/ppdb" size="md" icon={false} className="shrink-0">
              Daftar
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
