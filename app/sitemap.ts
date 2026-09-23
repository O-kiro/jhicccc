import type { MetadataRoute } from "next";
import { getSite } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";

/**
 * Peta situs untuk mesin pencari, dibangun dari isi CMS — berita, program, dan
 * layanan baru masuk sendiri tanpa berkas ini disentuh. Disegarkan mengikuti
 * `getSite()` (60 detik), jadi berita yang baru terbit cepat terdaftar.
 *
 * Dua hal yang sengaja TIDAK ada di sini:
 *
 * 1. Portal siswa dan guru. Isinya di balik login, halamannya sudah `noindex`,
 *    dan `robots.txt` melarangnya. Portal alumni nanti juga tidak masuk.
 * 2. Halaman masuk (`/masuk`, `/login`, `/ppdb/login`). Tidak ada isi yang
 *    berguna di hasil pencarian, dan mengundang perayap ke formulir login
 *    hanya menambah lalu lintas sia-sia.
 *
 * `lastModified` hanya diisi bila tanggalnya benar-benar diketahui. Mengisi
 * semua halaman dengan "sekarang" membuat tiap perayapan seolah seluruh situs
 * baru berubah — Google lalu berhenti memercayai nilainya sama sekali.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { digitalServices, news, programs } = await getSite();

  // Berita terbaru mewakili perubahan beranda dan indeks berita: keduanya
  // menampilkan daftar berita.
  const beritaTerbaru = news.map((n) => n.date).sort().at(-1);

  const halaman: MetadataRoute.Sitemap = [
    // Beranda ditulis dengan garis miring — bentuk kanonik untuk akar situs.
    { url: `${SITE_URL}/`, lastModified: beritaTerbaru, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/profil`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/ppdb`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/ppdb/dokumen`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/berita`, lastModified: beritaTerbaru, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/layanan`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/alumni`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/kontak`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const halamanProgram: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${SITE_URL}/program/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Hanya layanan yang punya halaman detail; sisanya cuma kartu di beranda.
  const halamanLayanan: MetadataRoute.Sitemap = digitalServices.flatMap((s) =>
    s.detail
      ? [
          {
            url: `${SITE_URL}/layanan/${s.detail.slug}`,
            changeFrequency: "monthly" as const,
            priority: 0.6,
          },
        ]
      : [],
  );

  const halamanBerita: MetadataRoute.Sitemap = [...news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((n) => ({
      url: `${SITE_URL}/berita/${n.slug}`,
      lastModified: n.date,
      changeFrequency: "yearly",
      priority: 0.5,
    }));

  return [...halaman, ...halamanProgram, ...halamanLayanan, ...halamanBerita];
}
