import type { Metadata } from "next";
import { PageHead } from "@/app/components/siswa/ui";
import { TaskList } from "@/app/components/siswa/task-list";
import { getTugas } from "@/lib/api";

export const metadata: Metadata = {
  title: "Tugas",
  description: "Tugas dari guru beserta tenggatnya.",
};

export default async function TugasPage() {
  const { tasks } = await getTugas();
  const aktif = tasks.filter((t) => !t.completed).length;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHead
        eyebrow="Tugas"
        title="Tugas dari Guru"
        desc={
          tasks.length === 0
            ? "Belum ada tugas untuk kelasmu."
            : `${aktif} tugas belum selesai. Tandai selesai setelah kamu mengumpulkannya.`
        }
      />
      <TaskList tasks={tasks} />
    </div>
  );
}
