import type { Metadata } from "next";
import { ExamRunner } from "@/app/components/siswa/exam-runner";

export const metadata: Metadata = {
  // Suffix "| MAN Kota Batu" sudah ditambahkan template di root layout.
  title: "Sesi CBT — Akidah Akhlak",
  description: "Sesi ujian berbasis komputer MAN Kota Batu.",
  robots: { index: false, follow: false },
};

export default function CbtSessionPage() {
  return <ExamRunner />;
}
