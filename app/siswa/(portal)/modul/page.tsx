import type { Metadata } from "next";
import { CourseGrid } from "@/app/components/siswa/course-grid";
import { getCourses } from "@/lib/api";

export const metadata: Metadata = {
  title: "Modul Pembelajaran",
  description: "Katalog mata pelajaran, progres modul, dan akses materi semester berjalan.",
};

export default async function ModulPage() {
  const { semester, filters, courses } = await getCourses();

  return (
    <div className="mx-auto max-w-6xl">
      <CourseGrid
        eyebrow="Modul Pembelajaran"
        title={semester ?? "Semester Berjalan"}
        desc="Kelola kemajuan belajar kamu, akses modul, dan berinteraksi dengan pengajar kamu di platform akademik kami yang terintegrasi."
        filters={filters}
        courses={courses}
      />
    </div>
  );
}
