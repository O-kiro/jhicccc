import type { MetadataRoute } from "next";

const BASE = "https://mankotabatu.sch.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Portal siswa adalah area akun — jangan diindeks.
      disallow: "/siswa",
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
