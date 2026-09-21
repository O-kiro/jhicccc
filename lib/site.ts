/**
 * Konten situs publik dari CMS (menu My Website di panel admin).
 *
 * Diambil dari /api/v1/public/site dan disegarkan paling lama tiap 60 detik,
 * jadi perubahan di panel admin muncul di situs dalam semenit.
 *
 * CADANGAN: kalau API tidak bisa dihubungi, situs memakai isi bawaan di
 * lib/content.ts. Disengaja — situs sekolah yang mati karena server admin
 * bermasalah jauh lebih buruk daripada konten yang telat semenit. Ini juga
 * yang membuat `next build` tetap berhasil walau backend belum jalan.
 * Setiap kali cadangan dipakai, peringatan tercetak di log server.
 */

import { cache } from "react";
import {
  achievements,
  agenda,
  alumni,
  digitalServices,
  extracurriculars,
  facilities,
  faqs,
  galleryItems,
  news,
  programs,
  testimonials,
} from "@/lib/content";

const API_URL = process.env.API_URL ?? "http://localhost:8000/api/v1";

/** Detik sebelum konten diambil ulang dari CMS. */
const SEGAR_SETIAP = 60;

export type SitePopup = {
  id: number;
  title: string;
  body: string;
  linkUrl: string | null;
  linkLabel: string | null;
};

/** Bentuknya sama persis dengan ekspor lib/content.ts — lihat PublicSiteController. */
export type Site = {
  digitalServices: typeof digitalServices;
  news: typeof news;
  agenda: typeof agenda;
  programs: typeof programs;
  achievements: typeof achievements;
  extracurriculars: typeof extracurriculars;
  facilities: typeof facilities;
  galleryItems: typeof galleryItems;
  faqs: typeof faqs;
  testimonials: typeof testimonials;
  alumni: typeof alumni;
  popup: SitePopup | null;
};

const CADANGAN: Site = {
  digitalServices,
  news,
  agenda,
  programs,
  achievements,
  extracurriculars,
  facilities,
  galleryItems,
  faqs,
  testimonials,
  alumni,
  popup: null,
};

/** Kunci yang wajib ada; respons tanpa salah satunya dianggap rusak. */
const KUNCI = Object.keys(CADANGAN) as (keyof Site)[];

function utuh(data: unknown): data is Site {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;
  return KUNCI.every((k) => (k === "popup" ? k in d : Array.isArray(d[k])));
}

/**
 * Di-cache per render: header, halaman, dan sitemap berbagi satu permintaan.
 * Lintas permintaan, fetch cache Next.js yang menahannya selama SEGAR_SETIAP.
 */
export const getSite = cache(async (): Promise<Site> => {
  try {
    const res = await fetch(`${API_URL}/public/site`, {
      headers: { Accept: "application/json" },
      next: { revalidate: SEGAR_SETIAP, tags: ["site"] },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: unknown = await res.json();

    if (!utuh(data)) throw new Error("bentuk respons tidak dikenali");

    return data;
  } catch (error) {
    console.warn(
      `[site] CMS tidak bisa dibaca (${error instanceof Error ? error.message : error}); memakai konten bawaan lib/content.ts.`,
    );
    return CADANGAN;
  }
});

/*
 * Pencari per slug untuk halaman detail. Membaca getSite(), jadi ikut
 * cadangan yang sama. Halaman detail tetap dibangun statis lewat
 * generateStaticParams, tetapi karena dynamicParams tidak dimatikan, isi baru
 * dari CMS yang belum ada saat build tetap bisa dibuka — dirender saat
 * pertama diminta.
 */

export async function getNewsArticle(slug: string) {
  return (await getSite()).news.find((n) => n.slug === slug);
}

export async function getProgram(slug: string) {
  return (await getSite()).programs.find((p) => p.slug === slug);
}

export async function getService(slug: string) {
  return (await getSite()).digitalServices.find((s) => s.detail?.slug === slug);
}

export type SearchItem = { label: string; group: string; href: string };

/**
 * Indeks modal pencarian. Disusun di server lalu dikirim sebagai daftar
 * ringkas — bukan seluruh konten — supaya isi berita tidak ikut terkirim ke
 * peramban hanya demi pencarian judul.
 */
export function buildSearchIndex(site: Site): SearchItem[] {
  return [
    ...site.programs.map((p) => ({ label: p.name, group: "Program", href: `/program/${p.slug}` })),
    ...site.digitalServices.map((s) => ({ label: s.name, group: "Layanan Digital", href: s.href })),
    ...site.achievements.map((a) => ({ label: a.title, group: "Prestasi", href: "/#prestasi" })),
    ...site.news.map((n) => ({ label: n.title, group: "Berita", href: `/berita/${n.slug}` })),
    ...site.extracurriculars.map((e) => ({ label: e.name, group: "Ekstrakurikuler", href: "/#ekskul" })),
    ...site.facilities.map((f) => ({ label: f.name, group: "Fasilitas", href: "/#fasilitas" })),
    ...site.agenda.map((a) => ({ label: a.title, group: "Agenda", href: "/#agenda" })),
    ...site.faqs.map((f) => ({ label: f.q, group: "FAQ", href: "/#faq" })),
  ];
}
