import type { Metadata } from "next";
import { PageHero } from "@/app/components/page-hero";
import { Container } from "@/app/components/ui";
import { StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { Icon } from "@/app/components/icons";
import { alumni } from "@/lib/content";

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

export default function AlumniPage() {
  return (
    <main className="pb-24">
      <PageHero
        crumb="Alumni"
        eyebrow="Jejak Lulusan"
        title="Alumni Berprestasi"
        desc="Para lulusan MAKOBA yang melanjutkan kiprah dan memberi manfaat di berbagai bidang."
      />

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
