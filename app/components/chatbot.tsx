"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";

type Pesan = { role: "user" | "model"; text: string };

const SAPAAN: Pesan = {
  role: "model",
  text: "Assalamu'alaikum! Saya Asisten MAKOBA. Silakan tanya seputar MAN Kota Batu — PPDB, program, fasilitas, atau kontak.",
};

const SARAN = ["Kapan pendaftaran PPDB?", "Apa saja program unggulan?", "Apa syarat daftar?", "Alamat madrasah di mana?"];

/**
 * Asisten tanya-jawab di pojok kiri bawah situs publik. Pojok kanan sudah
 * dipakai tombol WhatsApp dan "kembali ke atas". Percakapan hanya hidup di
 * tab ini; tidak ada yang disimpan di server.
 */
export function Chatbot() {
  const [buka, setBuka] = useState(false);
  const [pesan, setPesan] = useState<Pesan[]>([SAPAAN]);
  const [isian, setIsian] = useState("");
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState<string | null>(null);
  const daftarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    daftarRef.current?.scrollTo({ top: daftarRef.current.scrollHeight, behavior: "smooth" });
  }, [pesan, sibuk, galat]);

  useEffect(() => {
    if (!buka) return;
    inputRef.current?.focus();
    const tutup = (e: KeyboardEvent) => e.key === "Escape" && setBuka(false);
    document.addEventListener("keydown", tutup);
    return () => document.removeEventListener("keydown", tutup);
  }, [buka]);

  async function kirim(teks: string) {
    const tanya = teks.trim();
    if (!tanya || sibuk) return;

    const baru = [...pesan, { role: "user" as const, text: tanya }];
    setPesan(baru);
    setIsian("");
    setGalat(null);
    setSibuk(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Sapaan pembuka tidak ikut dikirim; itu bukan bagian percakapan.
        body: JSON.stringify({ messages: baru.slice(1) }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.reply) {
        setPesan((p) => [...p, { role: "model", text: data.reply }]);
      } else {
        setGalat(data?.message ?? "Maaf, asisten sedang tidak dapat menjawab.");
      }
    } catch {
      setGalat("Tidak dapat terhubung. Periksa koneksimu.");
    } finally {
      setSibuk(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setBuka((b) => !b)}
        aria-expanded={buka}
        aria-controls="chatbot-panel"
        aria-label={buka ? "Tutup asisten" : "Tanya Asisten MAKOBA"}
        className="bg-blue-gradient fixed bottom-20 left-4 z-40 grid h-14 w-14 place-items-center rounded-full text-white shadow-overlay transition-transform hover:-translate-y-0.5 lg:bottom-6 lg:left-6"
      >
        <Icon name={buka ? "close" : "chat"} className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {buka && (
          <motion.section
            id="chatbot-panel"
            role="dialog"
            aria-label="Asisten MAKOBA"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-36 z-50 flex max-h-[min(34rem,calc(100dvh-10rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-overlay sm:inset-x-auto sm:left-4 sm:w-[23rem] lg:bottom-24 lg:left-6"
          >
            <header className="bg-blue-gradient flex items-center gap-3 px-4 py-3 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15">
                <Icon name="sparkle" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-extrabold">Asisten MAKOBA</p>
                <p className="text-xs text-white/75">Tanya jawab seputar madrasah</p>
              </div>
              <button
                type="button"
                onClick={() => setBuka(false)}
                aria-label="Tutup asisten"
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/15"
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </header>

            <div ref={daftarRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {pesan.map((m, i) => (
                <p
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-auto w-fit max-w-[85%] whitespace-pre-line rounded-2xl rounded-br-md bg-blue px-3.5 py-2 text-sm text-white"
                      : "w-fit max-w-[90%] whitespace-pre-line rounded-2xl rounded-bl-md bg-surface-2 px-3.5 py-2 text-sm leading-relaxed text-ink"
                  }
                >
                  {m.text}
                </p>
              ))}

              {sibuk && (
                <p className="flex w-fit gap-1 rounded-2xl rounded-bl-md bg-surface-2 px-4 py-3" aria-label="Asisten sedang mengetik">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </p>
              )}

              {galat && (
                <p role="alert" className="text-xs font-semibold text-gold-strong">
                  {galat}
                </p>
              )}

              {pesan.length === 1 && !sibuk && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SARAN.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => kirim(s)}
                      className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-blue hover:text-blue"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                kirim(isian);
              }}
              className="flex items-center gap-2 border-t border-line p-3"
            >
              <label htmlFor="chatbot-isian" className="sr-only">
                Pertanyaan
              </label>
              <input
                ref={inputRef}
                id="chatbot-isian"
                value={isian}
                onChange={(e) => setIsian(e.target.value)}
                maxLength={500}
                autoComplete="off"
                placeholder="Tulis pertanyaan…"
                className="min-w-0 flex-1 rounded-full border border-line bg-canvas px-4 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-blue"
              />
              <button
                type="submit"
                disabled={sibuk || !isian.trim()}
                aria-label="Kirim pertanyaan"
                className="bg-blue-gradient grid h-10 w-10 shrink-0 place-items-center rounded-full text-white disabled:opacity-50"
              >
                <Icon name="arrow" className="h-4 w-4" />
              </button>
            </form>
            <p className="px-4 pb-2 text-center text-[11px] text-muted">
              Jawaban dibuat AI dan bisa keliru. Untuk kepastian, hubungi admin.
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
