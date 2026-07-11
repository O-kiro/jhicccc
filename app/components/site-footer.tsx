"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { Container } from "./ui";
import { school, socials } from "@/lib/content";

const quickLinks = [
  { label: "Tentang Kami", href: "/#tentang" },
  { label: "Program Unggulan", href: "/#program" },
  { label: "Prestasi", href: "/#prestasi" },
  { label: "Berita", href: "/berita" },
];

// Tautan sistem menuju halaman LOGIN masing-masing (bukan isi sistem).
const serviceLinks = [
  { label: "PPDB Online", href: "https://ppdb.mankotabatu.sch.id/", external: true },
  { label: "Rapor Digital (RDM)", href: "/portal/rdm", external: false },
  { label: "E-Learning", href: "https://elearning.mankotabatu.sch.id/", external: true },
  { label: "CBT", href: "/portal/cbt", external: false },
  { label: "PPID & Pengaduan", href: "/layanan/ppid", external: false },
];

export function SiteFooter() {
  return (
    <footer id="kontak" className="scroll-mt-24 border-t border-line bg-surface-2 text-ink">
      <Container className="py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Logo MAN Kota Batu"
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10 object-contain"
              />
              <span className="leading-tight">
                <span className="block font-display text-base font-extrabold">{school.name}</span>
                <span className="block text-xs text-muted">{school.nick}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
              {school.longName} — madrasah penyelenggara riset yang {school.motto.toLowerCase()}.
            </p>
            <p className="mt-4 font-serif text-sm italic text-teal">“{school.tagline}”</p>

            <div className="mt-6 flex gap-2.5">
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

          {/* Quick links */}
          <nav aria-label="Tautan cepat">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Tautan Cepat</h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted transition-colors hover:text-blue">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Layanan">
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Layanan</h3>
            <ul className="mt-5 space-y-3">
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-blue"
                    >
                      {l.label}
                      <Icon name="external" className="h-3.5 w-3.5 opacity-60" />
                    </a>
                  ) : (
                    <Link href={l.href} className="text-sm text-muted transition-colors hover:text-blue">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-ink">Kontak</h3>
            <ul className="mt-5 space-y-3.5 text-sm text-muted">
              <li className="flex items-start gap-2.5">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                {school.address}
              </li>
              <li>
                <a href={`tel:${school.phone.replace(/\s|\(|\)/g, "")}`} className="flex items-center gap-2.5 transition-colors hover:text-blue">
                  <Icon name="phone" className="h-4 w-4 shrink-0 text-teal" />
                  {school.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${school.email}`} className="flex items-center gap-2.5 transition-colors hover:text-blue">
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-teal" />
                  {school.email}
                </a>
              </li>
              <li>
                <a href={school.mapsUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1.5 font-semibold text-teal">
                  Lihat di Peta
                  <Icon name="external" className="h-4 w-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {school.longName}. Hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="shield" className="h-4 w-4 text-gold" />
              Zona Integritas
            </span>
            <span className="rounded-md bg-surface px-2.5 py-1 font-semibold shadow-card">WBK</span>
            <span className="rounded-md bg-surface px-2.5 py-1 font-semibold shadow-card">WBBM</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
