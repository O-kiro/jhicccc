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

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <DigitalServices />
      <AboutStats />
      <StarDivider />
      <Programs />
      <Achievements />
      <News />
      <Principal />
      <StarDivider />
      <Extracurriculars />
      <Facilities />
      <Agenda />
      <Gallery />
      <Testimonials />
      <Faq />
      <CtaPpdb />
    </main>
  );
}
