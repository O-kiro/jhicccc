"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";
import { cn } from "./ui";
import { school, socials } from "@/lib/content";

const CBT_URL = "https://uam.mankotabatu.sch.id/";
const YOUTUBE_URL = socials.find((s) => s.name === "YouTube")?.href ?? CBT_URL;

// Aplikasi klien ujian diunduh dari server CBT madrasah.
const APPS = [
  { label: "Android", href: CBT_URL },
  { label: "Windows", href: CBT_URL },
  { label: "iOS & macOS", href: CBT_URL },
];

const inputBase =
  "w-full rounded-xl border bg-surface px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted border-line focus:border-blue";

export function CbtLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState(false);

  function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username dan password wajib diisi.");
      return;
    }
    setError(null);
    setNotice(true);
  }

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={submit} noValidate className="rounded-card bg-surface p-8 shadow-card">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo.png"
            alt={`Logo ${school.name}`}
            width={72}
            height={72}
            unoptimized
            className="h-18 w-18 object-contain"
          />
          <h2 className="mt-4 font-display text-2xl font-extrabold uppercase text-ink">{school.name}</h2>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-teal">Online CBT Platform</p>
        </div>

        <p className="mt-6 rounded-xl bg-gold-soft px-4 py-3 text-center text-sm leading-relaxed text-ink/85">
          Pastikan jaringan dan perangkat ujian dalam kondisi terbaik, dan jangan membagikan
          akun kepada siapa pun.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="cbt-username" className="mb-1.5 block text-sm font-medium text-ink">
              Username
            </label>
            <input
              id="cbt-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username peserta"
              autoComplete="username"
              className={cn(inputBase, error && !username.trim() && "border-red-400 focus:border-red-500")}
            />
          </div>
          <div>
            <label htmlFor="cbt-password" className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="cbt-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className={cn(inputBase, error && !password.trim() && "border-red-400 focus:border-red-500")}
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
              role="status"
            >
              <div className="mt-4 rounded-xl bg-blue-soft p-4 text-sm leading-relaxed text-ink/85">
                <p className="font-semibold text-blue">Autentikasi belum terhubung dari halaman ini.</p>
                <p className="mt-1">
                  Ujian dilaksanakan melalui server CBT madrasah sesuai jadwal. Gunakan akun dan
                  token dari pengawas di ruang ujian.
                </p>
                <a
                  href={CBT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 font-semibold text-blue hover:underline"
                >
                  Buka server CBT resmi
                  <Icon name="external" className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-blue-gradient px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-hover"
        >
          Masuk ke Sistem
        </button>

        <div className="mt-6 border-t border-line pt-5">
          <p className="text-center text-xs font-semibold uppercase tracking-wide text-muted">
            Unduh Aplikasi Ujian
          </p>
          <div className="mt-3 flex justify-center gap-2.5">
            {APPS.map((a) => (
              <a
                key={a.label}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-blue hover:text-blue"
              >
                {a.label}
                <Icon name="external" className="h-3 w-3 opacity-60" />
              </a>
            ))}
          </div>
          <p className="mt-4 text-center text-sm">
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-blue hover:underline"
            >
              <Icon name="play" className="h-4 w-4" />
              Tutorial penggunaan CBT
            </a>
          </p>
        </div>

        <p className="mt-6 border-t border-line pt-4 text-center text-xs text-muted">
          © 2026 {school.name} — CBT Platform
        </p>
      </form>

      <p className="mt-5 flex items-center justify-center gap-2 text-center text-sm text-muted">
        <Icon name="shield" className="h-4 w-4 shrink-0 text-teal" />
        Khusus untuk siswa, guru, dan staff sekolah. Gunakan akun resmi sekolah untuk masuk.
      </p>
    </div>
  );
}
