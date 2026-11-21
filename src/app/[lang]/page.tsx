import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { ScrollRefresh } from "@/components/ScrollRefresh";
import { DateJourney } from "@/components/DateJourney";
import { FullPage } from "@/components/FullPage";
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
import { getDictionary, hasLocale } from "@/i18n/config";

/**
 * Hsoumi Dates — authentic Tunisian dates, worldwide export.
 *
 * 01 Home · 02 About · 03 Expertise (collection + process) · 04 Products
 * 05 Facilities · 06 Quality · 07 Export & global reach (route + export) · 08 Contact
 *
 * The page moves one full screen per gesture (<FullPage/>), and one Deglet Nour
 * travels the whole company process with it, landing on real dates in the photographs:
 * palm → harvest → sorting → quality control → products → cleaning line → quality → container.
 *
 * Served in English (/en), French (/fr) and Arabic (/ar, right-to-left); each section receives its copy.
 */
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <Nav t={t.nav} brand={t.brand} lang={lang} />
      <main>
        <Hero t={t.hero} />
        <Origin t={t.about} />
        <Harvest t={t.harvest} />
        <Expertise t={t.process} />
        <Collection t={t.products} />
        <Facilities t={t.facilities} />
        <Quality t={t.quality} />
        <Route t={t.route} />
        <Export t={t.export} />
        <Contact t={t.contact} />
      </main>
      <Footer t={t.footer} brand={t.brand} nav={t.nav.links} />
      {/* After every section, so its master timeline is created once all pins exist. */}
      <DateJourney />
      <FullPage />
      <ScrollRefresh />
    </>
  );
}
