import type { Metadata } from "next";
import { PortalShell } from "@/app/components/siswa/shell";
import { getAlumniOverview } from "@/lib/api-alumni";

export const metadata: Metadata = {
  title: { default: "Portal Alumni", template: "%s | MAN Kota Batu" },
  // Area akun; jangan sampai terindeks mesin pencari.
  robots: { index: false, follow: false },
};

/**
 * Kerangkanya sama dengan portal siswa dan guru. Alumni tidak punya jadwal
 * pelajaran, jadi kartu "Kelas Selanjutnya" di sidebar tidak dipakai.
 */
export default async function AlumniPortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { alumni, announcements } = await getAlumniOverview();

  return (
    <PortalShell
      portal="alumni"
      user={{ name: alumni.name, subtitle: alumni.angkatan }}
      nextClass={null}
      announcements={announcements}
    >
      {children}
    </PortalShell>
  );
}
