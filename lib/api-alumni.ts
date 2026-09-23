/**
 * Klien API Portal Alumni — endpoint /alumni/* di Laravel (guard "alumni").
 *
 * Ganti sandi dan keluar memakai endpoint bersama di lib/api.ts. Perpustakaan
 * tidak ada di sini: itu milik portal siswa dan guru.
 */

import { cache } from "react";
import type { IconName } from "@/lib/content";
import { authedGet, type ApiAnnouncement, type ApiReply, type ApiThread, type ApiTone } from "@/lib/api";

export type ApiAlumni = {
  id: number;
  name: string;
  email: string;
  graduation_year: number;
  occupation: string | null;
  /** "Alumni 2019" — dipakai chip profil dan penulis topik. */
  angkatan: string;
};

export type ApiAlumniOverview = {
  alumni: ApiAlumni;
  summary: {
    alumni_terdata: number;
    tahun: number | null;
    lanjut_studi_negeri: number;
    lanjut_studi_negeri_persen: number;
    program_beasiswa: number;
    kuota_beasiswa: number;
    topik_forum: number;
    anggota_forum: number;
  };
  announcements: ApiAnnouncement[];
};

export type ApiBeasiswa = {
  summary: {
    program_aktif: number;
    program_total: number;
    kuota: number;
    pendaftar: number;
    terverifikasi: number;
    penyerapan: number;
    sisa_kuota: number;
  };
  categories: string[];
  /** Kategori yang sedang disaring; null berarti semua. */
  selected: string | null;
  scholarships: {
    id: number;
    category: string;
    name: string;
    quota: number;
    benefits: string | null;
    target: string | null;
    deadline: string | null;
    status: "dibuka" | "segera_ditutup" | "ditutup";
    status_label: string;
    url: string | null;
  }[];
};

export type ApiSebaran = {
  years: number[];
  year: number | null;
  total: number;
  outcomes: {
    category: string;
    label: string;
    tone: ApiTone | "muted";
    students: number;
    percent: number;
    note: string | null;
  }[];
};

/** Sama bentuknya dengan forum siswa, ditambah angkatan penulisnya. */
export type ApiAlumniThread = ApiThread & { author_note: string };

export type ApiAlumniReply = ApiReply & { author_note: string | null };

export type ApiAlumniForum = {
  categories: { id: number; name: string; desc: string; icon: IconName; tone: ApiTone; threads: number }[];
  threads: ApiAlumniThread[];
  sort: "terbaru" | "populer";
  query: string | null;
  threads_shown: number;
  threads_total: number;
  stats: { value: string; label: string }[];
  trending: { tag: string; title: string }[];
  top_contributors: { name: string; posts: number }[];
};

export type ApiAlumniForumThread = {
  thread: ApiAlumniThread;
  replies: ApiAlumniReply[];
};

/** Di-cache per render: layout (sidebar) dan beranda berbagi satu permintaan. */
export const getAlumniOverview = cache(
  (): Promise<ApiAlumniOverview> => authedGet<ApiAlumniOverview>("/alumni/overview"),
);

export const getAlumniMe = cache((): Promise<ApiAlumni> => authedGet<ApiAlumni>("/alumni/me"));

export const getBeasiswa = cache(
  (kategori?: string): Promise<ApiBeasiswa> =>
    authedGet<ApiBeasiswa>(`/alumni/beasiswa${kategori ? `?kategori=${encodeURIComponent(kategori)}` : ""}`),
);

export const getSebaran = cache(
  (tahun?: number): Promise<ApiSebaran> =>
    authedGet<ApiSebaran>(`/alumni/statistik${tahun ? `?tahun=${tahun}` : ""}`),
);

export const getAlumniForum = cache(
  (opsi: { threads?: number; urut?: string; q?: string } = {}): Promise<ApiAlumniForum> => {
    const p = new URLSearchParams();
    if (opsi.threads) p.set("threads", String(opsi.threads));
    if (opsi.urut === "populer") p.set("urut", "populer");
    if (opsi.q) p.set("q", opsi.q);
    const qs = p.toString();
    return authedGet<ApiAlumniForum>(`/alumni/forum${qs ? `?${qs}` : ""}`);
  },
);

/** Melempar ApiError 404 bila topiknya sudah dihapus. */
export const getAlumniThread = cache(
  (id: number): Promise<ApiAlumniForumThread> =>
    authedGet<ApiAlumniForumThread>(`/alumni/forum/threads/${id}`),
);
