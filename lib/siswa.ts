/**
 * Data portal siswa MAN Kota Batu.
 * Diselaraskan 1:1 dengan design-siswa.md. Semua angka/nama di sini adalah
 * data contoh untuk prototipe — belum terhubung ke backend akademik.
 * All copy in Bahasa Indonesia.
 */

import type { IconName } from "./content";

export const student = {
  name: "Akhnaf Meyfan",
  nisn: "009283741",
  kelas: "X-B",
  semester: "Semester Ganjil 2025/2026",
  streak: 14,
};

/* ---------------------------------------------------------------- */
/*  Navigasi sidebar — dipakai di semua halaman portal              */
/* ---------------------------------------------------------------- */
export const portalNav: { label: string; href: string; icon: IconName }[] = [
  { label: "Overview", href: "/siswa", icon: "grid" },
  { label: "Rapor Digital", href: "/siswa/rapor", icon: "rdm" },
  { label: "Kursus", href: "/siswa/kursus", icon: "elearning" },
  { label: "Ujian", href: "/siswa/ujian", icon: "cbt" },
  { label: "Perpustakaan", href: "/siswa/perpustakaan", icon: "library" },
  { label: "Forum Murid", href: "/siswa/forum", icon: "users" },
];

/** Kartu "Kelas Selanjutnya" yang menempel di bawah sidebar. */
export const nextClass = {
  subject: "Matematika",
  time: "08:30–09:45 WIB",
  cta: "Ikuti Kelas Live",
};

/* ---------------------------------------------------------------- */
/*  §2 Overview — Portal Akademik                                    */
/* ---------------------------------------------------------------- */
export const overviewQuote =
  "Ilmu itu seperti air, seraplah dengan pikiran yang terbuka, lalu hiasi dengan akhlak yang mulia agar bermanfaat bagi dunia dan agama.";

export const overviewStats: {
  label: string;
  value: string;
  note: string;
  icon: IconName;
  tone: "teal" | "blue" | "gold";
}[] = [
  { label: "Rata-Rata Rapor", value: "88.3", note: "Semester berjalan", icon: "chart", tone: "blue" },
  { label: "Kehadiran", value: "98.5", note: "Good", icon: "attendance", tone: "teal" },
  { label: "Tugas", value: "5", note: "3 Segera Dikumpulkan!!", icon: "flag", tone: "gold" },
];

export type ScheduleItem = {
  start: string;
  end: string;
  subject: string;
  teacher: string;
  live?: boolean;
};

export const todaySchedule: ScheduleItem[] = [
  { start: "07:00", end: "08:30", subject: "Fiqih", teacher: "Ust. H. Abdurrahman" },
  { start: "08:30", end: "09:45", subject: "Matematika", teacher: "Rini Waraswati, S.Pd, M.Si", live: true },
  { start: "09:45", end: "11:45", subject: "Kimia", teacher: "Dra. Sukrawati Arni" },
  { start: "12:30", end: "13:50", subject: "Bahasa Arab", teacher: "Indah Rahmayanti, S.Pd" },
  { start: "13:50", end: "14:45", subject: "Sejarah Kebudayaan Islam", teacher: "Aslanik, S.Pd.I" },
];

export const announcements: { date: string; title: string; desc: string }[] = [
  {
    date: "2026-03-15",
    title: "Kebijakan Seragam Sekolah",
    desc: "Kebijakan baru tentang seragam",
  },
  {
    date: "2026-03-12",
    title: "Kompetisi Robotik",
    desc: "Pendaftaran untuk turnamen robotika tahunan tingkat sekolah",
  },
  {
    date: "2026-03-10",
    title: "Pertemuan Orang Tua dan Guru",
    desc: "Rapat evaluasi bulanan untuk orang tua akan diadakan pada hari Sabtu ini.",
  },
];

/* ---------------------------------------------------------------- */
/*  §3 Pusat Ujian & Evaluasi (CBT)                                  */
/* ---------------------------------------------------------------- */
export type UpcomingExam = {
  subject: string;
  title: string;
  when: string;
  priority?: "Tinggi";
  /** Detik menuju mulai — dirender jadi countdown "MULAI DALAM hh:mm:ss". */
  startsInSeconds?: number;
};

export const upcomingExams: UpcomingExam[] = [
  {
    subject: "Matematika",
    title: "Calculus & Integration",
    when: "24 Oktober 2026, 08:30–10:30",
    priority: "Tinggi",
    startsInSeconds: 2 * 3600 + 14 * 60 + 30,
  },
  { subject: "SKI", title: "Masa Kejayaan An-Dalusia", when: "Hari Ini, 13:00" },
  { subject: "Bahasa Inggris", title: "Reading & Vocab", when: "Besok, 09:00" },
];

export const examResults: { subject: string; score: number; finishedOn: string }[] = [
  { subject: "Fisika", score: 92, finishedOn: "2026-05-12" },
  { subject: "Biologi", score: 85, finishedOn: "2026-05-08" },
];

export const examRules = [
  "Harus menggunakan Wifi MAKOBA dan tidak diperbolehkan menggunakan sim card.",
  "Tidak boleh menggunakan tab atau aplikasi lain saat sesi CBT aktif.",
  "Dilarang berganti atau beralih tab.",
];

/* ---------------------------------------------------------------- */
/*  §4 Halaman soal CBT                                              */
/* ---------------------------------------------------------------- */
export const examSession = {
  subject: "Akidah Akhlak",
  title: "Penilaian Akhir Semester (PAS) Ganjil",
  totalQuestions: 40,
  currentNumber: 14,
  /** Sisa waktu pengerjaan dalam detik (01:42:03). */
  remainingSeconds: 1 * 3600 + 42 * 60 + 3,
  type: "Pilihan Ganda",
  question:
    "Sifat terpuji yang dimiliki oleh Nabi Ibrahim AS ketika menghadapi cobaan dari Allah SWT berupa perintah untuk menyembelih putra tercintanya, Ismail AS, menunjukkan tingkatan iman yang sangat tinggi. Perilaku ini dalam terminologi Akidah Akhlak disebut sebagai...",
  options: [
    { key: "A", text: "Sabar dan Tawakal yang Mutlak" },
    { key: "B", text: "Ukhuwah Islamiyah" },
    { key: "C", text: "Syaja'ah dalam berdakwah" },
    { key: "D", text: "Istiqomah dalam Ibadah" },
    { key: "E", text: "Tasamuh antar sesama" },
  ],
  /** Jawaban yang sedang dipilih pada contoh desain. */
  selected: "B",
};

/**
 * Status tiap nomor pada navigator soal. Nomor 14 aktif; sisanya dibuat
 * deterministik supaya render server & klien tidak berbeda.
 */
export type QuestionState = "sudah" | "belum" | "ragu";

export const questionStates: QuestionState[] = Array.from(
  { length: examSession.totalQuestions },
  (_, i): QuestionState => {
    const n = i + 1;
    if (n > examSession.currentNumber) return "belum";
    if (n % 6 === 0) return "ragu";
    return "sudah";
  },
);

/* ---------------------------------------------------------------- */
/*  §5 Daftar mata pelajaran (Kursus)                                */
/* ---------------------------------------------------------------- */
export type Course = {
  name: string;
  teacher: string;
  category: "Agama" | "Sains";
  icon: IconName;
  tone: "teal" | "blue" | "gold";
  /** Progres modul yang sudah diselesaikan (%). */
  progress: number;
  modules: number;
};

export const courses: Course[] = [
  { name: "Quran Hadist", teacher: "Ustadz Ahmad Fauzi, M.Ag", category: "Agama", icon: "tahfidz", tone: "teal", progress: 72, modules: 12 },
  { name: "Fiqih", teacher: "Ani Nur Aisyah, S.Ag", category: "Agama", icon: "book", tone: "teal", progress: 64, modules: 10 },
  { name: "Matematika", teacher: "Rini Waraswati, S.Pd, M.Si", category: "Sains", icon: "sigma", tone: "blue", progress: 58, modules: 14 },
  { name: "Kimia", teacher: "Dra. Sukrawati Arni", category: "Sains", icon: "flask", tone: "blue", progress: 45, modules: 11 },
  { name: "Bahasa Inggris", teacher: "Indah Rahmayanti, S.Pd", category: "Sains", icon: "globe", tone: "gold", progress: 81, modules: 9 },
  { name: "Fisika", teacher: "Anisak Intan Eka Prani, M.Si", category: "Sains", icon: "research", tone: "blue", progress: 53, modules: 13 },
];

export const courseFilters = ["All", "Agama", "Sains"] as const;

/* ---------------------------------------------------------------- */
/*  §6 Rapor Digital Madrasah (RDM)                                  */
/* ---------------------------------------------------------------- */
export const raporSummary: { label: string; value: string; icon: IconName; tone: "teal" | "blue" | "gold" }[] = [
  { label: "Rata-Rata Rapor", value: "88.3", icon: "chart", tone: "blue" },
  { label: "Peringkat Kelas", value: "2 of 32", icon: "trophy", tone: "gold" },
  { label: "Kehadiran", value: "98.5%", icon: "attendance", tone: "teal" },
];

/** Sejarah nilai bulanan (Aug–Jan) untuk grafik garis. */
export const gradeHistory: { month: string; score: number }[] = [
  { month: "Agu", score: 82 },
  { month: "Sep", score: 85 },
  { month: "Okt", score: 84 },
  { month: "Nov", score: 89 },
  { month: "Des", score: 91 },
  { month: "Jan", score: 88 },
];

export const recentAssessments: { subject: string; score: number }[] = [
  { subject: "Quran Hadist", score: 94 },
  { subject: "Matematika", score: 88 },
  { subject: "Fisika", score: 91 },
];

export const teacherFeedback: { name: string; role: string; when: string; text: string }[] = [
  {
    name: "Siti Muthomimah, S.Pd",
    role: "Wali Kelas",
    when: "2 hari lalu",
    text: "Akhnaf telah menunjukkan perkembangan luar biasa dalam kemampuan kepemimpinannya semester ini. Kontribusinya di forum kelas sangat keren.",
  },
  {
    name: "Ahmad Fauzan, M.Pd",
    role: "Guru Quran Hadist",
    when: "1 minggu lalu",
    text: "Performa menghafal yang luar biasa. Terus pertahankan konsistensimu dalam belajar Al-Quran dan Hadist",
  },
  {
    name: "Anisak Intan Eka Prani, M.Si",
    role: "Guru Fisika",
    when: "2 hari lalu",
    text: "Dalam pelajaran Fisika, Akhnaf menunjukkan pemahaman konsep yang cukup baik, terutama saat praktikum. Ia aktif mengamati dan mengaitkan teori dengan fenomena yang terjadi di sekitarnya.",
  },
  {
    name: "Rini Waraswati, S.Pd, M.Si",
    role: "Guru Matematika",
    when: "2 hari lalu",
    text: "Akhnaf menunjukkan perkembangan yang baik dalam pembelajaran Matematika semester ini. Ia semakin percaya diri menyelesaikan soal-soal hitungan dan tidak ragu bertanya saat menemui kesulitan.",
  },
];

/* ---------------------------------------------------------------- */
/*  §7 Perpustakaan Digital                                          */
/* ---------------------------------------------------------------- */
export const libraryCategories: { name: string; count: string; icon: IconName; tone: "teal" | "blue" | "gold" }[] = [
  { name: "Studi Islam", count: "2.400+ judul", icon: "tahfidz", tone: "teal" },
  { name: "Sains & Teknologi", count: "1.850+ judul", icon: "flask", tone: "blue" },
  { name: "Humaniora", count: "1.200+ judul", icon: "globe", tone: "gold" },
];

export const newArrivals: { title: string; author?: string; tone: "teal" | "blue" | "gold" }[] = [
  { title: "Fisika Kelas XI", tone: "blue" },
  { title: "Kimia Kelas XI", tone: "teal" },
  { title: "Bahasa Arab Kelas XI", tone: "gold" },
  { title: "Digital Creativity", author: "Creative Hub Team", tone: "blue" },
];

export const borrowedBooks: { title: string; dueInDays: number }[] = [
  { title: "Informatika Kelas XI", dueInDays: 2 },
  { title: "Matematika TL Kelas XI", dueInDays: 5 },
  { title: "Akidah Akhlak Kelas XI", dueInDays: 2 },
];

export const continueReading = {
  title: "Zaman Keemasan Islam: Rumah Kebijaksanaan",
  badge: "Baru dibuka",
  desc: "Telusuri kisah Baitul Hikmah di Baghdad, pusat penerjemahan dan ilmu pengetahuan yang mempertemukan tradisi Yunani, Persia, dan India dalam satu peradaban intelektual.",
  chapter: "Chapter 4: The Golden Age",
  page: 142,
  totalPages: 350,
  progress: 42,
};

/* ---------------------------------------------------------------- */
/*  §8 Forum Murid                                                   */
/* ---------------------------------------------------------------- */
export const forumCategories: {
  name: string;
  desc: string;
  threads: number;
  icon: IconName;
  tone: "teal" | "blue" | "gold";
}[] = [
  {
    name: "Diskusi Akademik",
    desc: "Topik tentang mata pelajaran, ujian, dan persiapan olimpiade.",
    threads: 124,
    icon: "book",
    tone: "blue",
  },
  {
    name: "Ekstrakulikuler",
    desc: "Klub, olahraga, seni, dan kegiatan organisasi mahasiswa.",
    threads: 86,
    icon: "ball",
    tone: "gold",
  },
  {
    name: "Madrasah Life",
    desc: "Kegiatan keagamaan, pembentukan karakter, dan suasana sekolah.",
    threads: 52,
    icon: "heart",
    tone: "teal",
  },
];

export const discussions: {
  category: string;
  title: string;
  author: string;
  when: string;
  excerpt: string;
  replies: number;
  likes: number;
}[] = [
  {
    category: "Diskusi Akademik",
    title: "Strategi Belajar Efektif Menjelang Ujian Tengah Semester",
    author: "@Tumbal_pakaL",
    when: "2h ago",
    excerpt:
      "Mari berbagi tips membagi waktu belajar dan kegiatan ekskul agar nilai tetap maksimal di tengah jadwal yang padat bulan ini.",
    replies: 24,
    likes: 82,
  },
  {
    category: "Madrasah Life",
    title: "Cara cepat naik rank immortal di season 41",
    author: "@FINEshyt",
    when: "5h ago",
    excerpt: "Saran Hero buat push rank dong suhuu, tiap hari stuck di epic terus huhu",
    replies: 48,
    likes: 82,
  },
  {
    category: "Madrasah Life",
    title: "Tips Menyeimbangkan Tugas Sekolah dan Target Hafalan",
    author: "@fian_na_imo",
    when: "1d ago",
    excerpt:
      "Banyak yang bertanya bagaimana cara mengatur jadwal antara setumpuk PR dan setoran hafalan harian. Berikut beberapa insight...",
    replies: 12,
    likes: 82,
  },
];

export const forumStats: { value: string; label: string }[] = [
  { value: "1.000", label: "Active Members" },
  { value: "12k+", label: "Total Topics" },
  { value: "636", label: "Online Now" },
  { value: "15", label: "New Today" },
];

export const trendingTopics: { tag: string; title: string }[] = [
  { tag: "Academic", title: "Bocoran TKA tahun ini!!!!" },
  { tag: "Life", title: "Menu Kantin Baru: Apa favoritmu?" },
  { tag: "Clubs", title: "Club Robotik winstreak terus!!!!" },
];

export const topContributors: { name: string; posts: number }[] = [
  { name: "Rizky Zakaria", posts: 420 },
  { name: "Nabila Azzahra", posts: 385 },
  { name: "Arif Maulana", posts: 312 },
];
