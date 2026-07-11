import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/app/components/ui";
import { Reveal } from "@/app/components/reveal";
import { CbtLogin } from "@/app/components/cbt-login";

export const metadata: Metadata = {
  title: "Login CBT",
  description:
    "Login panel CBT (Computer Based Test) MAN Kota Batu — platform ujian daring madrasah.",
};

export default function CbtPortalPage() {
  return (
    <main className="pb-24">
      <Container className="pt-32 sm:pt-40">
        <nav aria-label="Breadcrumb" className="mb-10 text-sm text-muted">
          <Link href="/" className="hover:text-blue">Beranda</Link>
          <span className="px-2">/</span>
          <Link href="/layanan/cbt" className="hover:text-blue">CBT</Link>
          <span className="px-2">/</span>
          <span className="text-ink">Login</span>
        </nav>
        <Reveal>
          <CbtLogin />
        </Reveal>
      </Container>
    </main>
  );
}
