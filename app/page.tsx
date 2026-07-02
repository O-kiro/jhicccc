import { Hero } from "./components/hero";
import { Marquee } from "./components/marquee";
import { DigitalServices } from "./components/digital-services";
import { AboutStats } from "./components/about-stats";
import { Programs } from "./components/programs";
import { Achievements } from "./components/achievements";
import { News } from "./components/news";
import { Principal } from "./components/principal";
import { Extracurriculars } from "./components/extracurriculars";
import { Facilities } from "./components/facilities";
import { Agenda } from "./components/agenda";
import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
import { Faq } from "./components/faq";
import { CtaPpdb } from "./components/cta-ppdb";
import { StarDivider } from "./components/dividers";

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
