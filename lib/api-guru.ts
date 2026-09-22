/**
 * Klien API Portal Guru — endpoint /guru/* di Laravel (guard "teacher").
 *
 * Perpustakaan dan ganti sandi tidak ada di sini: endpoint-nya dipakai
 * bersama portal siswa, jadi fungsinya tetap di lib/api.ts.
 */

import { cache } from "react";
import type { IconName } from "@/lib/content";
import { authedGet, type ApiAnnouncement, type ApiTone } from "@/lib/api";

export type ApiTeacher = {
  id: number;
  name: string;
  nip: string | null;
  email: string | null;
  /** Nama kelas perwalian; null bila bukan wali kelas. */
  homeroom: string | null;
};

export type ApiSesi = {
  id: number;
  /** Nomor hari ISO: Senin = 1. */
  day: number;
  day_label: string;
  subject: string;
  classroom: string;
  start: string;
  end: string;
  meeting_url: string | null;
  live: boolean;
};

export type ApiGuruOverview = {
  teacher: ApiTeacher;
  quote: { body: string; source: string | null } | null;
  summary: {
    classes: number;
    students: number;
    sessions_today: number;
    journals_pending: number;
    active_loans: number;
  };
  /** `started`: jam mulainya sudah lewat (menurut jam WIB server). */
  today_schedule: (ApiSesi & { journal_filled: boolean; started: boolean })[];
  announcements: ApiAnnouncement[];
};

export type ApiJadwal = {
  days: { day: number; label: string; is_today: boolean; sessions: ApiSesi[] }[];
  summary: { sessions: number; minutes: number; classes: number; subjects: string[] };
};

type SesiJurnal = {
  schedule_id: number;
  subject: string;
  classroom: string;
  start: string;
  end: string;
  class_size: number;
};

export type ApiJurnal = {
  /** Sesi yang sudah mulai tapi belum dicatat, terbaru lebih dulu. */
  pending: (SesiJurnal & { date: string })[];
  journals: (SesiJurnal & {
    id: number;
    date: string;
    topic: string;
    note: string | null;
    present_count: number | null;
  })[];
  schedules: (SesiJurnal & { day: number; day_label: string })[];
  /** "Y-m-d" menurut jam WIB server. */
  today: string;
  range_days: number;
  max_back_days: number;
};

export type ApiModulGuru = {
  id: number;
  number: number;
  title: string;
  description: string | null;
  url: string | null;
  /** Berapa siswa terdaftar yang sudah menandai modul ini selesai. */
  completed: number;
};

export type ApiKelas = {
  courses: {
    id: number;
    subject: string;
    category: string;
    icon: IconName;
    tone: ApiTone;
    classroom: string | null;
    academic_year: string;
    semester: string;
    students: number;
    average_progress: number;
    modules: ApiModulGuru[];
  }[];
};

export type ApiNilai = {
  classes: { key: string; subject: string; classroom: string }[];
  selected: {
    key: string;
    subject: string;
    classroom: string;
    students: { id: number; name: string; nisn: string }[];
    assessments: {
      title: string;
      assessed_on: string;
      count: number;
      average: number;
      /** Dikunci ID siswa. */
      scores: Record<string, number>;
    }[];
  } | null;
  /** "Y-m-d" menurut jam WIB server. */
  today: string;
};

/** Di-cache per render: layout (sidebar) dan beranda berbagi satu permintaan. */
export const getGuruOverview = cache(
  (): Promise<ApiGuruOverview> => authedGet<ApiGuruOverview>("/guru/overview"),
);

export const getGuruMe = cache((): Promise<ApiTeacher> => authedGet<ApiTeacher>("/guru/me"));

export const getJadwal = cache((): Promise<ApiJadwal> => authedGet<ApiJadwal>("/guru/jadwal"));

export const getJurnal = cache((): Promise<ApiJurnal> => authedGet<ApiJurnal>("/guru/jurnal"));

export const getKelas = cache((): Promise<ApiKelas> => authedGet<ApiKelas>("/guru/kelas"));

export const getNilai = cache(
  (kelas?: string): Promise<ApiNilai> =>
    authedGet<ApiNilai>(kelas ? `/guru/nilai?kelas=${encodeURIComponent(kelas)}` : "/guru/nilai"),
);
