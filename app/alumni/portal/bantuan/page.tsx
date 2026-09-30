import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/app/components/icons";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { PageHead, Panel, PanelTitle } from "@/app/components/siswa/ui";
import { school } from "@/lib/content";

export const metadata: Metadata = {
  title: "Bantuan",
  description: "Panduan singkat dan kontak bantuan Portal Alumni MAN Kota Batu.",
};

/** Pertanyaan yang paling sering muncul di meja TU dan wali kelas. */
const PANDUAN = [
  {
    q: "Lupa kata sandi portal",
    a: "Hubungi Tim IT Madrasah atau tata usaha untuk mengatur ulang kata sandi. Setelah bisa masuk, segera ganti kata sandi di halaman Akun.",
  },
  {
    q: "Data sebaran alumni kurang tepat",
    a: "Statistik & Sebaran adalah rekap penelusuran yang diverifikasi madrasah. Laporkan koreksi ke tata usaha agar rekapnya diperbarui.",
  },
  {
    q: "Mendaftar program beasiswa",
    a: "Buka Portal Beasiswa, pilih program yang masih dibuka, lalu tekan Lihat Selengkapnya. Program tanpa tautan didaftarkan lewat tata usaha madrasah.",
  },
  {
    q: "Membuat topik di Forum Alumni",
    a: "Buka Forum Alumni, tekan Mulai Topik Baru, pilih kategori, lalu tulis judul dan isinya. Jaga adab berdiskusi antarangkatan.",
  },
];


export default function AlumniBantuanPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHead
        eyebrow="Pusat Bantuan"
        title="Bantuan Portal Alumni"
        desc="Panduan singkat penggunaan portal dan kontak Tim IT Madrasah bila mengalami kendala."
      />

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <Reveal>
          <Panel as="section">
            <PanelTitle icon="help">Pertanyaan Umum</PanelTitle>
            <StaggerGroup className="space-y-2.5">
              {PANDUAN.map((p) => (
                <StaggerItem key={p.q}>
                  <details className="group rounded-xl border border-line bg-surface-2 p-4 open:border-primary/30">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink">
                      {p.q}
                      <Icon name="chevron" className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted">{p.a}</p>
                  </details>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Panel>
        </Reveal>

        <Reveal delay={0.05}>
          <Panel as="section">
            <PanelTitle icon="phone">Hubungi Tim IT Madrasah</PanelTitle>
            <p className="text-sm leading-relaxed text-muted">
              Tim Helpdesk IT Madrasah siap membantu kendala akses portal alumni pada jam kerja madrasah.
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${school.phone.replace(/\s|\(|\)/g, "")}`}
                  className="flex items-center gap-2.5 text-ink transition-colors hover:text-primary"
                >
                  <Icon name="phone" className="h-4 w-4 shrink-0 text-primary" />
                  {school.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${school.email}`}
                  className="flex items-center gap-2.5 text-ink transition-colors hover:text-primary"
                >
                  <Icon name="mail" className="h-4 w-4 shrink-0 text-primary" />
                  {school.email}
                </a>
              </li>
            </ul>
            <div className="mt-5 grid gap-2">
              <Link
                href="/alumni/portal/akun"
                className="press inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-strong"
              >
                <Icon name="shield" className="h-4 w-4" />
                Ganti Kata Sandi
              </Link>
              <Link
                href="/kontak"
                className="press inline-flex items-center justify-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
              >
                Halaman Kontak Madrasah
              </Link>
            </div>
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}
