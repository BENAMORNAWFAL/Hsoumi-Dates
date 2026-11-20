import { Nav } from "@/components/Nav";
import { ScrollRefresh } from "@/components/ScrollRefresh";
import { DateJourney } from "@/components/DateJourney";
import { Hero } from "@/components/sections/Hero";
import { Origin } from "@/components/sections/Origin";
import { Harvest } from "@/components/sections/Harvest";
import { Expertise } from "@/components/sections/Expertise";
import { Collection } from "@/components/sections/Collection";
import { Facilities } from "@/components/sections/Facilities";
import { Quality } from "@/components/sections/Quality";
import { Route } from "@/components/sections/Route";
import { Export } from "@/components/sections/Export";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

/**
 * Hsoumi Dates — authentic Tunisian dates, worldwide export.
 *
 * 01 Home · 02 About · 03 Expertise (collection + process) · 04 Products
 * 05 Facilities · 06 Quality · 07 Export & global reach (route + export) · 08 Contact
 *
 * One Deglet Nour travels the whole company process across these sections:
 * palm → harvest → sorting → quality control → selection → cleaning line → container → ship.
 */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Origin />
        <Harvest />
        <Expertise />
        <Collection />
        <Facilities />
        <Quality />
        <Route />
        <Export />
        <Contact />
      </main>
      <Footer />
      {/* After every section, so its master timeline is created once all pins exist. */}
      <DateJourney />
      <ScrollRefresh />
    </>
  );
}
