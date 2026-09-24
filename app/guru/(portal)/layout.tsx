import type { Metadata } from "next";
import { PortalShell } from "@/app/components/siswa/shell";
import { getGuruOverview } from "@/lib/api-guru";
import { pickNextClass } from "@/lib/next-class";

export const metadata: Metadata = {
  title: { default: "Portal Guru", template: "%s | MAN Kota Batu" },
  // Area akun; jangan sampai terindeks mesin pencari.
  robots: { index: false, follow: false },
};

/** Kerangkanya sama dengan portal siswa; hanya menu dan chip profilnya berbeda. */
export default async function GuruPortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Di-cache per render: beranda memakai ulang respons yang sama.
  const { teacher, today_schedule, announcements } = await getGuruOverview();

  return (
    <PortalShell
      portal="guru"
      user={{
        name: teacher.name,
        subtitle: teacher.homeroom
          ? `Wali Kelas ${teacher.homeroom}`
          : teacher.nip
            ? `NIP ${teacher.nip}`
            : "Guru",
      }}
      nextClass={pickNextClass(today_schedule, {
        joinLabel: "Buka Kelas Live",
        suffix: (s) => s.classroom,
      })}
      announcements={announcements}
    >
      {children}
    </PortalShell>
  );
}
