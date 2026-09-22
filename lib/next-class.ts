import type { NextClass } from "@/app/components/siswa/shell";
import { jamWib } from "@/lib/format";

type Slot = {
  subject: string;
  start: string;
  end: string;
  live: boolean;
  meeting_url: string | null;
};

/**
 * Sesi yang sedang berlangsung bila ada; kalau tidak, sesi berikutnya
 * berdasarkan jam sekarang. Null bila jadwal hari ini sudah habis.
 *
 * Dipakai layout portal siswa dan portal guru — kartu "Kelas Selanjutnya" di
 * sidebar keduanya sama.
 */
export function pickNextClass<T extends Slot>(
  schedule: T[],
  { joinLabel, suffix }: { joinLabel: string; suffix?: (slot: T) => string },
): NextClass | null {
  const clock = jamWib();

  const slot = schedule.find((s) => s.live) ?? schedule.find((s) => s.start >= clock);

  if (!slot) {
    return null;
  }

  return {
    subject: suffix ? `${slot.subject} · ${suffix(slot)}` : slot.subject,
    time: `${slot.start}–${slot.end} WIB`,
    live: slot.live,
    meetingUrl: slot.meeting_url,
    joinLabel,
  };
}
