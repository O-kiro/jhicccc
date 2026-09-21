import type { Metadata } from "next";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn, toneSoft } from "@/lib/styles";
import Link from "next/link";
import { PageHead, Panel, PanelTitle, Pill } from "@/app/components/siswa/ui";
import { NewThread } from "@/app/components/siswa/new-thread";
import { LikeButton } from "@/app/components/siswa/like-button";
import { getForum } from "@/lib/api";

export const metadata: Metadata = {
  title: "Forum Murid",
  description: "Forum diskusi siswa MAN Kota Batu — akademik, ekstrakurikuler, dan madrasah life.",
};

/** Berapa diskusi tambahan yang dimuat tiap kali tombol ditekan. */
const LANGKAH = 5;

export default async function ForumPage({
  searchParams,
}: {
  searchParams: Promise<{ diskusi?: string }>;
}) {
  const diminta = Number((await searchParams).diskusi);
  const batas = Number.isFinite(diminta) && diminta > 0 ? diminta : undefined;

  const {
    categories,
    threads,
    threads_shown: shown,
    threads_total: total,
    stats,
    trending,
    top_contributors: topContributors,
  } = await getForum(batas);

  /** Warna tag diskusi mengikuti kategori induknya. */
  const toneOf = (category: string) =>
    categories.find((c) => c.name === category)?.tone ?? "teal";

  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Forum Diskusi Siswa"
        title="Forum Murid"
        desc="Terhubung, berbagi wawasan, dan berdiskusi mengenai kehidupan akademik serta ekstrakurikuler bersama komunitas MAN Kota Batu."
        action={<NewThread categories={categories} />}
      />

      {/* Kategori */}
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
                {c.threads} Active Threads
              </p>
            </Panel>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* Diskusi terbaru */}
        <Reveal>
          <Panel as="section" className="h-full">
            <PanelTitle icon="chat">Recent Discussions</PanelTitle>
            {threads.length === 0 && (
              <p className="rounded-card border border-line bg-surface-2 p-5 text-sm text-muted">
                Belum ada diskusi. Jadilah yang pertama membuka topik.
              </p>
            )}
            <StaggerGroup className="space-y-3">
              {threads.map((d) => (
                <StaggerItem key={d.id}>
                  <article className="group rounded-card border border-line bg-surface-2 p-5 transition-colors hover:border-ink/15">
                    {/* Judul yang tertaut, bukan seluruh kartu: tombol suka
                        di bawahnya harus tetap bisa diklik sendiri. */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone={toneOf(d.category)}>{d.category}</Pill>
                      <span className="text-[11px] font-semibold text-muted">
                        {d.author} &middot; {d.when}
                      </span>
                    </div>
                    <Link href={`/siswa/forum/${d.id}`} className="block">
                      <h3 className="mt-3 font-display text-base font-extrabold leading-snug text-ink transition-colors group-hover:text-blue">
                        {d.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">
                        {d.excerpt}
                      </p>
                    </Link>
                    <div className="mt-4 flex items-center gap-5 border-t border-line pt-3.5 text-[11px] font-semibold text-muted">
                      <Link
                        href={`/siswa/forum/${d.id}`}
                        className="press inline-flex items-center gap-1.5 transition-colors hover:text-blue"
                      >
                        <Icon name="chat" className="h-3.5 w-3.5" />
                        {d.replies} Replies
                      </Link>
                      <LikeButton
                        threadId={d.id}
                        likes={d.likes}
                        liked={d.liked_by_me ?? false}
                      />
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>

            {/* Lewat URL, bukan state klien: hasilnya bisa dibagikan dan
                tetap bekerja tanpa JavaScript. */}
            {shown < total && (
              <Link
                href={`/siswa/forum?diskusi=${shown + LANGKAH}`}
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

        {/* Kolom kanan */}
        <div className="space-y-6">
          <Reveal delay={0.05}>
            <Panel as="section">
              <PanelTitle icon="chart">Forum Stats</PanelTitle>
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
              <PanelTitle icon="flame">Trending Topics</PanelTitle>
              <ol className="space-y-3">
                {trending.map((t, i) => (
                  <li key={t.title} className="flex gap-3">
                    <span className="font-display text-sm font-extrabold tabular-nums text-muted">
                      {i + 1}
                    </span>
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
            </Panel>
          </Reveal>

          <Reveal delay={0.15}>
            <Panel as="section">
              <PanelTitle icon="trophy">Top Kontribusi</PanelTitle>
              <ol className="space-y-3">
                {topContributors.map((c, i) => (
                  <li key={c.name} className="flex items-center gap-3">
                    <span className="bg-blue-gradient grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-xs font-extrabold text-white">
                      {/* Nama forum diawali "@", yang tidak berguna sebagai inisial. */}
                      {c.name.replace(/^@/, "").charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-ink">{c.name}</span>
                      <span className="block text-[11px] text-muted">{c.posts} posts</span>
                    </span>
                    <span className="font-display text-sm font-extrabold tabular-nums text-muted">
                      #{i + 1}
                    </span>
                  </li>
                ))}
              </ol>
            </Panel>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
