/**
 * Alamat kanonik situs.
 *
 * Dipakai `metadataBase`, JSON-LD, `robots.txt`, dan `sitemap.xml` — keempatnya
 * harus menyebut alamat yang sama. Kalau berbeda, mesin pencari menganggap satu
 * halaman yang sama ada di dua alamat.
 *
 * Bisa ditimpa lewat env `SITE_URL` saat dipasang di domain lain (pratinjau,
 * staging). Garis miring di ujung dibuang supaya penyambungan jalur tidak
 * menghasilkan `//profil`.
 */
export const SITE_URL = (process.env.SITE_URL ?? "https://mankotabatu.sch.id").replace(/\/+$/, "");
