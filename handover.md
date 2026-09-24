# Handover — Website & Portal MAN Kota Batu

Catatan serah-terima untuk sesi baru. Ditulis 20 September 2026.

---

## 1. Apa ini

Website madrasah MAN Kota Batu (MAKOBA) untuk lomba, terdiri dari tiga bagian:

1. **Situs publik** — profil, berita, PPDB, layanan digital (Next.js)
2. **Portal siswa** — `/siswa`, delapan halaman sesuai `design-siswa.md` (Next.js)
3. **Panel admin** — `/admin`, CRUD data madrasah (Laravel + Filament)

Portal siswa dan panel admin berbagi **satu gerbang masuk** di `/masuk`.

---

## 2. Dua repo terpisah

| | Lokasi lokal | GitHub | Cabang aktif |
|---|---|---|---|
| Frontend | `~/Documents/jhic26/jhicccc` | `O-kiro/jhicccc` (publik) | `feat/portal-siswa` |
| Backend | `~/Documents/jhic26/backend` | `O-kiro/jhicccc-backend` | `main` |

**Status:** keduanya sudah di-commit dan ter-push, tidak ada perubahan menggantung.
PR #1 sudah di-merge; `main` frontend isinya setara dengan cabang kerja.

Folder lokalnya bersebelahan, tapi tidak saling bergantung lewat path — keduanya
terhubung lewat port di host.

---

## 3. Menjalankan

### Docker (cara utama)

Dua terminal, masing-masing di repo-nya:

```bash
cd backend   && docker compose up
cd jhicccc   && docker compose up
```

Jalan pertama butuh beberapa menit — entrypoint mengurus `.env`, `composer install`,
`APP_KEY`, `npm ci`, build aset, migrasi, dan seed. Semua idempoten.

Tunggu sampai muncul `→ siap di ...`.

- Portal & situs publik: `http://localhost:3000`
- Panel admin: `http://localhost:8000/admin`

### Tanpa Docker

```bash
cd backend && php artisan serve          # butuh PHP 8.5, composer install, npm run build
cd jhicccc && npm run dev
```

**`npm run build` di backend wajib.** Tanpa itu tema Filament tidak ada dan panel
admin tampil tanpa gaya sama sekali. Ini jebakan yang paling sering terulang.

### Kredensial (data seed)

| Peran | Masuk dengan | Kata sandi |
|---|---|---|
| Admin | `admin@mankotabatu.sch.id` | `password` |
| Siswa | NISN `009283741` | `password` |
| Guru | `rini@mankotabatu.sch.id` atau NIP `198503152010012007` | `password` |
| Alumni | `aldian@alumni.mankotabatu.sch.id` | `password` |
| Pendaftar PPDB | Nomor `PPDB26-0001` (di `/ppdb/login`) | `password` |

Hanya satu guru contoh yang punya akses portal. Guru lain belum diberi sandi —
isi lewat **Data Master → Guru** di panel admin. Akun alumni dibuat lewat
**Alumni → Akun Alumni**; seeder mengisi enam akun contoh, semuanya bersandi
`password`.

> Di mesin pemilik proyek, NISN siswa sudah diubah lewat panel admin jadi `696969`
> dengan kata sandi yang tidak tercatat. Berkas SQLite tidak masuk Git, jadi hasil
> clone baru selalu memakai data seed di atas.

---

## 4. Stack

**Runtime:** PHP 8.5.10 · Node 22 (frontend) / 24 (backend, hanya build aset) · Docker 29.5.3

**Backend:** Laravel 13.30 · Filament 5.8.1 (membawa Livewire 4.4 + Alpine) ·
Sanctum 4.3 · Blade · Pint · PHPUnit 12.5
Aset: Vite 8.3 + Tailwind 4.3 (khusus tema admin)

**Frontend:** Next.js 16.2.9 (App Router) · React 19.2.4 · Motion 12.41 ·
Tailwind 4.3 · TypeScript 5.9

**Database:** SQLite, berkas tunggal `database/database.sqlite`, 21 tabel.

**Tipografi** (berlaku di kedua sisi):
- Plus Jakarta Sans 700/800 — heading, display, angka statistik
- Inter 400–700 — body, nav, tombol, input, label, tabel, badge
- Lora italic — kutipan hero dan sambutan saja, bukan peran struktural

**Palet:**
`#0F6E56` teal (utama) · `#185FA5` biru (sekunder) · `#BA7517` emas (aksen) ·
`#F1EFE8` krem (latar) · `#2C2C2A` abu (teks)

---

## 5. Arsitektur — keputusan penting

### Route group `(public)` di frontend

Chrome situs publik (header, footer, sticky CTA) ada di `app/(public)/layout.tsx`,
bukan root layout. Tanpa pemisahan ini, portal siswa tidak bisa punya shell
sendiri. **URL tidak berubah** — route group tidak ikut ke path.

### Portal siswa

- `app/siswa/(portal)/` — enam halaman bersidebar
- `app/siswa/login` dan `app/siswa/cbt` sengaja **di luar** group itu agar tampil
  tanpa sidebar
- `proxy.ts` menjaga `/siswa/*` (lihat jebakan #1)

### Portal guru

- `app/guru/(portal)/` — Overview, Jadwal Mengajar, Jurnal Mengajar,
  Kelas & Materi, Penilaian, Perpustakaan, Akun
- **Kerangkanya satu dengan portal siswa**: `PortalShell` menerima
  `portal="siswa" | "guru"`, lalu menu, label, dan chip profil diambil dari
  `lib/portal-nav.ts`. Mengubah tampilan shell berarti mengubah keduanya.
- **Perpustakaan identik**: isi halamannya ada di
  `app/components/portal/library-view.tsx` dan `catalogue-view.tsx`; halaman
  siswa dan guru hanya membungkusnya dengan `base` berbeda. Endpoint Laravel-nya
  pun satu (`/library`, `auth:student,teacher`).
- Endpoint khusus guru: `/api/v1/guru/*` (guard `teacher`), klien di
  `lib/api-guru.ts`
- Cookie `makoba-peran` (`siswa`/`guru`) hanya penunjuk arah untuk `proxy.ts`.
  Bukan batas keamanan: Laravel menolak token siswa di endpoint guru dan
  sebaliknya, karena provider kedua guard berbeda.

### Portal alumni

- `app/alumni/portal/` — Overview, Portal Beasiswa, Statistik & Sebaran,
  Forum Alumni, Akun. Kerangkanya `PortalShell` yang sama.
- **Alamatnya `/alumni/portal`, bukan `/alumni`**: halaman publik `/alumni`
  (etalase profil alumni) tetap ada dan terbuka untuk umum. `proxy.ts` hanya
  menjaga `/alumni/portal*`.
- **Forum alumni memakai tabel sendiri** (`alumni_forum_*`), terpisah penuh
  dari forum siswa — keputusan sadar: diskusi alumni dan siswa tidak boleh
  tercampur. Bentuk JSON-nya sengaja dibuat sama, sehingga komponen
  `NewThread`, `LikeButton`, `ReplyForm`, dan `ReplyList` dipakai dua portal
  lewat prop `base` (awalan jalur API).
- **Perpustakaan tidak diberikan ke alumni** — rutenya tetap `auth:student,teacher`.
- Angka di portal dihitung dari data: sebaran kelulusan (`alumni_outcomes`),
  katalog beasiswa (`scholarships`), dan isi forum. Tidak ada angka hiasan.

### Login tunggal

Satu form di `/masuk`. Laravel menentukan peran dari identitasnya:

- surel → akun admin lebih dulu, lalu guru, lalu alumni
- selain surel → NISN siswa lebih dulu, lalu NIP guru (NIP boleh berspasi)

```
Siswa  → token Sanctum (guard student) → cookie httpOnly → /siswa
Guru   → token Sanctum (guard teacher) → cookie httpOnly → /guru
Alumni → token Sanctum (guard alumni)  → cookie httpOnly → /alumni/portal
Admin  → tautan handoff sekali pakai   → sesi Filament   → /admin
```

Orang yang punya lebih dari satu akun dengan surel serta sandi yang sama selalu
masuk sebagai yang paling awal (admin → guru → alumni). Beri sandi berbeda bila
perlu keduanya.

Admin tidak bisa memakai token karena Filament berjalan di atas sesi, dan cookie
sesi tidak bisa dipasang lintas origin. Jembatannya: token acak 64 karakter,
**disimpan sebagai hash SHA-256**, TTL 60 detik, sekali pakai lewat `Cache::pull`,
sesi diregenerasi setelah masuk, rute dibatasi laju 10/menit.
Lihat `HandoffController` dan 8 tes di `AdminHandoffTest`.

### Token desain admin

`resources/css/filament/admin/theme.css` disusun dalam 8 bagian bernomor.
**Bagian 3 adalah satu-satunya tempat yang perlu disentuh** untuk mengubah tampilan —
lima warna dasar, dan semua turunan (tint, garis, teks sekunder, gradasi) dihitung
dengan `color-mix(in srgb, ...)`.

Ruang warna `srgb` dipilih sengaja agar hasilnya sama persis dengan angka kontras
yang sudah diverifikasi.

### Dasbor admin

Satu widget penuh (`DasborMadrasah`) yang menyalin susunan halaman Overview portal
siswa. Blade-nya dipecah per bagian di `resources/views/filament/widgets/dasbor/`.
**Nol gaya inline** — semua lewat kelas `.mk-*`.

Dua bagian tata letak ditambahkan lewat render hook karena Filament tidak
menyediakannya: judul halaman di topbar (`TOPBAR_LOGO_AFTER`) dan kartu pengguna
di dasar sidebar (`SIDEBAR_FOOTER`).

---

## 6. Jebakan yang sudah ditemukan

Semua ini sudah menghabiskan waktu sekali. Jangan mengulanginya.

### Next.js 16

1. **`middleware.ts` tidak ada lagi — namanya `proxy.ts`.** Kalau ditulis dengan nama
   lama, berkasnya tidak pernah dieksekusi dan portal terbuka untuk siapa saja.
   Tanpa error apa pun.
2. **`cookies()` sekarang async** — wajib `await`.
3. Baca `node_modules/next/dist/docs/` sebelum menulis kode. Versi ini punya
   breaking change yang tidak ada di ingatan model.

### Filament v5

4. **Filament mengompilasi CSS-nya sendiri.** Kelas utilitas Tailwind sembarangan
   (`flex`, `gap-3`) di Blade kustom belum tentu ada. Pakai kelas yang didefinisikan
   di `theme.css`, atau gaya inline.
5. **Gaya inline mengalahkan selector kelas.** Aturan hover berbasis
   `background-color` pada elemen yang latarnya ditulis inline tidak akan pernah
   berlaku. Pakai properti lain, misalnya `filter`.
6. **Warna teks menu sidebar ada di `.fi-sidebar-item-label`, bukan di tombolnya.**
   Mewarnai tombol saja tidak berpengaruh.
7. **`.fi-topbar` ADALAH elemen `<nav>`-nya**, bukan pembungkusnya.
   `.fi-topbar > nav` tidak cocok dengan apa pun.
8. **`$columnSpan = 'full'` pada widget diabaikan** — Filament v5 merender dasbor
   lewat sistem Schema, bukan grid widget lama. Solusinya override `getColumns()`
   di kelas halaman Dashboard.
9. **Widget lazy-load lewat Livewire** — tidak ada di HTML awal. Jangan simpulkan
   widget rusak dari `curl`.
10. **`.fi-sidebar-item-active` tidak ada di v5**; yang benar
    `li.fi-sidebar-item.fi-active` dengan tombol `a.fi-sidebar-item-btn`.
11. Nama kelas Filament berubah antar versi dan CSS yang salah selector **tidak
    melempar error**. Selalu verifikasi lewat computed style di browser.

### Blade

12. **`@if` yang menempel langsung setelah huruf tidak dikenali** (mis. `sesi@if`),
    dan `@endif`-nya jadi yatim — seluruh view gagal render. Susun di blok `@php`.

### Next.js ↔ Laravel

13. **`cn()` tidak bisa dipanggil dari server component** kalau diekspor dari modul
    `"use client"`. Karena itu helper kelas pindah ke `lib/styles.ts`.
14. **`route()` absolut memakai host permintaan.** Di Docker, permintaan datang dari
    `host.docker.internal` — nama yang tidak bisa dibuka browser pengguna. Tautan
    handoff dibangun dari jalur relatif + `APP_URL`.

### Basis data

**`php artisan migrate:fresh` menghapus seluruh isi basis data.** Berkas
SQLite-nya di-bind-mount dan diabaikan Git, jadi tidak ada riwayat yang bisa
dipulihkan — data yang diubah lewat panel admin (NISN, kata sandi, topik forum
yang ditulis siswa) hilang permanen. Cadangkan dulu sebelum menjalankannya:

```bash
cp database/database.sqlite "database/database.sqlite.bak-$(date +%F-%H%M)"
```

Untuk sekadar menguji seeder, pakai basis data uji: `php artisan test` memakai
SQLite di memori dan tidak menyentuh berkas ini.

**Kolom tanggal tersimpan `Y-m-d 00:00:00`**, bukan `Y-m-d`. Cari dengan
`whereDate()`. `updateOrCreate(['date' => '2026-09-22'])` tidak pernah menemukan
barisnya — lalu mencoba membuat baris baru dan menabrak indeks unik.

**Zona waktu aplikasi `Asia/Jakarta`** (`config/app.php`, bisa ditimpa
`APP_TIMEZONE`). Sampai 22 September 2026 nilainya `UTC`: "LIVE NOW" dan sesi CBT
menyala tujuh jam terlambat, dan "hari ini" masih kemarin sampai pukul 07.00 WIB.
Stempel `created_at` lama tertulis dalam UTC, jadi tampil tujuh jam lebih awal.
Di frontend, jam dibaca lewat `jamWib()` (`lib/format.ts`) karena Node di Docker
berjalan dalam UTC.

### Docker

15. **Volume bernama membuat `node_modules` ada tapi kosong**, sehingga
    `[ ! -d node_modules ]` bernilai salah dan `npm ci` terlewat. Periksa **isi**
    foldernya. Bug ini hanya muncul di clone baru, tidak di mesin yang sudah ada
    `public/build`.
16. **`docker-php-ext-install` gagal** saat membangun beberapa ekstensi sekaligus
    (`cp: can't stat 'modules/*'`). Dipakai `install-php-extensions`.
17. `vendor/` dan `node_modules/` **tidak** di-mount dari host — isinya binary khusus
    OS dan milik macOS tidak jalan di Alpine.
18. **Akhir baris CRLF merusak entrypoint di Windows.** Git di Windows mengubah
    `LF` jadi `CRLF` saat checkout; shebang jadi `#!/bin/sh\r` dan kernel mencari
    penafsir bernama `/bin/sh\r`. Pesannya menyesatkan:
    `exec /usr/local/bin/entrypoint: no such file or directory` — yang hilang
    bukan entrypoint-nya, tapi penafsirnya.
    Ditangani dua lapis: `sed -i 's/\r$//'` di Dockerfile (bekerja walau checkout
    sudah terlanjur CRLF) dan `.gitattributes` dengan `eol=lf`.
    Backend tidak pernah kena karena skeleton Laravel sudah punya
    `* text=auto eol=lf`; hanya frontend yang tidak punya `.gitattributes`.

### Aksesibilitas / warna

19. **Emas `#BA7517` gagal sebagai teks**: 3.72:1 di putih, **1.67:1 di hero teal**.
    Dipakai hanya untuk isian dan ikon. Teks emas memakai turunan:
    `#915b12` di latar terang, `#eedcc5` di hero.
20. Build tool membuat **fallback otomatis** untuk browser tanpa `color-mix()`, dan
    fallback itu memakai warna dasarnya mentah — bisa menghasilkan teks teal di atas
    latar teal. `color-mix()` didukung semua browser utama sejak 2023, jadi risikonya
    kecil, tapi nyata.

### Lingkungan kerja

21. Tangkapan layar browser **tidak bisa dipercaya** saat pane tersembunyi atau
    viewport di-emulasi lalu diperkecil — animasi membeku dan paint bisa basi.
    Ukur lewat DOM/computed style.

---

## 7. Status pekerjaan

### Selesai dan terverifikasi

- Situs publik (tidak disentuh sejak awal, tetap utuh)
- Portal siswa — 8 halaman sesuai `design-siswa.md`
- API v1, 18 endpoint: `login`, `logout`, `me`, `overview`, `report-card`,
  `report-card/pdf`, `announcements`, `courses`, `exams`, `exam-session`,
  `exam-session/answers` (POST), `exam-session/finish` (POST), `library`,
  `forum`, `forum/threads` (POST), `forum/threads/{id}`,
  `forum/threads/{id}/replies` (POST), `forum/threads/{id}/like` (POST)
- Login tunggal siswa + admin, termasuk handoff
- Panel admin: semua menu berfungsi — tidak ada lagi halaman rangka
- Dasbor admin dengan susunan sama seperti portal siswa
- Sistem token desain, tipografi, dan kontras terverifikasi (termasuk mode gelap)
- Docker untuk kedua repo, diuji dari kondisi clone baru

**Tes backend: 316/316 lolos.** Pint bersih.

### Seluruh portal siswa kini memakai API

`lib/siswa.ts` sudah dihapus. Kedelapan halaman mengambil datanya dari
Laravel; yang tersisa di kode hanya `lib/portal-nav.ts` (peta rute aplikasi,
memang bukan data madrasah).

**Tidak ada lagi tombol mati di portal siswa.** Kedelapan aksi yang dulu
kosong kini berfungsi:

| Aksi | Cara kerja |
|---|---|
| Selesai Ujian | Konfirmasi → dinilai server → nilai tampil → masuk Hasil Ujian |
| Mulai Topik Baru | Dialog berisi kategori, judul, isi |
| Buka diskusi | Halaman `/siswa/forum/[id]` — baru ada; sebelumnya 84 balasan tersimpan tapi tak terlihat |
| Balas diskusi | Formulir di halaman topik; balasan sendiri ditandai "Kamu" |
| Suka / batal suka | Sakelar, optimistik, satu suka per siswa (tabel `forum_thread_likes`) |
| Muat Diskusi Lainnya | Lewat `?diskusi=N` di URL, bukan state klien |
| Unduh Rapor PDF | Dibuat server dengan dompdf |
| Lihat Modul | Daftar modul per mapel; materi berupa tautan luar |
| Lanjutkan Membaca | Membuka tautan berkas buku |
| Dashboard Saya | Menuju `/siswa` |
| Lihat Anotasi | **Dihapus** — menyorot teks menuntut isi buku di dalam portal |

Penilaian ujian dikerjakan server dan sesi terkunci setelah dikirim: kunci
jawaban (`exam_question_options.is_correct`) tidak pernah sampai ke portal,
dijaga dua lapis (`ExamQuestionResource` dan `#[Hidden]` di model) dan diuji.

Angka suka: `forum_threads.like_count` tetap jadi angka yang ditampilkan
(nilai seed seperti 82 jadi titik awal), sedangkan `forum_thread_likes`
mencatat *siapa* yang menyukai — itu yang membuat tombolnya bisa dimatikan
dan mencegah satu siswa menyukai dua kali.

Materi modul dan berkas buku disimpan sebagai **tautan** (`course_modules.url`,
`books.url`), bukan berkas yang diunggah — itu keputusan sadar, bukan
kekurangan. Keduanya boleh kosong; portal menampilkan "Materi belum tersedia".

### Panel admin lengkap

Semua tabel punya pengelola di panel, dan ke-17 menu yang dulu rangka kini
berfungsi:

| Grup | Menu |
|---|---|
| Akademik | Kursus (+ modul, peserta), Ujian (+ soal & kunci), Hasil Ujian |
| Kesiswaan | Klasemen Poin, Buku Tatib, Catatan Kedisiplinan |
| Absensi | Rekap Bulanan (matriks buku induk), Kehadiran Harian, Guru Piket, Jurnal KBM, Live Monitoring |
| Humas | Buku Tamu, Katalog Layanan, PTSP |
| Keuangan | Master Pembayaran, Tagihan & Kasir, Keuangan Komite |
| Sarana & Prasarana | Master Ruang, Buku Induk Barang, Peminjaman & Booking |
| E-Library | Buku, Pinjaman Buku, Meja Sirkulasi |
| My Website | Pop-up, Layanan Cepat, Berita, Agenda, Program, Prestasi, Ekskul, Fasilitas, Galeri, QnA, Testimoni, Alumni |
| Lainnya | Persuratan, Konseling, Kelola ZI, Sync Data |

Tiga yang bentuknya perlu diketahui:

- **Meja Sirkulasi** memakai kolom teks biasa untuk NISN dan kode buku.
  Pembaca RFID/barcode umumnya berperilaku seperti keyboard, jadi alat
  sungguhan langsung bekerja tanpa integrasi khusus. Aturannya ada di
  `app/Services/Sirkulasi.php`.
- **Sync Data bukan sinkronisasi langsung.** Tidak ada sistem pusat (EMIS,
  dll.) yang bisa dihubungi. Isinya impor siswa dari CSV, dua tahap: periksa
  lalu terapkan. Siswa baru diberi sandi acak yang **hanya bisa diunduh sekali**
  — bukan NISN, karena portal belum punya fitur ganti sandi.
- **My Website** menggerakkan situs publik. Lihat bagian berikut.

### Peran panel admin

Tujuh peran, didefinisikan di satu tempat — `backend/app/Support/Peran.php`:

| Peran | Menu yang bisa dibuka |
|---|---|
| Admin Utama | Semua, termasuk **Pengaturan → Pengguna Panel** |
| Wakasek Kurikulum | Data Master, Akademik |
| Wakasek Kesiswaan | Data Master, Kesiswaan, Absensi |
| Guru BK | Kesiswaan, Konseling (termasuk catatan rahasia) |
| Tata Usaha | Data Master, Keuangan, Sarpras, Persuratan, Kelola ZI, Sync Data |
| Humas | Humas, Konten, My Website |
| Pustakawan | E-Library |

URL yang diketik langsung pun dibalas 403, bukan hanya menunya yang hilang.
Akun lama otomatis menjadi Admin Utama. Akun tanpa peran tidak bisa masuk.
Admin Utama terakhir tidak bisa diturunkan atau dihapus.

Akun per peran belum ada di data seed — buat lewat **Pengguna Panel**.

### Fitur siswa yang ditambahkan terakhir

- **Forum**: balas ke balasan (satu tingkat), hapus balasan sendiri
- **Akun** (`/siswa/akun`, lewat chip profil): ganti kata sandi; sesi lain dicabut
- **Katalog buku** (`/siswa/perpustakaan/katalog`): pinjam dan kembalikan sendiri
- **Kursus**: tandai modul selesai; progres dihitung dari situ

### Portal guru

Dibangun dengan isi bawaan sambil menunggu dokumen fitur guru. Menu dan isinya
bisa diubah tanpa menyentuh kerangka — lihat §5 "Portal guru".

| Menu | Isi |
|---|---|
| Overview | Sapaan, kelas diampu, sesi hari ini, jurnal tertunda, pengumuman |
| Jadwal Mengajar | Jadwal sepekan per hari, tautan kelas live |
| Jurnal Mengajar | Sesi yang sudah mulai tapi belum dicatat (7 hari ke belakang), catat materi + jumlah hadir, riwayat, ubah, hapus. Tercatat di tabel yang sama dengan modul Jurnal KBM admin |
| Kelas & Materi | Kursus yang diampu, progres rata-rata siswa terdaftar, tambah/ubah/hapus modul (tautan wajib http/https) — langsung tampil di Kursus siswa |
| Penilaian | Lembar nilai per kelas; judul + tanggal yang sama berarti menyunting. Langsung masuk Rapor Digital siswa |
| Perpustakaan | Sama persis dengan milik siswa; kuota 5 buku berlaku juga |
| Akun | Identitas + ganti kata sandi (sesi lain dicabut) |

Pendukungnya:

- `teachers` punya `password` (boleh kosong = belum diberi akses) dan
  `is_active`. Admin mengisinya di Data Master → Guru; kolom "Portal Guru"
  menunjukkan statusnya.
- `book_loans.teacher_id` baru; peminjam tepat satu dari siswa atau guru
  (dijaga model). Meja sirkulasi menerima NISN **atau NIP**; form Peminjaman
  punya pilihan peminjam guru.
- "Kelas diampu" = gabungan pasangan mapel–kelas dari jadwal **dan** kursus
  (`App\Support\Pengampuan`), karena keduanya tidak selalu diisi bersamaan.
- Menonaktifkan siswa atau guru kini ikut mencabut semua tokennya.
- Batas laju endpoint bersama memakai limiter bernama (`portal-sandi`,
  `portal-tulis`): `throttle:5,1` biasa mengunci pada ID saja, sehingga siswa #1
  dan guru #1 akan berbagi jatah.
- Sekalian diperbaiki: token yang dicabut (mis. setelah ganti sandi di perangkat
  lain) dulu membuat `/siswa` ↔ `/masuk` memantul tanpa henti. Kini
  `/masuk?expired=1` membuang cookie-nya.

### SEO: sitemap.xml dan robots.txt

`app/sitemap.ts` dibangun dari isi CMS, jadi berita, program, dan layanan baru
masuk sendiri (disegarkan 60 detik seperti `getSite()`). Diverifikasi: 22 URL,
XML sah, semuanya balas 200.

- **Portal tidak pernah masuk sitemap** — `/siswa`, `/guru`, dan nanti alumni
  ada di balik login, halamannya `noindex`, dan `robots.txt` melarangnya.
  Tambahkan portal baru ke `disallow` di `app/robots.ts` saat dibuat.
- **Halaman masuk sengaja dikeluarkan** (`/masuk`, `/login`, `/ppdb/login`):
  tidak berguna di hasil pencarian.
- **`lastModified` hanya diisi kalau tanggalnya diketahui** (berita, beranda,
  indeks berita). Mengisi semuanya dengan "sekarang" membuat Google berhenti
  memercayai nilainya.
- **Alamat kanonik satu sumber**: `lib/seo.ts` → `SITE_URL`, dipakai
  `metadataBase`, JSON-LD, `robots.txt`, dan `sitemap.xml`. Bisa ditimpa env
  `SITE_URL` untuk domain lain.

### Portal alumni (Career Center)

Dibangun mengikuti `~/Documents/jhic26/alumni.md` (4 layar Figma).

| Menu | Isi |
|---|---|
| Overview | Sapaan, 4 kartu ringkasan, 3 kartu modul, pemberitahuan madrasah |
| Portal Beasiswa | Ringkasan (program aktif, kuota, pendaftar, penyerapan) + katalog dengan penyaring kategori dan badge status |
| Statistik & Sebaran | Diagram donat + tabel rincian per kategori, penyaring tahun kelulusan |
| Forum Alumni | 3 kategori, urut terbaru/populer, pencarian, balasan bersarang satu tingkat, suka, hapus balasan sendiri |
| Akun | Identitas + ganti kata sandi |

Tabel baru: `alumni_accounts`, `scholarships`, `alumni_outcomes`, dan empat
tabel `alumni_forum_*`. Semuanya punya menu di panel admin (grup **Alumni**,
dapat diakses Admin Utama dan Humas).

Catatan angka: dokumen menyebut "8 program beasiswa" tapi katalognya memuat 6 —
yang diseed 6, dan ringkasannya menghitung sendiri. Jumlah balasan juga
dihitung dari tabel, bukan angka contoh di desain (24/48/12).

### Portal guru dilengkapi sesuai dokumennya

Menyusul `man-kota-batu-dashboard-guru.md` yang baru ditemukan setelah portal
guru dibangun. Sebelas menu sekarang:

| Menu | Catatan |
|---|---|
| Overview, Jadwal Mengajar, Jurnal Mengajar, Kelas & Materi, Penilaian, Perpustakaan, Akun | sudah ada sejak awal |
| **Modul Pembelajaran** | modul ajar sendiri / rekan sejawat / arsip, tautan berkas wajib http(s) |
| **Bahan Ajar & LKPD** | koleksi pribadi, isinya ditautkan dari Drive |
| **Jurnal Harian** | kegiatan di luar jam mengajar, boleh dilampiri bukti foto |
| **RDM** | unggah berkas rapor per kelas + catatan guru untuk siswa |
| **Lapor Tatib** | laporan poin kedisiplinan, masuk ke tabel modul Kesiswaan |

- **Catatan di RDM memakai tabel `teacher_feedback`** yang sama dengan
  "Catatan Guru" di Rapor Digital siswa — yang ditulis guru langsung terbaca
  siswa.
- **Poin tatib disalin saat dilaporkan**, bukan dibaca ulang dari aturannya:
  mengubah bobot aturan kelak tidak menulis ulang riwayat.
- **Buku tatib kini ikut diseed** (9 aturan). Tanpa itu menu Lapor Tatib tidak
  punya apa pun untuk dipilih — basis data lama memang kosong.
- **Batas unggahan PHP dinaikkan ke 20 MB** lewat `Dockerfile`. Bawaan 2 MB
  membuat unggahan gagal tanpa pesan yang jelas: PHP membuang berkasnya
  sebelum Laravel sempat memvalidasi. **Perlu `docker compose up --build`.**

### Unggah berkas PPDB kini sungguhan

Sebelumnya `/login` dan `/ppdb/dokumen` hanya tiruan: login menerima nama dan
sandi apa pun, dan tombol kirim hanya mengganti tampilan tanpa menyimpan
berkas. Sekarang:

- **Akun dibuat panitia** di **PPDB → Pendaftar PPDB** (nomor pendaftaran +
  kata sandi). Nomor berikutnya diusulkan otomatis (`PPDB26-0007`).
- Calon siswa masuk di `/ppdb/login`, mengunggah PDF per jenis berkas
  (maks 5 MB), dan melihat statusnya: menunggu, diterima, atau perlu diganti
  beserta alasan dari panitia.
- **Satu jenis berkas satu baris**: mengunggah ulang mengganti berkas lama,
  menghapus berkas lamanya dari penyimpanan, dan mengembalikan status ke
  "menunggu".
- Berkas wajib mengikuti jalur: Sertifikat Prestasi hanya wajib untuk jalur
  Prestasi.
- Panitia memverifikasi lewat relation manager di panel; alasan penolakan
  langsung terbaca calon siswa.
- Guard kelima (`ppdb`) dengan cookie peran `ppdb`; `/ppdb` dan `/ppdb/login`
  tetap terbuka untuk umum, hanya `/ppdb/dokumen` yang dijaga.

### Lonceng pengumuman berfungsi

Tombol lonceng di topbar ketiga portal dulu hiasan tanpa aksi, lengkap dengan
titik merah palsu. Sekarang membuka daftar pengumuman (data yang sudah ikut
terkirim bersama data portal, jadi tanpa permintaan jaringan baru), dan titik
merahnya hanya muncul bila ada pengumuman terbit dalam 3 hari terakhir.

### Situs publik kini dikelola lewat CMS

Sebelas daftar di `lib/content.ts` pindah ke basis data dan dibaca lewat
`lib/site.ts` → `GET /api/v1/public/site` (tanpa token). Bentuk responsnya
sengaja sama persis dengan ekspor `lib/content.ts`, jadi komponen situs tidak
tahu dari mana datanya datang.

- **Perubahan di admin tampil seketika**: Laravel memanggil webhook
  `POST /api/revalidate` setiap konten disimpan atau dihapus. Diukur 0,4 detik.
  Kalau webhook gagal atau belum dikonfigurasi, situs tetap menyusul sendiri
  dalam ≤ 60 detik.
- **Gambar bisa diunggah** di Berita dan Galeri. Unggahan disajikan sebagai
  `/storage/...`, yang diteruskan Next.js ke backend (`next.config.ts`).
- **Kalau API mati, situs tetap hidup** dengan isi bawaan `lib/content.ts`, dan
  log server mencetak `[site] CMS tidak bisa dibaca …`. `next build` juga tetap
  berhasil tanpa backend.
- **Mengedit daftar-daftar itu di `lib/content.ts` tidak mengubah situs** selama
  API berjalan. Berkas itu kini cadangan dan sumber isi awal saja. Identitas
  sekolah, statistik, sambutan kepala, navigasi, profil, dan info PPDB masih
  dibaca langsung dari sana.
- Isi awal CMS diekspor langsung dari `lib/content.ts` ke
  `backend/database/seeders/data/situs.json` — tidak diketik ulang. Ada tes yang
  membuktikan API mengembalikan isi yang identik.
- Satu perbedaan yang disengaja: **berita diurutkan berdasarkan tanggal**, jadi
  berita baru otomatis jadi berita utama. Dulu urutannya manual; dua berita
  terakhir kini bertukar tempat. Galeri dan prestasi tetap mengikuti urutan
  manual (bisa diseret di panel).

---

## 8. Utang teknis

1. **4 error lint di frontend, sudah ada sejak sebelum semua pekerjaan ini.**
   Tiga `react-hooks/rules-of-hooks` di `app/components/site-header.tsx`
   (useEffect setelah early return) dan satu `no-html-link-for-pages` di
   `app/components/achievements.tsx`. Dikonfirmasi ada di commit `850e287`.
   Sengaja tidak disentuh agar diff tetap fokus.

2. **Komentar palet di `app/globals.css` tidak cocok dengan nilainya** — komentarnya
   menulis `#185FA5`, nilainya `#1f5faf`.

3. **Frontend dan admin memakai nilai palet yang sedikit berbeda.** Admin sudah
   memakai palet spesifikasi (`#F1EFE8`, `#2C2C2A`, `#185FA5`), frontend masih
   (`#f3f1e9`, `#201f1d`, `#1f5faf`). Selisihnya tipis tapi ada.

4. **Tidak ada teks Arab yang didukung.** Konten penuh istilah keagamaan
   (Quran Hadist, Tahfidz, Akidah Akhlak). Kalau nanti ada aksara Arab, browser
   jatuh ke font sistem. Amiri direkomendasikan tapi belum dipasang.

5. **SQLite hanya melayani satu penulis dalam satu waktu.** Cukup untuk lomba;
   akan terasa kalau banyak guru input nilai bersamaan. Pindah ke MySQL/PostgreSQL
   tinggal ganti konfigurasi dan tambah satu service di Compose.

6. **Repo frontend publik.** Tidak ada kredensial yang pernah ter-commit
   (`.env` diabaikan di kedua repo), tapi perlu dijaga.

7. **Token GitHub lama pernah tertulis polos** di URL remote `.git/config`.
   Sudah dibersihkan dari remote. Pastikan token itu sudah dicabut di
   https://github.com/settings/tokens.

8. **Angka di beberapa kartu forum kecil karena data contohnya kecil.**
   "Active Members", "Total Topics", dan jumlah thread per kategori dihitung
   dari isi basis data, bukan angka hiasan seperti sebelumnya (`1.000`,
   `12k+`). Akan terlihat wajar begitu data asli masuk.

9. **Build tanpa backend mencetak puluhan peringatan `[site]`** — satu per
    halaman yang dibangun. Tidak berbahaya, tapi bising di log CI.

---

10. **Rahasia webhook revalidasi di `compose.yaml` hanya untuk pengembangan.**
   Kedua repo publik, jadi nilainya bisa dibaca siapa saja. Di server
   sungguhan ganti `SITUS_REVALIDATE_SECRET` (backend) dan `REVALIDATE_SECRET`
   (frontend) dengan nilai yang sama dan rahasia.

11. **Catatan konseling rahasia tidak terlihat oleh Admin Utama.** Disengaja:
   hanya peran Guru BK yang memuatnya. Admin Utama yang perlu membukanya harus
   memberi dirinya peran BK lewat menu Pengguna Panel.

12. **Progres kursus lama bergeser beberapa poin** setelah dikonversi jadi modul
   selesai: 72% dari 12 modul bukan bilangan bulat, jadi menjadi 9/12 = 75%.

13. **Isi portal guru belum mengikuti dokumen resmi** — dokumennya menyusul.
   Menu saat ini pilihan bawaan yang memakai tabel yang sudah ada.

14. **Data contoh jadwal dan kursus tidak konsisten**: jadwal Fiqih diampu
   Ust. H. Abdurrahman, kursus Fiqih diampu Ani Nur Aisyah. Portal guru
   menampilkannya apa adanya — masing-masing melihat kelasnya di menu berbeda.

15. **Pesan 422 Laravel masih berakhiran "(and 1 more error)"** dalam bahasa
   Inggris. Formulir portal menampilkan galat per kolom, jadi jarang terlihat.

16. **Portal guru punya 11 menu, dokumennya 10.** "Kelas & Materi" (materi
   kursus yang dilihat siswa) dipertahankan di samping "Modul Pembelajaran"
   (perangkat ajar guru) karena keduanya hal yang berbeda. "Daftar Nilai" di
   dokumen memakai daftar kelas lebih dulu; di sini kelas dipilih lewat chip
   di halaman Penilaian.

17. **Alumni belum bisa mendaftar sendiri.** Akunnya dibuat admin, sama seperti
   guru. Kalau nanti perlu pendaftaran mandiri, butuh verifikasi data lulusan
   supaya orang luar tidak bisa mengaku alumni.

18. **Rekap sebaran disimpan sebagai agregat per tahun**, bukan per orang.
   Cukup untuk diagram dan tabel, tapi tidak bisa menjawab "alumni A sekarang
   di mana".

19. **Batas memori pengujian dinaikkan ke 512M** di `phpunit.xml`. Tes render
   PDF rapor memakai dompdf yang rakus memori; dengan 128M bawaan PHP, suite
   penuh berhenti di tengah jalan.

20. **Belum ada satu pun tes di frontend.** Backend 316 tes, frontend nol.
   Justru bug seperti tombol PPDB yang tidak mengirim apa pun tidak akan
   ketahuan sendiri tanpa tes.

21. **Pendaftar PPDB tidak bisa mendaftar sendiri.** Akunnya dibuat panitia,
   sama seperti guru dan alumni. Swa-daftar butuh verifikasi identitas supaya
   orang luar tidak membuat akun asal-asalan.

22. **Nama menu di peta situs dokumen berbeda dengan aplikasi** di sembilan
   tempat (mis. "Kelola Situs" vs "My Website"). Disengaja agar peta situs
   enak dibaca juri; kalau mau seragam, ganti label menunya di panel.

---

## 9. Berkas rujukan

| Berkas | Isi |
|---|---|
| `jhicccc/design-siswa.md` | Spesifikasi 8 halaman portal siswa |
| `jhicccc/jhic-prd.md` | PRD situs publik |
| `jhicccc/figma.md` | Prototipe Figma situs publik |
| `jhicccc/metamask.io-DESIGN.md` | Acuan sistem desain situs publik |
| `~/Downloads/dashboard-admin-tour.md` | 19 modul panel admin MAKOBADIG |
| `~/Documents/jhic26/man-kota-batu-dashboard-guru.md` | 10 layar Portal Guru (Figma) — belum diikuti penuh |
| `~/Documents/jhic26/alumni.md` | 4 layar Portal Alumni (Figma) — sudah diikuti |
| `backend/AGENTS.md` | Panduan Laravel Boost — **wajib dibaca sebelum ubah backend** |
| `jhicccc/AGENTS.md` | Peringatan breaking change Next.js |

---

## 10. Kalau melanjutkan

Urutan yang masuk akal:

1. Sambungkan modul berikutnya ke backend — **Kursus** paling sederhana
   (tabel `courses` + `enrollments` sudah ada), pola API-nya tinggal meniru
   `OverviewController` dan `ReportCardController`.
2. Samakan palet frontend dengan admin (utang #3), sekalian perbaiki komentar
   yang salah (utang #2).
3. Bereskan 4 error lint (utang #1) — terpisah, agar diff-nya bersih.

Sebelum menulis kode backend: baca `backend/AGENTS.md`.
Sebelum menulis kode frontend: baca dokumentasi Next di `node_modules/next/dist/docs/`.
