"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { revealOnEnter } from "@/lib/reveal";
import { Button } from "@/components/ui/Button";
import { SplitLines } from "@/components/ui/SplitLines";

const LEGS = [
  {
    label: "01 / Order preparation",
    title: "Packed, palletised, loaded",
    copy: "Each order is assembled to the agreed product, packaging and labelling specification.",
    img: "/images/export-by-road.jpg",
    alt: "A loaded truck on the road from the oasis region",
  },
  {
    label: "02 / Port handling",
    title: "From our facility to the port",
    copy: "Transport and handover to the port are coordinated for every shipment.",
    img: "/images/export-at-port.jpg",
    alt: "Containers stacked at a Mediterranean container port",
  },
  {
    label: "03 / International shipping",
    title: "Delivered to your market",
    copy: "Sea freight to professional buyers abroad, on the agreed shipping terms.",
    img: "/images/export-across-sea.jpg",
    alt: "A container ship leaving the coast at golden hour",
  },
];

const BUYERS = ["Importers", "Distributors", "Wholesalers", "Retail buyers", "Food-industry partners"];

/** 07 — Export & global reach. No destination countries or figures are stated. */
export function Export() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        revealOnEnter(root.current!);
        gsap.from("[data-cta]", {
          clipPath: "inset(0% 50% 0% 50%)",
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: "[data-cta]", start: "top 88%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="export"
      data-nav="light"
      className="relative bg-cream py-24 text-brown lg:pt-[82px] lg:pb-[65px]"
      aria-labelledby="export-title"
    >
      <div className="shell">
        <p data-fade className="eyebrow">07 / Export &amp; global reach</p>
        <div className="mt-6 flex flex-col gap-8 lg:mt-[27px] lg:flex-row lg:items-start lg:justify-between">
          <SplitLines
            id="export-title"
            className="t-h1 -ml-[4px]"
            lines={["Tunisian dates", "for international markets."]}
          />
          <div className="max-w-[445px] lg:mt-[40px] lg:mr-[-10px]">
            <p data-fade className="text-[14px] leading-[23.8px] text-muted">
              Hsoumi Dates is a Tunisian dates export company serving professional buyers abroad. Every
              order is prepared to the agreed product, packaging and shipping specifications.
            </p>
            <ul data-fade className="mt-5 flex flex-wrap gap-2" aria-label="Who we work with">
              {BUYERS.map((b) => (
                <li key={b} className="border border-line px-3 py-1 text-[11px] leading-[18px] text-brown">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-x-[25px] gap-y-14 md:grid-cols-3 lg:mt-[58px]">
          {LEGS.map((leg, i) => (
            <article key={leg.label}>
              <div data-reveal-img={i * 0.12} className="relative aspect-[410/275] overflow-hidden">
                <Image src={leg.img} alt={leg.alt} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
              </div>
              <p data-fade={i * 0.12} className="caption mt-[23px] text-muted">{leg.label}</p>
              <h3 data-fade={i * 0.12} className="mt-[18px] font-serif text-[30px] leading-[1.05]">{leg.title}</h3>
              <p data-fade={i * 0.12} className="mt-[18px] max-w-[380px] text-[13px] leading-[22.1px] text-muted">
                {leg.copy}
              </p>
            </article>
          ))}
        </div>

        <div
          data-cta
          className="mt-20 flex flex-col gap-8 bg-olive px-6 py-8 text-cream md:flex-row md:items-center md:justify-between md:px-8 lg:mt-[81px] lg:py-[27px] lg:pr-[90px]"
        >
          <div>
            <p className="font-serif text-[28px] leading-[1.05] md:text-[36px]">
              Looking for a reliable Tunisian dates supplier?
            </p>
            <p className="caption mt-4 pl-[2px] text-mist lg:mt-[19px]">For importers, distributors &amp; international partners</p>
          </div>
          <Button href="#contact" variant="on-image" className="self-start md:self-auto">
            Contact our export team
          </Button>
        </div>
      </div>
    </section>
  );
}
