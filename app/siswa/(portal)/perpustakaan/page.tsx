import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn, toneSoft } from "@/lib/styles";
import { PageHead, Panel, PanelTitle, Pill, Progress } from "@/app/components/siswa/ui";
import { BorrowButton, ReturnButton } from "@/app/components/siswa/loan-buttons";
import { getLibrary } from "@/lib/api";

export const metadata: Metadata = {
  title: "Perpustakaan",
  description: "Perpustakaan digital madrasah — koleksi, pinjaman berjalan, dan bacaan terakhir.",
};

export default async function PerpustakaanPage() {
  const {
    categories,
    new_arrivals: newArrivals,
    loans,
    loan_quota: loanQuota,
    loan_durations: loanDurations,
    continue_reading: continueReading,
  } = await getLibrary();

  const dipinjam = new Set(loans.map((l) => l.book_id));
  const kuotaPenuh = loans.length >= loanQuota;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Perpustakaan Digital"
        title="Jelajahi Koleksi"
        desc="Jelajahi sumber daya akademis dan spiritual pilihan kami."
        action={
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/siswa/perpustakaan/katalog"
              className="btn-sheen bg-blue-gradient press inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
            >
              <Icon name="search" className="h-4 w-4" />
              Katalog Buku
            </Link>
            <Link
              href="/siswa"
              className="press group inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/25 hover:bg-surface-2"
            >
              <Icon name="grid" className="h-4 w-4" />
              Dashboard Saya
            </Link>
          </div>
        }
      />

      {/* Kategori */}
      <StaggerGroup className="grid gap-4 sm:grid-cols-3">
        {categories.map((c) => (
          <StaggerItem key={c.name}>
            <Link
              href={`/siswa/perpustakaan/katalog?kategori=${encodeURIComponent(c.name)}`}
              className="block h-full"
            >
              <Panel className="card-glow h-full transition-shadow hover:shadow-card">
                <span className={cn("grid h-11 w-11 place-items-center rounded-xl", toneSoft[c.tone])}>
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-lg font-extrabold text-ink">{c.name}</h2>
                <p className="mt-1 text-xs font-semibold text-muted">{c.count}</p>
              </Panel>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Lanjutkan membaca — hanya muncul bila ada pinjaman yang sudah dibuka */}
      {continueReading && (
      <Reveal>
        <Panel as="section" className="bg-teal-gradient mt-6 border-transparent p-0 text-on-dark">
          <div className="relative overflow-hidden rounded-card">
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/5" />
            <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="min-w-0">
                <Pill tone="gold">
                  <Icon name="bookmark" className="h-3 w-3" />
                  {continueReading.badge}
                </Pill>
                <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight">
                  {continueReading.title}
                </h2>
                {continueReading.description && (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-on-dark/75">
                    {continueReading.description}
                  </p>
                )}
                <p className="mt-4 text-xs font-semibold text-on-dark/70">
                  Halaman {continueReading.current_page} dari {continueReading.total_pages}
                </p>

                <div className="mt-4 max-w-md">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-on-dark/70">
                    <span>Progres Bacaan</span>
                    <span className="tabular-nums">{continueReading.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${continueReading.progress}%` }}
                    />
                  </div>
                </div>

                {/* Tombol anotasi dihapus: menyorot teks menuntut isi buku
                    yang bisa dibaca di dalam portal, sedangkan buku di sini
                    ditautkan ke berkas luar. */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {continueReading.url ? (
                    <a
                      href={continueReading.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-sheen press group inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-sm font-semibold text-teal transition-transform hover:-translate-y-0.5"
                    >
                      Lanjutkan Membaca
                      <Icon name="external" className="h-4 w-4" />
                    </a>
                  ) : (
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-5 py-2.5 text-sm font-semibold text-on-dark/70">
                      <Icon name="ebook" className="h-4 w-4" />
                      Berkas buku belum ditautkan
                    </p>
                  )}
                </div>
              </div>

              <div
                aria-hidden
                className="hidden h-56 w-40 shrink-0 rotate-3 rounded-xl bg-white/10 p-4 ring-1 ring-white/20 lg:block"
              >
                <Icon name="ebook" className="h-10 w-10 text-gold" strokeWidth={1.2} />
                <p className="mt-4 font-display text-sm font-extrabold leading-tight text-on-dark/90">
                  {continueReading.title}
                </p>
              </div>
            </div>
          </div>
        </Panel>
      </Reveal>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Produk baru */}
        <Reveal>
          <Panel as="section" className="h-full">
            <PanelTitle icon="sparkle">Produk Baru</PanelTitle>
            <StaggerGroup className="grid gap-4 sm:grid-cols-2">
              {newArrivals.map((b) => (
                <StaggerItem key={b.id}>
                  <article className="flex h-full flex-wrap items-center gap-4 rounded-xl border border-line bg-surface-2 p-4">
                    <span
                      className={cn(
                        "grid h-16 w-12 shrink-0 place-items-center rounded-md",
                        toneSoft[b.tone],
                      )}
                    >
                      <Icon name="ebook" className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-sm font-extrabold leading-tight text-ink">
                        {b.title}
                      </span>
                      {b.author && <span className="mt-1 block text-xs text-muted">{b.author}</span>}
                    </span>
                    <div className="w-full">
                      <BorrowButton
                        bookId={b.id}
                        borrowed={dipinjam.has(b.id)}
                        durations={loanDurations}
                        full={kuotaPenuh}
                      />
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Panel>
        </Reveal>

        {/* Dipinjam */}
        <Reveal delay={0.05}>
          <Panel as="section" className="h-full">
            <PanelTitle icon="library" action={<Pill tone="muted">{loans.length} judul</Pill>}>
              Dipinjam
            </PanelTitle>
            {loans.length === 0 && (
              <p className="rounded-xl border border-line bg-surface-2 p-4 text-sm text-muted">
                Belum ada buku yang sedang dipinjam.
              </p>
            )}
            <ul className="space-y-3">
              {loans.map((b) => {
                const urgent = b.due_in_days <= 2;
                return (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2 p-3.5"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{b.title}</span>
                      <span className="mt-0.5 block text-xs text-muted">
                        {b.due_in_days < 0
                          ? `Terlambat ${Math.abs(b.due_in_days)} hari`
                          : `Jatuh tempo dalam ${b.due_in_days} hari`}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1.5">
                      <Pill tone={urgent ? "gold" : "teal"}>
                        <Icon name="clock" className="h-3 w-3" />
                        {b.due_in_days}h
                      </Pill>
                      <ReturnButton loanId={b.id} title={b.title} />
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-muted">
                <span>Kuota pinjaman</span>
                <span className="tabular-nums text-ink">
                  {loans.length} / {loanQuota}
                </span>
              </div>
              <Progress
                value={(loans.length / loanQuota) * 100}
                tone="gold"
                label="Kuota pinjaman"
              />
            </div>
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}
