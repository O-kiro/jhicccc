"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/app/components/icons";

const inputBase =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted focus:border-blue";

export function PortalLoginForm() {
  const router = useRouter();
  const [nisn, setNisn] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nisn.trim() || !password.trim()) {
      setError("NISN dan Kata Sandi wajib diisi.");
      return;
    }
    setError(null);
    router.push("/siswa");
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="font-display text-3xl font-extrabold text-ink">Selamat Datang Kembali</h2>
      <p className="mt-2 text-sm text-muted">Silakan masuk untuk mengakses layanan akademik anda.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <div>
          <label htmlFor="portal-nisn" className="mb-1.5 block text-sm font-medium text-ink">
            NISN
          </label>
          <input
            id="portal-nisn"
            type="text"
            inputMode="numeric"
            value={nisn}
            onChange={(e) => setNisn(e.target.value)}
            placeholder="Masukkan NISN"
            autoComplete="username"
            className={inputBase}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="portal-pass" className="text-sm font-medium text-ink">
              Kata Sandi
            </label>
            <Link href="/kontak" className="text-xs font-semibold text-blue hover:underline">
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
            className="h-4 w-4 rounded border-line accent-[var(--blue)]"
          />
          Ingat saya di perangkat ini
        </label>

        {error && (
          <p role="alert" className="flex items-center gap-2 text-sm font-medium text-gold-strong">
            <Icon name="ppid" className="h-4 w-4" />
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn-sheen bg-blue-gradient group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Masuk ke Portal
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
