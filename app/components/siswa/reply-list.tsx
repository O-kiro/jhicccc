"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";
import { cn } from "@/lib/styles";
import { Pill } from "./ui";
import { ReplyForm } from "./reply-form";
import type { ApiReply } from "@/lib/api";

/**
 * Daftar balasan satu tingkat bersarang, dengan aksi balas dan hapus.
 *
 * Hanya satu formulir balasan yang terbuka pada satu waktu, supaya jelas
 * siapa yang sedang ditanggapi.
 */
export function ReplyList({
  threadId,
  replies,
  base = "/api/forum",
}: {
  threadId: number;
  /** Balasan forum alumni membawa `author_note` (angkatan); opsional di sini. */
  replies: (ApiReply & { author_note?: string | null })[];
  base?: string;
}) {
  const [membalas, setMembalas] = useState<number | null>(null);
  const [menghapus, setMenghapus] = useState<number | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const router = useRouter();

  async function hapus(reply: ApiReply) {
    if (!window.confirm("Hapus balasan ini? Tanggapan orang lain terhadapnya tetap ada.")) return;

    setMenghapus(reply.id);
    setGalat(null);

    try {
      const res = await fetch(`${base}/balasan/${reply.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? "Balasan gagal dihapus.");
      router.refresh();
    } catch (e) {
      setGalat(e instanceof Error ? e.message : "Balasan gagal dihapus.");
    } finally {
      setMenghapus(null);
    }
  }

  if (replies.length === 0) {
    return (
      <p className="mt-5 rounded-xl border border-line bg-surface-2 p-5 text-sm text-muted">
        Belum ada balasan. Jadilah yang pertama menanggapi.
      </p>
    );
  }

  // Fungsi biasa, bukan komponen: komponen yang didefinisikan di dalam render
  // dianggap jenis baru tiap render, sehingga React memasang ulang isinya dan
  // teks yang sedang diketik di formulir balasan ikut hilang.
  function item(r: ApiReply & { author_note?: string | null }, anak = false) {
    if (r.is_deleted) {
      return (
        <div className="rounded-xl border border-dashed border-line p-4 text-sm italic text-muted">
          Balasan ini telah dihapus penulisnya.
        </div>
      );
    }

    const nama = r.author ?? "Anonim";
    // Menanggapi balasan-anak tetap menempel ke induknya (satu tingkat), jadi
    // yang dibuka adalah formulir di bawah induk dengan nama yang dibalas.
    const indukId = r.parent_id ?? r.id;

    return (
      <div
        className={cn(
          "rounded-xl border p-4",
          r.is_mine ? "border-teal/35 bg-teal-soft/30" : "border-line bg-surface-2",
          anak && "p-3.5",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-blue-gradient grid h-7 w-7 shrink-0 place-items-center rounded-full font-display text-[11px] font-extrabold text-white">
            {nama.replace(/^@/, "").charAt(0).toUpperCase()}
          </span>
          <span className="text-sm font-semibold text-ink">{nama}</span>
          {/* Forum alumni menyertakan angkatan penulis; forum siswa tidak. */}
          {r.author_note && <Pill tone="muted">{r.author_note}</Pill>}
          {r.is_mine && <Pill tone="teal">Kamu</Pill>}
          <span className="text-[11px] text-muted">{r.when}</span>
        </div>
        <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-ink/90">{r.body}</p>
        <div className="mt-3 flex items-center gap-4 text-[11px] font-semibold text-muted">
          <button
            type="button"
            onClick={() => setMembalas(membalas === r.id ? null : r.id)}
            className="press inline-flex items-center gap-1.5 transition-colors hover:text-blue"
          >
            <Icon name="chat" className="h-3.5 w-3.5" />
            Balas
          </button>
          {r.is_mine && (
            <button
              type="button"
              onClick={() => hapus(r)}
              disabled={menghapus === r.id}
              className="press inline-flex items-center gap-1.5 transition-colors hover:text-gold-strong disabled:opacity-50"
            >
              <Icon name="close" className="h-3.5 w-3.5" />
              {menghapus === r.id ? "Menghapus…" : "Hapus"}
            </button>
          )}
        </div>
        {membalas === r.id && (
          <ReplyForm
            threadId={threadId}
            base={base}
            parentId={indukId}
            mention={nama}
            onDone={() => setMembalas(null)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      {galat && (
        <p role="alert" className="mt-4 text-sm font-semibold text-gold-strong">
          {galat}
        </p>
      )}
      <ul className="mt-5 space-y-3">
        {replies.map((r) => (
          <li key={r.id}>
            {item(r)}
            {r.children.length > 0 && (
              <ul className="mt-2 space-y-2 border-l-2 border-line pl-4 sm:ml-6">
                {r.children.map((c) => (
                  <li key={c.id}>
                    {item(c, true)}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
