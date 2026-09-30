import Image from "next/image";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";
import type { ApiTone } from "@/lib/api";

/** Sampul pengganti mengikuti warna kategori, supaya rak tetap berwarna. */
const SAMPUL: Record<ApiTone, string> = {
  teal: "from-teal to-teal-strong",
  blue: "from-primary to-primary-strong",
  gold: "from-gold to-gold-strong",
};

/**
 * Sampul buku perpustakaan. Unggahan admin (/storage/...) bila ada; bila
 * belum, sampul berwarna bertuliskan judul — rak tidak pernah kosong.
 */
export function BookCover({
  title,
  author,
  cover,
  tone,
  className,
  sizes = "160px",
}: {
  title: string;
  author?: string | null;
  cover: string | null;
  tone: ApiTone;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[2/3] overflow-hidden rounded-lg bg-linear-to-br shadow-card",
        SAMPUL[tone],
        className,
      )}
    >
      {cover ? (
        <Image src={cover} alt={`Sampul ${title}`} fill sizes={sizes} className="object-cover" />
      ) : (
        <div aria-hidden className="flex h-full flex-col justify-between p-3 text-white">
          <Icon name="ebook" className="h-5 w-5 opacity-80" />
          <div>
            <p className="line-clamp-4 font-display text-[13px] font-extrabold leading-tight">{title}</p>
            {author && <p className="mt-1 line-clamp-1 text-[10px] text-white/75">{author}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
