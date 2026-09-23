import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn } from "@/lib/styles";
import { PageHead, Panel, PanelTitle, Pill, StatCard } from "@/app/components/siswa/ui";
import { getSebaran, type ApiSebaran } from "@/lib/api-alumni";

export const metadata: Metadata = {
  title: "Statistik & Sebaran",
  description: "Sebaran kelulusan alumni MAN Kota Batu ke PTN, kedinasan, swasta, dan dunia kerja.",
};

/** Warna irisan diagram; sepadan dengan token di globals.css. */
const WARNA: Record<string, string> = {
  teal: "var(--teal)",
  blue: "var(--blue)",
  gold: "var(--gold)",
  muted: "var(--muted)",
};

const IKON: Record<string, "trophy" | "globe" | "shield" | "users"> = {
  ptn: "trophy",
  pts: "globe",
  kedinasan: "shield",
  kerja: "users",
};

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
      warna: WARNA[o.tone] ?? WARNA.teal,
      panjang,
      offset: -terpakai,
      judul: `${o.label}: ${o.students} siswa (${o.percent}%)`,
    });
    terpakai += panjang;
  }

  return (
    <svg viewBox="0 0 180 180" className="h-56 w-56 shrink-0" role="img" aria-label="Diagram sebaran kelulusan">
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
      <text
        x="90"
        y="84"
        textAnchor="middle"
        className="fill-muted text-[9px] font-semibold uppercase tracking-[0.08em]"
      >
        Total Lulusan
      </text>
      <text x="90" y="104" textAnchor="middle" className="fill-ink font-display text-[22px] font-extrabold">
        {total}
      </text>
    </svg>
  );
}

export default async function StatistikPage({
  searchParams,
}: {
  searchParams: Promise<{ tahun?: string }>;
}) {
  const { tahun } = await searchParams;
  const data = await getSebaran(tahun ? Number(tahun) : undefined);
  const { years, year, total, outcomes } = data;

  const utama = outcomes.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Statistik & Sebaran"
        title="Sebaran Kelulusan Alumni"
        desc={
          year
            ? `Penelusuran alumni angkatan ${year}: lanjut ke PTN, perguruan tinggi swasta, sekolah kedinasan, dan dunia kerja.`
            : "Rekap sebaran kelulusan belum diisi admin."
        }
      />

      {years.length > 1 && (
        <nav aria-label="Tahun kelulusan" className="mb-6 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-[0.06em] text-muted">
            Tahun kelulusan
          </span>
          {years.map((t) => (
            <Link
              key={t}
              href={`/alumni/portal/statistik?tahun=${t}`}
              aria-current={t === year ? "page" : undefined}
              className={cn(
                "press rounded-full px-4 py-2 text-sm font-semibold tabular-nums transition-colors",
                t === year
                  ? "bg-ink text-canvas"
                  : "border border-line text-muted hover:border-ink/25 hover:text-ink",
              )}
            >
              {t}
            </Link>
          ))}
        </nav>
      )}

      {total === 0 ? (
        <p className="rounded-card border border-line bg-surface-2 p-6 text-sm text-muted">
          Belum ada data sebaran. Admin mengisinya lewat panel: Alumni → Sebaran Kelulusan.
        </p>
      ) : (
        <>
          <StaggerGroup className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StaggerItem>
              <StatCard
                label="Alumni Terdata"
                value={String(total)}
                note={`Kelulusan ${year}`}
                icon="users"
                tone="blue"
              />
            </StaggerItem>
            {utama.map((o) => (
              <StaggerItem key={o.category}>
                <StatCard
                  label={o.label}
                  value={String(o.students)}
                  note={`${o.percent}% dari total`}
                  icon={IKON[o.category] ?? "chart"}
                  tone={o.tone === "muted" ? "gold" : o.tone}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr]">
            <Reveal>
              <Panel as="section" className="flex h-full flex-col items-center justify-center gap-5 sm:flex-row lg:flex-col">
                <Donat outcomes={outcomes} total={total} />
                <ul className="space-y-2.5">
                  {outcomes.map((o) => (
                    <li key={o.category} className="flex items-center gap-2.5 text-sm">
                      <span
                        aria-hidden
                        className="h-3 w-3 shrink-0 rounded-sm"
                        style={{ background: WARNA[o.tone] ?? WARNA.teal }}
                      />
                      <span className="font-semibold text-ink">{o.label}</span>
                      <span className="tabular-nums text-muted">{o.percent}%</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </Reveal>

            <Reveal delay={0.05}>
              <Panel as="section" className="h-full">
                <PanelTitle icon="chart" action={<Pill tone="muted">TA {year}</Pill>}>
                  Rincian Penelusuran
                </PanelTitle>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-line text-left text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
                      <tr>
                        <th scope="col" className="pb-2.5">Kategori</th>
                        <th scope="col" className="pb-2.5 text-right">Siswa</th>
                        <th scope="col" className="pb-2.5 text-right">Persen</th>
                        <th scope="col" className="hidden pb-2.5 pl-4 sm:table-cell">Jalur Populer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {outcomes.map((o) => (
                        <tr key={o.category}>
                          <td className="py-3">
                            <span className="flex items-center gap-2 font-semibold text-ink">
                              <span
                                aria-hidden
                                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                                style={{ background: WARNA[o.tone] ?? WARNA.teal }}
                              />
                              {o.label}
                            </span>
                            <span className="mt-1 block text-xs text-muted sm:hidden">{o.note}</span>
                          </td>
                          <td className="py-3 text-right font-display font-extrabold tabular-nums text-ink">
                            {o.students}
                          </td>
                          <td className="py-3 text-right tabular-nums text-muted">{o.percent}%</td>
                          <td className="hidden py-3 pl-4 text-xs leading-relaxed text-muted sm:table-cell">
                            {o.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-5 flex items-start gap-2 rounded-xl bg-surface-2 p-3.5 text-xs leading-relaxed text-muted">
                  <Icon name="help" className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                  Angka ini rekap hasil penelusuran alumni yang diverifikasi madrasah, bukan data pribadi
                  per orang.
                </p>
              </Panel>
            </Reveal>
          </div>
        </>
      )}
    </div>
  );
}
