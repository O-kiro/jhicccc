import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Login Upload Berkas — PPDB",
  description: "Masuk untuk menyerahkan dokumen PPDB MAN Kota Batu.",
};

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-0px)] bg-canvas">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 lg:grid-cols-2">
        {/* Sisi kiri — Branding */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-dark p-12 text-on-dark lg:flex">
          <div className="relative">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Logo MAN Kota Batu" className="h-10 w-10 object-contain" />
              <span className="font-display text-lg font-extrabold">MAN Kota Batu</span>
            </div>
            <p className="mt-6 font-serif text-2xl italic text-gold">“Berilmu. Berakhlak. Berprestasi.”</p>
            <h1 className="display mt-8 text-4xl leading-none text-on-dark">
              Gerbang digital menuju ekosistem pendidikan
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-on-dark/70">
              Gerbang digital menuju ekosistem pendidikan yang memadukan tradisi keilmuan Islam dan inovasi teknologi modern.
            </p>
          </div>
          <p className="text-xs text-on-dark/60">
            © 2024 MAN Kota Batu Integrated Digital Service. Dilindungi oleh enkripsi keamanan tingkat tinggi.
          </p>
          {/* decorative */}
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -top-10 right-20 h-32 w-32 rounded-full bg-white/5" />
        </div>

        {/* Sisi kanan — Form Login */}
        <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:px-12">
          {/* Mobile branding */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo MAN Kota Batu" className="h-9 w-9 object-contain" />
            <span className="font-display font-extrabold text-ink">MAN Kota Batu</span>
            <span className="text-xs text-muted">Berilmu. Berakhlak. Berprestasi.</span>
          </div>
          <LoginForm />
          <p className="mt-8 text-center text-xs text-muted lg:hidden">
            © 2024 MAN Kota Batu Integrated Digital Service. Dilindungi oleh enkripsi keamanan tingkat tinggi.
          </p>
        </div>
      </div>
    </main>
  );
}
