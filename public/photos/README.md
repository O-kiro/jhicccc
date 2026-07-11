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

## Kepala Madrasah (section Sambutan — rasio ideal 4:5, potret)

- [ ] `kepala-madrasah.jpg` — Drs. H. Farhadi, M.Si

## Galeri (grid + lightbox — rasio ideal 4:3)

- [ ] `galeri-hari-santri.jpg` — Upacara Hari Santri Nasional
- [ ] `galeri-pekan-riset.jpg` — Pekan Riset & Pameran Karya
- [ ] `galeri-wisuda-tahfidz.jpg` — Wisuda Tahfidz Angkatan VII
- [ ] `galeri-robotik.jpg` — Kompetisi Robotik Internal
- [ ] `galeri-pentas-seni.jpg` — Class Meeting & Pentas Seni
- [ ] `galeri-studi-lapangan.jpg` — Studi Lapangan Kelas Riset

Path-nya sudah terpasang di `lib/content.ts` (field `image` / `photo`).
Selama file belum ada, website tetap aman — placeholder pastel yang tampil.
