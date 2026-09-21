import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Container } from "@/app/components/ui";
import { Icon } from "@/app/components/icons";
import { getProgram, getSite } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

const tone = {
  teal: { soft: "bg-teal-soft", text: "text-teal" },
  blue: { soft: "bg-blue-soft", text: "text-blue" },
  gold: { soft: "bg-gold-soft", text: "text-gold-strong" },
} as const;

export async function generateStaticParams() {
  return (await getSite()).programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return { title: "Program tidak ditemukan" };
  return { title: program.name, description: program.desc };
}

export default async function ProgramPage({ params }: Params) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();

  const c = tone[program.color];
  const related = (await getSite()).programs.filter((p) => p.slug !== slug);

  return (
    <main className="pb-24">
      <Container className="pt-32 sm:pt-40">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
          <Link href="/" className="hover:text-blue">Beranda</Link>
          <span className="px-2">/</span>
          <Link href="/#program" className="hover:text-blue">Akademik</Link>
          <span className="px-2">/</span>
          <span className="text-ink">{program.name}</span>
        </nav>

        {/* Hero panel */}
        <div className={`relative overflow-hidden rounded-panel ${c.soft} p-8 sm:p-12`}>
          <div className="max-w-2xl">
            <div className="flex items-center gap-4">
              <span className={`grid h-16 w-16 place-items-center rounded-2xl bg-surface ${c.text} shadow-card`}>
                <Icon name={program.icon} className="h-8 w-8" />
              </span>
              <span className="rounded-md bg-surface/70 px-3 py-1 text-xs font-semibold text-ink">{program.tag}</span>
            </div>
            <h1 className="display mt-6 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">{program.name}</h1>
            <p className="mt-4 text-lg leading-relaxed text-ink/75">{program.desc}</p>
            <div className="mt-7">
              <Button href="/ppdb">Daftar Program Ini</Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Detail */}
      <Container className="mt-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <h2 className="display text-2xl text-ink">Tentang Program</h2>
            <div className="mt-5 space-y-4">
              {program.detail.map((p, i) => (
                <p key={i} className="text-[15px] leading-relaxed text-muted">{p}</p>
              ))}
            </div>

            <h2 className="display mt-12 text-2xl text-ink">Kegiatan</h2>
            <ul className="mt-5 space-y-3">
              {program.activities.map((a) => (
                <li key={a} className="flex items-start gap-3 text-[15px] text-ink">
                  <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface shadow-card ${c.text}`}>
                    <Icon name="check" className="h-4 w-4" />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Keunggulan */}
          <aside>
            <div className="rounded-card bg-surface p-7 shadow-card lg:sticky lg:top-24">
              <h3 className="font-display text-lg font-bold text-ink">Keunggulan</h3>
              <ul className="mt-4 space-y-3">
                {program.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                    <Icon name="star8" className={`h-4 w-4 shrink-0 ${c.text}`} strokeWidth={1.4} />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>

      {/* Related */}
      <Container className="mt-20">
        <h2 className="display text-2xl text-ink">Program Lainnya</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {related.map((p) => {
            const rc = tone[p.color];
            return (
              <Link
                key={p.slug}
                href={`/program/${p.slug}`}
                className={`group flex items-center gap-5 rounded-card ${rc.soft} p-6 transition-all duration-200 hover:-translate-y-1`}
              >
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-surface ${rc.text} shadow-card`}>
                  <Icon name={p.icon} className="h-7 w-7" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-ink">{p.name}</h3>
                  <p className="line-clamp-1 text-sm text-ink/70">{p.tag}</p>
                </div>
                <Icon name="arrow" className="ml-auto h-5 w-5 shrink-0 text-ink/50 transition-transform group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
