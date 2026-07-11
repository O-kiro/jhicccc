"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "./icons";
import { cn } from "./ui";
import { school } from "@/lib/content";

const RDM_URL = "https://rdm.mankotabatu.sch.id/";

// Pilihan mengikuti aplikasi RDM (Kemenag) versi 3.1.
const YEARS = ["2026/2027", "2025/2026", "2024/2025", "2023/2024", "2022/2023", "2021/2022", "2020/2021", "2019/2020"];
const SEMESTERS = ["Ganjil", "Genap", "SKS I", "SKS II", "SKS III", "SKS IV", "SKS V", "SKS VI"];

const inputBase =
  "w-full rounded-xl border bg-surface px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted border-line focus:border-blue";

export function RdmLogin() {
  const [year, setYear] = useState(YEARS[0]);
  const [semester, setSemester] = useState(SEMESTERS[0]);
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
          <h2 className="mt-4 font-display text-2xl font-extrabold text-ink">Rapor Digital Madrasah</h2>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em] text-teal">{school.name}</p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="rdm-tahun" className="mb-1.5 block text-sm font-medium text-ink">
                Tahun Pelajaran
              </label>
              <select id="rdm-tahun" value={year} onChange={(e) => setYear(e.target.value)} className={inputBase}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="rdm-semester" className="mb-1.5 block text-sm font-medium text-ink">
                Semester
              </label>
              <select id="rdm-semester" value={semester} onChange={(e) => setSemester(e.target.value)} className={inputBase}>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="rdm-username" className="mb-1.5 block text-sm font-medium text-ink">
              Username
            </label>
            <input
              id="rdm-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username akun RDM"
              autoComplete="username"
              className={cn(inputBase, error && !username.trim() && "border-red-400 focus:border-red-500")}
            />
          </div>
          <div>
            <label htmlFor="rdm-password" className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="rdm-password"
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
                  Silakan masuk melalui server RDM resmi madrasah, atau hubungi wali kelas/admin
                  apabila mengalami kendala akun.
                </p>
                <a
                  href={RDM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 font-semibold text-blue hover:underline"
                >
                  Buka server RDM resmi
                  <Icon name="external" className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-blue-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-hover"
        >
          Login
        </button>

        <div className="mt-4 text-center">
          <Link href="/kontak" className="text-sm font-semibold text-blue hover:underline">
            Lupa Password Admin?
          </Link>
        </div>

        <p className="mt-6 border-t border-line pt-4 text-center text-xs leading-relaxed text-muted">
          RDM adalah aplikasi resmi Kementerian Agama dan tidak diperjualbelikan.
          <span className="mt-1 block">RDM Versi 3.1 · {school.name}</span>
        </p>
      </form>

      <p className="mt-5 flex items-center justify-center gap-2 text-center text-sm text-muted">
        <Icon name="shield" className="h-4 w-4 shrink-0 text-teal" />
        Khusus untuk siswa, guru, dan staff sekolah. Gunakan akun resmi sekolah untuk masuk.
      </p>
    </div>
  );
}
