/**
 * Menu sidebar portal siswa.
 *
 * Ini peta rute aplikasi, bukan data madrasah, jadi memang tinggal di kode —
 * tiap entri harus punya halaman yang benar-benar ada. Seluruh isi portal
 * lainnya (kursus, ujian, buku, forum) diambil dari API; lihat lib/api.ts.
 */

import type { IconName } from "./content";

export const portalNav: { label: string; href: string; icon: IconName }[] = [
  { label: "Overview", href: "/siswa", icon: "grid" },
  { label: "Rapor Digital", href: "/siswa/rapor", icon: "rdm" },
  { label: "Kursus", href: "/siswa/kursus", icon: "elearning" },
  { label: "Ujian", href: "/siswa/ujian", icon: "cbt" },
  { label: "Perpustakaan", href: "/siswa/perpustakaan", icon: "library" },
  { label: "Forum Murid", href: "/siswa/forum", icon: "users" },
];
