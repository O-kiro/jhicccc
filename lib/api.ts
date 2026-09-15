/**
 * Klien API portal siswa.
 *
 * Semua pemanggilan berjalan di server: token disimpan dalam cookie httpOnly
 * sehingga tidak pernah terbaca JavaScript browser, dan base URL API tidak
 * ikut terkirim ke klien.
 */

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const TOKEN_COOKIE = "makoba-token";

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
  streak_days: number;
};

export type ApiScheduleItem = {
  id: number;
  subject: string;
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
  summary: {
    average_score: number | null;
    attendance_percentage: number | null;
    streak_days: number;
  };
  today_schedule: ApiScheduleItem[];
  announcements: ApiAnnouncement[];
};

export type ApiReportCard = {
  report_card: {
    id: number;
    academic_year: string;
    semester: string;
    average_score: number;
    class_rank: number | null;
    class_size: number | null;
    attendance_percentage: number;
  };
  grade_history: { month: string; score: number }[];
  recent_assessments: {
    id: number;
    subject: string;
    title: string | null;
    score: number;
    assessed_on: string;
  }[];
  teacher_feedback: {
    id: number;
    name: string;
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
async function authedGet<T>(path: string): Promise<T> {
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

/** Melempar ApiError 404 bila rapor periode berjalan belum diterbitkan. */
export const getReportCard = cache((): Promise<ApiReportCard> =>
  authedGet<ApiReportCard>("/report-card"),
);
