import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/app/components/ui";
import { NewsCard } from "@/app/components/news-card";
import { news } from "@/lib/content";

export const metadata: Metadata = {
  title: "Berita & Informasi",
  description:
    "Kabar terbaru, pengumuman, prestasi, dan informasi kegiatan MAN Kota Batu (MAKOBA).",
};

export default function BeritaPage() {
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
          desc="Ikuti perkembangan kegiatan, prestasi, dan pengumuman terbaru dari MAN Kota Batu."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      </Container>
    </main>
  );
}
