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

### Login tunggal

Satu form di `/masuk`. Laravel menentukan peran dari bentuk identitasnya
(mengandung `@` → admin, selain itu → NISN siswa):

```
Siswa → token Sanctum → cookie httpOnly → /siswa
Admin → tautan handoff sekali pakai → sesi Filament → /admin
```

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
- Panel admin: 9 resource CRUD + 17 halaman rangka modul
- Dasbor admin dengan susunan sama seperti portal siswa
- Sistem token desain, tipografi, dan kontras terverifikasi (termasuk mode gelap)
- Docker untuk kedua repo, diuji dari kondisi clone baru

**Tes backend: 78/78 lolos.** Pint bersih.

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

### Belum punya CRUD di panel admin

Tabel modul baru belum punya Resource Filament, jadi isinya hanya bisa diubah
lewat seeder atau tinker: `courses`, `course_modules`, `enrollments`, `exams`,
`exam_questions`, `exam_question_options`, `exam_answers`, `exam_results`,
`books`, `book_loans`, `forum_*`, `quotes`.

Yang paling terasa: **guru belum bisa membuat soal ujian lewat panel**,
padahal teks soal hasil seed sendiri berbunyi "diisi guru lewat panel admin".

### Rangka, belum berisi

15 dari 19 modul di `dashboard-admin-tour.md` masih halaman placeholder yang
menjelaskan rencana isinya: Kesiswaan, Absensi (4), Humas, Keuangan (2),
Sarpras, E-Library, My Website, Kelola ZI, Persuratan, PTSP, Buku Tatib,
Konseling, Sync Data.

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

8. **Meminjam buku belum bisa dilakukan siswa.** Pinjaman hanya bisa dibuat
   lewat seeder; tidak ada endpoint pinjam/kembalikan, dan `current_page`
   tidak pernah berubah karena buku dibaca di luar portal.

9. **Progres kursus belum terhubung ke modul.** `enrollments.progress_percentage`
   masih angka yang disetel manual, bukan hasil hitungan modul yang selesai —
   menandai modul selesai belum ada. Perlu tabel penyelesaian modul kalau mau
   angkanya jujur.

10. **Angka di beberapa kartu forum kecil karena data contohnya kecil.**
   "Active Members", "Total Topics", dan jumlah thread per kategori dihitung
   dari isi basis data, bukan angka hiasan seperti sebelumnya (`1.000`,
   `12k+`). Akan terlihat wajar begitu data asli masuk.

---

## 9. Berkas rujukan

| Berkas | Isi |
|---|---|
| `jhicccc/design-siswa.md` | Spesifikasi 8 halaman portal siswa |
| `jhicccc/jhic-prd.md` | PRD situs publik |
| `jhicccc/figma.md` | Prototipe Figma situs publik |
| `jhicccc/metamask.io-DESIGN.md` | Acuan sistem desain situs publik |
| `~/Downloads/dashboard-admin-tour.md` | 19 modul panel admin MAKOBADIG |
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
