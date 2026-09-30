import type { Metadata } from "next";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn } from "@/lib/styles";
import { Panel, PanelTitle } from "@/app/components/siswa/ui";
import { HeaderCard, TabTautan } from "@/app/components/guru/ui";
import { getSebaran, type ApiSebaran } from "@/lib/api-alumni";
import type { IconName } from "@/lib/content";

export const metadata: Metadata = {
  title: "Statistik & Sebaran",
  description: "Statistik kelulusan dan sebaran alumni MAN Kota Batu ke PTN, kedinasan, swasta, dan dunia kerja.",
};

/** Palet Figma per kategori: warna irisan dan latar lencana persen. */
const WARNA: Record<string, { irisan: string; lencana: string }> = {
  ptn: { irisan: "#2563eb", lencana: "bg-[#e0edff] text-[#1e40af]" },
  pts: { irisan: "#10b981", lencana: "bg-[#dcfce7] text-[#047857]" },
  kedinasan: { irisan: "#f43f5e", lencana: "bg-[#ffe4e6] text-[#be123c]" },
  kerja: { irisan: "#f59e0b", lencana: "bg-[#fef3c7] text-[#b45309]" },
};
const CADANGAN = { irisan: "#94a3b8", lencana: "bg-surface-2 text-muted" };
const warnaOf = (kategori: string) => WARNA[kategori] ?? CADANGAN;

/**
 * Diagram donat tanpa pustaka grafik: tiap irisan satu lingkaran dengan
 * stroke-dasharray, digeser sebanyak irisan sebelumnya. Dirender di server,
 * jadi tidak menambah JavaScript ke browser.
 */
function Donat({ outcomes, total }: { outcomes: ApiSebaran["outcomes"]; total: number }) {
  const R = 70;
  const KELILING = 2 * Math.PI * R;

  // Panjang dan pergeseran tiap irisan dihitung sekali di sini, bukan sambil
  // memetakan JSX: mengubah variabel di dalam map() dianggap efek samping
  // saat render oleh React Compiler.
  const irisan: { key: string; warna: string; panjang: number; offset: number; judul: string }[] = [];
  let terpakai = 0;

  for (const o of outcomes) {
    const panjang = total > 0 ? (o.students / total) * KELILING : 0;
    irisan.push({
      key: o.category,
      warna: warnaOf(o.category).irisan,
      panjang,
      offset: -terpakai,
      judul: `${o.label}: ${o.students} siswa (${o.percent}%)`,
    });
    terpakai += panjang;
  }

  return (
    <svg viewBox="0 0 180 180" className="h-56 w-56 shrink-0" role="img" aria-label="Diagram distribusi outcome alumni">
      <g transform="rotate(-90 90 90)">
        <circle cx="90" cy="90" r={R} fill="none" stroke="var(--line)" strokeWidth="24" />
        {irisan.map((i) => (
          <circle
            key={i.key}
            cx="90"
            cy="90"
            r={R}
            fill="none"
            stroke={i.warna}
            strokeWidth="24"
            strokeDasharray={`${i.panjang} ${KELILING - i.panjang}`}
            strokeDashoffset={i.offset}
          >
            <title>{i.judul}</title>
          </circle>
        ))}
      </g>
      <text x="90" y="76" textAnchor="middle" className="fill-muted text-[8px] font-semibold uppercase tracking-[0.1em]">
        Total Lulusan
      </text>
      <text x="90" y="100" textAnchor="middle" className="fill-ink font-display text-[24px] font-extrabold">
        {total}
      </text>
      <text x="90" y="114" textAnchor="middle" className="fill-muted text-[9px] font-semibold">
        Siswa
      </text>
    </svg>
  );
}

export default async function StatistikPage({ searchParams }: { searchParams: Promise<{ tahun?: string }> }) {
  const { tahun } = await searchParams;
  const { years, year, total, outcomes } = await getSebaran(tahun ? Number(tahun) : undefined);

  const siswa = (kategori: string) => outcomes.find((o) => o.category === kategori)?.students ?? 0;

  const ringkasan: { label: string; value: number; icon: IconName; kotak: string }[] = [
    { label: "Total Alumni Terdata", value: total, icon: "users", kotak: "bg-[#e0edff] text-[#1e62d0]" },
    { label: "Lolos Seleksi PTN", value: siswa("ptn"), icon: "trophy", kotak: "bg-[#dcfce7] text-[#15803d]" },
    { label: "Sekolah Kedinasan", value: siswa("kedinasan"), icon: "shield", kotak: "bg-[#ffe4e6] text-[#be123c]" },
    {
      label: "Serapan Kerja & Swasta",
      value: siswa("kerja") + siswa("pts"),
      icon: "globe",
      kotak: "bg-[#fef3c7] text-[#b45309]",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <HeaderCard
        icon="chart"
        title="Statistik Kelulusan & Sebaran Alumni"
        desc={
          year
            ? `Penelusuran alumni angkatan ${year}: lanjut ke PTN, perguruan tinggi swasta, sekolah kedinasan, dan dunia kerja.`
            : "Rekap sebaran kelulusan belum diisi admin."
        }
      >
        {years.length > 1 && (
          <div className="mt-5 border-t border-line pt-5">
            <TabTautan
              label="Tahun kelulusan"
              items={years.map((t) => ({
                href: `/alumni/portal/statistik?tahun=${t}`,
                label: String(t),
                active: t === year,
              }))}
            />
          </div>
        )}
      </HeaderCard>

      {total === 0 ? (
        <p className="mt-6 rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
          Belum ada data sebaran. Admin mengisinya lewat panel: Alumni → Sebaran Kelulusan.
        </p>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Ringkasan — tersusun di kiri */}
          <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {ringkasan.map((r) => (
              <StaggerItem key={r.label}>
                <Panel className="flex items-center gap-4">
                  <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", r.kotak)}>
                    <Icon name={r.icon} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold text-muted">{r.label}</span>
                    <span className="block font-display text-xl font-extrabold tabular-nums text-ink">
                      {r.value} Siswa
                    </span>
                  </span>
                </Panel>
              </StaggerItem>
            ))}
          </StaggerGroup>

          {/* Distribusi: donat kiri, tabel kanan */}
          <Reveal>
            <Panel as="section" className="h-full">
              <PanelTitle icon="chart">Distribusi Penelusuran Outcome Alumni</PanelTitle>
              <div className="grid items-center gap-6 xl:grid-cols-[auto_minmax(0,1fr)]">
                <div className="flex justify-center">
                  <Donat outcomes={outcomes} total={total} />
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-line text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                      <tr>
                        <th scope="col" className="pb-2.5">Kategori</th>
                        <th scope="col" className="pb-2.5 text-right">Siswa</th>
                        <th scope="col" className="pb-2.5 text-right">Persentase</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {outcomes.map((o) => (
                        <tr key={o.category}>
                          <td className="py-3">
                            <span className="flex items-center gap-2 font-semibold text-ink">
                              <span
                                aria-hidden
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ background: warnaOf(o.category).irisan }}
                              />
                              {o.label}
                            </span>
                            {o.note && <span className="mt-1 block pl-4.5 text-xs text-muted">{o.note}</span>}
                          </td>
                          <td className="py-3 text-right font-display font-extrabold tabular-nums text-ink">
                            {o.students}
                          </td>
                          <td className="py-3 text-right">
                            <span
                              className={cn(
                                "inline-block rounded-md px-2 py-0.5 text-xs font-bold tabular-nums",
                                warnaOf(o.category).lencana,
                              )}
                            >
                              {o.percent.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
                    <Icon name="help" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    Rekap hasil penelusuran alumni yang diverifikasi madrasah, bukan data pribadi per orang.
                  </p>
                </div>
              </div>
            </Panel>
          </Reveal>
        </div>
      )}
    </div>
  );
}
