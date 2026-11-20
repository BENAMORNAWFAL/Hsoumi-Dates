"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { revealOnEnter } from "@/lib/reveal";
import { SplitLines } from "@/components/ui/SplitLines";
import { JourneyStop } from "@/components/ui/JourneyStop";

const OPERATIONS = [
  {
    title: "Sorting lines",
    copy: "Dates are cleaned, sorted and graded by quality, size and variety.",
    img: "/images/process-cleaning.jpg",
    alt: "Dates moving along a stainless-steel cleaning and sorting line",
  },
  {
    title: "Packaging operations",
    copy: "Industrial packing and labelling in the formats each order requires.",
    img: "/images/facility-export-cartons.jpg",
    alt: "Cartons and packing materials ready for packaging (illustrative photograph)",
  },
  {
    title: "Storage",
    copy: "Packed dates are kept in appropriate storage conditions until dispatch.",
    img: "/images/facility-storage.jpg",
    alt: "Palletised cartons on warehouse racking (illustrative photograph)",
  },
  {
    title: "Export order preparation",
    copy: "Orders are assembled, palletised and prepared for loading.",
    img: "/images/export-by-road.jpg",
    alt: "A loaded truck leaving for the port",
  },
];

/** Pinned timeline: each operation becomes active every STEP; the journey date rests on the first. */
const START = 0.5;
const STEP = 0.9;
const TOTAL = START + STEP * OPERATIONS.length;
const LINE_REST = 0.9 / TOTAL;

/** 05 — Our facilities. */
export function Facilities() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

      // Desktop: hold on the facility while each operation is presented in turn.
      mm.add(MQ.desktop, () => {
        revealOnEnter(q("[data-fac-head]")[0]);
        const items = q("[data-op]");
        const shots = q("[data-op-shot]");
        gsap.set(items, { opacity: 0.32 });
        gsap.set(shots.slice(1), { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: section,
            start: () => (section.offsetHeight > window.innerHeight ? "bottom bottom" : "top top"),
            end: "+=150%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          q("[data-op-frame]"),
          { clipPath: "inset(10% 8% 10% 8%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power2.inOut" },
          0,
        );
        shots.forEach((shot, i) => {
          tl.fromTo(shot.querySelector("[data-reveal-scale]"), { scale: 1.12 }, { scale: 1, duration: STEP + 0.6, ease: "none" }, Math.max(0, START + i * STEP - 0.5));
        });
        items.forEach((item, i) => {
          const at = START + i * STEP;
          tl.to(item, { opacity: 1, duration: 0.3 }, at).fromTo(
            item.querySelector("[data-op-bar]"),
            { scaleY: 0 },
            { scaleY: 1, duration: 0.4 },
            at,
          );
          if (i > 0) tl.to(shots[i], { autoAlpha: 1, duration: 0.35, ease: "none" }, at - 0.2);
          if (i < items.length - 1) tl.to(item, { opacity: 0.5, duration: 0.3 }, at + STEP);
        });
        tl.set({}, {}, TOTAL);
      });

      mm.add(MQ.mobile, () => revealOnEnter(section));
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="facilities"
      data-nav="dark"
      data-journey-pin
      className="relative overflow-hidden bg-brown py-24 text-cream lg:flex lg:min-h-[100svh] lg:items-center lg:py-[64px]"
      aria-labelledby="facilities-title"
    >
      <div className="shell grid w-full gap-14 lg:grid-cols-[minmax(0,587fr)_minmax(0,693fr)] lg:gap-0">
        <div className="lg:pt-[12px] lg:pr-10">
          <div data-fac-head>
            <p data-fade className="eyebrow">05 / Our facilities</p>
            <SplitLines
              id="facilities-title"
              className="t-h1 mt-8 -ml-[4px] lg:mt-[40px] lg:!text-[clamp(2.6rem,4.6vw,4.4rem)]"
              lines={["Where the harvest", "becomes an", "export order."]}
            />
            <p data-fade className="mt-8 max-w-[480px] text-[15px] leading-[27.2px] text-parchment md:text-[16px] lg:mt-[32px]">
              Our activity brings together the operations needed to receive, prepare, keep and ship dates
              at a professional scale.
            </p>
          </div>

          <ol className="mt-12 space-y-[26px] lg:mt-[44px]">
            {OPERATIONS.map((op, i) => (
              <li key={op.title} data-op data-fade className="relative grid grid-cols-[53px_1fr]">
                <span
                  data-op-bar
                  aria-hidden
                  className="absolute top-[2px] -left-[16px] hidden h-[46px] w-px origin-top bg-gold-deep lg:block"
                />
                <span className="pt-[3px] text-[11px] leading-[18.7px] text-gold-deep">0{i + 1}</span>
                <div>
                  <h3 className="font-serif text-[25px] leading-[25.5px]">{op.title}</h3>
                  <p className="mt-[9px] text-[12px] leading-[20.4px] text-parchment">{op.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Desktop: one frame, the photograph changes with the active operation. */}
        <figure className="hidden lg:block">
          <div data-op-frame className="relative aspect-[693/640] overflow-hidden">
            {OPERATIONS.map((op, i) => (
              <div key={op.img} data-op-shot className="absolute inset-0 overflow-hidden">
                <div data-reveal-scale className="absolute inset-0">
                  <Image src={op.img} alt={op.alt} fill sizes="48vw" className="object-cover" />
                  {i === 0 && <JourneyStop id="line" frac={LINE_REST} />}
                </div>
              </div>
            ))}
          </div>
          <figcaption className="caption mt-4 text-parchment/70">Illustrative photography</figcaption>
        </figure>

        {/* Mobile & tablet: all four operations as a grid. */}
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {OPERATIONS.map((op, i) => (
            <div key={op.img} data-reveal-img={i * 0.08} className="relative aspect-[4/3] overflow-hidden">
              <div data-reveal-scale className="absolute inset-0">
                <Image src={op.img} alt={op.alt} fill sizes="45vw" className="object-cover" />
                {i === 0 && <JourneyStop id="line" />}
              </div>
            </div>
          ))}
          <p className="caption col-span-2 mt-1 text-parchment/70">Illustrative photography</p>
        </div>
      </div>
    </section>
  );
}
