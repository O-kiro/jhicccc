import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn, toneSoft } from "@/lib/styles";
import { PageHead, Panel, PanelTitle, Pill } from "@/app/components/siswa/ui";
import { NewThread } from "@/app/components/siswa/new-thread";
import { LikeButton } from "@/app/components/siswa/like-button";
import { getAlumniForum } from "@/lib/api-alumni";

export const metadata: Metadata = {
  title: "Forum Alumni",
  description: "Forum alumni MAN Kota Batu — karir, perkuliahan, dan jejaring lintas angkatan.",
};

/** Berapa diskusi tambahan yang dimuat tiap kali tombol ditekan. */
const LANGKAH = 5;

const API = "/api/alumni/forum";

export default async function ForumAlumniPage({
  searchParams,
}: {
  searchParams: Promise<{ diskusi?: string; urut?: string; q?: string }>;
}) {
  const { diskusi, urut = "terbaru", q = "" } = await searchParams;
  const diminta = Number(diskusi);
  const cari = q.trim();

  const data = await getAlumniForum({
    threads: Number.isFinite(diminta) && diminta > 0 ? diminta : undefined,
    urut,
    q: cari || undefined,
  });

  const {
    categories,
    threads,
    threads_shown: shown,
    threads_total: total,
    stats,
    trending,
    top_contributors: topContributors,
  } = data;

  const toneOf = (category: string) => categories.find((c) => c.name === category)?.tone ?? "teal";

  /** Menjaga parameter lain saat salah satunya diganti. */
  const tautan = (ubah: { urut?: string; q?: string; diskusi?: string }) => {
    const p = new URLSearchParams();
    const gabung: { urut?: string; q?: string; diskusi?: string } = {
      urut: data.sort,
      q: cari || undefined,
      ...ubah,
    };
    if (gabung.urut && gabung.urut !== "terbaru") p.set("urut", gabung.urut);
    if (gabung.q) p.set("q", gabung.q);
    if (gabung.diskusi) p.set("diskusi", String(gabung.diskusi));
    const s = p.toString();
    return `/alumni/portal/forum${s ? `?${s}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Jejaring Karir"
        title="Forum Alumni"
        desc="Wadah silaturahmi, berbagi pengalaman karir, informasi perkuliahan, serta peluang kolaborasi bagi alumni MAN Kota Batu."
        action={
          <NewThread
            categories={categories}
            base={API}
            categoryField="alumni_forum_category_id"
          />
        }
      />

      <StaggerGroup className="grid gap-4 sm:grid-cols-3">
        {categories.map((c) => (
          <StaggerItem key={c.id}>
            <Panel className="card-glow h-full transition-shadow hover:shadow-card">
              <span className={cn("grid h-11 w-11 place-items-center rounded-xl", toneSoft[c.tone])}>
                <Icon name={c.icon} className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-extrabold text-ink">{c.name}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{c.desc}</p>
              <p className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-teal">
                <Icon name="chat" className="h-3.5 w-3.5" />
                {c.threads} topik aktif
              </p>
            </Panel>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <Reveal>
          <Panel as="section" className="h-full">
            <PanelTitle
              icon="chat"
              action={
                <span className="flex gap-1.5">
                  {(["terbaru", "populer"] as const).map((u) => (
                    <Link
                      key={u}
                      href={tautan({ urut: u, diskusi: undefined })}
                      aria-current={data.sort === u ? "page" : undefined}
                      className={cn(
                        "press rounded-full px-3 py-1.5 text-[11px] font-semibold capitalize transition-colors",
                        data.sort === u
                          ? "bg-ink text-canvas"
                          : "border border-line text-muted hover:text-ink",
                      )}
                    >
                      {u}
                    </Link>
                  ))}
                </span>
              }
            >
              Diskusi
            </PanelTitle>

            {/* GET biasa: hasil pencarian bisa dibagikan dan tetap jalan
                tanpa JavaScript. */}
            <form action="/alumni/portal/forum" className="mb-5 flex flex-wrap gap-3">
              {data.sort === "populer" && <input type="hidden" name="urut" value="populer" />}
              <label htmlFor="cari-diskusi" className="sr-only">
                Cari diskusi
              </label>
              <input
                id="cari-diskusi"
                name="q"
                defaultValue={cari}
                placeholder="Cari topik atau isi diskusi…"
                className="min-w-0 flex-1 rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-ink outline-none focus:border-blue"
              />
              <button
                type="submit"
                className="press inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
              >
                <Icon name="search" className="h-4 w-4" />
                Cari
              </button>
            </form>

            {threads.length === 0 && (
              <p className="rounded-card border border-line bg-surface-2 p-5 text-sm text-muted">
                {cari
                  ? `Tidak ada diskusi yang cocok dengan "${cari}".`
                  : "Belum ada diskusi. Jadilah yang pertama membuka topik."}
              </p>
            )}

            <StaggerGroup className="space-y-3">
              {threads.map((d) => (
                <StaggerItem key={d.id}>
                  <article className="group rounded-card border border-line bg-surface-2 p-5 transition-colors hover:border-ink/15">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone={toneOf(d.category)}>{d.category}</Pill>
                      <span className="text-[11px] font-semibold text-muted">
                        {d.author} &middot; {d.author_note} &middot; {d.when}
                      </span>
                    </div>
                    <Link href={`/alumni/portal/forum/${d.id}`} className="block">
                      <h3 className="mt-3 font-display text-base font-extrabold leading-snug text-ink transition-colors group-hover:text-blue">
                        {d.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{d.excerpt}</p>
                    </Link>
                    <div className="mt-4 flex items-center gap-5 border-t border-line pt-3.5 text-[11px] font-semibold text-muted">
                      <Link
                        href={`/alumni/portal/forum/${d.id}`}
                        className="press inline-flex items-center gap-1.5 transition-colors hover:text-blue"
                      >
                        <Icon name="chat" className="h-3.5 w-3.5" />
                        {d.replies} balasan
                      </Link>
                      <LikeButton
                        threadId={d.id}
                        likes={d.likes}
                        liked={d.liked_by_me ?? false}
                        base={API}
                      />
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>

            {shown < total && (
              <Link
                href={tautan({ diskusi: String(shown + LANGKAH) })}
                scroll={false}
                className="press mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/25 hover:bg-surface-2"
              >
                Muat Diskusi Lainnya
                <span className="text-muted">({total - shown} lagi)</span>
                <Icon name="chevron" className="h-4 w-4" />
              </Link>
            )}
          </Panel>
        </Reveal>

        <div className="space-y-6">
          <Reveal delay={0.05}>
            <Panel as="section">
              <PanelTitle icon="chart">Statistik Forum</PanelTitle>
              <dl className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-line bg-surface-2 p-3.5">
                    <dt className="text-[11px] font-semibold text-muted">{s.label}</dt>
                    <dd className="mt-1 font-display text-xl font-extrabold tabular-nums text-ink">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </Reveal>

          <Reveal delay={0.1}>
            <Panel as="section">
              <PanelTitle icon="flame">Topik Ramai</PanelTitle>
              {trending.length === 0 ? (
                <p className="text-sm text-muted">Belum ada topik.</p>
              ) : (
                <ol className="space-y-3">
                  {trending.map((t, i) => (
                    <li key={t.title} className="flex gap-3">
                      <span className="font-display text-sm font-extrabold tabular-nums text-muted">{i + 1}</span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-gold-strong">
                          {t.tag}
                        </span>
                        <span className="mt-0.5 block text-sm font-semibold leading-snug text-ink">
                          {t.title}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </Panel>
          </Reveal>

          <Reveal delay={0.15}>
            <Panel as="section">
              <PanelTitle icon="trophy">Top Kontribusi</PanelTitle>
              {topContributors.length === 0 ? (
                <p className="text-sm text-muted">Belum ada kontributor.</p>
              ) : (
                <ol className="space-y-3">
                  {topContributors.map((c, i) => (
                    <li key={c.name} className="flex items-center gap-3">
                      <span className="bg-blue-gradient grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-xs font-extrabold text-white">
                        {c.name.replace(/^@/, "").charAt(0).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">{c.name}</span>
                        <span className="block text-[11px] text-muted">{c.posts} topik</span>
                      </span>
                      <span className="font-display text-sm font-extrabold tabular-nums text-muted">
                        #{i + 1}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </Panel>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
