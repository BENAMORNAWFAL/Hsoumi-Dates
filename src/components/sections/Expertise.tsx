"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { revealOnEnter } from "@/lib/reveal";
import { SplitLines } from "@/components/ui/SplitLines";
import { JourneyStop } from "@/components/ui/JourneyStop";
import type { STOPS } from "@/lib/journey";
import type { Dictionary } from "@/i18n/config";

/** Pinned timeline rhythm: one step every GAP, each revealing over REVEAL. */
const GAP = 0.6;
const REVEAL = 1.2;

/** Photographs and journey stops for each step; copy comes from the dictionary (same order). */
const PROCESS: {
  img: string;
  stop?: keyof typeof STOPS;
}[] = [
  {
    img: "/images/harvest-sunlit-dates.jpg",
  },
  {
    img: "/images/process-sorting-deglet-nour-clean.jpg",
    stop: "sorting",
  },
  {
    img: "/images/process-quality-deglet-nour-clean.jpg",
    stop: "inspection",
  },
  {
    img: "/images/process-preparation.jpg",
  },
  {
    img: "/images/facility-warehouse-racks.jpg",
  },
  {
    img: "/images/export-at-port.jpg",
  },
];

const TOTAL = (PROCESS.length - 1) * GAP + REVEAL;
/** Pin progress at which the travelling date rests on card i (just after it settles). */
const restFrac = (i: number) => (i * GAP + REVEAL * 0.85) / TOTAL;

/** 03 — Our expertise: the complete process. */
export function Expertise({ t }: { t: Dictionary["process"] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      // Wide screens: the section holds while each step of the process comes to light in order.
      mm.add(MQ.wide, () => {
        revealOnEnter(q("[data-expertise-head]")[0]);
        const counter = q("[data-counter]")[0] as HTMLElement;
        counter.textContent = "00";

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: section,
            start: () => (section.offsetHeight > window.innerHeight ? "bottom bottom" : "top top"),
            end: "+=170%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            const step = Math.max(0, Math.min(PROCESS.length, Math.floor((tl.time() + GAP * 0.6) / GAP)));
            counter.textContent = `0${step}`;
          },
        });

        tl.fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1, duration: TOTAL, ease: "none" }, 0);
        q("[data-card]").forEach((card, i) => {
          const at = i * GAP;
          tl.fromTo(
            card.querySelector("[data-card-photo]"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" },
            at,
          )
            .fromTo(card.querySelector("[data-reveal-scale]"), { scale: 1.3 }, { scale: 1, duration: REVEAL, ease: "power2.out" }, at)
            .from(card.querySelectorAll("[data-card-text]"), { autoAlpha: 0, y: 24, stagger: 0.12, duration: 0.5 }, at + 0.35);
        });
      });

      mm.add(MQ.belowWide, () => revealOnEnter(section));
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="process"
      data-nav="light"
      data-journey-pin
      data-fp-steps={`${restFrac(1)},${restFrac(2)},1`}
      className="relative bg-cream py-24 text-brown xl:flex xl:min-h-[100svh] xl:flex-col xl:justify-center xl:py-[70px]"
      aria-labelledby="process-title"
    >
      <div className="shell w-full">
        <div data-expertise-head className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p data-fade className="eyebrow">{t.eyebrow}</p>
            <SplitLines
              id="process-title"
              className="t-h2 mt-6 -ms-[4px] max-w-[875px] lg:mt-[24px] lg:!text-[clamp(2.3rem,4.3vw,3.9rem)]"
              lines={t.title}
            />
          </div>
          <p data-fade className="max-w-[380px] pb-[14px] text-[14px] leading-[23.8px] text-muted">
            {t.intro}
          </p>
        </div>

        <ol className="mt-14 grid gap-x-5 gap-y-12 sm:grid-cols-2 md:grid-cols-3 xl:mt-[52px] xl:grid-cols-6">
          {PROCESS.map((p, i) => (
            <li key={p.img} data-card className="flex flex-col gap-4">
              <div data-card-photo data-reveal-img className="relative aspect-[302/252] overflow-hidden">
                <div data-reveal-scale className="absolute inset-0">
                  <Image src={p.img} alt={t.steps[i].alt} fill sizes="(min-width: 1280px) 15vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 90vw" className="object-cover" />
                  {p.stop && <JourneyStop id={p.stop} frac={restFrac(i)} fracEnd={p.stop === "inspection" ? 1 : undefined} />}
                </div>
              </div>
              <h3 data-card-text data-fade className="font-serif text-[22px] leading-[1.1]">
                <span className="me-2 text-[15px] text-muted tabular-nums">0{i + 1}</span>
                {t.steps[i].title}
              </h3>
              <p data-card-text data-fade className="text-[13px] leading-[22.1px] text-muted">
                {t.steps[i].copy}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex items-center gap-6 xl:mt-[60px]">
          <p data-fade className="caption min-w-0 tracking-[2px] text-muted xl:shrink-0">
            {t.sequence}
          </p>
          <div aria-hidden className="relative hidden h-px flex-1 bg-line xl:block">
            <div data-progress className="absolute inset-0 origin-left scale-x-0 rtl:origin-right bg-amber" />
          </div>
          <p aria-hidden dir="ltr" className="caption hidden tabular-nums text-muted xl:block">
            <span data-counter>06</span> / 06
          </p>
        </div>
      </div>
    </section>
  );
}
