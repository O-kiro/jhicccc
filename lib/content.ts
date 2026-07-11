/**
 * Single source of truth for the MAN Kota Batu homepage.
 * All copy is real (PRD §13 — target: 0 konten placeholder), in Bahasa Indonesia.
 * Social/contact links are best-effort official handles — verify before launch.
 */

export type IconName =
  | "ppdb" | "rdm" | "cbt" | "elearning" | "library" | "attendance" | "ppid" | "ebook"
  | "research" | "olympiad" | "tahfidz"
  | "trophy" | "calendar" | "sparkle" | "search" | "sun" | "moon" | "menu" | "close"
  | "arrow" | "chevron" | "pin" | "phone" | "mail" | "clock" | "quote" | "star8"
  | "instagram" | "youtube" | "facebook" | "tiktok" | "whatsapp" | "external"
  | "shield" | "users" | "book" | "globe" | "heart" | "play" | "check" | "flask"
  | "palette" | "ball" | "mic" | "leaf" | "camera";

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

export const stats: { value: number; suffix?: string; label: string; icon: IconName }[] = [
  { value: 1299, label: "Siswa Aktif", icon: "users" },
  { value: 84, label: "Guru & Tenaga Pendidik", icon: "book" },
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
   * RDM & CBT punya halaman login di dalam situs (/portal/*) meniru portal aslinya;
   * lainnya menuju subdomain eksternal (pola — verifikasi sebelum rilis).
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
    login: { href: "/portal/rdm", label: "Masuk ke RDM" },
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
    login: { href: "/portal/cbt", label: "Masuk ke CBT" },
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
    login: { href: "https://elearning.mankotabatu.sch.id/", label: "Masuk ke E-Learning" },
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
    login: { href: "https://perpustakaan.mankotabatu.sch.id/", label: "Masuk Perpustakaan Digital" },
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
    name: "Absensi Digital",
    desc: "Kehadiran siswa terpantau real-time.",
    href: "/layanan/absensi-digital",
    icon: "attendance",
    tone: "gold",
    detail: {
      slug: "absensi-digital",
      fullName: "Absensi Digital",
      audience: "Wali murid",
      about: [
        "Absensi Digital mencatat kehadiran siswa MAN Kota Batu secara elektronik setiap hari. Data kehadiran terekap otomatis sehingga madrasah dan wali murid dapat memantau kedisiplinan siswa dengan mudah.",
        "Sistem ini menjadi bagian dari pembinaan karakter: keterlambatan dan ketidakhadiran terpantau sejak dini sehingga dapat ditindaklanjuti bersama antara wali kelas dan orang tua.",
      ],
      features: [
        "Pencatatan kehadiran elektronik setiap hari",
        "Rekap otomatis harian, bulanan, dan semester",
        "Pemantauan keterlambatan dan ketidakhadiran",
        "Tindak lanjut pembinaan bersama wali kelas",
        "Data akurat sebagai dasar penilaian kedisiplinan",
      ],
      steps: [
        { title: "Siswa Melakukan Presensi", desc: "Presensi dilakukan setiap hari saat tiba di madrasah." },
        { title: "Sistem Merekap Otomatis", desc: "Kehadiran, keterlambatan, dan izin terekam dalam satu sistem." },
        { title: "Wali Murid Memantau", desc: "Informasi kehadiran dapat dikonfirmasi melalui wali kelas atau kanal informasi madrasah." },
        { title: "Tindak Lanjut", desc: "Ketidakhadiran tanpa keterangan ditindaklanjuti wali kelas bersama orang tua." },
      ],
    },
  },
  {
    name: "E-Book Karya",
    desc: "Publikasi buku dan karya tulis siswa.",
    href: "/layanan/e-book-karya",
    icon: "ebook",
    tone: "teal",
    detail: {
      slug: "e-book-karya",
      fullName: "E-Book Karya MAKOBA",
      audience: "Siswa, guru & masyarakat umum",
      about: [
        "E-Book Karya adalah rak digital yang memuat buku, antologi, dan karya tulis ilmiah hasil karya siswa serta guru MAN Kota Batu. Setiap karya yang lahir dari kelas, ekstrakurikuler, maupun program riset diabadikan agar dapat dibaca dan menginspirasi.",
        "Publikasi ini merupakan buah dari budaya literasi madrasah penyelenggara riset — bukti bahwa menulis dan meneliti menjadi keseharian warga MAKOBA.",
      ],
      features: [
        "Kumpulan buku dan antologi karya siswa & guru",
        "Publikasi karya tulis ilmiah Kelas Riset",
        "Dapat dibaca secara daring oleh masyarakat",
        "Dokumentasi jejak karya setiap angkatan",
        "Memotivasi budaya menulis di madrasah",
      ],
      steps: [
        { title: "Buka Koleksi", desc: "Telusuri daftar karya yang telah diterbitkan madrasah." },
        { title: "Pilih Judul", desc: "Pilih buku, antologi, atau karya ilmiah yang ingin dibaca." },
        { title: "Baca Secara Daring", desc: "Karya dapat dibaca langsung dalam format digital." },
        { title: "Terbitkan Karyamu", desc: "Siswa yang ingin menerbitkan karya dapat menghubungi guru pembina literasi." },
      ],
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

export function getServiceBySlug(slug: string): DigitalService | undefined {
  return digitalServices.find((s) => s.detail?.slug === slug);
}

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
    tag: "Sains & Inovasi",
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
    tag: "Akademik Kompetitif",
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
    tag: "Qurani & Akhlak",
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

export function getProgramBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}

export const achievements: {
  title: string; student: string; level: "Kota" | "Provinsi" | "Nasional" | "Internasional";
  year: number; organizer: string; field: string;
}[] = [
  { title: "Medali Emas — Riset Sains Madrasah", student: "Tim Riset MAKOBA", level: "Nasional", year: 2026, organizer: "Kemenag RI", field: "Riset" },
  { title: "Juara 1 Olimpiade Matematika", student: "Aisyah Nur Haliza", level: "Provinsi", year: 2026, organizer: "Dindik Jatim", field: "Akademik" },
  { title: "Best Paper — Science Fair", student: "M. Fariz Abdullah", level: "Internasional", year: 2025, organizer: "ASEAN Youth Science", field: "Riset" },
  { title: "Juara 2 MTQ Pelajar", student: "Khaled Ibrahim", level: "Provinsi", year: 2026, organizer: "LPTQ Jatim", field: "Keagamaan" },
  { title: "Juara 1 KSM Geografi", student: "Salsabila Putri", level: "Nasional", year: 2025, organizer: "Kemenag RI", field: "Akademik" },
  { title: "Juara Umum Pencak Silat", student: "Tim Tapak Suci", level: "Kota", year: 2026, organizer: "IPSI Kota Batu", field: "Olahraga" },
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

export const news: NewsItem[] = [
  {
    slug: "medali-emas-riset-sains-nasional",
    title: "MAKOBA Raih Medali Emas Kompetisi Riset Sains Madrasah Nasional",
    category: "Prestasi",
    date: "2026-06-18",
    author: "Humas MAKOBA",
    tone: "teal",
    image: "/photos/berita-medali-emas.jpg",
    excerpt: "Tim riset MAN Kota Batu kembali mengharumkan nama madrasah dengan riset bertema energi terbarukan di ajang KRSM 2026.",
    content: [
      "Tim riset MAN Kota Batu kembali menorehkan prestasi membanggakan dengan meraih medali emas pada Kompetisi Riset Sains Madrasah (KRSM) tingkat nasional tahun 2026. Penelitian yang diusung mengangkat tema pemanfaatan limbah kulit apel khas Kota Batu sebagai sumber bioetanol ramah lingkungan.",
      "Karya ini lahir dari proses pembimbingan intensif di laboratorium riset madrasah, mulai dari penyusunan proposal, eksperimen, hingga penulisan laporan ilmiah. Para juri menilai riset ini relevan dengan kearifan lokal sekaligus menjawab tantangan energi terbarukan.",
      "Kepala madrasah menyampaikan apresiasi atas capaian ini dan berharap semangat meneliti terus tumbuh di kalangan siswa. Prestasi ini menegaskan posisi MAKOBA sebagai madrasah penyelenggara riset yang konsisten melahirkan inovasi.",
    ],
  },
  {
    slug: "ppdb-2026-2027-dibuka",
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
    slug: "wisuda-tahfidz-angkatan-7",
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
    slug: "workshop-karya-ilmiah",
    title: "Workshop Penulisan Karya Ilmiah untuk Kelas Riset",
    category: "Akademik",
    date: "2026-05-24",
    author: "Humas MAKOBA",
    tone: "teal",
    image: "/photos/berita-workshop-kti.jpg",
    excerpt: "Menghadirkan dosen pembimbing dari perguruan tinggi negeri untuk mengasah metodologi penelitian siswa.",
    content: [
      "Kelas Riset MAN Kota Batu menggelar workshop penulisan karya ilmiah dengan menghadirkan dosen pembimbing dari perguruan tinggi negeri. Kegiatan ini bertujuan mengasah metodologi penelitian dan kualitas penulisan siswa.",
      "Peserta dibekali materi mulai dari perumusan masalah, kajian pustaka, metode penelitian, hingga teknik penyajian data. Sesi praktik membuat siswa langsung menerapkan kaidah penulisan ilmiah pada riset mereka.",
      "Workshop semacam ini rutin diselenggarakan untuk menjaga kualitas riset siswa agar siap berkompetisi di tingkat nasional maupun internasional.",
    ],
  },
];

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return news.find((n) => n.slug === slug);
}

export const principal: { name: string; role: string; message: string; photo?: string } = {
  name: "Drs. H. Farhadi, M.Si",
  role: "Kepala MAN Kota Batu",
  photo: "/photos/kepala-madrasah.jpg",
  message:
    "Assalamu'alaikum warahmatullahi wabarakatuh. Selamat datang di laman resmi MAN Kota Batu. Kami berkomitmen menghadirkan pendidikan yang menyeimbangkan keunggulan akademik, kedalaman spiritual, dan akhlak mulia. Melalui program Riset, Olimpiade, dan Tahfidz, kami ikhtiarkan setiap siswa tumbuh menjadi generasi yang berilmu, berakhlak, dan berprestasi — siap memberi manfaat bagi umat dan bangsa.",
};

export const extracurriculars: { name: string; category: string; desc: string; icon: IconName }[] = [
  { name: "Karya Ilmiah Remaja", category: "Akademik", desc: "Wadah penelitian dan inovasi ilmiah siswa.", icon: "flask" },
  { name: "Hadrah & Banjari", category: "Keagamaan", desc: "Seni musik islami untuk syiar dan kreativitas.", icon: "mic" },
  { name: "Pramuka", category: "Kepanduan", desc: "Pembentukan karakter, disiplin, dan kepemimpinan.", icon: "leaf" },
  { name: "Pencak Silat", category: "Olahraga", desc: "Bela diri tradisional pembentuk fisik & mental.", icon: "ball" },
  { name: "English Club", category: "Bahasa", desc: "Pengembangan kemampuan berbahasa Inggris.", icon: "globe" },
  { name: "Jurnalistik & Fotografi", category: "Seni", desc: "Dokumentasi dan literasi media madrasah.", icon: "camera" },
  { name: "Robotik & Coding", category: "Teknologi", desc: "Rancang bangun robot dan pemrograman dasar.", icon: "cbt" },
  { name: "Seni Rupa & Kaligrafi", category: "Seni", desc: "Ekspresi seni visual dan kaligrafi islami.", icon: "palette" },
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

export const testimonials: { name: string; role: string; quote: string }[] = [
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
  {
    name: "Dewi Anggraini",
    role: "Alumni 2022 · Wirausaha Muda",
    quote: "Organisasi dan ekstrakurikuler di madrasah membentuk kepemimpinan saya. Terima kasih, MAKOBA.",
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
    q: "Apakah MAN Kota Batu menyediakan asrama?",
    a: "MAKOBA memfasilitasi program pembinaan, termasuk dukungan bagi siswa tahfidz. Informasi detail asrama dapat ditanyakan langsung ke pihak madrasah.",
  },
  {
    q: "Bagaimana cara mengakses rapor digital (RDM)?",
    a: "Wali murid dapat masuk ke layanan RDM melalui menu Layanan Digital menggunakan akun yang diberikan oleh wali kelas.",
  },
  {
    q: "Apa itu status Madrasah Penyelenggara Riset?",
    a: `MAKOBA ditetapkan sebagai madrasah penyelenggara riset resmi berdasarkan ${school.researchDecree}, sehingga riset menjadi bagian dari pembelajaran.`,
  },
  {
    q: "Bagaimana prosedur mengajukan izin penelitian di madrasah?",
    a: "Peneliti eksternal dapat mengajukan surat permohonan melalui layanan PPID atau menghubungi bagian tata usaha madrasah.",
  },
  {
    q: "Apakah tersedia beasiswa bagi siswa berprestasi?",
    a: "Tersedia berbagai program apresiasi dan keringanan bagi siswa berprestasi maupun kurang mampu sesuai ketentuan yang berlaku.",
  },
  {
    q: "Di mana lokasi MAN Kota Batu?",
    a: `MAKOBA beralamat di ${school.address}. Lokasi dapat dilihat pada peta di bagian Kontak.`,
  },
];

export const agenda: {
  date: string; title: string; category: "Ujian" | "Ekstrakurikuler" | "Keagamaan" | "Umum";
}[] = [
  { date: "2026-07-07", title: "Masa Pengenalan Lingkungan Madrasah (MPLM)", category: "Umum" },
  { date: "2026-07-14", title: "Awal Tahun Pelajaran 2026/2027", category: "Umum" },
  { date: "2026-07-26", title: "Peringatan Tahun Baru Hijriah 1448 H", category: "Keagamaan" },
  { date: "2026-08-09", title: "Seleksi Kelas Olimpiade", category: "Ujian" },
  { date: "2026-08-17", title: "Upacara HUT Kemerdekaan RI ke-81", category: "Umum" },
  { date: "2026-08-23", title: "Gelar Karya Riset Siswa", category: "Ekstrakurikuler" },
  { date: "2026-09-06", title: "Penilaian Tengah Semester Ganjil", category: "Ujian" },
  { date: "2026-09-20", title: "Pekan Olahraga & Seni Madrasah", category: "Ekstrakurikuler" },
];

export const socials: { name: string; href: string; icon: IconName }[] = [
  { name: "Instagram", href: "https://www.instagram.com/mankotabatuofficial/", icon: "instagram" },
  { name: "YouTube", href: "https://www.youtube.com/@mankotabatuofficial3160", icon: "youtube" },
  { name: "Facebook", href: "https://www.facebook.com/mankotabatuofficial?rdid=14F5S8fbcuWTPb2W&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FNUhA5wfroPR5aW51%2F#", icon: "facebook" },
  { name: "TikTok", href: "https://www.tiktok.com/@mankotabatuofficial?_t=8qcHwAexXH8&_r=1", icon: "tiktok" },
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

export const profile = {
  intro: [
    "Madrasah Aliyah Negeri Kota Batu (MAKOBA) adalah lembaga pendidikan menengah berciri khas agama Islam di bawah naungan Kementerian Agama. Berlokasi di jantung Kota Batu, Jawa Timur, MAKOBA berkomitmen menyelenggarakan pendidikan yang menyeimbangkan keunggulan akademik, kedalaman spiritual, dan akhlak mulia.",
    "Sebagai madrasah penyelenggara riset resmi, MAKOBA menghadirkan tiga program unggulan — Kelas Riset, Kelas Olimpiade, dan Kelas Tahfidz — yang membentuk generasi berilmu, berakhlak, dan berprestasi.",
  ],
  vision:
    "Terwujudnya madrasah yang unggul dalam imtak dan iptek, berkarakter Islami, serta mampu bersaing di tingkat nasional dan global.",
  missions: [
    "Menyelenggarakan pembelajaran yang berkualitas, kreatif, dan berbasis riset.",
    "Menanamkan nilai-nilai keislaman dan akhlak mulia dalam kehidupan sehari-hari.",
    "Mengembangkan potensi siswa di bidang akademik, olimpiade, dan tahfidz.",
    "Membangun budaya berprestasi yang kompetitif dan kolaboratif.",
    "Mewujudkan tata kelola madrasah yang bersih, profesional, dan melayani.",
  ],
  history: [
    { year: "1980", title: "Cikal Bakal Madrasah", desc: "Berdiri sebagai lembaga pendidikan Islam yang menjadi cikal bakal MAN Kota Batu." },
    { year: "1995", title: "Penegerian", desc: "Resmi menjadi Madrasah Aliyah Negeri dengan pengakuan dan dukungan pemerintah." },
    { year: "2020", title: "Madrasah Penyelenggara Riset", desc: "Ditetapkan sebagai madrasah riset melalui SK Dirjen Pendidikan Islam No. 6757 Tahun 2020." },
    { year: "2024", title: "Zona Integritas WBK", desc: "Memperkuat komitmen pelayanan bersih melalui pembangunan Zona Integritas WBK/WBBM." },
  ],
  org: [
    { name: "Drs. H. Farhadi, M.Si", role: "Kepala Madrasah", icon: "shield" as IconName },
    { name: "Waka Kurikulum", role: "Bidang Kurikulum", icon: "book" as IconName },
    { name: "Waka Kesiswaan", role: "Bidang Kesiswaan", icon: "users" as IconName },
    { name: "Waka Sarana & Prasarana", role: "Bidang Sarpras", icon: "globe" as IconName },
    { name: "Waka Humas", role: "Hubungan Masyarakat", icon: "mail" as IconName },
    { name: "Kepala Tata Usaha", role: "Administrasi & Tata Usaha", icon: "rdm" as IconName },
  ],
};

export const ppdbInfo = {
  yearLabel: "2026 / 2027",
  // Countdown target — penutupan pendaftaran gelombang 1
  deadlineISO: "2026-07-05T23:59:59+07:00",
  jalur: [
    { name: "Jalur Prestasi", icon: "trophy" as IconName, desc: "Bagi siswa dengan prestasi akademik maupun non-akademik tingkat kota hingga internasional." },
    { name: "Jalur Afirmasi", icon: "heart" as IconName, desc: "Bagi calon siswa dari keluarga kurang mampu dengan dukungan keringanan biaya." },
    { name: "Jalur Reguler", icon: "users" as IconName, desc: "Jalur umum melalui seleksi administrasi dan tes masuk madrasah." },
  ],
  timeline: [
    { date: "2026-06-10", title: "Pendaftaran Dibuka", desc: "Pendaftaran daring gelombang 1 melalui portal PPDB MAKOBA." },
    { date: "2026-07-05", title: "Penutupan Gelombang 1", desc: "Batas akhir pendaftaran dan unggah berkas gelombang 1." },
    { date: "2026-07-09", title: "Tes Seleksi", desc: "Tes potensi akademik, baca Al-Qur'an, dan wawancara." },
    { date: "2026-07-12", title: "Pengumuman Hasil", desc: "Pengumuman kelulusan diumumkan melalui portal PPDB." },
    { date: "2026-07-16", title: "Daftar Ulang", desc: "Verifikasi dan daftar ulang bagi calon siswa yang diterima." },
  ],
  requirements: [
    "Fotokopi ijazah / SKL SMP/MTs",
    "Fotokopi rapor semester 1–5",
    "Fotokopi Kartu Keluarga & akta kelahiran",
    "Pas foto terbaru",
    "Sertifikat prestasi (untuk jalur prestasi)",
  ],
};
