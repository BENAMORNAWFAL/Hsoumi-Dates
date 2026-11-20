"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { revealOnEnter } from "@/lib/reveal";
import { Button } from "@/components/ui/Button";
import { ProductCard, type Product } from "@/components/ui/ProductCard";

const PRODUCTS: Product[] = [
  {
    category: "Branched dates",
    title: "Deglet Nour",
    description:
      "Kept on their natural strands — the traditional presentation of Tunisia’s signature variety, prized for premium retail and gifting.",
    formats: "Boxed formats on request",
    img: "/images/product-deglet-nour-branch.jpg",
    alt: "A strand of Deglet Nour dates on the branch, resting on a travertine block",
    stop: "selection",
  },
  {
    category: "Pitted dates",
    title: "Deglet Nour",
    description:
      "Carefully pitted Deglet Nour for retail, food service and food-industry customers.",
    formats: "Retail and bulk formats on request",
    img: "/images/product-deglet-nour-pitted.jpg",
    alt: "Pitted Deglet Nour dates in a dark ceramic dish",
  },
  {
    category: "Other varieties",
    title: "Tunisian varieties",
    description:
      "Other traditional Tunisian date varieties, subject to season and availability.",
    formats: "Availability on request",
    img: "/images/product-kenta.jpg",
    alt: "A pyramid of golden Tunisian dates on a stone plinth",
  },
];

const FORMATS = [
  { title: "Consumer packs", copy: "Retail-ready packs for supermarkets and specialist shops." },
  { title: "Gift boxes", copy: "Presentation boxes for branched and premium dates." },
  { title: "Bulk cartons", copy: "Cartons for distributors, food service and food industry." },
];

/** 04 — Our products. */
export function Collection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => revealOnEnter(section));

      // Products drift at slightly different speeds, like objects on a table.
      mm.add(MQ.desktop, () => {
        gsap.utils.toArray<HTMLElement>("[data-variety]", section).forEach((el, i) => {
          gsap.fromTo(
            el,
            { y: [40, 110, 70][i] },
            {
              y: 0,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "center center", scrub: 1 },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="products"
      data-nav="light"
      className="relative bg-sand py-24 text-brown lg:pt-[77px] lg:pb-[64px]"
      aria-labelledby="products-title"
    >
      <div className="shell">
        <p data-fade className="eyebrow">04 / Our products</p>
        <h2 id="products-title" className="t-h1 mt-6 -ml-[4px] lg:mt-[24px] lg:!text-[clamp(2.6rem,5vw,4.5rem)]">
          <span className="line-mask"><span data-line>Tunisian dates, led by Deglet Nour.</span></span>
        </h2>
        <p data-fade className="mt-5 max-w-[860px] text-[15px] leading-[27.2px] text-muted md:text-[16px] lg:mt-[22px]">
          Deglet Nour — the “date of light” — is Tunisia’s signature variety: translucent, honey-toned and
          delicately sweet. We supply it in the presentations professional buyers ask for.
        </p>

        <div className="mt-14 grid gap-x-[25px] gap-y-16 sm:grid-cols-2 lg:mt-[59px] lg:grid-cols-3">
          {PRODUCTS.map((p, i) => (
            <div key={p.img} data-variety>
              <ProductCard product={p} delay={i * 0.12} />
            </div>
          ))}
        </div>

        {/* Packaging formats */}
        <div className="mt-20 grid gap-10 border-t border-line pt-12 lg:mt-[72px] lg:grid-cols-[minmax(0,410fr)_minmax(0,870fr)] lg:gap-[25px]">
          <div className="flex gap-6">
            <div data-reveal-img className="relative aspect-square w-[120px] shrink-0 overflow-hidden">
              <Image
                src="/images/facility-export-cartons.jpg"
                alt="Plain cardboard cartons and packing materials (illustrative photograph)"
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
            <div>
              <p data-fade className="eyebrow text-muted">Packaging formats</p>
              <p data-fade className="mt-3 font-serif text-[28px] leading-[1.05]">Packed to your specification.</p>
            </div>
          </div>
          <div>
            <ul className="grid gap-6 sm:grid-cols-3">
              {FORMATS.map((f) => (
                <li key={f.title} data-fade>
                  <p className="font-serif text-[22px] leading-[1.1]">{f.title}</p>
                  <p className="mt-2 text-[13px] leading-[22.1px] text-muted">{f.copy}</p>
                </li>
              ))}
            </ul>
            <p data-fade className="mt-6 text-[13px] leading-[22.1px] text-muted">
              Formats, net weights and labelling are agreed with each client according to the destination market.
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between lg:mt-[48px] lg:pr-[68px]">
          <p data-fade className="font-serif text-[28px] leading-[29.4px]">Whole fruit. Consistent quality.</p>
          <div data-fade>
            <Button href="#contact" variant="chocolate">Request product specifications</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
