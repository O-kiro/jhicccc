import { ScrollProgress } from "@/app/components/scroll-progress";
import { StickyCta } from "@/app/components/sticky-cta";
import { BackToTop } from "@/app/components/back-to-top";
import { SiteHeader } from "@/app/components/site-header";
import { SiteFooter } from "@/app/components/site-footer";
import { buildSearchIndex, getSite } from "@/lib/site";

/**
 * Chrome situs publik. Dipisah dari root layout supaya portal siswa
 * (/siswa/*) bisa memakai shell-nya sendiri tanpa header/footer sekolah.
 */
export default async function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const searchIndex = buildSearchIndex(await getSite());

  return (
    <>
      {/* Keyboard users can jump past the fixed header straight to content. */}
      <a
        href="#konten"
        className="bg-blue-gradient fixed left-4 top-4 z-[60] -translate-y-24 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-overlay transition-transform focus:translate-y-0"
      >
        Lewati ke konten
      </a>
      <ScrollProgress />
      <SiteHeader searchIndex={searchIndex} />
      <div id="konten">{children}</div>
      <SiteFooter />
      <StickyCta />
      <BackToTop />
    </>
  );
}
