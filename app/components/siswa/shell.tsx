"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/app/components/icons";
import { ThemeToggle } from "@/app/components/theme-toggle";
import { cn } from "@/lib/styles";
import { school } from "@/lib/content";
import { portalNav } from "@/lib/portal-nav";
import type { ApiStudent } from "@/lib/api";

/** Sepadan dengan --ease-snap dan --ease-drawer di globals.css. */
const EASE_SNAP = [0.23, 1, 0.32, 1] as const;
const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

/** Overview cocok persis; menu lain aktif untuk seluruh sub-route-nya. */
function isActive(pathname: string, href: string) {
  return href === "/siswa" ? pathname === "/siswa" : pathname.startsWith(href);
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Menu portal" className="space-y-1">
      {portalNav.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "press group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold",
              "transition-[background-color,color,transform] duration-200 ease-snap",
              active
                ? "bg-teal-soft text-teal"
                : "text-muted hover:bg-surface-2 hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId="siswa-nav-active"
                className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-teal"
              />
            )}
            <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export type NextClass = {
  subject: string;
  time: string;
  live: boolean;
  meetingUrl: string | null;
};

/** Kartu "Kelas Selanjutnya" — muncul di bawah menu pada tiap halaman portal. */
function NextClassCard({ nextClass }: { nextClass: NextClass }) {
  return (
    <div className="bg-teal-gradient relative overflow-hidden rounded-card p-4 text-on-dark">
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gold">
        {nextClass.live ? "Sedang Berlangsung" : "Kelas Selanjutnya"}
      </p>
      <p className="mt-2 font-display text-lg font-extrabold leading-tight">{nextClass.subject}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-on-dark/70">
        <Icon name="clock" className="h-3.5 w-3.5" />
        {nextClass.time}
      </p>
      {nextClass.meetingUrl ? (
        <a
          href={nextClass.meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-sheen press mt-3.5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold text-on-dark transition-[background-color,transform] duration-200 ease-snap hover:bg-white/25"
        >
          <Icon name="play" className="h-3.5 w-3.5" />
          Ikuti Kelas Live
        </a>
      ) : (
        <p className="mt-3.5 text-center text-xs font-semibold text-on-dark/60">
          Tautan kelas belum tersedia
        </p>
      )}
    </div>
  );
}

function SidebarBody({
  nextClass,
  onLogout,
  onNavigate,
}: {
  nextClass: NextClass | null;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6">
      <Link href="/siswa" onClick={onNavigate} className="flex items-center gap-2.5 px-1.5">
        <Image
          src="/logo.png"
          alt={`Logo ${school.name}`}
          width={36}
          height={36}
          unoptimized
          className="h-9 w-9 object-contain"
        />
        <span className="leading-tight">
          <span className="block font-display text-sm font-extrabold text-ink">{school.name}</span>
          <span className="block text-[11px] text-muted">Portal Siswa</span>
        </span>
      </Link>

      <NavList onNavigate={onNavigate} />

      <div className="mt-auto space-y-3">
        {nextClass && <NextClassCard nextClass={nextClass} />}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href="/kontak"
            onClick={onNavigate}
            className="press inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-semibold text-muted transition-[border-color,color,transform] duration-200 ease-snap hover:border-ink/25 hover:text-ink"
          >
            <Icon name="help" className="h-3.5 w-3.5" />
            Bantuan
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="press inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-semibold text-muted transition-[border-color,color,transform] duration-200 ease-snap hover:border-gold/40 hover:text-gold-strong"
          >
            <Icon name="logout" className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

export function PortalShell({
  student,
  nextClass,
  children,
}: {
  student: ApiStudent;
  nextClass: NextClass | null;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    router.replace("/masuk");
    router.refresh();
  }

  // Drawer tidak boleh bertahan setelah pindah halaman — termasuk saat
  // navigasi back/forward. Disetel saat render (pola resmi React) agar tidak
  // memicu render bertingkat seperti setState di dalam effect.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Sidebar tetap (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-line bg-surface lg:block">
        <SidebarBody nextClass={nextClass} onLogout={handleLogout} />
      </aside>

      {/* Drawer (mobile) */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.2, ease: EASE_SNAP } }}
              exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE_SNAP } }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              // `transform` ditulis penuh, bukan shorthand `x`: shorthand Motion
              // berjalan di main thread lewat requestAnimationFrame, sehingga
              // mudah patah-patah saat halaman sedang sibuk memuat data.
              initial={{ transform: "translateX(-100%)" }}
              animate={{
                transform: "translateX(0%)",
                transition: { duration: 0.32, ease: EASE_DRAWER },
              }}
              // Keluar lebih cepat daripada masuk: saat menutup, pengguna sudah
              // memutuskan dan hanya menunggu sistem merespons.
              exit={{
                transform: "translateX(-100%)",
                transition: { duration: 0.2, ease: EASE_DRAWER },
              }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-surface shadow-overlay lg:hidden"
            >
              <SidebarBody nextClass={nextClass} onLogout={handleLogout} onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={cn("lg:pl-72", loggingOut && "pointer-events-none opacity-60")}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-5 sm:px-8">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Buka menu portal"
              className="press grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-[background-color,transform] duration-200 ease-snap hover:bg-surface-2 lg:hidden"
            >
              <Icon name="menu" className="h-5 w-5" />
            </button>

            <div className="ml-auto flex items-center gap-2">
              <span className="mr-1 hidden items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1.5 text-xs font-semibold text-gold-strong sm:inline-flex">
                <Icon name="flame" className="h-3.5 w-3.5" />
                {student.streak_days} Hari
              </span>
              <ThemeToggle />
              <button
                type="button"
                aria-label="Pengumuman"
                className="press relative grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition-[background-color,transform] duration-200 ease-snap hover:bg-surface-2"
              >
                <Icon name="bell" className="h-[18px] w-[18px]" />
                <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold ring-2 ring-canvas" />
              </button>
              {/* Chip profil menuju halaman Akun (ganti kata sandi). */}
              <Link
                href="/siswa/akun"
                aria-label={`Akun ${student.name}`}
                aria-current={pathname === "/siswa/akun" ? "page" : undefined}
                className="press flex items-center gap-2.5 rounded-full border border-line py-1 pl-1 pr-3.5 transition-[background-color,border-color,transform] duration-200 ease-snap hover:border-ink/25 hover:bg-surface-2"
              >
                <span className="bg-blue-gradient grid h-8 w-8 place-items-center rounded-full font-display text-xs font-extrabold text-white">
                  {student.name.charAt(0)}
                </span>
                <span className="hidden leading-tight sm:block">
                  <span className="block text-xs font-semibold text-ink">{student.name}</span>
                  <span className="block text-[11px] text-muted">Kelas {student.kelas ?? "—"}</span>
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="px-5 pb-16 pt-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
