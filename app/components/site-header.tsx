"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";
import { ThemeToggle } from "./theme-toggle";
import { SearchModal } from "./search-modal";
import { Button, cn } from "./ui";
import { navItems, school } from "@/lib/content";

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
            {navItems.map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-ink/80 transition-colors hover:text-blue"
                >
                  {item.label}
                  {item.children && <Icon name="chevron" className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:rotate-180" />}
                </Link>
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
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Cari"
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
              <ul className="mx-auto max-w-6xl space-y-1 px-5 py-4 sm:px-8">
                {navItems.map((item) => (
                  <li key={item.label}>
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
                  </li>
                ))}
                <li className="pt-2">
                  <Button href="/ppdb" className="w-full" icon={false} onClick={() => setMenuOpen(false)}>
                    PPDB 2026
                  </Button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
