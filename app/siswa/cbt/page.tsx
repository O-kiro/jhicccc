import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { ExamRunner } from "@/app/components/siswa/exam-runner";
import { ApiError, getExamSession, getMe } from "@/lib/api";

export const metadata: Metadata = {
  // Suffix "| MAN Kota Batu" sudah ditambahkan template di root layout.
  title: "Sesi CBT",
  description: "Sesi ujian berbasis komputer MAN Kota Batu.",
  robots: { index: false, follow: false },
};

/** Sesi ujian selalu dimuat ulang: sisa waktu tidak boleh diambil dari cache. */
export const dynamic = "force-dynamic";

export default async function CbtSessionPage() {
  const student = await getMe();

  let session;
  try {
    session = await getExamSession();
  } catch (error) {
    // 404 berarti tidak ada ujian yang sedang berlangsung untuk kelas ini —
    // itu keadaan normal, bukan kerusakan, jadi ditangani di sini.
    if (!(error instanceof ApiError) || error.status !== 404) {
      throw error;
    }

    return (
      <main className="grid min-h-screen place-items-center bg-canvas px-5">
        <div className="max-w-md rounded-card border border-line bg-surface p-8 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gold-soft text-gold-strong">
            <Icon name="clock" className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-xl font-extrabold text-ink">
            Belum Ada Sesi Berlangsung
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Sesi CBT hanya bisa dibuka pada rentang waktu ujian yang dijadwalkan. Periksa jadwalmu
            di halaman Ujian.
          </p>
          <Link
            href="/siswa/ujian"
            className="btn-sheen bg-blue-gradient mt-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Lihat Jadwal Ujian
            <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return <ExamRunner session={session} student={student} />;
}
