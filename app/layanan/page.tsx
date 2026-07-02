import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/app/components/page-hero";
import { Container } from "@/app/components/ui";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { SpotlightCard } from "@/app/components/spotlight-card";
import { Icon } from "@/app/components/icons";
import { digitalServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Layanan Digital",
  description:
    "Satu pintu layanan digital MAN Kota Batu — PPDB Online, RDM, CBT, E-Learning, Perpustakaan Digital, Absensi Digital, E-Book Karya, serta PPID & Pengaduan.",
};

const tint: Record<string, string> = {
  teal: "bg-teal-soft text-teal",
  blue: "bg-blue-soft text-blue",
  gold: "bg-gold-soft text-gold-strong",
};

export default function LayananPage() {
  return (
    <main className="pb-24">
      <PageHero
        crumb="Layanan Digital"
        eyebrow="Satu Pintu Layanan"
        title="Layanan Digital MAKOBA"
        desc="Seluruh layanan akademik dan administrasi madrasah dalam satu tempat — pilih layanan untuk melihat fungsi dan cara mengaksesnya."
      />

      <Container className="mt-12">
        <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {digitalServices.map((s) => (
            <StaggerItem key={s.name} className="h-full">
              <SpotlightCard className="h-full">
                <Link
                  href={s.href}
                  className="card-glow group flex h-full flex-col rounded-card bg-surface p-7 shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hover"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110 ${tint[s.tone]}`}
                    >
                      <Icon name={s.icon} className="h-7 w-7" />
                    </span>
                    {s.detail && (
                      <span className="rounded-md bg-canvas px-3 py-1 text-xs font-semibold text-muted">
                        {s.detail.audience}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-5 font-display text-xl font-bold text-ink">{s.name}</h2>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{s.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                    Lihat layanan
                    <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.1}>
          <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-muted">
            <Icon name="shield" className="h-4 w-4 shrink-0 text-teal" />
            Khusus untuk siswa, guru, dan staff sekolah. Gunakan akun resmi sekolah untuk masuk.
          </p>
        </Reveal>
      </Container>
    </main>
  );
}
