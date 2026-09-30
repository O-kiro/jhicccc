import type { Metadata } from "next";
import { PortalShell } from "@/app/components/siswa/shell";
import { ReadingWidget } from "@/app/components/siswa/reading-widget";
import { PortalFooter } from "@/app/components/siswa/portal-footer";
import { getOverview } from "@/lib/api";

export const metadata: Metadata = {
  // Judul tiap halaman memakai template root ("%s | MAN Kota Batu") supaya
  // /siswa dan sub-halamannya konsisten.
  title: { default: "Portal Siswa", template: "%s | MAN Kota Batu" },
  // Area akun; jangan sampai terindeks mesin pencari.
  robots: { index: false, follow: false },
};

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // getOverview di-cache per render, jadi halaman Overview memakai ulang
  // respons yang sama tanpa permintaan HTTP kedua.
  const { student, continue_reading } = await getOverview();

  return (
    <PortalShell
      portal="siswa"
      user={{
        name: student.name,
        subtitle: `Kelas ${student.kelas ?? "—"}`,
      }}
      // portal-siswa.md §2: widget bacaan aktif menggantikan kartu kelas.
      nextClass={null}
      widget={<ReadingWidget loan={continue_reading} />}
    >
      {children}
      <PortalFooter />
    </PortalShell>
  );
}
