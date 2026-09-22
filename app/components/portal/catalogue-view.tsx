import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { cn, toneSoft } from "@/lib/styles";
import { PageHead, Panel, Pill } from "@/app/components/siswa/ui";
import { BorrowButton } from "@/app/components/siswa/loan-buttons";
import type { ApiCatalogue } from "@/lib/api";

/** Katalog lengkap — sama untuk portal siswa dan portal guru; lihat LibraryView. */
export function CatalogueView({
  base,
  q,
  kategori,
  katalog,
}: {
  base: string;
  q: string;
  kategori: string;
  katalog: ApiCatalogue;
}) {
  const penuh = katalog.active_loans >= katalog.loan_quota;

  const tautanKategori = (k: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (k) p.set("kategori", k);
    const s = p.toString();
    return `${base}/perpustakaan/katalog${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href={`${base}/perpustakaan`}
        className="press inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
      >
        <Icon name="chevron" className="h-4 w-4 rotate-90" />
        Kembali ke Perpustakaan
      </Link>

      <PageHead
        eyebrow="Perpustakaan Digital"
        title="Katalog Buku"
        desc={`Sedang dipinjam: ${katalog.active_loans} dari ${katalog.loan_quota} buku yang diizinkan.`}
      />

      {/* GET biasa: tetap jalan tanpa JavaScript, dan hasilnya bisa dibagikan. */}
      <form action={`${base}/perpustakaan/katalog`} className="flex flex-wrap gap-3">
        {kategori && <input type="hidden" name="kategori" value={kategori} />}
        <label htmlFor="cari-buku" className="sr-only">
          Cari judul atau penulis
        </label>
        <input
          id="cari-buku"
          name="q"
          defaultValue={q}
          placeholder="Cari judul atau penulis…"
          className="min-w-0 flex-1 rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-ink outline-none focus:border-blue"
        />
        <button
          type="submit"
          className="press inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
        >
          <Icon name="search" className="h-4 w-4" />
          Cari
        </button>
      </form>

      <nav aria-label="Kategori" className="mt-4 flex flex-wrap gap-2">
        {["", ...katalog.categories].map((k) => {
          const aktif = k === kategori;
          return (
            <Link
              key={k || "semua"}
              href={tautanKategori(k)}
              aria-current={aktif ? "page" : undefined}
              className={cn(
                "press rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                aktif ? "bg-ink text-canvas" : "border border-line text-muted hover:border-ink/25 hover:text-ink",
              )}
            >
              {k || "Semua"}
            </Link>
          );
        })}
      </nav>

      {katalog.books.length === 0 ? (
        <p className="mt-6 rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
          Tidak ada buku yang cocok{q ? ` dengan "${q}"` : ""}.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {katalog.books.map((b) => (
            <li key={b.id}>
              <Panel className="flex h-full flex-col">
                <div className="flex items-start gap-3">
                  <span className={cn("grid h-14 w-11 shrink-0 place-items-center rounded-md", toneSoft[b.tone])}>
                    <Icon name="ebook" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-extrabold leading-tight text-ink">{b.title}</span>
                    {b.author && <span className="mt-1 block text-xs text-muted">{b.author}</span>}
                    <span className="mt-2 inline-flex">
                      <Pill tone={b.tone}>{b.category}</Pill>
                    </span>
                  </span>
                </div>
                {b.description && (
                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-muted">{b.description}</p>
                )}
                <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                  <span className="text-[11px] text-muted">{b.total_pages} halaman</span>
                  <BorrowButton
                    bookId={b.id}
                    borrowed={b.borrowed_by_me}
                    durations={katalog.durations}
                    full={penuh}
                  />
                </div>
              </Panel>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
