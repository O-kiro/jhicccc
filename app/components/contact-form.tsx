"use client";

import { useState } from "react";
import { Icon } from "./icons";
import { cn } from "@/lib/styles";

type Fields = { nama: string; email: string; pesan: string };

export function ContactForm() {
  const [form, setForm] = useState<Fields>({ nama: "", email: "", pesan: "" });
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [sent, setSent] = useState(false);

  function validate(f: Fields): Partial<Fields> {
    const e: Partial<Fields> = {};
    if (!f.nama.trim()) e.nama = "Nama wajib diisi.";
    if (!f.email.trim()) e.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Format email tidak valid.";
    if (!f.pesan.trim()) e.pesan = "Pesan wajib diisi.";
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length === 0) setSent(true);
  }

  function set<K extends keyof Fields>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  if (sent) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-card bg-surface p-10 text-center shadow-card">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-soft text-blue">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold text-ink">Pesan Terkirim</h3>
        <p className="mt-2 text-sm text-muted">
          Terima kasih, {form.nama.split(" ")[0]}. Pesanmu telah kami terima dan akan segera ditindaklanjuti.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm({ nama: "", email: "", pesan: "" });
          }}
          className="mt-6 text-sm font-semibold text-blue hover:underline"
        >
          Kirim pesan lain
        </button>
      </div>
    );
  }

  const inputBase =
    "w-full rounded-xl border bg-surface px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted";

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-card bg-surface p-7 shadow-card sm:p-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="nama" className="mb-1.5 block text-sm font-medium text-ink">Nama Lengkap</label>
          <input
            id="nama"
            type="text"
            value={form.nama}
            onChange={(e) => set("nama", e.target.value)}
            placeholder="Nama Anda"
            aria-invalid={!!errors.nama}
            className={cn(inputBase, errors.nama ? "border-red-400 focus:border-red-500" : "border-line focus:border-blue")}
          />
          {errors.nama && <p className="mt-1 text-xs text-red-600">{errors.nama}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="email@contoh.com"
            aria-invalid={!!errors.email}
            className={cn(inputBase, errors.email ? "border-red-400 focus:border-red-500" : "border-line focus:border-blue")}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="pesan" className="mb-1.5 block text-sm font-medium text-ink">Pesan</label>
          <textarea
            id="pesan"
            rows={5}
            value={form.pesan}
            onChange={(e) => set("pesan", e.target.value)}
            placeholder="Tulis pertanyaan atau pesan Anda…"
            aria-invalid={!!errors.pesan}
            className={cn(inputBase, "resize-none", errors.pesan ? "border-red-400 focus:border-red-500" : "border-line focus:border-blue")}
          />
          {errors.pesan && <p className="mt-1 text-xs text-red-600">{errors.pesan}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-gradient px-6 py-3.5 text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-hover"
      >
        Kirim Pesan
        <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </form>
  );
}
