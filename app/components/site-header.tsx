"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";
import { ThemeToggle } from "./theme-toggle";
import { SearchModal } from "./search-modal";
import { Button, cn } from "./ui";
import { navItems, school } from "@/lib/content";

// Highlights the top-level nav item for the section currently in view (on the
// homepage) or the active route. Keys match navItems labels.
const ACTIVE_MAP: Record<string, { sections?: string[]; paths?: string[] }> = {
  Profil: { paths: ["/profil", "/alumni"] },
  Akademik: { sections: ["program", "ekskul"], paths: ["/program"] },
  Prestasi: { sections: ["prestasi"] },
  Berita: { sections: ["berita"], paths: ["/berita"] },
  Informasi: { sections: ["layanan", "agenda", "fasilitas", "galeri", "faq"], paths: ["/layanan"] },
  Kontak: { sections: ["kontak"], paths: ["/kontak", "/ppdb"] },
};

const SECTION_IDS = [
  "layanan", "program", "prestasi", "berita",
  "ekskul", "fasilitas", "agenda", "galeri", "faq", "kontak",
];

/** Tracks which of the given section ids is most prominently in the viewport. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.2, 0.5, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${school.name} — Beranda`}>
      <Image
        src="/logo.png"
        alt="Logo MAN Kota Batu"
        width={44}
        height={44}
        priority
        unoptimized
        className="h-11 w-11 object-contain"
      />
      <span className="leading-tight">
        <span className="block font-display text-[15px] font-extrabold tracking-tight text-ink">{school.name}</span>
        <span className="block text-[11px] font-medium text-muted">{school.nick}</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const activeSection = useActiveSection(SECTION_IDS);

  const isActive = (label: string) => {
    const m = ACTIVE_MAP[label];
    if (!m) return false;
    if (m.paths?.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;
    return pathname === "/" && !!activeSection && (m.sections?.includes(activeSection) ?? false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // ⌘K / Ctrl+K opens search from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled || menuOpen ? "border-b border-line bg-canvas/85 backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const active = isActive(item.label);
              return (
                <li key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-blue",
                      active ? "text-blue" : "text-ink/80",
                    )}
                  >
                    {item.label}
                    {item.children && <Icon name="chevron" className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" />}
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="bg-blue-gradient absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {item.children && (
                    <div className="invisible absolute left-0 top-full w-56 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <div className="overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-overlay">
                        {item.children.map((c) => (
                          <Link
                            key={c.label}
                            href={c.href}
                            className="block rounded-xl px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-blue-soft hover:text-blue"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Cari"
              aria-keyshortcuts="Meta+K Control+K"
              title="Cari (⌘K)"
              className="grid h-10 w-10 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ink/[0.05] hover:text-blue"
            >
              <Icon name="search" className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <div className="hidden sm:block">
              <Button href="/ppdb" size="md" icon={false}>
                PPDB 2026
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.05] lg:hidden"
            >
              <Icon name={menuOpen ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-line bg-canvas lg:hidden"
            >
              <motion.ul
                className="mx-auto max-w-6xl space-y-1 px-5 py-4 sm:px-8"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
              >
                {navItems.map((item) => (
                  <motion.li
                    key={item.label}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2.5 font-medium text-ink hover:bg-blue-soft hover:text-blue"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="ml-3 border-l border-line pl-3">
                        {item.children.map((c) => (
                          <Link
                            key={c.label}
                            href={c.href}
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-muted hover:text-blue"
                          >
                            {c.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.li>
                ))}
                <motion.li
                  className="pt-2"
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <Button href="/ppdb" className="w-full" icon={false} onClick={() => setMenuOpen(false)}>
                    PPDB 2026
                  </Button>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
