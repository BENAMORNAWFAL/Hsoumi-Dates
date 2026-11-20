/**
 * Brand, navigation and contact configuration for Hsoumi Dates.
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
  nav: [
    { href: "#about", label: "About" },
    { href: "#expertise", label: "Expertise" },
    { href: "#products", label: "Products" },
    { href: "#facilities", label: "Facilities" },
    { href: "#quality", label: "Quality" },
    { href: "#export", label: "Export" },
    { href: "#contact", label: "Contact" },
  ],
} as const;
