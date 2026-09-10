import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";
import { school, socials } from "@/lib/content";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const sans  = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const serif = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mankotabatu.sch.id"),
  title: {
    default: "MAN Kota Batu — Berilmu. Berakhlak. Berprestasi.",
    template: "%s | MAN Kota Batu",
  },
  description:
    "Website resmi Madrasah Aliyah Negeri Kota Batu (MAKOBA) — madrasah penyelenggara riset dengan Kelas Riset, Olimpiade, dan Tahfidz. Maju, bermutu, dan mendunia.",
  keywords: [
    "MAN Kota Batu",
    "MAKOBA",
    "madrasah aliyah negeri",
    "sekolah Islam Batu",
    "PPDB MAN Kota Batu",
    "madrasah riset",
  ],
  authors: [{ name: "MAN Kota Batu" }],
  openGraph: {
    title: "MAN Kota Batu — Berilmu. Berakhlak. Berprestasi.",
    description:
      "Madrasah Aliyah Negeri Kota Batu — memadukan identitas Islami yang elegan dengan pendidikan modern bermutu.",
    url: "/",
    locale: "id_ID",
    type: "website",
    siteName: "MAN Kota Batu",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAN Kota Batu — Berilmu. Berakhlak. Berprestasi.",
    description:
      "Madrasah penyelenggara riset dengan Kelas Riset, Olimpiade, dan Tahfidz. Maju, bermutu, dan mendunia.",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

// Structured data so search engines understand the organization (PRD NFR-10).
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: school.longName,
  alternateName: [school.name, school.nick],
  url: "https://mankotabatu.sch.id",
  logo: "https://mankotabatu.sch.id/logo.png",
  description:
    "Madrasah Aliyah Negeri Kota Batu — madrasah penyelenggara riset dengan Kelas Riset, Olimpiade, dan Tahfidz.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Patimura No. 25, Temas",
    addressLocality: "Kota Batu",
    addressRegion: "Jawa Timur",
    postalCode: "65315",
    addressCountry: "ID",
  },
  telephone: "+62-341-591600",
  email: school.email,
  sameAs: socials.map((s) => s.href),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0b110e" },
  ],
};

// Runs before first paint to apply the saved/system theme without a flash.
const themeScript = `(function(){try{var t=localStorage.getItem("makoba-theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${serif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
