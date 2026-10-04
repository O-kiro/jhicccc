"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@/app/components/icons";

const inputBase =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted focus:border-blue disabled:opacity-60";

/**
 * Nomor pendaftaran PPDB (mis. PPDB26-0001) masuk lewat jalurnya sendiri —
 * sesi pendaftar berbeda dari warga madrasah. Nomor lain yang bukan email
 * dicoba sebagai PPDB bila login biasa menolaknya, untuk berjaga-jaga kalau
 * panitia memakai format nomor sendiri.
 */
async function masuk(identifier: string, password: string, remember: boolean): Promise<Response> {
  const ppdb = () =>
    fetch("/api/ppdb/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registration_number: identifier, password }),
    });

  if (/^ppdb/i.test(identifier)) return ppdb();

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password, remember }),
  });

  if ((res.status === 401 || res.status === 422) && !identifier.includes("@")) {
    const cadangan = await ppdb();
    if (cadangan.ok) return cadangan;
  }

  return res;
}

export function PortalLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(
    params.get("expired") ? "Sesi kamu sudah berakhir. Silakan masuk lagi." : null,
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      setError("Email/ID pengguna dan kata sandi wajib diisi.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await masuk(identifier.trim(), password, remember);
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          res.status === 429
            ? "Terlalu banyak percobaan. Coba lagi sebentar lagi."
            : (data?.message ?? "Email/ID pengguna atau kata sandi salah."),
        );
        setSubmitting(false);
        return;
      }

      // Admin diserahkan ke Laravel lewat tautan sekali pakai yang membuat
      // sesi Filament. Itu origin lain, jadi router Next.js tidak dipakai —
      // dan `replace` menjaga tautan sekali-pakai lepas dari riwayat.
      if (data?.role === "admin" && typeof data.redirect === "string") {
        window.location.replace(data.redirect);
        return;
      }

      // Siswa & guru: cookie sudah dipasang route handler; refresh agar
      // server component membaca sesi baru sebelum berpindah halaman.
      //
      // `next` hanya dipakai bila menuju portal miliknya sendiri. Selain
      // mencegah siswa terlempar ke portal lain, ini juga menutup pengalihan
      // ke situs luar lewat ?next=//situs-lain.
      const PORTAL = ["/siswa", "/guru", "/alumni/portal", "/ppdb/dokumen"];
      const home: string = PORTAL.includes(data?.home) ? data.home : "/siswa";
      const minta = params.get("next") ?? "";
      const next = minta === home || minta.startsWith(`${home}/`) ? minta : home;
      startTransition(() => {
        router.replace(next);
        router.refresh();
      });
    } catch {
      setError("Tidak dapat menghubungi server. Periksa koneksimu.");
      setSubmitting(false);
    }
  }

  const busy = submitting || pending;

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="font-display text-3xl font-extrabold text-ink">Selamat Datang Kembali</h2>
      <p className="mt-2 text-sm text-muted">Silakan masuk untuk mengakses layanan akademik anda.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <div>
          <label htmlFor="portal-identifier" className="mb-1.5 block text-sm font-medium text-ink">
            Email atau ID Pengguna
          </label>
          <input
            id="portal-identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Masukkan email atau ID pengguna"
            autoComplete="username"
            disabled={busy}
            className={inputBase}
          />
          <p className="mt-1.5 text-xs text-muted">
            Pakai email atau ID yang diberikan madrasah (termasuk nomor pendaftaran PPDB).
            Lupa kata sandi? Admin madrasah dapat menerbitkan sandi sementara.
          </p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="portal-pass" className="text-sm font-medium text-ink">
              Kata Sandi
            </label>
            <Link
              href="/kontak"
              title="Kata sandi disetel ulang oleh admin madrasah"
              className="text-xs font-semibold text-blue hover:underline"
            >
              Lupa Kata Sandi?
            </Link>
          </div>
          <div className="relative">
            <input
              id="portal-pass"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Kata Sandi"
              autoComplete="current-password"
              disabled={busy}
              className={`${inputBase} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted transition-colors hover:text-ink"
            >
              <Icon name="eye" className="h-4 w-4" />
            </button>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={busy}
            className="h-4 w-4 rounded border-line accent-[var(--blue)]"
          />
          Ingat saya di perangkat ini
        </label>

        {error && (
          <p role="alert" className="flex items-start gap-2 text-sm font-medium text-gold-strong">
            <Icon name="ppid" className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="btn-sheen bg-blue-gradient press lift group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold text-white disabled:pointer-events-none disabled:opacity-60"
        >
          {busy ? "Memproses…" : "Masuk ke Portal"}
          {!busy && (
            <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Belum memiliki akun?{" "}
        <Link href="/kontak" className="font-semibold text-blue hover:underline">
          Hubungi Admin Madrasah
        </Link>
      </p>
    </div>
  );
}
