import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Portal siswa dan guru adalah area akun — jangan diindeks.
      // Tambahkan portal berikutnya (mis. alumni) di sini saat dibuat.
      disallow: ["/siswa", "/guru"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
