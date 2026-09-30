import type { ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import type { IconName } from "@/lib/content";
import { cn } from "@/lib/styles";

/**
 * Kartu judul halaman portal guru (redesain Figma): kartu putih, ikon dalam
 * lingkaran pekat, judul, subjudul, dan tombol aksi di kanan atas.
 */
export function HeaderCard({
  icon,
  tone = "primary",
  eyebrow,
  title,
  desc,
  action,
  children,
}: {
  icon: IconName;
  tone?: "primary" | "gold";
  eyebrow?: string;
  title: string;
  desc?: string;
  action?: ReactNode;
  /** Isi tambahan di dalam kartu yang sama — tab, penyaring, atau tabel. */
  children?: ReactNode;
}) {
  return (
    <section className="rounded-card border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "grid h-12 w-12 shrink-0 place-items-center rounded-full text-white",
              tone === "gold" ? "bg-gold" : "bg-primary",
            )}
          >
            <Icon name={icon} className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">{eyebrow}</p>
            )}
            <h1 className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold leading-tight tracking-[-0.02em] text-ink">
              {title}
            </h1>
            {desc && <p className="mt-1 text-sm leading-relaxed text-muted">{desc}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}

/** Tombol "+ …" di kanan atas kartu judul: biru (bawaan) atau oranye. */
export const tombolTambah = (tone: "primary" | "gold" = "primary") =>
  cn(
    "press inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60",
    tone === "gold" ? "bg-[#f59e0b] hover:bg-[#d98a06]" : "bg-primary hover:bg-primary-strong",
  );

/** Tab pil berbasis tautan (URL), dipakai Modul, Jurnal Harian, dan Jurnal Mengajar. */
export function TabTautan({
  items,
  label,
}: {
  items: { href: string; label: string; active: boolean }[];
  label: string;
}) {
  return (
    <nav aria-label={label} className="flex flex-wrap gap-2">
      {items.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          scroll={false}
          aria-current={t.active ? "page" : undefined}
          className={cn(
            "press rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            t.active
              ? "bg-primary text-white"
              : "border border-line text-muted hover:border-primary/40 hover:text-primary",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

/** Ikon ✏️ / 🗑️ di kolom Aksi tabel. */
export function TombolAksi({
  jenis,
  label,
  onClick,
  disabled,
}: {
  jenis: "edit" | "trash";
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "press grid h-8 w-8 place-items-center rounded-full border border-line transition-colors disabled:opacity-50",
        jenis === "trash" ? "text-muted hover:border-danger/40 hover:text-danger" : "text-muted hover:border-primary/40 hover:text-primary",
      )}
    >
      <Icon name={jenis} className="h-4 w-4" />
    </button>
  );
}

/** Pembungkus tabel data portal guru: kepala berwarna lembut, garis antarbaris. */
export const tabel = {
  wrap: "mt-5 overflow-x-auto rounded-xl border border-line",
  table: "w-full min-w-[640px] text-sm",
  thead: "bg-primary-soft/60 text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-ink",
  th: "px-4 py-3",
  tbody: "divide-y divide-line bg-surface",
  td: "px-4 py-3 align-top",
};

/** "2026-09-20" → "20-09-2026" (format tanggal tabel Figma). */
export function tanggalTabel(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}
