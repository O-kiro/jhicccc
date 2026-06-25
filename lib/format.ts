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
