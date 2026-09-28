/**
 * Alamat kanonik situs.
 *
 * Dipakai `metadataBase`, JSON-LD, `robots.txt`, dan `sitemap.xml` — keempatnya
 * harus menyebut alamat yang sama. Kalau berbeda, mesin pencari menganggap satu
 * halaman yang sama ada di dua alamat.
 *
 * Bawaannya domain lomba JHIC 2026. Domain resmi madrasah
 * (mankotabatu.sch.id) sengaja tidak dipakai selama penjurian.
 *
 * Bisa ditimpa lewat env `SITE_URL` saat dipasang di domain lain. Garis miring
 * di ujung dibuang supaya penyambungan jalur tidak menghasilkan `//profil`.
 */
export const SITE_URL = (process.env.SITE_URL ?? "https://jhic2026.rezasidin.my.id").replace(/\/+$/, "");
