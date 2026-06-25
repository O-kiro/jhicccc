import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Container, PhotoTile } from "@/app/components/ui";
import { NewsCard } from "@/app/components/news-card";
import { Icon } from "@/app/components/icons";
import { getNewsBySlug, news } from "@/lib/content";
import { formatDate } from "@/lib/format";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return { title: "Berita tidak ditemukan" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { title: article.title, description: article.excerpt, type: "article" },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) notFound();

  const related = news.filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <main className="pb-24 pt-32 sm:pt-40">
      <article className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
          <Link href="/" className="hover:text-blue">Beranda</Link>
          <span className="px-2">/</span>
          <Link href="/berita" className="hover:text-blue">Berita</Link>
          <span className="px-2">/</span>
          <span className="line-clamp-1 inline-block max-w-[14rem] align-bottom text-ink">{article.category}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={article.tone}>{article.category}</Badge>
          <span className="text-sm text-muted">
            {formatDate(article.date)} · {article.author}
          </span>
        </div>

        <h1 className="display mt-5 text-balance text-[clamp(1.9rem,4.6vw,3.25rem)] text-ink">
          {article.title}
        </h1>

        <PhotoTile
          tone={article.tone}
          icon="sparkle"
          className="mt-8 aspect-[16/9] rounded-card"
          glyphClassName="h-16 w-16"
        />

        <div className="mt-8 space-y-5">
          {article.content.map((paragraph, i) => (
            <p key={i} className="text-lg leading-relaxed text-ink/80">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <Link href="/berita" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
            <Icon name="arrow" className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />
            Kembali ke semua berita
          </Link>
        </div>
      </article>

      <Container className="mt-20">
        <h2 className="display text-2xl text-ink">Berita Lainnya</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {related.map((item) => (
            <NewsCard key={item.slug} item={item} />
          ))}
        </div>
      </Container>
    </main>
  );
}
