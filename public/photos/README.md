# Foto Website MAKOBA

Taruh file foto di folder ini dengan **nama persis** seperti daftar di bawah,
lalu foto otomatis tampil menggantikan kotak pastel placeholder-nya.
Format `.jpg` (kalau pakai `.png`/`.webp`, sesuaikan juga path-nya di `lib/content.ts`).
Ukuran ideal: sisi terpanjang ±1600px, di bawah ~1–2 MB (Next.js mengoptimasi otomatis).

## Berita (tampil di beranda, /berita, dan halaman artikel — rasio ideal 16:9)

- [ ] `berita-medali-emas.jpg` — Medali Emas Riset Sains Nasional
- [ ] `berita-ppdb-dibuka.jpg` — Pembukaan PPDB 2026/2027
- [ ] `berita-wisuda-tahfidz.jpg` — Wisuda Tahfidz Angkatan 7
- [ ] `berita-workshop-kti.jpg` — Workshop Karya Ilmiah

## Tentang MAKOBA (rasio ideal 4:3)

- [ ] `gedung-madrasah.jpg` — foto fisik gedung MAN Kota Batu

## Kepala Madrasah (section Sambutan — rasio ideal 4:5, potret)

- [ ] `kepala-madrasah.jpg` — Drs. H. Farhadi, M.Si, foto formal berlatar putih

## Fasilitas (kartu foto — rasio ideal 16:9, bagian bawah tertutup teks)

- [ ] `fasilitas-laboratorium.jpg` — Laboratorium Riset
- [ ] `fasilitas-masjid.jpg` — Masjid Madrasah
- [ ] `fasilitas-perpustakaan.jpg` — Perpustakaan Modern
- [ ] `fasilitas-kelas.jpg` — Ruang Kelas Smart
- [ ] `fasilitas-lapangan.jpg` — Lapangan Olahraga
- [ ] `fasilitas-aula.jpg` — Aula Serbaguna

## Testimoni (foto profil bulat — rasio 1:1)

- [ ] `testimoni-ellll.jpg` — ELLLL
- [ ] `testimoni-hanifah.jpg` — Hanifah Salsabila
- [ ] `testimoni-sutrisno.jpg` — Bapak Sutrisno
- [ ] `testimoni-iqbal.jpg` — Muhammad Iqbal

## Galeri (masonry + lightbox — foto dipotong mengikuti tinggi kartu)

- [ ] `galeri-hari-santri.jpg` — Upacara Hari Santri Nasional
- [ ] `galeri-pekan-riset.jpg` — Pekan Riset & Pameran Karya
- [ ] `galeri-wisuda-tahfidz.jpg` — Wisuda Tahfidz Angkatan VII
- [ ] `galeri-robotik.jpg` — Kompetisi Robotik Internal
- [ ] `galeri-pentas-seni.jpg` — Class Meeting & Pentas Seni
- [ ] `galeri-studi-lapangan.jpg` — Studi Lapangan Kelas Riset

Path-nya sudah terpasang di `lib/content.ts` (field `image` / `photo` /
`buildingPhoto`) dan di data awal CMS. Berita, galeri, fasilitas, dan testimoni
juga bisa diberi foto lewat unggahan di panel admin → My Website.
Selama file belum ada, website tetap aman — placeholder pastel yang tampil.
