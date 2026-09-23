import type { MetadataRoute } from "next";

const BASE = "https://mankotabatu.sch.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Portal siswa dan guru adalah area akun — jangan diindeks.
      // Tambahkan portal berikutnya (mis. alumni) di sini saat dibuat.
      disallow: ["/siswa", "/guru"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
