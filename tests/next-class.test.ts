import { afterEach, describe, expect, it, vi } from "vitest";
import { pickNextClass } from "@/lib/next-class";

const sesi = (start: string, end: string, live = false) => ({
  subject: `Mapel ${start}`,
  start,
  end,
  live,
  meeting_url: null,
});

afterEach(() => vi.useRealTimers());

/** Membekukan jam dinding ke waktu WIB tertentu. */
function jamWibDi(jam: string) {
  vi.useFakeTimers();
  // 07.00 WIB = 00.00 UTC.
  vi.setSystemTime(new Date(`2026-09-22T${jam}:00Z`));
}

describe("pickNextClass", () => {
  it("mendahulukan sesi yang sedang berlangsung", () => {
    jamWibDi("03:00"); // 10.00 WIB
    const hasil = pickNextClass([sesi("07:00", "08:30"), sesi("13:00", "14:00", true)], {
      joinLabel: "Ikuti Kelas Live",
    });

    expect(hasil?.subject).toBe("Mapel 13:00");
    expect(hasil?.live).toBe(true);
  });

  it("memilih sesi berikutnya berdasarkan jam WIB", () => {
    jamWibDi("02:00"); // 09.00 WIB
    const hasil = pickNextClass([sesi("07:00", "08:30"), sesi("10:00", "11:30")], {
      joinLabel: "Ikuti Kelas Live",
    });

    expect(hasil?.subject).toBe("Mapel 10:00");
    expect(hasil?.time).toBe("10:00–11:30 WIB");
  });

  it("mengembalikan null saat jadwal hari itu sudah habis", () => {
    jamWibDi("10:00"); // 17.00 WIB
    expect(pickNextClass([sesi("07:00", "08:30")], { joinLabel: "x" })).toBeNull();
  });

  it("menambahkan keterangan kelas bila diminta", () => {
    jamWibDi("00:30"); // 07.30 WIB
    const hasil = pickNextClass([{ ...sesi("08:00", "09:00"), classroom: "X-B" }], {
      joinLabel: "Buka Kelas Live",
      suffix: (s) => s.classroom,
    });

    expect(hasil?.subject).toBe("Mapel 08:00 · X-B");
    expect(hasil?.joinLabel).toBe("Buka Kelas Live");
  });
});
