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

export type ApiModulAjar = {
  tab: "saya" | "rekan" | "arsip";
  filters: { subject_id: number | null; classroom_id: number | null };
  counts: { saya: number; rekan: number; arsip: number };
  plans: {
    id: number;
    title: string;
    subject: string | null;
    classroom: string | null;
    time_range: string | null;
    url: string | null;
    note: string | null;
    status: "aktif" | "arsip";
    teacher: string;
    is_mine: boolean;
  }[];
  subjects: { id: number; name: string }[];
  classrooms: { id: number; name: string }[];
};

export type ApiBahanAjar = {
  selected: string | null;
  types: Record<string, string>;
  counts: Record<string, number>;
  materials: {
    id: number;
    type: string;
    type_label: string;
    title: string;
    subject: string | null;
    level: string | null;
    url: string | null;
    description: string | null;
  }[];
  subjects: { id: number; name: string }[];
};

export type ApiJurnalHarian = {
  filters: { dari: string | null; sampai: string | null };
  counts: { tahun_ini: number; arsip: number };
  activities: {
    id: number;
    date: string;
    classroom: string | null;
    activity: string;
    /** Alamat bukti foto; null bila tidak ada. */
    photo_url: string | null;
  }[];
  classrooms: { id: number; name: string }[];
  today: string;
  max_photo_kb: number;
};

export type ApiRdm = {
  classrooms: { id: number; name: string; academic_year: string }[];
  students: { id: number; name: string; classroom: string | null }[];
  uploads: {
    id: number;
    classroom: string | null;
    academic_year: string;
    semester: string;
    file_url: string;
    original_name: string;
    size_kb: number;
    note: string | null;
    uploaded_on: string | null;
  }[];
  feedback: {
    id: number;
    student: string;
    student_id: number;
    role: string;
    body: string;
    created_on: string | null;
  }[];
  max_file_kb: number;
  semesters: string[];
};

export type ApiTatib = {
  students: { id: number; name: string; nisn: string; classroom_id: number | null; classroom: string | null }[];
  classrooms: { id: number; name: string }[];
  rules: { id: number; code: string; title: string; kind: string; points: number; category: string | null }[];
  reports: {
    id: number;
    student: string;
    classroom: string | null;
    rule: string;
    kind: string;
    points: number;
    occurred_on: string;
    note: string | null;
  }[];
  today: string;
  earliest: string;
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

export const getModulAjar = cache(
  (opsi: { tab?: string; subject_id?: string; classroom_id?: string } = {}): Promise<ApiModulAjar> => {
    const p = new URLSearchParams();
    if (opsi.tab) p.set("tab", opsi.tab);
    if (opsi.subject_id) p.set("subject_id", opsi.subject_id);
    if (opsi.classroom_id) p.set("classroom_id", opsi.classroom_id);
    const qs = p.toString();
    return authedGet<ApiModulAjar>(`/guru/modul-ajar${qs ? `?${qs}` : ""}`);
  },
);

export const getBahanAjar = cache(
  (jenis?: string): Promise<ApiBahanAjar> =>
    authedGet<ApiBahanAjar>(`/guru/bahan-ajar${jenis ? `?jenis=${encodeURIComponent(jenis)}` : ""}`),
);

export const getJurnalHarian = cache((dari?: string, sampai?: string): Promise<ApiJurnalHarian> => {
  const p = new URLSearchParams();
  if (dari) p.set("dari", dari);
  if (sampai) p.set("sampai", sampai);
  const qs = p.toString();
  return authedGet<ApiJurnalHarian>(`/guru/jurnal-harian${qs ? `?${qs}` : ""}`);
});

export const getRdm = cache((): Promise<ApiRdm> => authedGet<ApiRdm>("/guru/rdm"));

export const getTatib = cache((): Promise<ApiTatib> => authedGet<ApiTatib>("/guru/tatib"));
