import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/app/components/ui";
import { NewsCard } from "@/app/components/news-card";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Berita & Informasi",
  description:
    "Kabar terbaru, pengumuman, prestasi, dan informasi kegiatan MAN Kota Batu (MAKOBA).",
};

export default async function BeritaPage() {
  const { news } = await getSite();
  return (
    <main className="scroll-mt-24 pb-24 pt-32 sm:pt-40">
      <Container>
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-blue">Beranda</Link>
          <span className="px-2">/</span>
          <span className="text-ink">Berita</span>
        </nav>

        <SectionHeading
          align="left"
          eyebrow="Kabar Terbaru"
          title="Berita & Informasi"
          desc="Ikuti perkembangan kegiatan, prestasi, dan pengumuman terbaru dari Madrasah Aliyah Negeri Kota Batu melalui portal berita resmi kami."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>

        {/* Figma: Tombol ← Lihat Selengkapnya */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/berita"
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface px-6 py-3 text-sm font-semibold text-ink shadow-card transition-all hover:-translate-y-0.5 hover:text-blue"
          >
            ← Lihat Selengkapnya
          </Link>
        </div>
      </Container>
    </main>
  );
}
