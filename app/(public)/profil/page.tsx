import type { Metadata } from "next";
import { PageHero } from "@/app/components/page-hero";
import { Container, PhotoTile, SectionHeading } from "@/app/components/ui";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { Icon } from "@/app/components/icons";
import { profile, school } from "@/lib/content";

export const metadata: Metadata = {
  title: "Profil Madrasah",
  description:
    "Profil MAN Kota Batu (MAKOBA) — visi & misi, sejarah, dan struktur organisasi madrasah penyelenggara riset di Kota Batu.",
};

export default function ProfilPage() {
  return (
    <main className="pb-24">
      <PageHero
        crumb="Profil"
        eyebrow="Tentang Kami"
        title="Profil MAN Kota Batu"
        desc="Mengenal lebih dekat madrasah yang memadukan identitas Islami dengan pendidikan modern berbasis riset."
      />

      {/* Tentang */}
      <Container className="mt-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <PhotoTile tone="teal" icon="globe" className="aspect-[4/3] rounded-panel" glyphClassName="h-24 w-24" />
          </Reveal>
          <div>
            <div className="space-y-4">
              {profile.intro.map((p, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-muted">{p}</p>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-card">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-soft text-gold-strong">
                <Icon name="shield" className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">Madrasah Penyelenggara Riset</p>
                <p className="text-xs text-muted">{school.researchDecree}</p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Visi & Misi */}
      <section id="visi" className="mt-24 scroll-mt-24 bg-surface-2 py-24">
        <Container>
          <SectionHeading eyebrow="Arah & Tujuan" title="Visi & Misi" />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col justify-center rounded-card bg-blue-soft p-8">
                <span className="eyebrow">Visi</span>
                <p className="mt-3 font-serif text-xl italic leading-relaxed text-ink sm:text-2xl">
                  “{profile.vision}”
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-card bg-surface p-8 shadow-card">
                <span className="eyebrow">Misi</span>
                <ol className="mt-4 space-y-3">
                  {profile.missions.map((m, i) => (
                    <li key={i} className="flex gap-3 text-[15px] text-ink">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-gradient text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      {m}
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Sejarah */}
      <Container id="sejarah" className="scroll-mt-24 py-24">
        <SectionHeading align="left" eyebrow="Perjalanan Kami" title="Sejarah Singkat" />
        <div className="mt-12 max-w-2xl">
          {profile.history.map((h, i) => (
            <Reveal key={h.year} delay={i * 0.05}>
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-gradient text-xs font-bold text-white">
                    {h.year}
                  </span>
                  {i < profile.history.length - 1 && <span className="my-1 w-px flex-1 bg-line" />}
                </div>
                <div className="pb-8">
                  <h3 className="font-display text-lg font-bold text-ink">{h.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{h.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* Struktur */}
      <section id="struktur" className="scroll-mt-24 bg-surface-2 py-24">
        <Container>
          <SectionHeading
            eyebrow="Tim Kami"
            title="Struktur Organisasi"
            desc="Jajaran pimpinan yang memimpin penyelenggaraan pendidikan di MAN Kota Batu."
          />
          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {profile.org.map((o) => (
              <StaggerItem key={o.role} className="h-full">
                <article className="flex h-full items-center gap-4 rounded-card bg-surface p-6 shadow-card">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-soft text-blue">
                    <Icon name={o.icon} className="h-7 w-7" />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-ink">{o.name}</h3>
                    <p className="text-sm text-muted">{o.role}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </section>
    </main>
  );
}
