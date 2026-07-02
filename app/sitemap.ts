import type { MetadataRoute } from "next";
import { digitalServices, news, programs } from "@/lib/content";

const BASE = "https://mankotabatu.sch.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/profil`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/ppdb`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/berita`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/layanan`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/alumni`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/kontak`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const programPages: MetadataRoute.Sitemap = programs.map((p) => ({
    url: `${BASE}/program/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const servicePages: MetadataRoute.Sitemap = digitalServices.flatMap((s) =>
    s.detail
      ? [{
          url: `${BASE}/layanan/${s.detail.slug}`,
          lastModified: now,
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }]
      : [],
  );

  const newsPages: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${BASE}/berita/${n.slug}`,
    lastModified: new Date(n.date),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticPages, ...programPages, ...servicePages, ...newsPages];
}
