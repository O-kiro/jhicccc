import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Portal siswa, guru, alumni, dan halaman berkas PPDB adalah area akun —
      // jangan diindeks. Aturannya mencocokkan awalan jalur, jadi yang ditulis
      // `/alumni/portal` dan `/ppdb/dokumen`, bukan `/alumni` atau `/ppdb`:
      // keduanya halaman publik. Tambahkan portal berikutnya di sini saat dibuat.
      disallow: ["/siswa", "/guru", "/alumni/portal", "/ppdb/dokumen"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
