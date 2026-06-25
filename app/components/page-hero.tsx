import Link from "next/link";
import { Container, SectionHeading } from "./ui";

export function PageHero({
  crumb,
  eyebrow,
  title,
  desc,
}: {
  crumb: string;
  eyebrow: string;
  title: string;
  desc?: string;
}) {
  return (
    <Container className="pb-4 pt-32 sm:pt-40">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-blue">
          Beranda
        </Link>
        <span className="px-2">/</span>
        <span className="text-ink">{crumb}</span>
      </nav>
      <SectionHeading align="left" eyebrow={eyebrow} title={title} desc={desc} />
    </Container>
  );
}
