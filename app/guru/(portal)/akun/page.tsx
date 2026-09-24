import type { Metadata } from "next";
import { Icon } from "@/app/components/icons";
import { Reveal } from "@/app/components/reveal";
import { PageHead, Panel, PanelTitle } from "@/app/components/siswa/ui";
import { PasswordForm } from "@/app/components/siswa/password-form";
import { getGuruMe } from "@/lib/api-guru";

export const metadata: Metadata = {
  title: "Akun Saya",
  description: "Identitas akun dan penggantian kata sandi portal guru.",
};

export default async function GuruAkunPage() {
  const guru = await getGuruMe();

  const identitas = [
    { label: "Nama", nilai: guru.name },
    { label: "NIP", nilai: guru.nip ?? "—" },
    { label: "Email", nilai: guru.email ?? "—" },
    { label: "Wali Kelas", nilai: guru.homeroom ?? "—" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <PageHead eyebrow="Pengaturan" title="Akun Saya" desc="Periksa identitas Anda dan ganti kata sandi portal." />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <Panel as="section" className="h-full">
            <PanelTitle icon="users">Identitas</PanelTitle>
            <dl className="space-y-3.5">
              {identitas.map((i) => (
                <div key={i.label}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{i.label}</dt>
                  <dd className="mt-0.5 break-words text-sm font-semibold text-ink">{i.nilai}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 flex items-start gap-2 rounded-xl bg-surface-2 p-3.5 text-xs leading-relaxed text-muted">
              <Icon name="help" className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              Data salah? Hubungi tata usaha madrasah — identitas hanya bisa diubah dari panel admin.
            </p>
          </Panel>
        </Reveal>

        <Reveal delay={0.05}>
          <Panel as="section" className="h-full">
            <PanelTitle icon="shield">Ganti Kata Sandi</PanelTitle>
            <PasswordForm />
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}
