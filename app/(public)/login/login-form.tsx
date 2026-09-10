"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";

export default function LoginForm() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim() || !password.trim()) {
      setError("Nama dan Kata Sandi wajib diisi.");
      return;
    }
    setError(null);
    router.push("/ppdb/dokumen");
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="font-display text-3xl font-extrabold text-ink">Selamat Datang</h2>
      <p className="mt-2 text-sm text-muted">Silakan masuk untuk menyerahkan dokumen ppdb.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <div>
          <label htmlFor="login-nama" className="mb-1.5 block text-sm font-medium text-ink">
            Nama
          </label>
          <input
            id="login-nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Masukkan Nama"
            autoComplete="name"
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none placeholder:text-muted focus:border-blue"
          />
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
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 pr-11 text-ink outline-none placeholder:text-muted focus:border-blue"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              aria-label={showPass ? "Sembunyikan" : "Tampilkan"}
              className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-blue"
            >
              <Icon name={showPass ? "close" : "search"} className="h-4 w-4" />
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 py-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-4 w-4 rounded border-line text-blue focus:ring-blue"
          />
          <span className="text-sm text-ink">Ingat saya di perangkat ini</span>
        </label>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-blue-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-hover"
        >
          Masuk ke Penyerahan
        </button>

        <p className="text-center text-sm text-muted">
          Belum memiliki akun?{" "}
          <Link href="/kontak" className="font-semibold text-blue hover:underline">
            Hubungi Admin Madrasah
          </Link>
        </p>
      </form>

      <p className="mt-8 hidden text-center text-xs leading-relaxed text-muted lg:block">
        © 2024 MAN Kota Batu Integrated Digital Service. Dilindungi oleh enkripsi keamanan tingkat tinggi.
      </p>
    </div>
  );
}
