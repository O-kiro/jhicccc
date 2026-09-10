import type { Metadata } from "next";
import { PortalShell } from "@/app/components/siswa/shell";

export const metadata: Metadata = {
  // Judul tiap halaman memakai template root ("%s | MAN Kota Batu") supaya
  // /siswa dan sub-halamannya konsisten.
  title: { default: "Portal Siswa", template: "%s | MAN Kota Batu" },
  // Area akun; jangan sampai terindeks mesin pencari.
  robots: { index: false, follow: false },
};

export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <PortalShell>{children}</PortalShell>;
}
