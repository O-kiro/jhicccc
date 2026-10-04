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
  /**
   * Menu kecil di dasar sidebar, tepat di atas tombol Keluar (merah).
   * Tanpa ini sidebar memakai tampilan lama: tombol Bantuan (/kontak) dan
   * Keluar berdampingan.
   */
  bottomNav?: PortalNavItem[];
  /** Warna menu aktif; bawaannya teal. Portal siswa memakai biru utama. */
  accent?: "teal" | "primary";
  /** Kelas pembungkus portal, mis. token warna khusus di globals.css. */
  className?: string;
  /** Label kecil di atas daftar menu, mis. "MAIN MENU". */
  navLabel?: string;
  /** Judul di kiri topbar; bila diisi, topbar berlatar putih bergaris bawah. */
  topbarTitle?: string;
};

export const portals: Record<PortalRole, PortalConfig> = {
  siswa: {
    home: "/siswa",
    label: "Portal Siswa",
    account: "/siswa/akun",
    // portal-siswa.md §2. Halaman Ujian dihapus permanen; rute lama
    // (/siswa/rapor, /siswa/kursus, /siswa/ujian) dialihkan di next.config.ts.
    nav: [
      { label: "Overview", href: "/siswa", icon: "grid" },
      { label: "Ranking", href: "/siswa/ranking", icon: "trophy" },
      { label: "Modul Pembelajaran", href: "/siswa/modul", icon: "elearning" },
      { label: "Tugas", href: "/siswa/tugas", icon: "check" },
      { label: "Perpustakaan", href: "/siswa/perpustakaan", icon: "library" },
      { label: "Forum Siswa", href: "/siswa/forum", icon: "users" },
      { label: "Portal Beasiswa", href: "/siswa/beasiswa", icon: "graduation" },
    ],
    bottomNav: [{ label: "Bantuan", href: "/siswa/bantuan", icon: "help" }],
    accent: "primary",
    className: "portal-siswa",
  },
  alumni: {
    home: "/alumni/portal",
    label: "Portal Alumni",
    account: "/alumni/portal/akun",
    navLabel: "MAIN MENU",
    nav: [
      { label: "Overview", href: "/alumni/portal", icon: "grid" },
      { label: "Portal Beasiswa", href: "/alumni/portal/beasiswa", icon: "trophy" },
      { label: "Statistik & Sebaran", href: "/alumni/portal/statistik", icon: "chart" },
      { label: "Forum Alumni", href: "/alumni/portal/forum", icon: "chat" },
    ],
    bottomNav: [{ label: "Bantuan", href: "/alumni/portal/bantuan", icon: "help" }],
    accent: "primary",
    className: "portal-alumni",
    topbarTitle: "Selamat Datang Para Alumni MAN KOTA BATU",
  },
  guru: {
    home: "/guru",
    label: "Portal Guru",
    account: "/guru/akun",
    navLabel: "MAIN MENU",
    // Redesain Figma: Overview di atas, sisanya alfabetis. Penilaian dibuka
    // lewat kartu Akses Cepat di Overview; Kelas & Materi lewat halaman
    // Bahan Ajar — keduanya tidak lagi punya menu sendiri.
    nav: [
      { label: "Overview", href: "/guru", icon: "grid" },
      { label: "Bahan Ajar", href: "/guru/bahan-ajar", icon: "ebook" },
      { label: "Jadwal Mengajar", href: "/guru/jadwal", icon: "calendar" },
      { label: "Jurnal Harian", href: "/guru/jurnal-harian", icon: "attendance" },
      { label: "Jurnal Mengajar", href: "/guru/jurnal", icon: "book" },
      { label: "Lapor Tatib", href: "/guru/tatib", icon: "flag" },
      { label: "Modul Pembelajaran", href: "/guru/modul-ajar", icon: "research" },
      { label: "Perpustakaan", href: "/guru/perpustakaan", icon: "library" },
      { label: "RDM", href: "/guru/rdm", icon: "rdm" },
      { label: "Tugas Siswa", href: "/guru/tugas", icon: "check" },
    ],
    bottomNav: [{ label: "Bantuan", href: "/guru/bantuan", icon: "help" }],
    accent: "primary",
    className: "portal-guru",
  },
};
