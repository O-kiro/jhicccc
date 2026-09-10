import type { Metadata } from "next";
import { PageHero } from "@/app/components/page-hero";
import { Container } from "@/app/components/ui";
import { Icon } from "@/app/components/icons";
import { ContactForm } from "@/app/components/contact-form";
import { school, socials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi MAN Kota Batu (MAKOBA) — alamat, telepon, email, media sosial, dan peta lokasi madrasah.",
};

const details = [
  { icon: "pin" as const, label: "Alamat", value: school.address },
  { icon: "phone" as const, label: "Telepon", value: school.phone, href: `tel:${school.phone.replace(/\s|\(|\)/g, "")}` },
  { icon: "mail" as const, label: "Email", value: school.email, href: `mailto:${school.email}` },
];

export default function KontakPage() {
  return (
    <main className="pb-24">
      <PageHero
        crumb="Kontak"
        eyebrow="Hubungi Kami"
        title="Kontak MAKOBA"
        desc="Punya pertanyaan seputar pendaftaran, akademik, atau kerja sama? Kami siap membantu."
      />

      <Container className="mt-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Info */}
          <div>
            <ul className="space-y-4">
              {details.map((d) => (
                <li key={d.label} className="flex items-start gap-4 rounded-card bg-surface p-5 shadow-card">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-soft text-blue">
                    <Icon name={d.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">{d.label}</p>
                    {d.href ? (
                      <a href={d.href} className="text-[15px] text-ink transition-colors hover:text-blue">{d.value}</a>
                    ) : (
                      <p className="text-[15px] text-ink">{d.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <p className="text-sm font-semibold text-ink">Ikuti Kami</p>
              <div className="mt-3 flex gap-2.5">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="grid h-11 w-11 place-items-center rounded-full bg-surface text-muted shadow-card transition-all hover:-translate-y-0.5 hover:text-blue"
                  >
                    <Icon name={s.icon} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>

        {/* Map */}
        <div className="mt-10 overflow-hidden rounded-card shadow-card">
          <iframe
            src={school.mapsEmbed}
            title="Peta lokasi MAN Kota Batu"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[420px] w-full border-0"
            allowFullScreen
          />
        </div>
      </Container>
    </main>
  );
}
