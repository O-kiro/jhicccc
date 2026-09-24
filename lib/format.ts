const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/** "2026-06-18" -> "18 Juni 2026". Deterministic (no Date/locale mismatch). */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** "2026-06-18" -> { day: 18, month: "Jun", year: 2026 } for calendar chips. */
export function dateParts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { day: d, month: MONTHS[m - 1].slice(0, 3), year: y };
}

/**
 * Jam dinding WIB "HH:MM", apa pun zona waktu servernya — Node di Docker
 * berjalan dalam UTC, sedangkan jadwal madrasah ditulis dalam WIB.
 */
export function jamWib(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

/** "2026-09-23" -> "Rabu". Dibangun dari angka, jadi tidak bergantung zona waktu. */
export function hariDari(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return HARI[new Date(y, m - 1, d).getDay()];
}

/** "2026-09-23", -30 -> "2026-08-24". Dihitung dalam UTC supaya tidak tergeser zona waktu. */
export function geserTanggal(iso: string, hari: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + hari)).toISOString().slice(0, 10);
}

/**
 * Tanggal terakhir (hari ini atau sebelumnya) yang jatuh pada hari ISO
 * tertentu. ("2026-09-22" Selasa, 1 Senin) -> "2026-09-21".
 */
export function tanggalTerakhirHari(hariIni: string, iso: number): string {
  const [y, m, d] = hariIni.split("-").map(Number);
  const sekarang = ((new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7) + 1;
  return geserTanggal(hariIni, -((sekarang - iso + 7) % 7));
}
