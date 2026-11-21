/**
 * Brand, navigation and contact configuration for Hsoumi Dates.
 *
 * Visible copy (nav labels included) lives in src/i18n/dictionaries.
 *
 * CONTACT DETAILS: the values below are placeholders. Replace them with the
 * company's real details before launch — the site never invents a phone
 * number or address, and hides any field left as `null`.
 */
export const SITE = {
  name: "Hsoumi Dates",
  wordmark: "HSOUMI DATES",
  tagline: "Authentic Tunisian Dates. Carefully Selected. Professionally Packed. Worldwide Export.",
  description:
    "Hsoumi Dates is a Tunisian company specialised in the collection, sorting, processing, packaging, storage and export of Tunisian dates, including Deglet Nour, for professional buyers worldwide.",
  contact: {
    /** Placeholder — replace with the company's real export inbox. */
    email: "contact@hsoumidates.example",
    phone: null as string | null,
    address: null as string | null,
    country: "Tunisia",
  },
  /** Site credit in the footer. */
  author: { url: "https://portfolio-expressjs.onrender.com/" },
  nav: [
    { href: "#about", key: "about" },
    { href: "#expertise", key: "expertise" },
    { href: "#products", key: "products" },
    { href: "#facilities", key: "facilities" },
    { href: "#quality", key: "quality" },
    { href: "#export", key: "export" },
    { href: "#contact", key: "contact" },
  ],
} as const;

export type NavKey = (typeof SITE.nav)[number]["key"];
