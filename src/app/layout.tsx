import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Hsoumi Dates — Authentic Tunisian Dates for Worldwide Export",
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "Hsoumi Dates",
    "Tunisian dates",
    "Deglet Nour",
    "date exporter Tunisia",
    "date packaging",
    "date sorting and grading",
    "bulk dates supplier",
  ],
  openGraph: {
    title: "Hsoumi Dates — Authentic Tunisian Dates",
    description: SITE.tagline,
    siteName: SITE.name,
    images: ["/images/hero-sahara-palm.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#30251d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
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
