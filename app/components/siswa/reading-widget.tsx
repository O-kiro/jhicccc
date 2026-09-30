import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { BookCover } from "@/app/components/portal/book-cover";
import type { ApiLoan, ApiTone } from "@/lib/api";

/**
 * Widget "sedang dibaca" di sidebar portal siswa (portal-siswa.md §2):
 * buku pinjaman aktif lengkap dengan progres dan tombol lanjut membaca.
 * Datanya ikut respons /overview, jadi tidak menambah permintaan per halaman.
 */
export function ReadingWidget({ loan }: { loan: ApiLoan | null }) {
  if (!loan) {
    return (
      <div className="rounded-card border border-dashed border-line p-4 text-center">
        <Icon name="ebook" className="mx-auto h-6 w-6 text-muted" strokeWidth={1.3} />
        <p className="mt-2 text-xs font-semibold text-ink">Belum ada bacaan aktif</p>
        <Link
          href="/siswa/perpustakaan"
          className="press mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Jelajahi Perpustakaan
          <Icon name="arrow" className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  // Warna sampul pengganti; pinjaman tidak membawa kategori, jadi netral.
  const tone: ApiTone = "blue";

  return (
    <div className="rounded-card border border-line bg-surface-2 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">{loan.badge}</p>
      <div className="mt-3 flex gap-3">
        <BookCover title={loan.title} cover={loan.cover} tone={tone} className="w-12 shrink-0" sizes="48px" />
        <div className="min-w-0">
          <p className="line-clamp-2 font-display text-sm font-extrabold leading-tight text-ink">{loan.title}</p>
          {loan.author && <p className="mt-0.5 truncate text-[11px] text-muted">{loan.author}</p>}
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-muted">
          <span>
            Hal. {loan.current_page}/{loan.total_pages}
          </span>
          <span className="tabular-nums text-ink">{loan.progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={loan.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progres membaca ${loan.title}`}
          className="h-1.5 overflow-hidden rounded-full bg-line"
        >
          <div className="h-full rounded-full bg-primary" style={{ width: `${loan.progress}%` }} />
        </div>
      </div>

      <div className="mt-3.5 grid gap-2">
        {loan.url ? (
          <a
            href={loan.url}
            target="_blank"
            rel="noopener noreferrer"
            className="press inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-strong"
          >
            Lanjutkan Membaca
            <Icon name="external" className="h-3.5 w-3.5" />
          </a>
        ) : (
          <p className="rounded-full bg-surface px-3 py-2 text-center text-[11px] font-semibold text-muted">
            Berkas buku belum ditautkan
          </p>
        )}
        <Link
          href="/siswa/perpustakaan"
          className="press inline-flex items-center justify-center gap-1.5 rounded-full border border-line px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-surface"
        >
          Lihat Inovasi
        </Link>
      </div>
    </div>
  );
}
