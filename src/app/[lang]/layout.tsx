import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Amiri, Cormorant_Garamond, IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";
import "../globals.css";
import { LOCALES, dirOf, getDictionary, hasLocale } from "@/i18n/config";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/* Arabic faces — only used (and only downloaded) on /ar. */
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  const t = dict.meta;
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: t.title,
    description: t.description,
    applicationName: dict.brand.name,
    keywords: [
      "Hsoumi Dates",
      "Tunisian dates",
      "Deglet Nour",
      "date exporter Tunisia",
      "date packaging",
      "date sorting and grading",
      "bulk dates supplier",
      "حسومي للتمور",
      "dattes tunisiennes",
      "exportateur de dattes Tunisie",
      "تمور تونسية",
      "دقلة نور",
      "تصدير التمور",
    ],
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", fr: "/fr", ar: "/ar", "x-default": "/en" },
    },
    openGraph: {
      title: t.ogTitle,
      description: t.tagline,
      siteName: dict.brand.name,
      images: ["/images/hero-sahara-palm.jpg"],
      type: "website",
      locale: { en: "en_US", fr: "fr_FR", ar: "ar_TN" }[lang],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#30251d",
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${cormorant.variable} ${manrope.variable} ${amiri.variable} ${plexArabic.variable}`}
    >
      {process.env.NODE_ENV === "development" && (
        <head>
          {/* Figma Code to Canvas capture helper — development only. */}
          <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async />
        </head>
      )}
      <body className="antialiased">{children}</body>
    </html>
  );
}
