import type { Metadata } from "next";
import { PageHead } from "@/app/components/siswa/ui";
import { CourseGrid } from "@/app/components/siswa/course-grid";
import { student } from "@/lib/siswa";

export const metadata: Metadata = {
  title: "Kursus",
  description: "Daftar mata pelajaran, progres modul, dan akses materi semester berjalan.",
};

export default function KursusPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Daftar Mata Pelajaran"
        title={student.semester}
        desc="Kelola kemajuan belajar kamu, akses modul, dan berinteraksi dengan pengajar kamu di platform akademik kami yang terintegrasi."
      />
      <CourseGrid />
    </div>
  );
}
