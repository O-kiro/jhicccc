import { Hero } from "@/app/components/hero";
import { Marquee } from "@/app/components/marquee";
import { DigitalServices } from "@/app/components/digital-services";
import { AboutStats } from "@/app/components/about-stats";
import { Programs } from "@/app/components/programs";
import { Achievements } from "@/app/components/achievements";
import { News } from "@/app/components/news";
import { Principal } from "@/app/components/principal";
import { Extracurriculars } from "@/app/components/extracurriculars";
import { Facilities } from "@/app/components/facilities";
import { Agenda } from "@/app/components/agenda";
import { Gallery } from "@/app/components/gallery";
import { Testimonials } from "@/app/components/testimonials";
import { Faq } from "@/app/components/faq";
import { CtaPpdb } from "@/app/components/cta-ppdb";
import { StarDivider } from "@/app/components/dividers";
import { SitePopup } from "@/app/components/site-popup";
import { getSite } from "@/lib/site";

export default async function Home() {
  // Konten dari CMS (menu My Website); lihat lib/site.ts untuk cadangannya.
  const site = await getSite();

  return (
    <main>
      <Hero />
      <Marquee />
      <DigitalServices digitalServices={site.digitalServices} />
      <AboutStats />
      <StarDivider />
      <Programs programs={site.programs} />
      <Achievements achievements={site.achievements} />
      <News news={site.news} />
      <Principal />
      <StarDivider />
      <Extracurriculars extracurriculars={site.extracurriculars} />
      <Facilities facilities={site.facilities} />
      <Agenda agenda={site.agenda} />
      <Gallery galleryItems={site.galleryItems} />
      <Testimonials testimonials={site.testimonials} />
      <Faq faqs={site.faqs} />
      <CtaPpdb />
      <SitePopup popup={site.popup} />
    </main>
  );
}
