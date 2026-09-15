import type { Metadata } from "next";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { cn, toneSoft } from "@/lib/styles";
import { PageHead, Panel, PanelTitle, Pill } from "@/app/components/siswa/ui";
import {
  discussions,
  forumCategories,
  forumStats,
  topContributors,
  trendingTopics,
} from "@/lib/siswa";

export const metadata: Metadata = {
  title: "Forum Murid",
  description: "Forum diskusi siswa MAN Kota Batu — akademik, ekstrakurikuler, dan madrasah life.",
};

/** Warna tag diskusi mengikuti kategori induknya. */
const toneOf = (category: string) =>
  forumCategories.find((c) => c.name === category)?.tone ?? "teal";

export default function ForumPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Forum Diskusi Siswa"
        title="Forum Murid"
        desc="Terhubung, berbagi wawasan, dan berdiskusi mengenai kehidupan akademik serta ekstrakurikuler bersama komunitas MAN Kota Batu."
        action={
          <button
            type="button"
            className="btn-sheen bg-blue-gradient group inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            <Icon name="plus" className="h-4 w-4" />
            Mulai Topik Baru
          </button>
        }
      />

      {/* Kategori */}
      <StaggerGroup className="grid gap-4 sm:grid-cols-3">
        {forumCategories.map((c) => (
          <StaggerItem key={c.name}>
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
            <StaggerGroup className="space-y-3">
              {discussions.map((d) => (
                <StaggerItem key={d.title}>
                  <article className="group rounded-card border border-line bg-surface-2 p-5 transition-colors hover:border-ink/15">
                    <div className="flex flex-wrap items-center gap-2">
                      <Pill tone={toneOf(d.category)}>{d.category}</Pill>
                      <span className="text-[11px] font-semibold text-muted">
                        {d.author} &middot; {d.when}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-base font-extrabold leading-snug text-ink transition-colors group-hover:text-blue">
                      {d.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{d.excerpt}</p>
                    <div className="mt-4 flex items-center gap-5 border-t border-line pt-3.5 text-[11px] font-semibold text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="chat" className="h-3.5 w-3.5" />
                        {d.replies} Replies
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="heart" className="h-3.5 w-3.5" />
                        {d.likes} Likes
                      </span>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <button
              type="button"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/25 hover:bg-surface-2"
            >
              Muat Diskusi Lainnya
              <Icon name="chevron" className="h-4 w-4" />
            </button>
          </Panel>
        </Reveal>

        {/* Kolom kanan */}
        <div className="space-y-6">
          <Reveal delay={0.05}>
            <Panel as="section">
              <PanelTitle icon="chart">Forum Stats</PanelTitle>
              <dl className="grid grid-cols-2 gap-3">
                {forumStats.map((s) => (
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
                {trendingTopics.map((t, i) => (
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
                      {c.name.charAt(0)}
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
