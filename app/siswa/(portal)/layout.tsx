import type { Metadata } from "next";
import { PortalShell, type NextClass } from "@/app/components/siswa/shell";
import { getOverview, type ApiScheduleItem } from "@/lib/api";

export const metadata: Metadata = {
  // Judul tiap halaman memakai template root ("%s | MAN Kota Batu") supaya
  // /siswa dan sub-halamannya konsisten.
  title: { default: "Portal Siswa", template: "%s | MAN Kota Batu" },
  // Area akun; jangan sampai terindeks mesin pencari.
  robots: { index: false, follow: false },
};

/**
 * Sesi yang sedang berlangsung bila ada; kalau tidak, sesi berikutnya
 * berdasarkan jam sekarang. Mengembalikan null bila jadwal hari ini sudah habis.
 */
function pickNextClass(schedule: ApiScheduleItem[]): NextClass | null {
  const now = new Date();
  const clock = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const slot = schedule.find((s) => s.live) ?? schedule.find((s) => s.start >= clock);

  if (!slot) {
    return null;
  }

  return {
    subject: slot.subject,
    time: `${slot.start}–${slot.end} WIB`,
    live: slot.live,
    meetingUrl: slot.meeting_url,
  };
}

export default async function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // getOverview di-cache per render, jadi halaman Overview memakai ulang
  // respons yang sama tanpa permintaan HTTP kedua.
  const { student, today_schedule } = await getOverview();

  return (
    <PortalShell student={student} nextClass={pickNextClass(today_schedule)}>
      {children}
    </PortalShell>
  );
}
