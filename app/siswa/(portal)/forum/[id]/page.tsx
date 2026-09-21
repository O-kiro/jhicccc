import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { Reveal } from "@/app/components/reveal";
import { Panel, Pill } from "@/app/components/siswa/ui";
import { LikeButton } from "@/app/components/siswa/like-button";
import { ReplyForm } from "@/app/components/siswa/reply-form";
import { ReplyList } from "@/app/components/siswa/reply-list";
import { ApiError, getForumThread } from "@/lib/api";

export const metadata: Metadata = {
  title: "Diskusi",
  description: "Topik diskusi di Forum Murid MAN Kota Batu.",
};

export default async function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  let data;
  try {
    data = await getForumThread(id);
  } catch (error) {
    // Topik yang sudah dihapus tampil sebagai 404, bukan halaman rusak.
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const { thread, replies } = data;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/siswa/forum"
        className="press inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
      >
        <Icon name="chevron" className="h-4 w-4 rotate-90" />
        Kembali ke Forum
      </Link>

      <Reveal>
        <Panel as="article" className="mt-5">
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="blue">{thread.category}</Pill>
            <span className="text-[11px] font-semibold text-muted">
              {thread.author} &middot; {thread.when}
            </span>
          </div>

          <h1 className="mt-3 font-display text-2xl font-extrabold leading-tight text-ink">
            {thread.title}
          </h1>

          <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink/90">
            {thread.excerpt}
          </p>

          <div className="mt-6 flex items-center gap-5 border-t border-line pt-4 text-[11px] font-semibold text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Icon name="chat" className="h-3.5 w-3.5" />
              {/* Hitungan server: termasuk balasan bersarang, tanpa yang dihapus. */}
              {thread.replies} Replies
            </span>
            <LikeButton
              threadId={thread.id}
              likes={thread.likes}
              liked={thread.liked_by_me ?? false}
            />
          </div>
        </Panel>
      </Reveal>

      <Reveal delay={0.05}>
        <Panel as="section" className="mt-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-ink">
            <Icon name="chat" className="h-[18px] w-[18px] text-teal" />
            Balasan
          </h2>

          <ReplyList threadId={thread.id} replies={replies} />

          <ReplyForm threadId={thread.id} />
        </Panel>
      </Reveal>
    </div>
  );
}
