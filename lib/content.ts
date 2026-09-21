/**
 * Konten situs MAN Kota Batu. Diselaraskan 1:1 dengan figma.md.
 * Social/contact links are best-effort official handles — verify before launch.
 *
 * PERHATIAN — sebagian isi berkas ini tidak lagi menjadi sumber tampilan.
 * Sebelas daftar (digitalServices, news, agenda, programs, achievements,
 * extracurriculars, facilities, galleryItems, faqs, testimonials, alumni)
 * kini dikelola lewat panel admin → My Website, dan dibaca lewat lib/site.ts.
 * Di sini daftar-daftar itu hanya berperan sebagai:
 *   1. cadangan saat API tidak bisa dihubungi, dan
 *   2. sumber isi awal CMS (diekspor ke backend/database/seeders/data/situs.json).
 * Mengubahnya di sini TIDAK mengubah situs selama API berjalan.
 *
 * Yang masih dibaca langsung dari sini: identitas sekolah (school), statistik,
 * sambutan kepala, media sosial, navigasi, profil, dan info PPDB.
 */

export type IconName =
  | "ppdb" | "rdm" | "cbt" | "elearning" | "library" | "attendance" | "ppid" | "ebook"
  | "research" | "olympiad" | "tahfidz"
  | "trophy" | "calendar" | "sparkle" | "search" | "sun" | "moon" | "menu" | "close"
  | "arrow" | "chevron" | "pin" | "phone" | "mail" | "clock" | "quote" | "star8"
  | "instagram" | "youtube" | "facebook" | "tiktok" | "whatsapp" | "external"
  | "shield" | "users" | "book" | "globe" | "heart" | "play" | "check" | "flask"
  | "palette" | "ball" | "mic" | "leaf" | "camera"
  // Portal siswa (design-siswa.md)
  | "flame" | "bell" | "download" | "chat" | "logout" | "help" | "flag"
  | "chart" | "wifi" | "grid" | "plus" | "eye" | "bookmark" | "sigma";

export const school = {
  name: "MAN Kota Batu",
  longName: "Madrasah Aliyah Negeri Kota Batu",
  nick: "MAKOBA",
  tagline: "Berilmu. Berakhlak. Berprestasi.",
  motto: "Maju, Bermutu, dan Mendunia",
  address: "Jl. Patimura No. 25, Temas, Kec. Batu, Kota Batu, Jawa Timur 65315",
  phone: "(0341) 591600",
  whatsapp: "+62 851 0000 0000",
  email: "info@mankotabatu.sch.id",
  mapsUrl: "https://maps.google.com/?q=MAN+Kota+Batu+Jl+Patimura+Batu",
  mapsEmbed: "https://maps.google.com/maps?q=MAN%20Kota%20Batu%20Jl%20Patimura%20No%2025%20Temas%20Batu&t=&z=15&ie=UTF8&iwloc=&output=embed",
  researchDecree: "SK Dirjen Pendidikan Islam No. 6757 Tahun 2020",
};

// Figma §1 Hero — Statistik cepat: 1.248 Siswa Aktif · 99 Guru & Tendik · 38 Rombongan Belajar · 32 Mata Pelajaran
export const stats: { value: number; suffix?: string; label: string; icon: IconName }[] = [
  { value: 1248, label: "Siswa Aktif", icon: "users" },
  { value: 99, label: "Guru & Tendik", icon: "book" },
  { value: 38, label: "Rombongan Belajar", icon: "globe" },
  { value: 32, label: "Mata Pelajaran", icon: "sparkle" },
];

export type DigitalService = {
  name: string;
  desc: string;
  /** Halaman informasi internal (detail layanan, atau /ppdb untuk PPDB Online). */
  href: string;
  icon: IconName;
  tone: "teal" | "blue" | "gold";
  /**
   * Halaman LOGIN sistem — semua tombol yang membuka sistem harus menuju ke sini;
   * jangan pernah menautkan/menampilkan isi sistem tanpa login.
   * RDM, CBT, E-Learning, dan Perpustakaan Digital memakai satu gerbang yang sama
   * di /siswa/login (design-siswa.md §1). PPDB tetap ke sistem PPDB eksternal.
   */
  login?: { href: string; label: string };
  /** Detail-page content; absent for services with their own dedicated page (PPDB). */
  detail?: {
    slug: string;
    fullName: string;
    audience: string;
    about: string[];
    features: string[];
    steps: { title: string; desc: string }[];
    note?: string;
  };
};

// Figma §1 — Layanan Digital MAKOBA (6):
// PPDB Online · RDM · CBT · E-Learning · Perpustakaan Digital · PPID & Pengaduan
export const digitalServices: DigitalService[] = [
  {
    name: "PPDB Online",
    desc: "Pendaftaran peserta didik baru secara daring.",
    href: "/ppdb",
    icon: "ppdb",
    tone: "teal",
    login: { href: "https://ppdb.mankotabatu.sch.id/", label: "Masuk PPDB Online" },
  },
  {
    name: "RDM",
    desc: "Rapor Digital Madrasah untuk wali murid.",
    href: "/layanan/rdm",
    icon: "rdm",
    tone: "blue",
    login: { href: "/siswa/login", label: "Masuk ke RDM" },
    detail: {
      slug: "rdm",
      fullName: "Rapor Digital Madrasah (RDM)",
      audience: "Wali murid & siswa",
      about: [
        "Rapor Digital Madrasah (RDM) adalah aplikasi penilaian resmi dari Kementerian Agama yang digunakan MAN Kota Batu untuk mengelola dan menyajikan hasil belajar siswa secara digital. Melalui RDM, capaian belajar tercatat rapi setiap semester dan dapat diakses tanpa harus menunggu pembagian rapor cetak.",
        "Layanan ini menjadi wujud transparansi penilaian madrasah: wali murid dapat memantau perkembangan akademik putra-putrinya, sementara guru mengelola nilai dalam satu sistem yang terstandar.",
      ],
      features: [
        "Nilai setiap mata pelajaran beserta deskripsi capaian",
        "Rekap kehadiran dan penilaian sikap",
        "Arsip rapor antar-semester yang tersimpan rapi",
        "Dapat diakses kapan saja dari perangkat apa pun",
        "Rapor dapat diunduh dan dicetak mandiri",
      ],
      steps: [
        { title: "Minta Akun", desc: "Wali murid menerima nama pengguna dan kata sandi dari wali kelas di awal tahun pelajaran." },
        { title: "Masuk ke RDM", desc: "Buka aplikasi RDM madrasah, lalu masuk menggunakan akun yang diberikan." },
        { title: "Pilih Semester", desc: "Tentukan tahun pelajaran dan semester yang ingin dilihat." },
        { title: "Lihat & Unduh Rapor", desc: "Nilai dan deskripsi capaian dapat dibaca langsung atau diunduh sebagai arsip." },
      ],
      note: "Akun RDM diterbitkan resmi oleh madrasah. Jaga kerahasiaan kata sandi dan hubungi wali kelas apabila lupa akses.",
    },
  },
  {
    name: "CBT",
    desc: "Computer Based Test untuk ujian online.",
    href: "/layanan/cbt",
    icon: "cbt",
    tone: "gold",
    login: { href: "/siswa/login", label: "Masuk ke CBT" },
    detail: {
      slug: "cbt",
      fullName: "Computer Based Test (CBT)",
      audience: "Siswa",
      about: [
        "CBT adalah platform ujian berbasis komputer yang digunakan MAN Kota Batu untuk penilaian tengah semester, penilaian akhir semester, ujian madrasah, hingga try out. Pelaksanaan ujian menjadi lebih efisien, hemat kertas, dan hasilnya dapat diolah dengan cepat.",
        "Sistem ini juga melatih siswa terbiasa dengan model asesmen digital seperti ANBK dan seleksi masuk perguruan tinggi yang kini berbasis komputer.",
      ],
      features: [
        "Soal terjadwal dengan token ujian yang aman",
        "Pengacakan soal untuk menjaga integritas",
        "Pewaktu otomatis sesuai durasi ujian",
        "Penilaian objektif yang cepat dan akurat",
        "Analisis hasil sebagai bahan evaluasi guru",
      ],
      steps: [
        { title: "Cek Jadwal", desc: "Perhatikan jadwal, sesi, dan ruang ujian yang diumumkan madrasah." },
        { title: "Siapkan Perangkat", desc: "Gunakan komputer laboratorium atau perangkat yang ditentukan panitia." },
        { title: "Masuk dengan Token", desc: "Login menggunakan akun peserta dan token yang dibagikan pengawas saat ujian dimulai." },
        { title: "Kerjakan & Kumpulkan", desc: "Kerjakan soal sesuai waktu; jawaban terkumpul otomatis saat sesi berakhir." },
      ],
      note: "Token ujian hanya dibagikan pengawas di ruang ujian sesaat sebelum sesi dimulai.",
    },
  },
  {
    name: "E-Learning",
    desc: "Kelas dan materi pembelajaran daring.",
    href: "/layanan/e-learning",
    icon: "elearning",
    tone: "teal",
    login: { href: "/siswa/login", label: "Masuk ke E-Learning" },
    detail: {
      slug: "e-learning",
      fullName: "E-Learning Madrasah",
      audience: "Siswa & guru",
      about: [
        "E-Learning Madrasah adalah ruang kelas digital tempat guru membagikan materi, tugas, kuis, dan diskusi untuk melengkapi pembelajaran tatap muka di MAN Kota Batu.",
        "Dengan e-learning, proses belajar tidak berhenti di jam pelajaran: siswa dapat mengulang materi, mengumpulkan tugas secara daring, dan memantau umpan balik guru dari mana saja.",
      ],
      features: [
        "Materi dan modul tersusun per mata pelajaran",
        "Pengumpulan tugas secara daring",
        "Kuis dan penilaian berbasis kelas digital",
        "Forum diskusi antara guru dan siswa",
        "Rekam jejak progres belajar setiap siswa",
      ],
      steps: [
        { title: "Masuk dengan Akun Madrasah", desc: "Gunakan akun pembelajaran yang diberikan oleh madrasah." },
        { title: "Pilih Kelas & Mapel", desc: "Buka kelas digital sesuai jadwal dan mata pelajaran." },
        { title: "Pelajari Materi & Kerjakan Tugas", desc: "Unduh materi, ikuti kuis, dan unggah tugas sebelum tenggat." },
        { title: "Pantau Umpan Balik", desc: "Nilai dan catatan guru dapat dilihat langsung pada setiap aktivitas." },
      ],
    },
  },
  {
    name: "Perpustakaan Digital",
    desc: "Koleksi buku dan jurnal elektronik.",
    href: "/layanan/perpustakaan-digital",
    icon: "library",
    tone: "blue",
    login: { href: "/siswa/login", label: "Masuk Perpustakaan Digital" },
    detail: {
      slug: "perpustakaan-digital",
      fullName: "Perpustakaan Digital",
      audience: "Siswa, guru & tenaga kependidikan",
      about: [
        "Perpustakaan MAN Kota Batu memadukan koleksi cetak dengan layanan digital: katalog daring, buku elektronik, dan referensi jurnal yang mendukung pembelajaran maupun penelitian siswa.",
        "Sebagai madrasah penyelenggara riset, perpustakaan menjadi dapur literasi Kelas Riset — tempat siswa menelusuri pustaka untuk proposal, karya tulis ilmiah, dan publikasi.",
      ],
      features: [
        "Katalog daring untuk menelusuri seluruh koleksi",
        "Koleksi e-book dan jurnal elektronik",
        "Referensi pendukung karya tulis ilmiah Kelas Riset",
        "Layanan peminjaman dengan kartu anggota",
        "Ruang baca yang nyaman untuk belajar",
      ],
      steps: [
        { title: "Telusuri Katalog", desc: "Cari judul melalui katalog daring atau langsung di perpustakaan." },
        { title: "Tunjukkan Kartu Anggota", desc: "Seluruh siswa dan guru MAKOBA otomatis menjadi anggota perpustakaan." },
        { title: "Pinjam atau Baca Daring", desc: "Koleksi cetak dipinjam sesuai ketentuan; koleksi digital dibaca langsung." },
        { title: "Kembalikan Tepat Waktu", desc: "Kembalikan pinjaman sesuai tenggat agar koleksi dapat dimanfaatkan bersama." },
      ],
      note: "Panduan akses koleksi digital dapat ditanyakan kepada pustakawan di jam layanan.",
    },
  },
  {
    name: "PPID & Pengaduan",
    desc: "Layanan informasi publik & aspirasi.",
    href: "/layanan/ppid",
    icon: "ppid",
    tone: "blue",
    detail: {
      slug: "ppid",
      fullName: "PPID & Layanan Pengaduan",
      audience: "Masyarakat umum",
      about: [
        "PPID (Pejabat Pengelola Informasi dan Dokumentasi) MAN Kota Batu melayani permohonan informasi publik sesuai Undang-Undang Nomor 14 Tahun 2008 tentang Keterbukaan Informasi Publik. Masyarakat berhak memperoleh informasi madrasah yang terbuka, cepat, dan tepat.",
        "Layanan ini juga menerima pengaduan dan aspirasi atas penyelenggaraan pendidikan, sebagai bagian dari komitmen Zona Integritas menuju Wilayah Bebas dari Korupsi (WBK) dan Wilayah Birokrasi Bersih Melayani (WBBM).",
      ],
      features: [
        "Permohonan informasi publik oleh masyarakat",
        "Kanal pengaduan dan aspirasi layanan madrasah",
        "Informasi berkala, serta-merta, dan tersedia setiap saat",
        "Tindak lanjut yang transparan dan akuntabel",
        "Bagian dari komitmen Zona Integritas WBK/WBBM",
      ],
      steps: [
        { title: "Ajukan Permohonan", desc: "Sampaikan permohonan informasi atau pengaduan secara tertulis melalui surat resmi atau email madrasah." },
        { title: "Lengkapi Identitas", desc: "Sertakan identitas yang jelas serta rincian informasi yang diminta dan tujuannya." },
        { title: "Proses Verifikasi", desc: "Petugas PPID memverifikasi dan memproses permohonan sesuai ketentuan perundang-undangan." },
        { title: "Terima Jawaban", desc: "Jawaban disampaikan melalui kontak pemohon sesuai batas waktu layanan informasi publik." },
      ],
      note: "Permohonan izin penelitian di madrasah juga dilayani melalui PPID atau bagian tata usaha.",
    },
  },
];

export type Program = {
  slug: string;
  name: string;
  tag: string;
  icon: IconName;
  color: "teal" | "blue" | "gold";
  desc: string;
  points: string[];
  detail: string[];
  activities: string[];
};

export const programs: Program[] = [
  {
    slug: "riset",
    name: "Kelas Riset",
    tag: "Karya ilmiah",
    icon: "research",
    color: "teal",
    desc: "Sebagai madrasah penyelenggara riset resmi, MAKOBA membimbing siswa melakukan penelitian ilmiah dari penyusunan proposal, eksperimen, hingga publikasi karya pada lomba dan jurnal nasional.",
    points: ["Bimbingan mentor peneliti", "Laboratorium riset terpadu", "Publikasi & lomba karya ilmiah"],
    detail: [
      "Kelas Riset adalah program unggulan yang menjadikan penelitian sebagai bagian dari pembelajaran sehari-hari. Status MAN Kota Batu sebagai madrasah penyelenggara riset resmi menjadi landasan kuat bagi siswa untuk berpikir kritis, ilmiah, dan solutif.",
      "Siswa dibimbing menempuh seluruh tahapan riset — mulai dari menemukan masalah, menyusun proposal, melakukan eksperimen di laboratorium, hingga menulis laporan dan mempublikasikan karya pada ajang lomba maupun jurnal ilmiah.",
    ],
    activities: [
      "Bimbingan intensif bersama mentor & dosen peneliti",
      "Praktikum dan eksperimen di laboratorium riset terpadu",
      "Penyusunan karya tulis ilmiah dan paper",
      "Partisipasi pada KRSM dan kompetisi riset nasional/internasional",
    ],
  },
  {
    slug: "olimpiade",
    name: "Kelas Olimpiade",
    tag: "kompetisi akademik",
    icon: "olympiad",
    color: "blue",
    desc: "Pembinaan intensif bagi siswa berbakat untuk berkompetisi di olimpiade sains, matematika, dan ilmu sosial mulai tingkat kota hingga internasional dengan kurikulum pengayaan khusus.",
    points: ["Pelatihan tipe soal olimpiade", "Pembinaan bertahap berjenjang", "Simulasi kompetisi rutin"],
    detail: [
      "Kelas Olimpiade dirancang untuk mengasah siswa berbakat agar mampu bersaing di kompetisi akademik bergengsi. Kurikulum pengayaan khusus diberikan di luar materi reguler untuk memperdalam penguasaan konsep.",
      "Melalui pembinaan berjenjang dan simulasi rutin, siswa dilatih terbiasa dengan tipe soal olimpiade serta manajemen waktu dan strategi mengerjakan soal tingkat tinggi.",
    ],
    activities: [
      "Pendalaman materi olimpiade sains, matematika & sosial",
      "Pembinaan bertahap oleh guru pembina berpengalaman",
      "Simulasi dan try out kompetisi secara berkala",
      "Pengiriman delegasi ke KSM, OSN, dan olimpiade internasional",
    ],
  },
  {
    slug: "tahfidz",
    name: "Kelas Tahfidz",
    tag: "Penghafal Al-Qur'an",
    icon: "tahfidz",
    color: "gold",
    desc: "Program tahfidzul Qur'an yang memadukan hafalan, tahsin, dan pemahaman makna, membentuk pribadi siswa yang berakhlak mulia tanpa meninggalkan prestasi akademik.",
    points: ["Target hafalan terstruktur", "Tahsin & muraja'ah harian", "Pembina hafidz bersanad"],
    detail: [
      "Kelas Tahfidz membentuk pribadi Qurani yang berakhlak mulia melalui program hafalan Al-Qur'an yang terstruktur. Hafalan dipadukan dengan tahsin dan pemahaman makna agar siswa tidak hanya hafal, tetapi juga menghayati.",
      "Program ini berjalan beriringan dengan capaian akademik, membuktikan bahwa kedalaman spiritual dan prestasi belajar dapat tumbuh bersama dalam lingkungan madrasah yang mendukung.",
    ],
    activities: [
      "Setoran hafalan dengan target juz yang terstruktur",
      "Tahsin dan muraja'ah (pengulangan) harian",
      "Bimbingan pembina hafidz bersanad",
      "Wisuda tahfidz dan apresiasi capaian hafalan",
    ],
  },
];

// Figma §1 — Prestasi Membanggakan (filter KOTA · PROVINSI · NASIONAL · INTERNASIONAL)
// Figma list: Silver Medal KOSSMI Robotik — Reza Malik (2026), Silver Medal Robotik ITS — M. Alief & M. Azriel (2026), Medali Perunggu IPSI — Raskha Aqila
export const achievements: {
  title: string; student: string; level: "Kota" | "Provinsi" | "Nasional" | "Internasional";
  year: number; organizer: string; field: string;
}[] = [
  { title: "Silver Medal KOSSMI Robotik", student: "Reza Malik", level: "Nasional", year: 2026, organizer: "KOSSMI 2026 — Universitas Telkom", field: "Robotik" },
  { title: "Silver Medal Robotik ITS", student: "M. Alief & M. Azriel", level: "Nasional", year: 2026, organizer: "ITS Surabaya", field: "Robotik" },
  { title: "Medali Perunggu IPSI", student: "Raskha Aqila", level: "Kota", year: 2026, organizer: "IPSI Kota Batu", field: "Pencak Silat" },
  { title: "Medali Emas — Riset Sains Madrasah", student: "Tim Riset MAKOBA", level: "Nasional", year: 2026, organizer: "Kemenag RI", field: "Riset" },
  { title: "Juara 1 Olimpiade Matematika", student: "Aisyah Nur Haliza", level: "Provinsi", year: 2026, organizer: "Dindik Jatim", field: "Akademik" },
  { title: "Best Paper — Science Fair", student: "M. Fariz Abdullah", level: "Internasional", year: 2025, organizer: "ASEAN Youth Science", field: "Riset" },
  { title: "Gold Medal — Robotics Challenge", student: "Tim Robotik MAKOBA", level: "Internasional", year: 2026, organizer: "World Robotic Olympiad", field: "Teknologi" },
  { title: "Juara 1 Tahfidz 5 Juz", student: "Fatimah Az-Zahra", level: "Kota", year: 2026, organizer: "Kemenag Kota Batu", field: "Keagamaan" },
];

export type NewsItem = {
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  excerpt: string;
  tone: "teal" | "blue" | "gold";
  content: string[];
  /** Optional real photo (e.g. "/photos/berita-1.jpg" in /public); falls back to the pastel tile. */
  image?: string;
};

// Figma §2 — Daftar Berita (6 item) + Figma §1 Berita utama KOSSMI
export const news: NewsItem[] = [
  {
    slug: "makoba-raih-tiga-medali-kossmi-2026",
    title: "MAKOBA Raih Tiga Medali Dalam Ajang KOSSMI 2026, Universitas Telkom",
    category: "Prestasi",
    date: "2026-06-18",
    author: "Humas MAKOBA",
    tone: "teal",
    image: "/photos/berita-kossmi-2026.jpg",
    excerpt: "MAKOBA M NYA MENYALA!! K NYA KEREN!!!🔥🔥 — Tim Robotik dan Riset MAKOBA borong medali di ajang Kompetisi Sains Siswa Madrasah Indonesia 2026.",
    content: [
      "MAKOBA M NYA MENYALA!! K NYA KEREN!!!🔥🔥 — MAN Kota Batu kembali mengharumkan nama madrasah dengan meraih tiga medali pada ajang Kompetisi Sains Siswa Madrasah Indonesia (KOSSMI) 2026 yang digelar di Universitas Telkom.",
      "Capaian ini diraih berkat pembinaan intensif di Kelas Riset dan Kelas Robotik: Silver Medal KOSSMI Robotik oleh Reza Malik, Silver Medal kategori Creative Open di ITS oleh M. Alief & M. Azriel, serta medali perunggu IPSI oleh Raskha Aqila yang turut mengharumkan nama madrasah pada pekan yang sama.",
      "Kepala madrasah menyampaikan rasa syukur dan apresiasi kepada siswa, pembina, dan orang tua. Prestasi ini menegaskan posisi MAKOBA sebagai madrasah penyelenggara riset yang konsisten melahirkan inovasi — Berilmu, Berakhlak, Berprestasi.",
    ],
  },
  {
    slug: "pembukaan-ppdb-2026-2027",
    title: "Pembukaan PPDB Tahun Pelajaran 2026/2027 Resmi Dimulai",
    category: "Pengumuman",
    date: "2026-06-10",
    author: "Panitia PPDB",
    tone: "blue",
    image: "/photos/berita-ppdb-dibuka.jpg",
    excerpt: "Pendaftaran peserta didik baru jalur prestasi, afirmasi, dan reguler dibuka secara daring melalui portal PPDB MAKOBA.",
    content: [
      "Penerimaan Peserta Didik Baru (PPDB) MAN Kota Batu untuk tahun pelajaran 2026/2027 resmi dibuka. Pendaftaran dilakukan secara daring melalui portal PPDB madrasah untuk memudahkan calon siswa dari berbagai daerah.",
      "Tersedia tiga jalur pendaftaran: jalur prestasi bagi siswa berprestasi akademik maupun non-akademik, jalur afirmasi bagi keluarga kurang mampu, serta jalur reguler. Setiap jalur memiliki kuota dan persyaratan yang dapat dilihat pada laman PPDB.",
      "Calon peserta didik diimbau menyiapkan dokumen yang dibutuhkan sejak awal dan mengikuti setiap tahapan sesuai jadwal. Informasi lebih lanjut dapat ditanyakan langsung ke panitia melalui kontak resmi madrasah.",
    ],
  },
  {
    slug: "wisuda-tahfidz-42-siswa-khatam-5-juz",
    title: "Wisuda Tahfidz: 42 Siswa Khatamkan Hafalan 5 Juz",
    category: "Keagamaan",
    date: "2026-06-02",
    author: "Humas MAKOBA",
    tone: "gold",
    image: "/photos/berita-wisuda-tahfidz.jpg",
    excerpt: "Prosesi wisuda tahfidz angkatan ke-7 berlangsung khidmat di Aula MAKOBA bersama wali murid dan dewan guru.",
    content: [
      "Sebanyak 42 siswa Kelas Tahfidz MAN Kota Batu mengikuti prosesi wisuda tahfidz angkatan ke-7. Acara berlangsung khidmat di Aula MAKOBA dan dihadiri oleh wali murid, dewan guru, serta para pembina hafidz.",
      "Program tahfidz di MAKOBA memadukan hafalan, tahsin, dan pemahaman makna Al-Qur'an dengan target yang terstruktur. Para wisudawan telah menuntaskan hafalan lima juz tanpa meninggalkan capaian akademik mereka.",
      "Kegiatan ini menjadi bukti bahwa keseimbangan antara prestasi akademik dan kedalaman spiritual dapat berjalan beriringan di lingkungan madrasah.",
    ],
  },
  {
    slug: "siswa-makoba-raih-medali-perak-its-creative-open",
    title: "Siswa MAKOBA Berhasil Meraih Medali Perak Di ITS Surabaya",
    category: "Akademik",
    date: "2026-05-24",
    author: "Humas MAKOBA",
    tone: "teal",
    image: "/photos/berita-its-perak.jpg",
    excerpt: "Pada Kategori Creative Open di ITS, Siswa Makoba Berhasil Meraih Medali Perak — suatu kebanggaan bagi madrasah.",
    content: [
      "Pada Kategori Creative Open di Institut Teknologi Sepuluh Nopember (ITS) Surabaya, siswa MAN Kota Batu berhasil meraih medali perak. Kompetisi ini mempertemukan inovator muda dari berbagai daerah untuk menampilkan karya robotik kreatif.",
      "M. Alief dan M. Azriel tampil memukau dengan robot rakitan yang menggabungkan mekanik presisi dan pemrograman. Juri mengapresiasi kreativitas solusi dan kemampuan presentasi tim MAKOBA.",
      "Capaian ini melengkapi raihan medali KOSSMI di pekan yang sama dan menjadi motivasi bagi ekstrakurikuler Robotik untuk terus berkarya.",
    ],
  },
  {
    slug: "ribuan-siswi-serentak-minum-tablet-tambah-darah",
    title: "Ribuan Siswi Serentak Minum Tablet Tambah Darah",
    category: "Kesehatan",
    date: "2026-05-04",
    author: "Humas MAKOBA",
    tone: "blue",
    image: "/photos/berita-ttd.jpg",
    excerpt: "Kota Batu, 4 Mei 2026. Suasana berbeda terasa di Aula MAN Kota Batu pada peringatan Hari Kesehatan — ribuan siswi serentak minum tablet tambah darah.",
    content: [
      "Kota Batu, 4 Mei 2026. Suasana berbeda terasa di Aula MAN Kota Batu pada peringatan Hari Kesehatan. Ribuan siswi mengikuti gerakan serentak minum tablet tambah darah (TTD) sebagai upaya pencegahan anemia remaja putri.",
      "Kegiatan ini bekerja sama dengan Dinas Kesehatan Kota Batu dan Puskesmas setempat. Edukasi gizi seimbang dan pentingnya TTD mingguan disampaikan sebelum pelaksanaan serentak.",
      "Madrasah berkomitmen mendukung kesehatan peserta didik sebagai fondasi prestasi belajar yang optimal.",
    ],
  },
  {
    slug: "man-kota-batu-raih-predikat-zona-integritas",
    title: "MAN Kota Batu Raih Predikat Zona Integritas Menuju WBK/WBBM",
    category: "Prestasi",
    date: "2026-05-24",
    author: "Humas MAKOBA",
    tone: "gold",
    image: "/photos/berita-zi.jpg",
    excerpt: "Madrasah Aliyah Negeri (MAN) Kota Batu kembali menunjukkan komitmennya dalam membangun tata kelola madrasah yang bersih dan melayani.",
    content: [
      "Madrasah Aliyah Negeri (MAN) Kota Batu kembali menunjukkan komitmennya dalam membangun tata kelola madrasah yang bersih, transparan, dan melayani melalui penguatan Zona Integritas menuju Wilayah Bebas dari Korupsi (WBK) dan Wilayah Birokrasi Bersih Melayani (WBBM).",
      "Berbagai inovasi layanan — mulai dari PPID, keterbukaan informasi publik, hingga digitalisasi layanan akademik — menjadi bukti keseriusan madrasah dalam menghadirkan pelayanan prima bagi siswa, orang tua, dan masyarakat.",
      "Predikat ini menjadi motivasi bagi seluruh warga madrasah untuk terus menjaga integritas, profesionalisme, dan semangat Berilmu, Berakhlak, Berprestasi.",
    ],
  },
];

// Figma §1 — Sambutan Kepala Madrasah (full text per figma.md)
export const principal: { name: string; role: string; message: string; photo?: string } = {
  name: "Drs. H. Farhadi, M.Si",
  role: "Kepala MAN Kota Batu",
  photo: "/photos/kepala-madrasah.jpg",
  message:
    "Assalamu'alaikum warahmatullahi wabarakatuh. Selamat datang di website resmi MAN Kota Batu. Website ini menjadi sarana informasi dan komunikasi untuk mengenal komitmen kami dalam menghadirkan pendidikan unggul di bawah Kementerian Agama Republik Indonesia. Dengan tenaga pendidik profesional, lingkungan belajar yang kondusif, serta berbagai prestasi akademik dan nonakademik, kami berkomitmen mencetak generasi yang berilmu, berakhlak mulia, dan siap menghadapi tantangan masa depan. Semoga website ini dapat mempererat sinergi antara madrasah, orang tua, alumni, dan masyarakat.",
};

// Figma §1 — Ekstrakurikuler (8): Tata Boga, Pramuka, Basket, Catur, Paduan Suara, Robotik, Badminton, Futsal
export const extracurriculars: { name: string; category: string; desc: string; icon: IconName }[] = [
  { name: "Tata Boga", category: "Keterampilan", desc: "Cita Rasa dan Kreativitas.", icon: "palette" },
  { name: "Pramuka", category: "Kepanduan", desc: "Pembentukan Karakter, Disiplin, dan Kepemimpinan.", icon: "leaf" },
  { name: "Basket", category: "Olahraga", desc: "Disiplin, Mental, Strategi Kerja Sama Tim", icon: "ball" },
  { name: "Catur", category: "Olahraga", desc: "Olah Pikir, Asah Taktik, Strategi, Kefokusan", icon: "globe" },
  { name: "Paduan Suara", category: "Seni Suara", desc: "Mengekspresikan Diri, Nada Indah, Sejuta Pesona.", icon: "mic" },
  { name: "Robotik", category: "Teknologi", desc: "Rancang Bangun Robot dan Pemrograman Dasar.", icon: "cbt" },
  { name: "Badminton", category: "Olahraga", desc: "Kecepatan, Kekuatan, Prestasi, Olah Taktik", icon: "ball" },
  { name: "Futsal", category: "Olahraga", desc: "Gocek Cepat, Kerja Sama, Strategi, Taktik Cerdas, Aksi Tangkas.", icon: "ball" },
];

export const facilities: { name: string; desc: string; icon: IconName }[] = [
  { name: "Laboratorium Riset", desc: "Lab sains terpadu untuk eksperimen & penelitian.", icon: "flask" },
  { name: "Masjid Madrasah", desc: "Pusat ibadah dan kegiatan keagamaan siswa.", icon: "tahfidz" },
  { name: "Perpustakaan Modern", desc: "Ribuan koleksi cetak dan digital.", icon: "library" },
  { name: "Ruang Kelas Smart", desc: "Kelas ber-AC dengan perangkat pembelajaran digital.", icon: "elearning" },
  { name: "Lapangan Olahraga", desc: "Fasilitas olahraga indoor dan outdoor.", icon: "ball" },
  { name: "Aula Serbaguna", desc: "Ruang acara berkapasitas besar.", icon: "users" },
];

export const galleryItems: { title: string; date: string; category: string; tone: "teal" | "blue" | "gold"; image?: string }[] = [
  { title: "Upacara Hari Santri Nasional", date: "2025-10-22", category: "Keagamaan", tone: "teal", image: "/photos/galeri-hari-santri.jpg" },
  { title: "Pekan Riset & Pameran Karya", date: "2026-03-15", category: "Akademik", tone: "blue", image: "/photos/galeri-pekan-riset.jpg" },
  { title: "Wisuda Tahfidz Angkatan VII", date: "2026-06-02", category: "Keagamaan", tone: "gold", image: "/photos/galeri-wisuda-tahfidz.jpg" },
  { title: "Kompetisi Robotik Internal", date: "2026-02-08", category: "Teknologi", tone: "blue", image: "/photos/galeri-robotik.jpg" },
  { title: "Class Meeting & Pentas Seni", date: "2025-12-12", category: "Seni", tone: "gold", image: "/photos/galeri-pentas-seni.jpg" },
  { title: "Studi Lapangan Kelas Riset", date: "2026-04-20", category: "Akademik", tone: "teal", image: "/photos/galeri-studi-lapangan.jpg" },
];

// Figma §1 — Apa Kata Mereka: ELLLL etc + tambahan real testimoni
export const testimonials: { name: string; role: string; quote: string }[] = [
  {
    name: "ELLLL",
    role: "Alumni pertama",
    quote: "Awalnya saya deg-degan masuk sekolah baru, tapi lewat MAKOBA saya jadi kenal banyak teman dan kakak kelas. Acaranya seru dan nggak membosankan!",
  },
  {
    name: "Hanifah Salsabila",
    role: "Alumni 2023 · Mahasiswi UGM",
    quote: "Kelas Riset di MAKOBA mengajari saya berpikir ilmiah sejak dini. Bekal itu sangat membantu saat kuliah dan menembus PTN impian.",
  },
  {
    name: "Bapak Sutrisno",
    role: "Wali Murid Kelas XI",
    quote: "Saya tenang menyekolahkan anak di sini. Akademiknya kuat, tapi pembinaan akhlak dan ibadahnya juga tidak kalah diperhatikan.",
  },
  {
    name: "Muhammad Iqbal",
    role: "Siswa Kelas XII · Kelas Tahfidz",
    quote: "Di MAKOBA saya bisa menghafal Al-Qur'an sambil tetap fokus belajar. Lingkungannya benar-benar mendukung.",
  },
];

export const alumni: {
  name: string; year: number; achievement: string; field: string;
  tone: "teal" | "blue" | "gold"; quote: string;
}[] = [
  {
    name: "dr. Lutfi Rahman", year: 2015, achievement: "Dokter di RSUD Kota Batu", field: "Kedokteran", tone: "teal",
    quote: "Pembiasaan disiplin dan akhlak di MAKOBA membentuk fondasi saya untuk menempuh pendidikan kedokteran.",
  },
  {
    name: "Rizal Maulana, S.T.", year: 2017, achievement: "Engineer di perusahaan teknologi nasional", field: "Teknologi", tone: "blue",
    quote: "Kelas Riset menumbuhkan rasa ingin tahu yang membawa saya ke dunia teknologi.",
  },
  {
    name: "Nabila Putri", year: 2019, achievement: "Awardee beasiswa LPDP luar negeri", field: "Beasiswa", tone: "gold",
    quote: "Budaya berprestasi di madrasah membuat saya berani bermimpi menembus kampus dunia.",
  },
  {
    name: "Ahmad Syauqi", year: 2018, achievement: "Hafidz & pengusaha muda", field: "Wirausaha", tone: "teal",
    quote: "Program tahfidz mengajarkan saya ketekunan yang kini menjadi modal berwirausaha.",
  },
  {
    name: "Salma Khoirunnisa", year: 2020, achievement: "Mahasiswi Hubungan Internasional UGM", field: "Sosial", tone: "blue",
    quote: "Organisasi dan debat di MAKOBA mengasah kepercayaan diri serta kemampuan komunikasi saya.",
  },
  {
    name: "Fauzan Adhima", year: 2016, achievement: "Peneliti muda bidang energi terbarukan", field: "Riset", tone: "gold",
    quote: "Riset pertama saya lahir di laboratorium MAKOBA, dan jejaknya saya teruskan hingga kini.",
  },
];

// Figma §1 — FAQ (4 item sesuai figma.md)
export const faqs: { q: string; a: string }[] = [
  {
    q: "Kapan pendaftaran PPDB MAN Kota Batu dibuka?",
    a: "PPDB tahun pelajaran 2026/2027 dibuka mulai Juni 2026 melalui portal PPDB online. Jadwal lengkap tiap jalur diumumkan pada laman PPDB.",
  },
  {
    q: "Apa saja program unggulan di MAKOBA?",
    a: "Terdapat tiga program unggulan: Kelas Riset, Kelas Olimpiade, dan Kelas Tahfidz, yang dapat dipilih sesuai minat dan bakat siswa.",
  },
  {
    q: "Apa Saja Fasilitas di Asrama",
    a: "MAKOBA memfasilitasi program pembinaan, termasuk dukungan bagi siswa tahfidz. Informasi detail asrama dapat ditanyakan langsung ke pihak madrasah melalui kontak resmi.",
  },
  {
    q: "Bagaimana cara mengakses rapor digital (RDM)?",
    a: "Wali murid dapat masuk ke layanan RDM melalui menu Layanan Digital menggunakan akun yang diberikan oleh wali kelas.",
  },
];

// Figma §1 — Agenda Kegiatan (3): MPLM, Awal Tahun Pelajaran 2026/2027, Tahun Baru Hijriah 1448 H
export const agenda: {
  date: string; title: string; category: "Ujian" | "Ekstrakurikuler" | "Keagamaan" | "Umum";
}[] = [
  { date: "2026-07-07", title: "Masa Pengenalan Lingkungan Madrasah (MPLM)", category: "Umum" },
  { date: "2026-07-14", title: "Awal Tahun Pelajaran 2026/2027", category: "Umum" },
  { date: "2026-07-26", title: "Peringatan Tahun Baru Hijriah 1448 H", category: "Keagamaan" },
];

// Figma — Footer tiap halaman: Instagram, YouTube, Facebook (3)
export const socials: { name: string; href: string; icon: IconName }[] = [
  { name: "Instagram", href: "https://www.instagram.com/mankotabatuofficial/", icon: "instagram" },
  { name: "YouTube", href: "https://www.youtube.com/@mankotabatuofficial3160", icon: "youtube" },
  { name: "Facebook", href: "https://www.facebook.com/mankotabatuofficial?rdid=14F5S8fbcuWTPb2W&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FNUhA5wfroPR5aW51%2F#", icon: "facebook" },
];

export const navItems: { label: string; href: string; children?: { label: string; href: string }[] }[] = [
  {
    label: "Profil",
    href: "/profil",
    children: [
      { label: "Tentang Kami", href: "/profil" },
      { label: "Visi & Misi", href: "/profil#visi" },
      { label: "Sejarah", href: "/profil#sejarah" },
      { label: "Struktur Organisasi", href: "/profil#struktur" },
      { label: "Alumni", href: "/alumni" },
    ],
  },
  {
    label: "Akademik",
    href: "/#program",
    children: [
      { label: "Program Unggulan", href: "/#program" },
      { label: "Kelas Riset", href: "/program/riset" },
      { label: "Kelas Olimpiade", href: "/program/olimpiade" },
      { label: "Kelas Tahfidz", href: "/program/tahfidz" },
      { label: "Ekstrakurikuler", href: "/#ekskul" },
    ],
  },
  { label: "Prestasi", href: "/#prestasi" },
  { label: "Berita", href: "/berita" },
  {
    label: "Informasi",
    href: "/#agenda",
    children: [
      { label: "Layanan Digital", href: "/layanan" },
      { label: "Agenda", href: "/#agenda" },
      { label: "Fasilitas", href: "/#fasilitas" },
      { label: "Galeri", href: "/#galeri" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  { label: "Kontak", href: "/kontak" },
];

// Figma §6 — Profil MAN Kota Batu
export const profile = {
  intro: [
    "Madrasah Aliyah Negeri Kota Batu (MAKOBA) adalah lembaga pendidikan menengah berciri khas agama Islam di bawah naungan Kementerian Agama. Berlokasi di jantung Kota Batu, Jawa Timur, MAKOBA berkomitmen menyelenggarakan pendidikan yang menyeimbangkan keunggulan akademik, kedalaman spiritual, dan akhlak mulia.",
    "Sebagai madrasah penyelenggara riset resmi, MAKOBA menghadirkan tiga program unggulan (Kelas Riset, Kelas Olimpiade, dan Kelas Tahfidz) yang membentuk generasi berilmu, berakhlak, dan berprestasi.",
  ],
  vision:
    "Terwujudnya Madrasah Unggul dan Bermartabat untuk Mencetak Generasi Cerdas, Maslahat, dan Berkontribusi Menuju Indonesia Emas 2045",
  missions: [
    "Meningkatkan ketaatan beribadah, berperilaku islami, nasionalis dan berakhlak mulia",
    "Mempersiapkan sumber daya manusia yang unggul dalam akademik dan non akademik",
    "Mempersiapkan peserta didik melanjutkan ke perguruan tinggi",
    "Membekali peserta didik dengan ketrampilan dan kecakapan hidup",
    "Menciptakan lingkungan belajar yang ramah dan pembelajaran yang berbasis literasi (Baca tulis, numerasi, sains, digital finansial, budaya dan kewarganegaraan)",
  ],
  history: [
    { year: "1970", title: "Cikal Bakal Madrasah", desc: "Berdiri sebagai PGAA NU Batu, diresmikan menjadi SPIAIN Sunan Ampel melalui SK Menteri Agama RI No. 02 Tahun 1970." },
    { year: "1978", title: "Penegerian", desc: "Resmi menjadi Madrasah Aliyah Negeri Malang II berdasarkan SK Menteri Agama RI No. 17 Tahun 1978." },
    { year: "1979", title: "Pindah Lokasi", desc: "Menempati gedung sewa milik MI Raoudlatul Ulum di Jl. Lahor 23 Batu." },
    { year: "1981", title: "Gedung Sendiri", desc: "Menempati gedung milik sendiri (pemerintah) di Jl. Patimura No. 25 Batu, dibangun dengan dana DIP Tahun Anggaran 1980/1981." },
    { year: "2014", title: "Perubahan Nama", desc: "Berubah menjadi Madrasah Aliyah Negeri Kota Batu berdasarkan SK Menteri Agama No. 157 Tahun 2014." },
  ],
  org: [
    { name: "Drs. H. Farhadi, M.Si", role: "Kepala Madrasah", icon: "shield" as IconName },
    { name: "Waka Kesiswaan", role: "Bidang Kesiswaan", icon: "users" as IconName },
    { name: "Waka Sarana & Prasarana", role: "Bidang Sarpras", icon: "globe" as IconName },
    { name: "Waka Kurikulum", role: "Bidang Kurikulum", icon: "book" as IconName },
    { name: "Waka Humas", role: "Hubungan Masyarakat", icon: "mail" as IconName },
    { name: "Kepala Tata Usaha", role: "Administrasi & Tata Usaha", icon: "rdm" as IconName },
  ],
};

// Figma §3 — PPDB 2026/2027 (Dua Jalur + 5 Tahapan + Persyaratan)
export const ppdbInfo = {
  yearLabel: "2026 / 2027",
  // Countdown target — penutupan pendaftaran
  deadlineISO: "2026-07-05T23:59:59+07:00",
  jalur: [
    { name: "Jalur Prestasi", icon: "trophy" as IconName, desc: "Bagi siswa dengan prestasi akademik maupun non-akademik tingkat kota hingga internasional." },
    { name: "Jalur Reguler", icon: "users" as IconName, desc: "Jalur umum melalui seleksi administrasi dan tes masuk madrasah secara kompetitif." },
  ],
  timeline: [
    { date: "2026-06-10", title: "Pendaftaran & Upload Berkas", desc: "Pendaftaran daring dan unggah berkas melalui portal PPDBM Online, sesuai jalur yang dipilih (Prestasi, Reguler 1, atau Reguler 2/Afirmasi)." },
    { date: "2026-06-20", title: "Verifikasi Berkas", desc: "Panitia melakukan verifikasi kelengkapan dan keabsahan berkas yang diunggah calon siswa." },
    { date: "2026-07-01", title: "Simulasi CBT & Tes Seleksi", desc: "Simulasi Computer Based Test dilanjutkan tes seleksi meliputi psikotes, akademik, dan Baca Tulis Al-Qur'an (BTQ)." },
    { date: "2026-07-05", title: "Pengumuman Hasil", desc: "Pengumuman kelulusan diumumkan melalui portal PPDB sesuai jadwal masing-masing jalur." },
    { date: "2026-07-10", title: "Daftar Ulang", desc: "Verifikasi dan daftar ulang bagi calon siswa yang dinyatakan diterima." },
  ],
  requirements: [
    "Fotokopi ijazah / SKL SMP/MTs",
    "Fotokopi rapor semester 1-5",
    "Fotokopi Kartu Keluarga & akta kelahiran",
    "Pas foto terbaru",
    "Sertifikat prestasi (untuk jalur prestasi)",
  ],
};
