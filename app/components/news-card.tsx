import Link from "next/link";
import { Icon } from "./icons";
import { Badge, PhotoTile } from "./ui";
import { formatDate } from "@/lib/format";
import type { NewsItem } from "@/lib/content";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/berita/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hover"
    >
      <PhotoTile tone={item.tone} icon="sparkle" className="aspect-[16/10]" glyphClassName="h-14 w-14" src={item.image} alt={item.title} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw">
        <span className="absolute left-4 top-4">
          <Badge tone={item.tone}>{item.category}</Badge>
        </span>
      </PhotoTile>
      <div className="flex flex-1 flex-col p-6">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted">
          <Icon name="calendar" className="h-3.5 w-3.5" />
          {formatDate(item.date)}
        </span>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink group-hover:text-blue">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{item.excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue">
          Baca selengkapnya
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
