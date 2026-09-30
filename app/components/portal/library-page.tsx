import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal } from "@/app/components/reveal";
import { BookCover } from "@/app/components/portal/book-cover";
import { PageHead, Panel, PanelTitle, Pill } from "@/app/components/siswa/ui";
import { cn, toneSoft } from "@/lib/styles";
import type { ApiCatalogue, ApiLibrary } from "@/lib/api";

/** Nomor halaman yang ditampilkan: 1 … (sekitar halaman aktif) … terakhir. */
function nomorHalaman(aktif: number, akhir: number): (number | "…")[] {
  const set = new Set([1, akhir, aktif - 1, aktif, aktif + 1].filter((n) => n >= 1 && n <= akhir));
  const urut = [...set].sort((a, b) => a - b);
  const hasil: (number | "…")[] = [];
  urut.forEach((n, i) => {
    if (i > 0 && n - urut[i - 1] > 1) hasil.push("…");
    hasil.push(n);
  });
  return hasil;
}

/**
 * Perpustakaan Digital dalam satu halaman (portal-siswa.md §3D): slider
 * kategori, buku yang dipinjam, buku baru, dan katalog bersampul dengan
 * pencarian serta paginasi. Dipakai portal siswa dan — disalin 100% sesuai
 * redesain — portal guru; bedanya hanya `base`, alamat halamannya.
 *
 * Sengaja ringkas: pinjaman hanya judul, buku baru dan koleksi hanya sampul
 * dan judul — tanpa tombol pinjam/kembalikan maupun tenggat. Sirkulasi
 * dilayani di meja perpustakaan.
 *
 * Kategori, kata kunci, dan halaman disimpan di URL (form GET dan tautan
 * biasa), jadi tetap bekerja tanpa JavaScript dan hasilnya bisa dibagikan.
 */
export function PortalLibraryPage({
  base,
  library,
  katalog,
  q,
  kategori,
}: {
  /** Alamat halaman perpustakaan portal, mis. "/siswa/perpustakaan". */
  base: string;
  library: ApiLibrary;
  katalog: ApiCatalogue;
  q: string;
  kategori: string;
}) {
  const { categories, new_arrivals: newArrivals, loans } = library;
  const toneOf = (k: string) => categories.find((c) => c.name === k)?.tone ?? "teal";

  const tautan = (ubah: { q?: string; kategori?: string; page?: number }) => {
    const p = new URLSearchParams();
    const nq = ubah.q ?? q;
    const nk = ubah.kategori ?? kategori;
    if (nq) p.set("q", nq);
    if (nk) p.set("kategori", nk);
    if (ubah.page && ubah.page > 1) p.set("page", String(ubah.page));
    const s = p.toString();
    return `${base}${s ? `?${s}` : ""}#koleksi`;
  };

  const halaman = katalog.pagination;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Perpustakaan Digital"
        title="Jelajahi Koleksi"
        desc="Jelajahi sumber daya akademis dan spiritual pilihan kami. Peminjaman dilayani di meja perpustakaan."
        action={
          <Pill tone="muted">
            Dipinjam {katalog.active_loans} / {katalog.loan_quota}
          </Pill>
        }
      />

      {/* Slider kategori */}
      <nav aria-label="Kategori buku" className="-mx-1 overflow-x-auto pb-2 [scrollbar-width:thin]">
        <ul className="flex snap-x gap-3 px-1">
          {[{ name: "", count: "Semua koleksi", icon: "grid" as const, tone: "blue" as const }, ...categories].map((c) => {
            const aktif = c.name === kategori;
            return (
              <li key={c.name || "semua"} className="snap-start">
                <Link
                  href={tautan({ kategori: c.name, page: 1 })}
                  aria-current={aktif ? "page" : undefined}
                  className={cn(
                    "flex min-w-[200px] items-center gap-3 rounded-card border p-4 transition-colors",
                    aktif ? "border-primary bg-primary text-white" : "border-line bg-surface hover:border-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                      aktif ? "bg-white/15" : toneSoft[c.tone],
                    )}
                  >
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-extrabold">{c.name || "Semua"}</span>
                    <span className={cn("block text-[11px]", aktif ? "text-white/75" : "text-muted")}>{c.count}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* Buku yang dipinjam */}
        <Reveal>
          <Panel as="section" className="h-full">
            <PanelTitle icon="library" action={<Pill tone="muted">{loans.length} judul</Pill>}>
              Buku yang Dipinjam
            </PanelTitle>
            {loans.length === 0 ? (
              <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
                Belum ada buku yang sedang dipinjam.
              </p>
            ) : (
              <ul className="space-y-2">
                {loans.map((b) => (
                  <li
                    key={b.id}
                    className="rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm font-semibold leading-snug text-ink"
                  >
                    {b.title}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </Reveal>

        {/* Buku baru — carousel sampul */}
        <Reveal delay={0.05}>
          <Panel as="section" className="h-full">
            <PanelTitle icon="sparkle">Buku Baru</PanelTitle>
            <ul className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
              {newArrivals.map((b) => (
                <li key={b.id} className="w-36 shrink-0 snap-start">
                  <BookCover title={b.title} author={b.author} cover={b.cover} tone={b.tone} sizes="144px" />
                  <p className="mt-2 line-clamp-2 text-xs font-semibold leading-snug text-ink">{b.title}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
      </div>

      {/* Koleksi buku — grid sampul dengan pencarian dan paginasi */}
      <section id="koleksi" className="mt-8 scroll-mt-24">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-xl font-extrabold text-ink">
            Koleksi Buku{kategori && <span className="text-muted"> · {kategori}</span>}
          </h2>
          <form action={base} className="flex w-full gap-2 sm:w-auto">
            {kategori && <input type="hidden" name="kategori" value={kategori} />}
            <label htmlFor="cari-buku" className="sr-only">
              Cari judul atau penulis
            </label>
            <div className="relative min-w-0 flex-1 sm:w-72">
              <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="cari-buku"
                name="q"
                defaultValue={q}
                placeholder="Cari judul atau penulis…"
                className="w-full rounded-full border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="press rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-strong"
            >
              Cari
            </button>
          </form>
        </div>

        {katalog.books.length === 0 ? (
          <p className="rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
            Tidak ada buku yang cocok{q ? ` dengan "${q}"` : ""}.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {katalog.books.map((b) => (
              <li key={b.id} className="flex flex-col">
                <BookCover
                  title={b.title}
                  author={b.author}
                  cover={b.cover}
                  tone={toneOf(b.category)}
                  sizes="(max-width: 640px) 45vw, 180px"
                />
                <p className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-ink">{b.title}</p>
              </li>
            ))}
          </ul>
        )}

        {halaman && halaman.last_page > 1 && (
          <nav aria-label="Halaman katalog" className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
            {halaman.page > 1 && (
              <Link
                href={tautan({ page: halaman.page - 1 })}
                aria-label="Halaman sebelumnya"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted hover:text-primary"
              >
                <Icon name="chevron" className="h-4 w-4 rotate-90" />
              </Link>
            )}
            {nomorHalaman(halaman.page, halaman.last_page).map((n, i) =>
              n === "…" ? (
                <span key={`jeda-${i}`} className="px-1 text-sm text-muted">
                  …
                </span>
              ) : (
                <Link
                  key={n}
                  href={tautan({ page: n })}
                  aria-current={n === halaman.page ? "page" : undefined}
                  className={cn(
                    "grid h-9 min-w-9 place-items-center rounded-full px-2 text-sm font-semibold tabular-nums",
                    n === halaman.page ? "bg-primary text-white" : "border border-line text-ink hover:border-primary/40",
                  )}
                >
                  {n}
                </Link>
              ),
            )}
            {halaman.page < halaman.last_page && (
              <Link
                href={tautan({ page: halaman.page + 1 })}
                aria-label="Halaman berikutnya"
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-muted hover:text-primary"
              >
                <Icon name="chevron" className="h-4 w-4 -rotate-90" />
              </Link>
            )}
          </nav>
        )}
      </section>
    </div>
  );
}
