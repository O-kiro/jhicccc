import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Container } from "@/app/components/ui";
import { Reveal, StaggerGroup, StaggerItem } from "@/app/components/reveal";
import { Icon } from "@/app/components/icons";
import { digitalServices, getServiceBySlug, school } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

const tone = {
  teal: { soft: "bg-teal-soft", text: "text-teal" },
  blue: { soft: "bg-blue-soft", text: "text-blue" },
  gold: { soft: "bg-gold-soft", text: "text-gold-strong" },
} as const;

export function generateStaticParams() {
  return digitalServices.flatMap((s) => (s.detail ? [{ slug: s.detail.slug }] : []));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service?.detail) return { title: "Layanan tidak ditemukan" };
  return { title: service.detail.fullName, description: service.desc };
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service?.detail) notFound();

  const { detail } = service;
  const c = tone[service.tone];
  const related = digitalServices.filter((s) => s.name !== service.name);

  return (
    <main className="pb-24">
      <Container className="pt-32 sm:pt-40">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-blue">Beranda</Link>
          <span className="px-2">/</span>
          <Link href="/layanan" className="hover:text-blue">Layanan Digital</Link>
          <span className="px-2">/</span>
          <span className="text-ink">{service.name}</span>
        </nav>

        {/* Hero panel */}
        <div className={`relative overflow-hidden rounded-panel ${c.soft} p-8 sm:p-12`}>
          <div className="max-w-2xl">
            <div className="flex items-center gap-4">
              <span className={`grid h-16 w-16 place-items-center rounded-2xl bg-surface ${c.text} shadow-card`}>
                <Icon name={service.icon} className="h-8 w-8" />
              </span>
              <span className="rounded-md bg-surface/70 px-3 py-1 text-xs font-semibold text-ink">
                {detail.audience}
              </span>
            </div>
            <h1 className="display mt-6 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">{detail.fullName}</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">{service.desc}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {service.login ? (
                <>
                  <Button href={service.login.href} external={service.login.href.startsWith("http")}>
                    {service.login.label}
                  </Button>
                  <Button href="/kontak" variant="outline" icon={false}>
                    Tanya Layanan Ini
                  </Button>
                </>
              ) : (
                <Button href="/kontak">Tanya Layanan Ini</Button>
              )}
            </div>
            {service.login && (
              <p className="mt-4 flex items-center gap-2 text-sm text-ink/70">
                <Icon name="shield" className="h-4 w-4 shrink-0" />
                Khusus untuk siswa, guru, dan staff sekolah. Gunakan akun resmi sekolah untuk masuk.
              </p>
            )}
          </div>
        </div>
      </Container>

      {/* Detail */}
      <Container className="mt-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <h2 className="display text-2xl text-ink">Tentang Layanan</h2>
            <div className="mt-5 space-y-4">
              {detail.about.map((p, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-muted">{p}</p>
              ))}
            </div>

            <h2 className="display mt-12 text-2xl text-ink">Cara Mengakses</h2>
            <div className="mt-8">
              {detail.steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.05}>
                  <div className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blue-gradient text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      {i < detail.steps.length - 1 && <span className="my-1 w-px flex-1 bg-line" />}
                    </div>
                    <div className="pb-8">
                      <h3 className="font-display text-lg font-bold text-ink">{step.title}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-muted">{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {detail.note && (
              <div className={`flex items-start gap-3 rounded-card ${c.soft} p-5`}>
                <Icon name="ppid" className={`mt-0.5 h-5 w-5 shrink-0 ${c.text}`} />
                <p className="text-sm leading-relaxed text-ink/80">{detail.note}</p>
              </div>
            )}
          </div>

          {/* Fitur + bantuan */}
          <aside>
            <div className="space-y-6 lg:sticky lg:top-24">
              <div className="rounded-card bg-surface p-7 shadow-card">
                <h3 className="font-display text-lg font-bold text-ink">Fitur Utama</h3>
                <ul className="mt-4 space-y-3">
                  {detail.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-medium text-ink">
                      <Icon name="check" className={`mt-0.5 h-4 w-4 shrink-0 ${c.text}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-card bg-surface p-7 shadow-card">
                <h3 className="font-display text-lg font-bold text-ink">Butuh Bantuan?</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Tim madrasah siap membantu kendala akses layanan ini.
                </p>
                <ul className="mt-4 space-y-3 text-sm text-muted">
                  <li>
                    <a
                      href={`tel:${school.phone.replace(/\s|\(|\)/g, "")}`}
                      className="flex items-center gap-2.5 transition-colors hover:text-blue"
                    >
                      <Icon name="phone" className="h-4 w-4 shrink-0 text-teal" />
                      {school.phone}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${school.email}`}
                      className="flex items-center gap-2.5 transition-colors hover:text-blue"
                    >
                      <Icon name="mail" className="h-4 w-4 shrink-0 text-teal" />
                      {school.email}
                    </a>
                  </li>
                </ul>
                <Button href="/kontak" variant="outline" className="mt-5 w-full" icon={false}>
                  Halaman Kontak
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Container>

      {/* Related */}
      <Container className="mt-20">
        <h2 className="display text-2xl text-ink">Layanan Lainnya</h2>
        <StaggerGroup className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((s) => {
            const rc = tone[s.tone];
            return (
              <StaggerItem key={s.name} className="h-full">
                <Link
                  href={s.href}
                  className={`group flex h-full items-center gap-4 rounded-card ${rc.soft} p-5 transition-all duration-200 hover:-translate-y-1`}
                >
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-surface ${rc.text} shadow-card`}>
                    <Icon name={s.icon} className="h-6 w-6" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-bold text-ink">{s.name}</h3>
                    <p className="line-clamp-1 text-sm text-ink/70">{s.desc}</p>
                  </div>
                  <Icon name="arrow" className="ml-auto h-5 w-5 shrink-0 text-ink/50 transition-transform group-hover:translate-x-1" />
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </Container>
    </main>
  );
}
