"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";

/**
 * Sakelar suka untuk satu topik.
 *
 * Tampilannya berubah lebih dulu, baru dikirim ke server — menyukai sesuatu
 * harus terasa seketika. Kalau permintaannya gagal, keadaannya dikembalikan.
 */
export function LikeButton({
  threadId,
  likes,
  liked,
  className,
}: {
  threadId: number;
  likes: number;
  liked: boolean;
  className?: string;
}) {
  const [state, setState] = useState({ likes, liked });
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function toggle(e: React.MouseEvent) {
    // Tombol ini bisa berada di dalam kartu yang seluruhnya tertaut.
    e.preventDefault();
    e.stopPropagation();

    if (busy) return;

    const sebelum = state;
    const sesudah = {
      liked: !sebelum.liked,
      likes: sebelum.likes + (sebelum.liked ? -1 : 1),
    };

    setState(sesudah);
    setBusy(true);

    try {
      const res = await fetch(`/api/forum/topik/${threadId}/suka`, { method: "POST" });
      const data = await res.json().catch(() => null);

      if (!res.ok) throw new Error();

      // Angka dari server yang berlaku: siswa lain bisa ikut menyukai
      // di sela-sela permintaan ini.
      setState({ liked: Boolean(data.liked), likes: Number(data.likes) });
      router.refresh();
    } catch {
      setState(sebelum);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={state.liked}
      aria-label={state.liked ? "Batalkan suka" : "Sukai topik ini"}
      className={cn(
        "press inline-flex items-center gap-1.5 rounded-full text-[11px] font-semibold",
        "transition-colors duration-200 ease-snap",
        state.liked ? "text-gold-strong" : "text-muted hover:text-gold-strong",
        className,
      )}
    >
      <Icon
        name="heart"
        // fill-current mengalahkan atribut fill="none" bawaan <Icon>, karena
        // CSS selalu menang atas atribut presentasi SVG.
        className={cn(
          "h-3.5 w-3.5 transition-transform",
          state.liked && "scale-110 fill-current",
        )}
      />
      {state.likes} Likes
    </button>
  );
}
