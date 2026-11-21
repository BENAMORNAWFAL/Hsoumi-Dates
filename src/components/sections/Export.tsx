"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { revealOnEnter } from "@/lib/reveal";
import { Button } from "@/components/ui/Button";
import { SplitLines } from "@/components/ui/SplitLines";
import type { Dictionary } from "@/i18n/config";

/** Photograph per leg; copy comes from the dictionary (same order). */
const LEGS = [
  {
    img: "/images/export-by-road.jpg",
  },
  {
    img: "/images/export-at-port.jpg",
  },
  {
    img: "/images/export-across-sea.jpg",
  },
];

/** 07 — Export & global reach. No destination countries or figures are stated. */
export function Export({ t }: { t: Dictionary["export"] }) {
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
        <p data-fade className="eyebrow">{t.eyebrow}</p>
        <div className="mt-6 flex flex-col gap-8 lg:mt-[27px] lg:flex-row lg:items-start lg:justify-between">
          <SplitLines
            id="export-title"
            className="t-h1 -ms-[4px]"
            lines={t.title}
          />
          <div className="max-w-[445px] lg:mt-[40px] lg:-me-[10px]">
            <p data-fade className="text-[14px] leading-[23.8px] text-muted">
              {t.intro}
            </p>
            <ul data-fade className="mt-5 flex flex-wrap gap-2" aria-label={t.buyersLabel}>
              {t.buyers.map((b) => (
                <li key={b} className="border border-line px-3 py-1 text-[11px] leading-[18px] text-brown">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-x-[25px] gap-y-14 md:grid-cols-3 lg:mt-[58px]">
          {LEGS.map((leg, i) => (
            <article key={leg.img}>
              <div data-reveal-img={i * 0.12} className="relative aspect-[410/275] overflow-hidden">
                <Image src={leg.img} alt={t.legs[i].alt} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
              </div>
              <p data-fade={i * 0.12} className="caption mt-[23px] text-muted">{t.legs[i].label}</p>
              <h3 data-fade={i * 0.12} className="mt-[18px] font-serif text-[30px] leading-[1.05]">{t.legs[i].title}</h3>
              <p data-fade={i * 0.12} className="mt-[18px] max-w-[380px] text-[13px] leading-[22.1px] text-muted">
                {t.legs[i].copy}
              </p>
            </article>
          ))}
        </div>

        <div
          data-cta
          className="mt-20 flex flex-col gap-8 bg-olive px-6 py-8 text-cream md:flex-row md:items-center md:justify-between md:px-8 lg:mt-[81px] lg:py-[27px] lg:pe-[90px]"
        >
          <div>
            <p className="font-serif text-[28px] leading-[1.05] md:text-[36px]">
              {t.ctaTitle}
            </p>
            <p className="caption mt-4 ps-[2px] text-mist lg:mt-[19px]">{t.ctaNote}</p>
          </div>
          <Button href="#contact" variant="on-image" className="self-start md:self-auto">
            {t.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
