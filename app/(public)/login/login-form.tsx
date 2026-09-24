"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";

/**
 * Masuk untuk mengunggah berkas PPDB.
 *
 * Nomor pendaftaran dan kata sandinya diterbitkan panitia — calon siswa tidak
 * mendaftar sendiri di sini. Sesi yang terbentuk dipegang cookie httpOnly,
 * sama seperti portal siswa dan guru.
 */
export default function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [nomor, setNomor] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const busy = submitting || pending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!nomor.trim() || !password.trim()) {
      setError("Nomor Pendaftaran dan Kata Sandi wajib diisi.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/ppdb/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_number: nomor.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(
          res.status === 429
            ? "Terlalu banyak percobaan. Coba lagi sebentar lagi."
            : (data?.message ?? "Nomor pendaftaran atau kata sandi salah."),
        );
        setSubmitting(false);
        return;
      }

      // Cookie sudah dipasang route handler; refresh supaya server component
      // membaca sesi baru sebelum berpindah halaman.
      startTransition(() => {
        router.replace("/ppdb/dokumen");
        router.refresh();
      });
    } catch {
      setError("Tidak dapat menghubungi server. Periksa koneksimu.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="font-display text-3xl font-extrabold text-ink">Selamat Datang</h2>
      <p className="mt-2 text-sm text-muted">
        Masuk dengan nomor pendaftaran untuk menyerahkan dokumen PPDB.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <div>
          <label htmlFor="login-nomor" className="mb-1.5 block text-sm font-medium text-ink">
            Nomor Pendaftaran
          </label>
          <input
            id="login-nomor"
            type="text"
            value={nomor}
            onChange={(e) => setNomor(e.target.value)}
            placeholder="mis. PPDB26-0001"
            autoComplete="username"
            disabled={busy}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-blue disabled:opacity-60"
          />
          <p className="mt-1.5 text-xs text-muted">
            Tertera pada bukti pendaftaran dari panitia PPDB.
          </p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-pass" className="text-sm font-medium text-ink">
              Kata Sandi
            </label>
            <Link href="/kontak" className="text-xs font-semibold text-blue hover:underline">
              Lupa Kata Sandi?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-pass"
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={busy}
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 pr-11 text-ink outline-none placeholder:text-muted focus:border-blue disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-blue"
            >
              <Icon name="eye" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-blue-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-hover disabled:pointer-events-none disabled:opacity-60"
        >
          {busy ? "Memproses…" : "Masuk ke Penyerahan"}
        </button>

        <p className="text-center text-sm text-muted">
          Belum punya nomor pendaftaran?{" "}
          <Link href="/ppdb" className="font-semibold text-blue hover:underline">
            Lihat alur PPDB
          </Link>
        </p>
      </form>

      <p className="mt-8 hidden text-center text-xs leading-relaxed text-muted lg:block">
        © 2024 MAN Kota Batu Integrated Digital Service. Dilindungi oleh enkripsi keamanan tingkat tinggi.
      </p>
    </div>
  );
}
