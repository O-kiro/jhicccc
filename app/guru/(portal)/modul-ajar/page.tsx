import type { Metadata } from "next";
import { LessonPlanBoard } from "@/app/components/guru/lesson-plan-board";
import { TabTautan } from "@/app/components/guru/ui";
import { getModulAjar } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Modul Pembelajaran",
  description: "Kelola, cetak, dan temukan modul ajar rekan sejawat.",
};

const TAB = [
  { key: "saya", label: "Modul Aktif Saya" },
  { key: "rekan", label: "Modul Rekan Sejawat" },
  { key: "arsip", label: "Arsip Lama" },
] as const;

const pilihan = "rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink outline-none focus:border-primary";

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
      <LessonPlanBoard data={data}>
        {/* Tab dan penyaring lewat URL: hasilnya bisa dibagikan dan tetap
            bekerja tanpa JavaScript. */}
        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-5 xl:flex-row xl:items-center xl:justify-between">
          <TabTautan
            label="Kelompok modul"
            items={TAB.map((t) => ({
              href: tautan({ tab: t.key }),
              label: `${t.label} (${data.counts[t.key]})`,
              active: t.key === data.tab,
            }))}
          />

          <form action="/guru/modul-ajar" className="flex flex-wrap items-center gap-2">
            {data.tab !== "saya" && <input type="hidden" name="tab" value={data.tab} />}
            <label htmlFor="saring-mapel" className="sr-only">
              Mata pelajaran
            </label>
            <select id="saring-mapel" name="subject_id" defaultValue={data.filters.subject_id ?? ""} className={pilihan}>
              <option value="">Semua mapel</option>
              {data.subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <label htmlFor="saring-kelas" className="sr-only">
              Tingkat kelas
            </label>
            <select id="saring-kelas" name="classroom_id" defaultValue={data.filters.classroom_id ?? ""} className={pilihan}>
              <option value="">Semua kelas</option>
              {data.classrooms.map((k) => (
                <option key={k.id} value={k.id}>{k.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="press rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-primary/40 hover:text-primary"
            >
              Saring
            </button>
          </form>
        </div>
      </LessonPlanBoard>
    </div>
  );
}
