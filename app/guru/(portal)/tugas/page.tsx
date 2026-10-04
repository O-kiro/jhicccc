import type { Metadata } from "next";
import { PageHead } from "@/app/components/siswa/ui";
import { TaskBoard } from "@/app/components/guru/task-board";
import { getTugasGuru } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Tugas Siswa",
  description: "Beri tugas untuk kelas yang diampu dan pantau berapa siswa yang sudah selesai.",
};

export default async function TugasGuruPage() {
  const data = await getTugasGuru();

  return (
    <div className="mx-auto max-w-5xl">
      <PageHead
        eyebrow="Tugas Siswa"
        title="Tugas untuk Kelas"
        desc="Tugas yang disimpan langsung tampil di halaman Tugas siswa pada kelas tersebut."
      />
      <TaskBoard courses={data.courses} tasks={data.tasks} />
    </div>
  );
}
