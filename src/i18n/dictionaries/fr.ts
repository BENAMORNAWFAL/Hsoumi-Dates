import type { Dictionary } from "./en";

/** French copy. Mirrors `en.ts` line for line — same facts, nothing added. */
const fr: Dictionary = {
  brand: { name: "Hsoumi Dattes", main: "HSOUMI", sub: "DATTES" },

  meta: {
    title: "Hsoumi Dattes — Dattes tunisiennes authentiques pour l’export mondial",
    description:
      "Hsoumi Dattes est une entreprise tunisienne spécialisée dans la collecte, le tri, la transformation, le conditionnement, le stockage et l’export de dattes tunisiennes, dont la Deglet Nour, pour les acheteurs professionnels du monde entier.",
    ogTitle: "Hsoumi Dattes — Dattes tunisiennes authentiques",
    tagline: "Dattes tunisiennes authentiques. Soigneusement sélectionnées. Conditionnées avec professionnalisme. Exportées dans le monde entier.",
  },

  nav: {
    label: "Navigation principale",
    home: "Hsoumi Dattes — retour en haut",
    language: "Langue",
    menu: "Menu",
    close: "Fermer",
    mobileTagline: "Dattes tunisiennes authentiques. Export mondial.",
    links: {
      about: "À propos",
      expertise: "Savoir-faire",
      products: "Produits",
      facilities: "Installations",
      quality: "Qualité",
      export: "Export",
      contact: "Contact",
    },
  },

  hero: {
    label: "Hsoumi Dattes — dattes tunisiennes authentiques",
    alt: "Un palmier dattier solitaire chargé de fruits dorés au coucher du soleil dans le Sahara tunisien",
    eyebrow: "Hsoumi Dattes  —  Tunisie",
    title: ["Dattes tunisiennes", "authentiques."],
    lede: "Soigneusement sélectionnées. Conditionnées avec professionnalisme. Exportées dans le monde entier.",
    copy: "Collecte, tri, conditionnement, stockage et export de dattes tunisiennes pour les acheteurs professionnels du monde entier.",
    cta: "Découvrir notre savoir-faire",
    contact: "Contacter notre équipe export",
    scroll: "Faites défiler    ↓",
    foot: "Deglet Nour  /  Tunisie",
  },

  about: {
    altMain: "Des oasis de palmiers dattiers qui cèdent la place aux dunes du Sahara tunisien",
    altInset: "Les mains d’un producteur tenant une branche de dattes Deglet Nour fraîchement récoltées",
    eyebrow: "02 / À propos",
    title: ["Une entreprise tunisienne,", "dédiée aux dattes."],
    lede: "Du palmier du producteur à l’entrepôt de l’importateur.",
    copy: [
      "Hsoumi Dattes est une entreprise tunisienne spécialisée dans la collecte, le tri, la transformation, le conditionnement, le stockage et l’export de dattes tunisiennes.",
      "Nous collectons les dattes auprès de producteurs tunisiens et faisons passer chaque lot par une chaîne maîtrisée — réception, sélection, calibrage, contrôle, conditionnement et stockage — en préparant chaque commande selon les spécifications des acheteurs professionnels à l’étranger.",
    ],
    closing: "Des dattes tunisiennes, traitées avec soin du palmier au port.",
    footLeft: "Oasis tunisiennes  /  Terre de la Deglet Nour",
    footRight: "Hsoumi Dattes — À propos",
  },

  harvest: {
    alt: "Des récolteurs grimpant à un palmier dattier et descendant des régimes de dattes ensachés",
    altDetail: "Dattes Deglet Nour mûres sur le palmier",
    intro: "03 / Notre savoir-faire  —  Tout commence à la récolte",
    eyebrow: "03 / Notre savoir-faire — La collecte",
    title: ["Tout commence", "au palmier."],
    lede: ["Collectées auprès de producteurs tunisiens.", "Sélectionnées dès leur arrivée."],
    copy: "À la récolte, nous collectons les dattes auprès de producteurs tunisiens. Chaque lot est réceptionné, contrôlé et sélectionné avant d’entrer dans notre processus de tri et de conditionnement.",
    steps: ["Collecte auprès de producteurs tunisiens", "Réception des dattes récoltées", "Sélection à l’arrivée"],
    tagline: "La qualité d’une commande commence à la récolte.",
  },

  process: {
    eyebrow: "03 / Notre savoir-faire — Le processus",
    title: ["Un processus maîtrisé,", "du palmier au port."],
    intro:
      "Chaque lot suit la même séquence — collecte, tri et calibrage, contrôle qualité, conditionnement, stockage et export — afin que chaque commande parvienne à son acheteur conformément aux spécifications.",
    steps: [
      {
        title: "Collecte",
        copy: "Les dattes sont collectées auprès de producteurs tunisiens et réceptionnées pour sélection.",
        alt: "Dattes Deglet Nour mûres suspendues au palmier avant la récolte",
      },
      {
        title: "Tri & calibrage",
        copy: "Triées et calibrées selon la qualité, la taille et la variété en lots homogènes.",
        alt: "Des mains gantées triant des dattes sur une table en inox",
      },
      {
        title: "Contrôle qualité",
        copy: "Contrôlées et préparées pour que seuls les fruits conformes soient conditionnés.",
        alt: "Une datte tenue en l’air pour un contrôle visuel",
      },
      {
        title: "Conditionnement",
        copy: "Conditionnées et étiquetées dans les formats prévus pour chaque commande.",
        alt: "Des dattes disposées à la main dans une barquette",
      },
      {
        title: "Stockage",
        copy: "Conservées dans des conditions de stockage adaptées pour préserver les fruits jusqu’à l’expédition.",
        alt: "Rayonnages à palettes dans un entrepôt de stockage (photo d’illustration)",
      },
      {
        title: "Export",
        copy: "Commandes préparées, chargées et expédiées aux acheteurs sur les marchés internationaux.",
        alt: "Conteneurs empilés dans un port méditerranéen",
      },
    ],
    sequence: "Collecte → Tri → Qualité → Conditionnement → Stockage → Export",
  },

  products: {
    eyebrow: "04 / Nos produits",
    title: "Les dattes tunisiennes, avec la Deglet Nour en tête.",
    intro:
      "La Deglet Nour — la « datte de lumière » — est la variété emblématique de la Tunisie : translucide, aux reflets de miel et délicatement sucrée. Nous la proposons dans les présentations demandées par les acheteurs professionnels.",
    items: [
      {
        category: "Dattes branchées",
        title: "Deglet Nour",
        description:
          "Conservées sur leurs branches naturelles — la présentation traditionnelle de la variété emblématique de la Tunisie, prisée pour la vente au détail haut de gamme et les cadeaux.",
        formats: "Formats en boîte sur demande",
        alt: "Une branche de dattes Deglet Nour posée sur un bloc de travertin",
      },
      {
        category: "Dattes dénoyautées",
        title: "Deglet Nour",
        description: "Deglet Nour soigneusement dénoyautées pour la grande distribution, la restauration et l’industrie agroalimentaire.",
        formats: "Formats détail et vrac sur demande",
        alt: "Dattes Deglet Nour dénoyautées dans un plat en céramique sombre",
      },
      {
        category: "Autres variétés",
        title: "Variétés tunisiennes",
        description: "D’autres variétés traditionnelles de dattes tunisiennes, selon la saison et la disponibilité.",
        formats: "Disponibilité sur demande",
        alt: "Une pyramide de dattes tunisiennes dorées sur un socle en pierre",
      },
    ],
    packagingAlt: "Cartons simples et matériel d’emballage (photo d’illustration)",
    packagingEyebrow: "Formats de conditionnement",
    packagingTitle: "Conditionnées selon votre cahier des charges.",
    formats: [
      { title: "Emballages grand public", copy: "Emballages prêts à la vente pour supermarchés et épiceries spécialisées." },
      { title: "Coffrets cadeaux", copy: "Coffrets de présentation pour dattes branchées et premium." },
      { title: "Cartons vrac", copy: "Cartons pour distributeurs, restauration et industrie agroalimentaire." },
    ],
    formatsNote: "Les formats, poids nets et étiquetages sont définis avec chaque client selon le marché de destination.",
    closing: "Fruits entiers. Qualité constante.",
    cta: "Demander les fiches produits",
  },

  facilities: {
    eyebrow: "05 / Nos installations",
    title: ["Là où la récolte", "devient une", "commande export."],
    intro:
      "Notre activité réunit les opérations nécessaires pour réceptionner, préparer, conserver et expédier les dattes à une échelle professionnelle.",
    operations: [
      {
        title: "Lignes de tri",
        copy: "Les dattes sont nettoyées, triées et calibrées selon la qualité, la taille et la variété.",
        alt: "Des dattes avançant sur une ligne de nettoyage et de tri en inox",
      },
      {
        title: "Conditionnement",
        copy: "Conditionnement et étiquetage industriels dans les formats exigés par chaque commande.",
        alt: "Cartons et matériel d’emballage prêts pour le conditionnement (photo d’illustration)",
      },
      {
        title: "Stockage",
        copy: "Les dattes conditionnées sont conservées dans des conditions de stockage adaptées jusqu’à l’expédition.",
        alt: "Cartons palettisés sur des rayonnages d’entrepôt (photo d’illustration)",
      },
      {
        title: "Préparation des commandes export",
        copy: "Les commandes sont assemblées, palettisées et préparées pour le chargement.",
        alt: "Un camion chargé partant vers le port",
      },
    ],
    illustrative: "Photos d’illustration",
  },

  quality: {
    alt: "Une datte tenue entre des doigts gantés pour un contrôle visuel",
    captionLeft: "Contrôle",
    illustrative: "Photos d’illustration",
    eyebrow: "06 / Notre qualité",
    title: ["La qualité se construit,", "étape par étape."],
    intro:
      "La qualité n’est pas un simple contrôle en bout de chaîne. Elle dépend de la façon dont les fruits sont sélectionnés, manipulés, conditionnés et conservés à chaque étape — du producteur au conteneur.",
    principles: [
      {
        title: "Sélection à la réception",
        copy: "Chaque lot est contrôlé à son arrivée afin que seuls les fruits conformes poursuivent le processus.",
      },
      {
        title: "Tri & calibrage",
        copy: "Les dattes sont séparées selon la qualité, la taille et la variété pour constituer des lots homogènes.",
      },
      {
        title: "Contrôle",
        copy: "Un contrôle visuel pendant la préparation écarte les fruits qui ne répondent pas aux exigences.",
      },
      {
        title: "Hygiène",
        copy: "Manipulation propre, équipements propres et tenues de protection tout au long de la transformation et du conditionnement.",
      },
      {
        title: "Conservation",
        copy: "Des conditions de conditionnement et de stockage choisies pour préserver la texture, la saveur et l’aspect.",
      },
    ],
    note: "Les spécifications produits, la documentation et les exigences d’étiquetage sont définies avec chaque client selon la réglementation du marché de destination.",
  },

  route: {
    illustration:
      "Illustration : des caisses de dattes sont chargées sur un camion, conduites au port, hissées sur un cargo et transportées par la mer.",
    eyebrow: "07 / Export & présence internationale  —  Le trajet",
    title: "Comment une commande Hsoumi Dattes voyage de nos installations jusqu’aux marchés internationaux",
    steps: [
      { title: "Conditionné & chargé", copy: "Les cartons conditionnés sont chargés dans le conteneur dans nos installations." },
      { title: "Sur la route", copy: "Transport terrestre de nos installations jusqu’à la côte tunisienne." },
      { title: "Au port", copy: "Le conteneur est remis puis hissé à bord pour l’expédition." },
      { title: "En mer", copy: "Fret maritime vers les acheteurs professionnels des marchés internationaux." },
      { title: "Jusqu’à votre marché", copy: "Des dattes tunisiennes authentiques, livrées à la destination convenue." },
    ],
    markets: "Depuis la Tunisie  ·  Vers les acheteurs professionnels des marchés internationaux",
    stages: "Étapes du trajet",
  },

  export: {
    eyebrow: "07 / Export & présence internationale",
    title: ["Des dattes tunisiennes", "pour les marchés internationaux."],
    intro:
      "Hsoumi Dattes est une entreprise tunisienne d’export de dattes au service des acheteurs professionnels à l’étranger. Chaque commande est préparée selon les spécifications convenues de produit, de conditionnement et d’expédition.",
    buyersLabel: "Nos interlocuteurs",
    buyers: ["Importateurs", "Distributeurs", "Grossistes", "Acheteurs de la distribution", "Partenaires de l’agroalimentaire"],
    legs: [
      {
        label: "01 / Préparation de commande",
        title: "Conditionné, palettisé, chargé",
        copy: "Chaque commande est assemblée selon les spécifications convenues de produit, de conditionnement et d’étiquetage.",
        alt: "Un camion chargé sur la route depuis la région des oasis",
      },
      {
        label: "02 / Opérations portuaires",
        title: "De nos installations au port",
        copy: "Le transport et la remise au port sont coordonnés pour chaque expédition.",
        alt: "Conteneurs empilés dans un port à conteneurs méditerranéen",
      },
      {
        label: "03 / Expédition internationale",
        title: "Livré sur votre marché",
        copy: "Fret maritime vers les acheteurs professionnels à l’étranger, selon les conditions d’expédition convenues.",
        alt: "Un porte-conteneurs quittant la côte à l’heure dorée",
      },
    ],
    ctaTitle: "Vous cherchez un fournisseur fiable de dattes tunisiennes ?",
    ctaNote: "Pour importateurs, distributeurs & partenaires internationaux",
    cta: "Contacter notre équipe export",
  },

  contact: {
    eyebrow: "08 / Contact",
    title: ["Parlons de", "votre prochaine commande."],
    intro:
      "Notre équipe export répond aux importateurs, distributeurs et partenaires internationaux. Parlez-nous de votre marché, des produits que vous recherchez et des volumes dont vous avez besoin.",
    email: "E-mail",
    phone: "Téléphone",
    location: "Localisation",
    country: "Tunisie",
    fields: {
      name: "Nom complet",
      company: "Société",
      email: "E-mail professionnel",
      phone: "Téléphone",
      country: "Pays",
      business: "Type d’activité",
      inquiry: "Demande",
      products: "Produits recherchés",
      volume: "Volume & fréquence estimés",
      message: "Message",
    },
    select: "Sélectionner…",
    businessTypes: ["Importateur", "Distributeur / grossiste", "Chaîne de distribution", "Industrie agroalimentaire", "Autre"],
    inquiries: ["Demande de devis", "Fiches produits", "Partenariat de distribution", "Autre demande"],
    productOptions: ["Deglet Nour — branchées", "Deglet Nour — en vrac", "Deglet Nour — dénoyautées", "Autres variétés tunisiennes"],
    volumePlaceholder: "ex. conteneurs par saison, cartons par mois",
    messagePlaceholder: "Conditionnement, port de destination, période de livraison…",
    subjectFallback: "Demande",
    noteBefore: "L’envoi ouvre votre messagerie avec votre demande préparée pour notre équipe export.",
    noteAfter: "Votre messagerie devrait maintenant être ouverte avec votre demande prête à être envoyée.",
    submit: "Envoyer la demande",
  },

  footer: {
    emblemAlt: "Emblème Hsoumi Dattes",
    chain: "Collecte · Tri · Conditionnement · Stockage · Export",
    title: ["Des dattes tunisiennes authentiques,", "préparées pour le monde."],
    navLabel: "Pied de page",
    explore: "Explorer",
    inquiries: "Demandes export",
    sendInquiry: "Envoyer une demande →",
    country: "Tunisie",
    tagline: "Dattes tunisiennes authentiques",
    backToTop: "↑ Retour en haut",
    poweredBy: "Propulsé par",
    author: "NAWFAL BENAMOR",
  },
};

export default fr;
