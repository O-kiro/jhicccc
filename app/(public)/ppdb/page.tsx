import type { Metadata } from "next";
import { PageHero } from "@/app/components/page-hero";
import { Button, Container, SectionHeading } from "@/app/components/ui";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { GeoTexture } from "@/app/components/ornaments";
import { Icon } from "@/app/components/icons";
import { ppdbInfo } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { Countdown } from "@/app/components/countdown";

export const metadata: Metadata = {
  title: "PPDB 2026/2027",
  description:
    "Penerimaan Peserta Didik Baru MAN Kota Batu tahun pelajaran 2026/2027 — jalur, jadwal, persyaratan, dan pendaftaran daring.",
};

export default function PpdbPage() {
  return (
    <main className="pb-24">
      <PageHero
        crumb="PPDB"
        eyebrow={`PPDB ${ppdbInfo.yearLabel}`}
        title="Penerimaan Peserta Didik Baru"
        desc="Bergabunglah dengan keluarga besar MAKOBA — madrasah riset yang membentuk generasi berilmu, berakhlak, dan berprestasi."
      />

      {/* Countdown panel */}
      <Container className="mt-8">
        <div className="relative isolate overflow-hidden rounded-panel bg-dark px-6 py-12 text-on-dark sm:px-12">
          <GeoTexture className="pointer-events-none absolute inset-0 text-white opacity-[0.06]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.06em]">
                <Icon name="clock" className="h-3.5 w-3.5 text-gold" />
                Penutupan Gelombang 1
              </span>
              <h2 className="display mt-4 text-balance text-[clamp(1.6rem,3.2vw,2.5rem)] text-on-dark">
                Segera daftar sebelum pendaftaran ditutup
              </h2>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href="https://ppdb.mankotabatu.sch.id/" external variant="light">
                  Daftar Sekarang
                </Button>
                <Button href="/login" variant="outlineDark" icon={false}>Masuk Penyerahan</Button>
              </div>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <Button href="/ppdb/dokumen" variant="outlineDark" icon={false}>Lihat Dokumen</Button>
                <Button href="/kontak" variant="outlineDark" icon={false}>Tanya Panitia</Button>
              </div>
              <p className="mt-4 flex items-center gap-2 text-sm text-on-dark/70">
                <Icon name="shield" className="h-4 w-4 shrink-0 text-gold" />
                Pendaftaran dilakukan melalui portal PPDB resmi madrasah.
              </p>
            </div>
            <Countdown deadlineISO={ppdbInfo.deadlineISO} />
          </div>
        </div>
      </Container>

      {/* Jalur — Figma: Dua Jalur Pendaftaran */}
      <Container className="py-24">
        <SectionHeading
          eyebrow="Pilihan Jalur"
          title="Dua Jalur Pendaftaran"
          desc="Pilih jalur yang paling sesuai dengan profil dan potensimu."
        />
        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2">
          {ppdbInfo.jalur.map((j) => (
            <StaggerItem key={j.name} className="h-full">
              <article className="flex h-full flex-col rounded-card bg-surface p-7 shadow-card">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-soft text-blue">
                  <Icon name={j.icon} className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-display text-xl font-bold text-ink">{j.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{j.desc}</p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>

      {/* Timeline + Requirements */}
      <section className="bg-surface-2 py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            {/* Timeline */}
            <div>
              <SectionHeading align="left" eyebrow="Jadwal" title="Tahapan PPDB" />
              <div className="mt-10">
                {ppdbInfo.timeline.map((step, i) => (
                  <Reveal key={step.title} delay={i * 0.05}>
                    <div className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-gradient text-sm font-bold text-white">
                          {i + 1}
                        </span>
                        {i < ppdbInfo.timeline.length - 1 && <span className="my-1 w-px flex-1 bg-line" />}
                      </div>
                      <div className="pb-8">
                        <span className="text-xs font-semibold text-blue">{formatDate(step.date)}</span>
                        <h3 className="font-display text-lg font-bold text-ink">{step.title}</h3>
                        <p className="mt-1 text-[15px] leading-relaxed text-muted">{step.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div id="daftar" className="scroll-mt-24">
              <SectionHeading align="left" eyebrow="Berkas" title="Persyaratan" />
              <Reveal delay={0.1}>
                <div className="mt-10 rounded-card bg-surface p-8 shadow-card">
                  <ul className="space-y-3.5">
                    {ppdbInfo.requirements.map((r) => (
                      <li key={r} className="flex items-start gap-3 text-[15px] text-ink">
                        <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-soft text-blue">
                          <Icon name="check" className="h-4 w-4" />
                        </span>
                        {r}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 grid gap-3">
                    <Button href="https://ppdb.mankotabatu.sch.id/" external className="w-full">
                      Daftar via PPDB Online
                    </Button>
                    <Button href="/login" variant="outline" className="w-full" icon={false}>
                      Masuk ke Penyerahan Dokumen
                    </Button>
                    <Button href="/kontak" variant="outline" className="w-full" icon={false}>
                      Hubungi Panitia
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
