import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/app/components/ui";
import { Reveal } from "@/app/components/reveal";
import { RdmLogin } from "@/app/components/rdm-login";

export const metadata: Metadata = {
  title: "Login RDM",
  description:
    "Halaman masuk Rapor Digital Madrasah (RDM) MAN Kota Batu untuk siswa, wali murid, guru, dan admin.",
};

export default function RdmPortalPage() {
  return (
    <main className="pb-24">
      <Container className="pt-32 sm:pt-40">
        <nav aria-label="Breadcrumb" className="mb-10 text-sm text-muted">
          <Link href="/" className="hover:text-blue">Beranda</Link>
          <span className="px-2">/</span>
          <Link href="/layanan/rdm" className="hover:text-blue">RDM</Link>
          <span className="px-2">/</span>
          <span className="text-ink">Login</span>
        </nav>
        <Reveal>
          <RdmLogin />
        </Reveal>
      </Container>
    </main>
  );
}
