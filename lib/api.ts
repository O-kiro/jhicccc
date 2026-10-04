/**
 * Klien API portal siswa (dan bagian yang dipakai bersama portal guru —
 * perpustakaan dan ganti sandi). Endpoint khusus guru ada di lib/api-guru.ts.
 *
 * Semua pemanggilan berjalan di server: token disimpan dalam cookie httpOnly
 * sehingga tidak pernah terbaca JavaScript browser, dan base URL API tidak
 * ikut terkirim ke klien.
 */

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { IconName } from "@/lib/content";
import type { ApiBeasiswa } from "@/lib/api-alumni";

export const TOKEN_COOKIE = "makoba-token";

/**
 * Portal milik token di atas: "siswa", "guru", atau "alumni". Dipakai proxy.ts
 * untuk mengarahkan ke portal yang benar — bukan batas keamanan. Laravel
 * tetap menolak token siswa di endpoint guru dan sebaliknya.
 */
export const ROLE_COOKIE = "makoba-peran";

export type PortalRole = "siswa" | "guru" | "alumni";

const API_URL = process.env.API_URL ?? "http://localhost:8000/api/v1";

/** Dilempar saat API membalas selain 2xx, supaya pemanggil bisa membedakan sebabnya. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiStudent = {
  id: number;
  nisn: string;
  name: string;
  kelas: string | null;
  academic_year: string | null;
};

export type ApiScheduleItem = {
  id: number;
  subject: string;
  /** Warna bidang studi, untuk garis tepi kartu jadwal. */
  tone: ApiTone;
  teacher: string;
  start: string;
  end: string;
  meeting_url: string | null;
  live: boolean;
};

export type ApiAnnouncement = {
  id: number;
  title: string;
  body: string;
  published_at: string | null;
};

export type ApiOverview = {
  student: ApiStudent;
  /** Kutipan sapaan; null bila admin menonaktifkan semuanya. */
  quote: { body: string; source: string | null } | null;
  summary: {
    average_score: number | null;
    attendance_percentage: number | null;
    /** Modul kelas yang belum ditandai selesai oleh siswa ini. */
    active_tasks: number;
  };
  today_schedule: ApiScheduleItem[];
  announcements: ApiAnnouncement[];
  /** Buku pinjaman aktif untuk widget sidebar; null bila tidak meminjam. */
  continue_reading: ApiLoan | null;
};

/** Warna aksen yang dipakai kartu portal; sepadan dengan peta di lib/styles. */
export type ApiTone = "teal" | "blue" | "gold";

export type ApiCourses = {
  semester: string | null;
  filters: string[];
  courses: {
    id: number;
    name: string;
    teacher: string | null;
    /** Foto profil guru (/storage/...); null berarti tampil inisial. */
    teacher_photo: string | null;
    category: string;
    icon: IconName;
    tone: ApiTone;
    modules: number;
    progress: number;
    module_list: {
      id: number;
      number: number;
      title: string;
      description: string | null;
      /** Null berarti materinya belum ditautkan guru. */
      url: string | null;
      /** Sudah ditandai selesai oleh siswa ini; menentukan progres kursus. */
      completed: boolean;
    }[];
  }[];
};

export type ApiLoan = {
  id: number;
  book_id: number;
  title: string;
  author: string | null;
  description: string | null;
  /** Tautan ke berkas buku; null berarti belum ditautkan pustakawan. */
  url: string | null;
  /** Sampul unggahan admin; null berarti portal menggambar sampul berwarna. */
  cover: string | null;
  badge: string;
  due_in_days: number;
  current_page: number;
  total_pages: number;
  progress: number;
};

export type ApiLibrary = {
  categories: { name: string; count: string; icon: IconName; tone: ApiTone }[];
  new_arrivals: {
    id: number;
    title: string;
    author: string | null;
    description: string | null;
    url: string | null;
    cover: string | null;
    category: string;
    tone: ApiTone;
    total_pages: number;
  }[];
  loans: ApiLoan[];
  loan_quota: number;
  loan_durations: number[];
  continue_reading: ApiLoan | null;
};

export type ApiCatalogue = {
  /** Terisi hanya bila katalog diminta per halaman (?page). */
  pagination: { page: number; last_page: number; total: number } | null;
  books: (ApiLibrary["new_arrivals"][number] & { borrowed_by_me: boolean })[];
  categories: string[];
  active_loans: number;
  loan_quota: number;
  /** Pilihan lama pinjam dalam hari, sama dengan meja sirkulasi. */
  durations: number[];
};

export type ApiThread = {
  id: number;
  category: string;
  title: string;
  author: string;
  when: string;
  excerpt: string;
  replies: number;
  likes: number;
  /** Null saat relasi suka tidak dimuat; selalu terisi di daftar dan detail. */
  liked_by_me: boolean | null;
};

export type ApiReply = {
  id: number;
  parent_id: number | null;
  /** Dihapus penulisnya; tampil sebagai penanda hanya bila masih ada anak. */
  is_deleted: boolean;
  author: string | null;
  body: string | null;
  when: string | null;
  is_mine: boolean;
  /** Satu tingkat sarang saja; anak tidak punya anak. */
  children: ApiReply[];
};

export type ApiForumThread = {
  thread: ApiThread;
  replies: ApiReply[];
};

export type ApiForum = {
  categories: {
    id: number;
    name: string;
    desc: string;
    icon: IconName;
    tone: ApiTone;
    threads: number;
  }[];
  threads: ApiThread[];
  /** Dipakai menyembunyikan "Muat Diskusi Lainnya" saat sudah habis. */
  threads_shown: number;
  /** Jumlah diskusi yang cocok dengan pencarian (atau seluruh forum). */
  threads_total: number;
  sort: "terbaru" | "populer";
  q: string | null;
  stats: { value: string; label: string }[];
  trending: { tag: string; title: string }[];
  top_contributors: { name: string; posts: number }[];
};

export type ApiRanking = {
  /** Excel ranking kelas terbaru yang ditandai guru; null bila belum ada. */
  sheet: {
    title: string;
    academic_year: string;
    semester: string;
    teacher: string | null;
    uploaded_on: string | null;
    note: string | null;
    /** Isi lembar pertama, baris demi baris; null bila berkasnya tidak terbaca. */
    rows: string[][] | null;
  } | null;
  teacher_feedback: {
    id: number;
    name: string;
    photo: string | null;
    role: string;
    body: string;
    created_at: string | null;
  }[];
};

/** Permintaan mentah tanpa autentikasi — dipakai endpoint login. */
export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, data?.message ?? "Permintaan ke server gagal.");
  }

  return data as T;
}

/**
 * GET terautentikasi. Token 401/419 berarti sesi habis — pengguna dikembalikan
 * ke halaman masuk alih-alih melihat halaman rusak.
 */
export async function authedGet<T>(path: string): Promise<T> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;

  if (!token) {
    redirect("/masuk");
  }

  const res = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 419) {
    redirect("/masuk?expired=1");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new ApiError(res.status, data?.message ?? `Gagal memuat data (HTTP ${res.status}).`);
  }

  return (await res.json()) as T;
}

/**
 * Di-cache per render supaya layout (sidebar) dan halaman Overview berbagi
 * satu permintaan HTTP, bukan dua.
 */
export const getOverview = cache((): Promise<ApiOverview> => authedGet<ApiOverview>("/overview"));

export const getMe = cache((): Promise<ApiStudent> => authedGet<ApiStudent>("/me"));

export const getRanking = cache((): Promise<ApiRanking> => authedGet<ApiRanking>("/ranking"));

export const getCourses = cache((): Promise<ApiCourses> => authedGet<ApiCourses>("/courses"));

export const getLibrary = cache((): Promise<ApiLibrary> => authedGet<ApiLibrary>("/library"));

/** `threads` mengatur berapa diskusi yang ditampilkan; server membatasi maksimumnya. */
/** Melempar ApiError 404 bila topiknya sudah dihapus. */
export const getForumThread = cache(
  (id: number): Promise<ApiForumThread> => authedGet<ApiForumThread>(`/forum/threads/${id}`),
);

export const getLibraryCatalogue = cache(
  (q?: string, kategori?: string, page?: number): Promise<ApiCatalogue> => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (kategori) p.set("kategori", kategori);
    // Tanpa page seluruh katalog dikirim (portal guru); portal siswa per halaman.
    if (page) p.set("page", String(page));
    const qs = p.toString();
    return authedGet<ApiCatalogue>(`/library/books${qs ? `?${qs}` : ""}`);
  },
);

export const getForum = cache(
  (threads?: number, sort?: "terbaru" | "populer", q?: string): Promise<ApiForum> => {
    const p = new URLSearchParams();
    if (threads) p.set("threads", String(threads));
    if (sort === "populer") p.set("urut", "populer");
    if (q) p.set("q", q);
    const qs = p.toString();
    return authedGet<ApiForum>(`/forum${qs ? `?${qs}` : ""}`);
  },
);

/** Katalog beasiswa yang sama dengan Portal Beasiswa alumni. */
export const getScholarships = cache(
  (kategori?: string): Promise<ApiBeasiswa> =>
    authedGet<ApiBeasiswa>(`/beasiswa${kategori ? `?kategori=${encodeURIComponent(kategori)}` : ""}`),
);
