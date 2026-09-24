import { describe, expect, it } from "vitest";
import { formatDate, dateParts, geserTanggal, hariDari, jamWib, tanggalTerakhirHari } from "@/lib/format";

describe("format tanggal", () => {
  it("menulis tanggal dalam bahasa Indonesia", () => {
    expect(formatDate("2026-06-18")).toBe("18 Juni 2026");
    expect(dateParts("2026-01-05")).toEqual({ day: 5, month: "Jan", year: 2026 });
  });

  it("menentukan nama hari tanpa bergantung zona waktu", () => {
    expect(hariDari("2026-09-23")).toBe("Rabu");
    expect(hariDari("2026-09-27")).toBe("Minggu");
  });

  it("menggeser tanggal melewati batas bulan", () => {
    expect(geserTanggal("2026-09-01", -1)).toBe("2026-08-31");
    expect(geserTanggal("2026-12-31", 1)).toBe("2027-01-01");
    expect(geserTanggal("2026-09-23", -30)).toBe("2026-08-24");
  });

  it("mencari hari tertentu yang paling dekat ke belakang", () => {
    // 22 September 2026 hari Selasa.
    expect(tanggalTerakhirHari("2026-09-22", 1)).toBe("2026-09-21"); // Senin
    expect(tanggalTerakhirHari("2026-09-22", 2)).toBe("2026-09-22"); // Selasa, hari itu juga
    expect(tanggalTerakhirHari("2026-09-22", 3)).toBe("2026-09-16"); // Rabu pekan lalu
  });

  it("membaca jam WIB, bukan jam server", () => {
    // 17.30 UTC = 00.30 WIB keesokan harinya.
    expect(jamWib(new Date("2026-09-22T17:30:00Z"))).toBe("00:30");
    expect(jamWib(new Date("2026-09-22T01:05:00Z"))).toBe("08:05");
  });
});
