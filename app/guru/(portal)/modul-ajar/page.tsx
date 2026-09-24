import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/styles";
import { PageHead } from "@/app/components/siswa/ui";
import { LessonPlanBoard } from "@/app/components/guru/lesson-plan-board";
import { getModulAjar } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Modul Pembelajaran",
  description: "Kelola modul ajar sendiri dan temukan modul rekan sejawat.",
};

const TAB = [
  { key: "saya", label: "Modul Aktif Saya" },
  { key: "rekan", label: "Modul Rekan Sejawat" },
  { key: "arsip", label: "Arsip Lama" },
] as const;

export default async function ModulAjarPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; subject_id?: string; classroom_id?: string }>;
}) {
  const q = await searchParams;
  const data = await getModulAjar(q);

  /** Menjaga penyaring lain saat salah satunya diganti. */
  const tautan = (ubah: { tab?: string; subject_id?: string; classroom_id?: string }) => {
    const p = new URLSearchParams();
    const gabung = {
      tab: data.tab,
      subject_id: data.filters.subject_id ? String(data.filters.subject_id) : "",
      classroom_id: data.filters.classroom_id ? String(data.filters.classroom_id) : "",
      ...ubah,
    };
    if (gabung.tab && gabung.tab !== "saya") p.set("tab", gabung.tab);
    if (gabung.subject_id) p.set("subject_id", gabung.subject_id);
    if (gabung.classroom_id) p.set("classroom_id", gabung.classroom_id);
    const s = p.toString();
    return `/guru/modul-ajar${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Modul Pembelajaran"
        title="Daftar Modul Ajar"
        desc="Kelola perangkat pembelajaran Anda sendiri, dan lihat modul yang dibagikan rekan sejawat."
      />

      {/* Tab dan penyaring lewat URL: hasilnya bisa dibagikan dan tetap
          bekerja tanpa JavaScript. */}
      <nav aria-label="Kelompok modul" className="mb-4 flex flex-wrap gap-2">
        {TAB.map((t) => {
          const aktif = t.key === data.tab;
          return (
            <Link
              key={t.key}
              href={tautan({ tab: t.key })}
              aria-current={aktif ? "page" : undefined}
              className={cn(
                "press rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                aktif ? "bg-ink text-canvas" : "border border-line text-muted hover:border-ink/25 hover:text-ink",
              )}
            >
              {t.label} ({data.counts[t.key]})
            </Link>
          );
        })}
      </nav>

      <form action="/guru/modul-ajar" className="mb-6 flex flex-wrap items-end gap-3">
        {data.tab !== "saya" && <input type="hidden" name="tab" value={data.tab} />}
        <span>
          <label htmlFor="saring-mapel" className="mb-1.5 block text-xs font-semibold text-muted">
            Mata pelajaran
          </label>
          <select
            id="saring-mapel"
            name="subject_id"
            defaultValue={data.filters.subject_id ?? ""}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink outline-none focus:border-blue"
          >
            <option value="">Semua mata pelajaran</option>
            {data.subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </span>
        <span>
          <label htmlFor="saring-kelas" className="mb-1.5 block text-xs font-semibold text-muted">
            Tingkat kelas
          </label>
          <select
            id="saring-kelas"
            name="classroom_id"
            defaultValue={data.filters.classroom_id ?? ""}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink outline-none focus:border-blue"
          >
            <option value="">Semua kelas</option>
            {data.classrooms.map((k) => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </select>
        </span>
        <button
          type="submit"
          className="press rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
        >
          Saring
        </button>
      </form>

      <LessonPlanBoard data={data} />
    </div>
  );
}
