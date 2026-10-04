import type { Metadata } from "next";
import { StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn } from "@/lib/styles";
import { Pill } from "@/app/components/siswa/ui";
import { HeaderCard, TabTautan } from "@/app/components/guru/ui";
import { getJadwal } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Jadwal Mengajar",
  description: "Jadwal KBM per hari, ditarik dari data penugasan kurikulum.",
};

export default async function JadwalPage({ searchParams }: { searchParams: Promise<{ hari?: string }> }) {
  const [{ hari }, { days }] = await Promise.all([searchParams, getJadwal()]);

  // Senin–Jumat selalu tampil; hari lain (Sabtu) hanya bila ada jadwalnya.
  const tampil = days.filter((d) => d.day <= 5 || d.sessions.length > 0);
  const diminta = Number(hari);
  const aktif =
    tampil.find((d) => d.day === diminta) ?? tampil.find((d) => d.is_today) ?? tampil.find((d) => d.sessions.length > 0) ?? tampil[0];

  return (
    <div className="mx-auto max-w-6xl">
      <HeaderCard
        icon="calendar"
        tone="gold"
        title="Jadwal Mengajar Anda"
        desc="Jadwal KBM ditarik otomatis dari data penugasan kurikulum."
      >
        <div className="mt-5 border-t border-line pt-5">
          <TabTautan
            label="Pilih hari"
            items={tampil.map((d) => ({
              href: `/guru/jadwal?hari=${d.day}`,
              label: d.label.toUpperCase(),
              active: d.day === aktif?.day,
            }))}
          />
        </div>

        {!aktif || aktif.sessions.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">
            Tidak ada jadwal mengajar{aktif ? ` hari ${aktif.label}` : ""}.
          </p>
        ) : (
          <StaggerGroup className="mt-5 space-y-3">
            {aktif.sessions.map((s, i) => (
              <StaggerItem key={s.id}>
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-l-4 border-l-primary p-4",
                    s.live ? "border-primary/35 bg-primary-soft/40" : "border-line bg-surface-2",
                  )}
                >
                  <span className="w-[120px] shrink-0 font-display text-sm font-extrabold tabular-nums text-ink">
                    {s.start}–{s.end}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-extrabold text-ink">{s.subject}</span>
                    <span className="block text-sm text-muted">Kelas {s.classroom}</span>
                  </span>
                  <Pill tone="blue">JAM KE {i + 1}</Pill>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}
      </HeaderCard>
    </div>
  );
}
