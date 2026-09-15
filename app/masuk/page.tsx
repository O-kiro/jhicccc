import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { PortalLoginForm } from "@/app/components/siswa/portal-login-form";
import { school } from "@/lib/content";

export const metadata: Metadata = {
  title: "Masuk",
  description:
    "Gerbang masuk MAN Kota Batu — portal siswa dan panel administrasi madrasah.",
  robots: { index: false, follow: false },
};

const SERVICES = ["CBT", "E-Learning", "RDM", "Perpustakaan Digital"];
const COPYRIGHT =
  "© 2024 MAN Kota Batu Integrated Digital Service. Dilindungi oleh enkripsi keamanan tingkat tinggi.";

/**
 * Panel kiri selalu memakai gradasi biru di light maupun dark mode, jadi warna
 * teks di atasnya dipatok tetap (bukan token tema yang ikut berbalik).
 */
const ACCENT = "text-[#f2d9a6]";

export default function MasukPage() {
  return (
    <main className="bg-canvas">
      {/* Full-bleed: tiap sisi tepat setengah layar, tanpa kontainer max-w
          yang menyisakan margin kosong di kanan-kiri. */}
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Sisi kiri — Branding */}
        <div className="bg-blue-gradient relative hidden overflow-hidden p-12 text-white xl:p-16 lg:block">
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -top-16 right-16 h-40 w-40 rounded-full bg-white/10" />

          {/* Kolom dalam dibatasi lebarnya lalu ditengahkan, supaya teks tetap
              nyaman dibaca meski panelnya melebar di layar besar. */}
          <div className="relative mx-auto flex h-full max-w-xl flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt={`Logo ${school.name}`}
                  className="h-10 w-10 object-contain"
                />
                <span className="font-display text-lg font-extrabold">{school.name}</span>
              </div>

              <p className={`mt-6 font-serif text-2xl italic ${ACCENT}`}>
                &ldquo;{school.tagline}&rdquo;
              </p>
              <h1 className="display mt-8 text-[clamp(2.25rem,3.4vw,3.25rem)] leading-none text-white">
                Gerbang digital menuju ekosistem pendidikan
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75">
                Satu pintu masuk untuk siswa, guru, dan staf madrasah — sistem akan mengantar kamu ke
                ruang yang sesuai secara otomatis.
              </p>

              <ul className="mt-8 flex flex-wrap gap-2">
                {SERVICES.map((s) => (
                  <li
                    key={s}
                    className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold text-white/90"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs leading-relaxed text-white/65">{COPYRIGHT}</p>
          </div>
        </div>

        {/* Sisi kanan — Form masuk */}
        <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:px-12">
          <div className="mx-auto flex w-full max-w-md flex-col">
            <div className="mb-8 flex items-center gap-2.5 lg:hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt={`Logo ${school.name}`} className="h-9 w-9 object-contain" />
              <span className="font-display font-extrabold text-ink">{school.name}</span>
              <span className="text-xs text-muted">{school.tagline}</span>
            </div>

            <Suspense fallback={<div className="mx-auto h-96 w-full max-w-md" />}>
              <PortalLoginForm />
            </Suspense>

            <Link
              href="/"
              className="press mx-auto mt-8 inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors duration-200 ease-snap hover:text-ink"
            >
              <Icon name="chevron" className="h-3.5 w-3.5 rotate-90" />
              Kembali ke situs madrasah
            </Link>
            <p className="mt-6 text-center text-xs text-muted lg:hidden">{COPYRIGHT}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
