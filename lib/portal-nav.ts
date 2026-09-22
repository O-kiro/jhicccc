/**
 * Menu sidebar portal siswa dan portal guru.
 *
 * Ini peta rute aplikasi, bukan data madrasah, jadi memang tinggal di kode —
 * tiap entri harus punya halaman yang benar-benar ada. Seluruh isi portal
 * diambil dari API; lihat lib/api.ts dan lib/api-guru.ts.
 */

import type { IconName } from "./content";
import type { PortalRole } from "./api";

export type PortalNavItem = { label: string; href: string; icon: IconName };

export type PortalConfig = {
  /** Beranda portal; menu Overview hanya aktif persis di sini. */
  home: string;
  /** Teks kecil di bawah nama madrasah pada sidebar. */
  label: string;
  account: string;
  nav: PortalNavItem[];
};

export const portals: Record<PortalRole, PortalConfig> = {
  siswa: {
    home: "/siswa",
    label: "Portal Siswa",
    account: "/siswa/akun",
    nav: [
      { label: "Overview", href: "/siswa", icon: "grid" },
      { label: "Rapor Digital", href: "/siswa/rapor", icon: "rdm" },
      { label: "Kursus", href: "/siswa/kursus", icon: "elearning" },
      { label: "Ujian", href: "/siswa/ujian", icon: "cbt" },
      { label: "Perpustakaan", href: "/siswa/perpustakaan", icon: "library" },
      { label: "Forum Murid", href: "/siswa/forum", icon: "users" },
    ],
  },
  guru: {
    home: "/guru",
    label: "Portal Guru",
    account: "/guru/akun",
    nav: [
      { label: "Overview", href: "/guru", icon: "grid" },
      { label: "Jadwal Mengajar", href: "/guru/jadwal", icon: "calendar" },
      { label: "Jurnal Mengajar", href: "/guru/jurnal", icon: "book" },
      { label: "Kelas & Materi", href: "/guru/kelas", icon: "elearning" },
      { label: "Penilaian", href: "/guru/nilai", icon: "rdm" },
      { label: "Perpustakaan", href: "/guru/perpustakaan", icon: "library" },
    ],
  },
};
