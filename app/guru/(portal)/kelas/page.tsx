import type { Metadata } from "next";
import { PageHead } from "@/app/components/siswa/ui";
import { CourseManager } from "@/app/components/guru/course-manager";
import { getKelas } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Kelas & Materi",
  description: "Kursus yang diampu, modul materi, dan progres siswa.",
};

export default async function KelasPage() {
  const { courses } = await getKelas();
  const siswa = courses.reduce((n, c) => n + c.students, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Kelas & Materi"
        title="Kursus yang Diampu"
        desc={
          courses.length === 0
            ? undefined
            : `${courses.length} kursus · ${siswa} pendaftaran siswa. Modul yang Anda tambahkan langsung tampil di halaman Kursus siswa.`
        }
      />
      <CourseManager courses={courses} />
    </div>
  );
}
