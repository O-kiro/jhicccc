import type { Metadata } from "next";
import Link from "next/link";
import { Container, SectionHeading } from "@/app/components/ui";
import DokumenForm from "./dokumen-form";
import { getPpdbBerkas } from "@/lib/api-ppdb";

export const metadata: Metadata = {
  title: "Pengumpulan Dokumen PPDB",
  description: "Penyerahan dokumen pendaftaran PPDB MAN Kota Batu — unggah berkas sesuai jalur Prestasi, Reguler 1, atau Reguler 2.",
  // Halaman pribadi calon siswa; jangan diindeks.
  robots: { index: false, follow: false },
};

export default async function DokumenPage() {
  // proxy.ts sudah memastikan ada sesi PPDB; kalau tokennya dicabut,
  // authedGet mengembalikan pengunjung ke halaman masuk.
  const data = await getPpdbBerkas();

  return (
    <main className="pb-24">
      <Container className="pt-32 sm:pt-40">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-blue">Beranda</Link>
          <span className="px-2">/</span>
          <Link href="/ppdb" className="hover:text-blue">PPDB</Link>
          <span className="px-2">/</span>
          <span className="text-ink">Dokumen</span>
        </nav>
        <SectionHeading
          align="left"
          eyebrow="PPDB 2026/2027"
          title="Pengumpulan Dokumen Pendaftaran"
          desc={`Unggah berkas sesuai jalur ${data.registrant.jalur}. Semua berkas wajib format .PDF.`}
        />
      </Container>
      <Container className="mt-12">
        <DokumenForm data={data} />
      </Container>
    </main>
  );
}
