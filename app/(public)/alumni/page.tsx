import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/app/components/page-hero";
import { Container } from "@/app/components/ui";
import { StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { Icon } from "@/app/components/icons";
import { getSite } from "@/lib/site";

export const metadata: Metadata = {
  title: "Alumni Berprestasi",
  description:
    "Kisah sukses alumni MAN Kota Batu (MAKOBA) di berbagai bidang — kedokteran, teknologi, riset, wirausaha, dan beasiswa.",
};

const avatarTone: Record<string, string> = {
  teal: "bg-teal-soft text-teal",
  blue: "bg-blue-soft text-blue",
  gold: "bg-gold-soft text-gold-strong",
};

export default async function AlumniPage() {
  const { alumni } = await getSite();
  return (
    <main className="pb-24">
      <PageHero
        crumb="Alumni"
        eyebrow="Jejak Lulusan"
        title="Alumni Berprestasi"
        desc="Para lulusan MAKOBA yang melanjutkan kiprah dan memberi manfaat di berbagai bidang."
      />

      {/* Pintu masuk ke Portal Alumni. Halaman ini tetap terbuka untuk umum;
          portalnya butuh akun yang dibuat humas madrasah. */}
      <Container className="mt-8">
        <div className="bg-teal-gradient relative overflow-hidden rounded-card p-7 text-on-dark sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/5" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-xl font-extrabold leading-tight sm:text-2xl">
                Portal Alumni &amp; Jejaring Karir
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-on-dark/80">
                Info beasiswa lanjutan, sebaran kelulusan tiap angkatan, dan forum jejaring karir —
                khusus alumni MAN Kota Batu.
              </p>
            </div>
            <Link
              href="/masuk?next=%2Falumni%2Fportal"
              className="btn-sheen press inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-surface px-6 py-3 text-sm font-semibold text-teal transition-transform hover:-translate-y-0.5"
            >
              <Icon name="users" className="h-4 w-4" />
              Masuk Portal Alumni
            </Link>
          </div>
        </div>
      </Container>

      <Container className="mt-12">
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {alumni.map((a) => (
            <StaggerItem key={a.name} className="h-full">
              <article className="flex h-full flex-col rounded-card bg-surface p-7 shadow-card">
                <div className="flex items-center gap-4">
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full font-display text-xl font-extrabold ${avatarTone[a.tone]}`}>
                    {a.name.charAt(0)}
                  </span>
                  <div>
                    <h3 className="font-display font-bold leading-tight text-ink">{a.name}</h3>
                    <p className="text-xs text-muted">Lulus {a.year} · {a.field}</p>
                  </div>
                </div>
                <p className="mt-5 text-sm font-semibold text-blue">{a.achievement}</p>
                <div className="mt-4 flex-1 border-t border-line pt-4">
                  <Icon name="quote" className="h-7 w-7 text-gold/40" />
                  <p className="mt-2 font-serif text-[15px] italic leading-relaxed text-ink/80">{a.quote}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </main>
  );
}
