/**
 * English copy for the whole site. `ar.ts` mirrors this shape exactly
 * (the `Dictionary` type enforces it). Arrays line up, by index, with the
 * images and journey stops declared in each section component.
 */
const en = {
  /** Brand name as written in this language (logo, footer wordmark, metadata). */
  brand: { name: "Hsoumi Dates", main: "HSOUMI", sub: "DATES" },

  meta: {
    title: "Hsoumi Dates — Authentic Tunisian Dates for Worldwide Export",
    description:
      "Hsoumi Dates is a Tunisian company specialised in the collection, sorting, processing, packaging, storage and export of Tunisian dates, including Deglet Nour, for professional buyers worldwide.",
    ogTitle: "Hsoumi Dates — Authentic Tunisian Dates",
    tagline: "Authentic Tunisian Dates. Carefully Selected. Professionally Packed. Worldwide Export.",
  },

  nav: {
    label: "Main",
    home: "Hsoumi Dates — back to top",
    language: "Language",
    menu: "Menu",
    close: "Close",
    mobileTagline: "Authentic Tunisian dates. Worldwide export.",
    links: {
      about: "About",
      expertise: "Expertise",
      products: "Products",
      facilities: "Facilities",
      quality: "Quality",
      export: "Export",
      contact: "Contact",
    },
  },

  hero: {
    label: "Hsoumi Dates — authentic Tunisian dates",
    alt: "A lone date palm heavy with golden fruit at sunset in the Tunisian Sahara",
    eyebrow: "Hsoumi Dates  —  Tunisia",
    title: ["Authentic", "Tunisian dates."],
    lede: "Carefully selected. Professionally packed. Worldwide export.",
    copy: "Collection, sorting, packaging, storage and export of Tunisian dates for professional buyers around the world.",
    cta: "Discover our expertise",
    contact: "Contact our export team",
    scroll: "Scroll to explore    ↓",
    foot: "Deglet Nour  /  Tunisia",
  },

  about: {
    altMain: "Date palm oases giving way to the dunes of the Tunisian Sahara",
    altInset: "A grower's hands holding a freshly harvested strand of Deglet Nour dates",
    eyebrow: "02 / About us",
    title: ["A Tunisian company,", "dedicated to dates."],
    lede: "From the producer’s palm to the importer’s warehouse.",
    copy: [
      "Hsoumi Dates is a Tunisian company specialised in the collection, sorting, processing, packaging, storage and export of Tunisian dates.",
      "We collect dates from Tunisian producers and bring every lot through a controlled chain — reception, selection, grading, inspection, packing and storage — preparing each order to the specifications of professional buyers abroad.",
    ],
    closing: "Tunisian dates, handled with care from palm to port.",
    footLeft: "Tunisian oases  /  Home of Deglet Nour",
    footRight: "Hsoumi Dates — About us",
  },

  harvest: {
    alt: "Harvesters climbing a date palm and lowering bagged bunches of dates",
    altDetail: "Ripe Deglet Nour dates on the palm",
    intro: "03 / Our expertise  —  It starts at harvest",
    eyebrow: "03 / Our expertise — Collection",
    title: ["It all starts", "at the palm."],
    lede: ["Collected from Tunisian producers.", "Selected on arrival."],
    copy: "At harvest time we collect dates from Tunisian producers. Each lot is received, checked and selected before it enters our sorting and packing process.",
    steps: ["Collection from Tunisian producers", "Reception of harvested dates", "Selection on arrival"],
    tagline: "The quality of an order starts with the harvest.",
  },

  process: {
    eyebrow: "03 / Our expertise — The process",
    title: ["One controlled process,", "from palm to port."],
    intro:
      "Every lot follows the same sequence — collection, sorting and grading, quality control, packaging, storage and export — so that each order reaches its buyer as specified.",
    steps: [
      {
        title: "Collection",
        copy: "Dates are collected from Tunisian producers and received for selection.",
        alt: "Ripe Deglet Nour dates hanging on the palm before harvest",
      },
      {
        title: "Sorting & grading",
        copy: "Sorted and graded by quality, size and variety into consistent lots.",
        alt: "Gloved hands sorting dates on a stainless-steel table",
      },
      {
        title: "Quality control",
        copy: "Inspected and prepared so that only suitable fruit is packed.",
        alt: "A single date held up for visual inspection",
      },
      {
        title: "Packaging",
        copy: "Packed and labelled in the formats specified for each order.",
        alt: "Dates being arranged by hand in a packing tray",
      },
      {
        title: "Storage",
        copy: "Kept in appropriate storage conditions to preserve the fruit until dispatch.",
        alt: "Pallet racking in a storage warehouse (illustrative photograph)",
      },
      {
        title: "Export",
        copy: "Orders prepared, loaded and shipped to buyers in international markets.",
        alt: "Shipping containers stacked at a Mediterranean port",
      },
    ],
    sequence: "Collection → Sorting → Quality → Packaging → Storage → Export",
  },

  products: {
    eyebrow: "04 / Our products",
    title: "Tunisian dates, led by Deglet Nour.",
    intro:
      "Deglet Nour — the “date of light” — is Tunisia’s signature variety: translucent, honey-toned and delicately sweet. We supply it in the presentations professional buyers ask for.",
    items: [
      {
        category: "Branched dates",
        title: "Deglet Nour",
        description:
          "Kept on their natural strands — the traditional presentation of Tunisia’s signature variety, prized for premium retail and gifting.",
        formats: "Boxed formats on request",
        alt: "A strand of Deglet Nour dates on the branch, resting on a travertine block",
      },
      {
        category: "Pitted dates",
        title: "Deglet Nour",
        description: "Carefully pitted Deglet Nour for retail, food service and food-industry customers.",
        formats: "Retail and bulk formats on request",
        alt: "Pitted Deglet Nour dates in a dark ceramic dish",
      },
      {
        category: "Other varieties",
        title: "Tunisian varieties",
        description: "Other traditional Tunisian date varieties, subject to season and availability.",
        formats: "Availability on request",
        alt: "A pyramid of golden Tunisian dates on a stone plinth",
      },
    ],
    packagingAlt: "Plain cardboard cartons and packing materials (illustrative photograph)",
    packagingEyebrow: "Packaging formats",
    packagingTitle: "Packed to your specification.",
    formats: [
      { title: "Consumer packs", copy: "Retail-ready packs for supermarkets and specialist shops." },
      { title: "Gift boxes", copy: "Presentation boxes for branched and premium dates." },
      { title: "Bulk cartons", copy: "Cartons for distributors, food service and food industry." },
    ],
    formatsNote: "Formats, net weights and labelling are agreed with each client according to the destination market.",
    closing: "Whole fruit. Consistent quality.",
    cta: "Request product specifications",
  },

  facilities: {
    eyebrow: "05 / Our facilities",
    title: ["Where the harvest", "becomes an", "export order."],
    intro:
      "Our activity brings together the operations needed to receive, prepare, keep and ship dates at a professional scale.",
    operations: [
      {
        title: "Sorting lines",
        copy: "Dates are cleaned, sorted and graded by quality, size and variety.",
        alt: "Dates moving along a stainless-steel cleaning and sorting line",
      },
      {
        title: "Packaging operations",
        copy: "Industrial packing and labelling in the formats each order requires.",
        alt: "Cartons and packing materials ready for packaging (illustrative photograph)",
      },
      {
        title: "Storage",
        copy: "Packed dates are kept in appropriate storage conditions until dispatch.",
        alt: "Palletised cartons on warehouse racking (illustrative photograph)",
      },
      {
        title: "Export order preparation",
        copy: "Orders are assembled, palletised and prepared for loading.",
        alt: "A loaded truck leaving for the port",
      },
    ],
    illustrative: "Illustrative photography",
  },

  quality: {
    alt: "A date held between gloved fingers for visual inspection",
    captionLeft: "Inspection",
    illustrative: "Illustrative photography",
    eyebrow: "06 / Our quality",
    title: ["Quality is built in,", "step by step."],
    intro:
      "Quality is not a single check at the end of the line. It depends on how the fruit is selected, handled, packed and kept at every stage — from the producer to the container.",
    principles: [
      {
        title: "Selection at reception",
        copy: "Each lot is checked on arrival so that only suitable fruit moves forward.",
      },
      {
        title: "Sorting & grading",
        copy: "Dates are separated by quality, size and variety to build consistent lots.",
      },
      {
        title: "Inspection",
        copy: "Visual inspection during preparation removes fruit that does not meet the required standard.",
      },
      {
        title: "Hygiene",
        copy: "Clean handling, clean equipment and protective wear throughout processing and packing.",
      },
      {
        title: "Preservation",
        copy: "Packing and storage conditions chosen to protect texture, flavour and appearance.",
      },
    ],
    note: "Product specifications, documentation and labelling requirements are discussed with each client according to the regulations of the destination market.",
  },

  route: {
    illustration:
      "Illustration: crates of dates are loaded onto a truck, driven to the port, lifted onto a cargo ship and carried across the sea.",
    eyebrow: "07 / Export & global reach  —  The route",
    title: "How an order of Hsoumi Dates travels from our facility to international markets",
    steps: [
      { title: "Packed & loaded", copy: "Packed cartons are loaded into the container at our facility." },
      { title: "On the road", copy: "Overland transport from our facility to the Tunisian coast." },
      { title: "At the port", copy: "The container is handed over and lifted aboard for shipment." },
      { title: "Across the sea", copy: "Sea freight to professional buyers in international markets." },
      { title: "To your market", copy: "Authentic Tunisian dates, delivered to the agreed destination." },
    ],
    markets: "From Tunisia  ·  To professional buyers in international markets",
    stages: "Journey stages",
  },

  export: {
    eyebrow: "07 / Export & global reach",
    title: ["Tunisian dates", "for international markets."],
    intro:
      "Hsoumi Dates is a Tunisian dates export company serving professional buyers abroad. Every order is prepared to the agreed product, packaging and shipping specifications.",
    buyersLabel: "Who we work with",
    buyers: ["Importers", "Distributors", "Wholesalers", "Retail buyers", "Food-industry partners"],
    legs: [
      {
        label: "01 / Order preparation",
        title: "Packed, palletised, loaded",
        copy: "Each order is assembled to the agreed product, packaging and labelling specification.",
        alt: "A loaded truck on the road from the oasis region",
      },
      {
        label: "02 / Port handling",
        title: "From our facility to the port",
        copy: "Transport and handover to the port are coordinated for every shipment.",
        alt: "Containers stacked at a Mediterranean container port",
      },
      {
        label: "03 / International shipping",
        title: "Delivered to your market",
        copy: "Sea freight to professional buyers abroad, on the agreed shipping terms.",
        alt: "A container ship leaving the coast at golden hour",
      },
    ],
    ctaTitle: "Looking for a reliable Tunisian dates supplier?",
    ctaNote: "For importers, distributors & international partners",
    cta: "Contact our export team",
  },

  contact: {
    eyebrow: "08 / Contact",
    title: ["Let’s discuss", "your next order."],
    intro:
      "Our export team answers importers, distributors and international partners. Tell us about your market, the products you are looking for and the volumes you need.",
    email: "Email",
    phone: "Phone",
    location: "Location",
    country: "Tunisia",
    fields: {
      name: "Full name",
      company: "Company",
      email: "Business email",
      phone: "Phone",
      country: "Country",
      business: "Business type",
      inquiry: "Inquiry",
      products: "Products of interest",
      volume: "Estimated volume & frequency",
      message: "Message",
    },
    select: "Select…",
    businessTypes: ["Importer", "Distributor / wholesaler", "Retail chain", "Food industry", "Other"],
    inquiries: ["Request a quotation", "Product specifications", "Distribution partnership", "Other inquiry"],
    productOptions: ["Deglet Nour — branched", "Deglet Nour — loose", "Deglet Nour — pitted", "Other Tunisian varieties"],
    volumePlaceholder: "e.g. containers per season, cartons per month",
    messagePlaceholder: "Packaging, destination port, delivery period…",
    subjectFallback: "Inquiry",
    noteBefore: "Sending opens your email app with your inquiry prepared for our export team.",
    noteAfter: "Your email app should now be open with your inquiry ready to send.",
    submit: "Send inquiry",
  },

  footer: {
    emblemAlt: "Hsoumi Dates emblem",
    chain: "Collection · Sorting · Packaging · Storage · Export",
    title: ["Authentic Tunisian dates,", "prepared for the world."],
    navLabel: "Footer",
    explore: "Explore",
    inquiries: "Export inquiries",
    sendInquiry: "Send an inquiry →",
    country: "Tunisia",
    tagline: "Authentic Tunisian dates",
    backToTop: "↑ Back to top",
    poweredBy: "Powered by",
    author: "NAWFAL BENAMOR",
  },
};

/** Same shape as the English copy, with every leaf widened to `string`. */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : { [K in keyof T]: Widen<T[K]> };

export type Dictionary = Widen<typeof en>;

export default en satisfies Dictionary;
