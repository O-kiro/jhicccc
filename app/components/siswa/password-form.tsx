"use client";

import { useId, useState } from "react";
import { Icon } from "@/app/components/icons";

type Galat = Partial<Record<"current_password" | "password" | "password_confirmation", string>>;

/**
 * Formulir ganti kata sandi. Syarat sandi baru ditampilkan di depan — sama
 * dengan aturan di Laravel — supaya siswa tidak menebak-nebak lewat galat.
 */
export function PasswordForm() {
  const [lama, setLama] = useState("");
  const [baru, setBaru] = useState("");
  const [ulang, setUlang] = useState("");
  const [lihat, setLihat] = useState(false);
  const [mengirim, setMengirim] = useState(false);
  const [galat, setGalat] = useState<Galat>({});
  const [umum, setUmum] = useState<string | null>(null);
  const [berhasil, setBerhasil] = useState<string | null>(null);
  const id = useId();

  const syarat = [
    { ok: baru.length >= 8, teks: "Minimal 8 karakter" },
    { ok: /[a-zA-Z]/.test(baru), teks: "Ada huruf" },
    { ok: /\d/.test(baru), teks: "Ada angka" },
    { ok: baru.length > 0 && baru === ulang, teks: "Konfirmasi cocok" },
  ];
  const siap = lama.length > 0 && syarat.every((s) => s.ok);

  async function kirim(e: React.FormEvent) {
    e.preventDefault();
    if (!siap || mengirim) return;

    setMengirim(true);
    setGalat({});
    setUmum(null);
    setBerhasil(null);

    try {
      const res = await fetch("/api/akun/sandi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_password: lama,
          password: baru,
          password_confirmation: ulang,
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.status === 422 && data?.errors) {
        const g: Galat = {};
        for (const [k, v] of Object.entries(data.errors as Record<string, string[]>)) {
          g[k as keyof Galat] = v[0];
        }
        setGalat(g);
        return;
      }
      if (res.status === 429) throw new Error("Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.");
      if (!res.ok) throw new Error(data?.message ?? "Kata sandi gagal diganti.");

      setLama("");
      setBaru("");
      setUlang("");
      const lain = Number(data?.other_sessions_revoked ?? 0);
      setBerhasil(
        lain > 0
          ? `Kata sandi diganti. ${lain} perangkat lain yang masih masuk telah dikeluarkan.`
          : "Kata sandi berhasil diganti.",
      );
    } catch (err) {
      setUmum(err instanceof Error ? err.message : "Kata sandi gagal diganti.");
    } finally {
      setMengirim(false);
    }
  }

  const kolom = (
    nama: keyof Galat,
    label: string,
    nilai: string,
    ubah: (v: string) => void,
    autoComplete: string,
  ) => (
    <div>
      <label htmlFor={`${id}-${nama}`} className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        {label}
      </label>
      <input
        id={`${id}-${nama}`}
        type={lihat ? "text" : "password"}
        value={nilai}
        onChange={(e) => ubah(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={galat[nama] ? true : undefined}
        className="mt-1.5 w-full rounded-xl border border-line bg-surface-2 px-4 py-3 text-sm text-ink outline-none focus:border-blue"
      />
      {galat[nama] && <p className="mt-1.5 text-xs font-semibold text-gold-strong">{galat[nama]}</p>}
    </div>
  );

  return (
    <form onSubmit={kirim} className="space-y-4">
      {kolom("current_password", "Kata sandi saat ini", lama, setLama, "current-password")}
      {kolom("password", "Kata sandi baru", baru, setBaru, "new-password")}
      {kolom("password_confirmation", "Ulangi kata sandi baru", ulang, setUlang, "new-password")}

      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
        {syarat.map((s) => (
          <li key={s.teks} className={s.ok ? "flex items-center gap-1.5 text-teal" : "flex items-center gap-1.5 text-muted"}>
            <Icon name={s.ok ? "check" : "close"} className="h-3.5 w-3.5" />
            {s.teks}
          </li>
        ))}
      </ul>

      <label className="flex items-center gap-2 text-xs font-semibold text-muted">
        <input type="checkbox" checked={lihat} onChange={(e) => setLihat(e.target.checked)} />
        Tampilkan kata sandi
      </label>

      {umum && (
        <p role="alert" className="text-sm font-semibold text-gold-strong">
          {umum}
        </p>
      )}
      {berhasil && (
        <p role="status" className="flex items-start gap-2 rounded-xl bg-teal-soft/60 p-3.5 text-sm font-semibold text-teal">
          <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" />
          {berhasil}
        </p>
      )}

      <button
        type="submit"
        disabled={!siap || mengirim}
        className="btn-sheen bg-blue-gradient press inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
      >
        <Icon name="shield" className="h-4 w-4" />
        {mengirim ? "Menyimpan…" : "Ganti Kata Sandi"}
      </button>
    </form>
  );
}
