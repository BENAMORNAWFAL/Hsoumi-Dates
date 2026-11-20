"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { parallax, revealOnEnter } from "@/lib/reveal";
import { SplitLines } from "@/components/ui/SplitLines";

const PRINCIPLES = [
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
];

/** 06 — Our quality. States practices only; no certifications are claimed. */
export function Quality() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        revealOnEnter(root.current!);
        parallax(root.current!);
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="quality"
      data-nav="light"
      className="relative bg-cream py-24 text-brown lg:py-[110px]"
      aria-labelledby="quality-title"
    >
      <div className="shell grid gap-16 lg:grid-cols-[minmax(0,520fr)_minmax(0,120fr)_minmax(0,640fr)] lg:gap-0">
        <figure className="relative lg:col-start-1">
          <div data-reveal-img className="relative aspect-[520/600] overflow-hidden">
            <div data-reveal-scale className="absolute inset-0">
              <Image
                src="/images/process-quality.jpg"
                alt="A date held between gloved fingers for visual inspection"
                fill
                sizes="(min-width: 1024px) 38vw, 90vw"
                className="object-cover object-[60%_50%]"
              />
            </div>
          </div>
          <figcaption className="caption mt-4 flex justify-between text-muted">
            <span>Inspection</span>
            <span>Illustrative photography</span>
          </figcaption>
        </figure>

        <div className="lg:col-start-3">
          <p data-fade className="eyebrow">06 / Our quality</p>
          <SplitLines
            id="quality-title"
            className="t-h2 mt-8 -ml-[4px] lg:mt-[40px]"
            lines={["Quality is built in,", "step by step."]}
          />
          <p data-fade className="mt-8 max-w-[540px] text-[15px] leading-[28.8px] text-muted md:text-[16px]">
            Quality is not a single check at the end of the line. It depends on how the fruit is selected,
            handled, packed and kept at every stage — from the producer to the container.
          </p>

          <ol className="mt-12 border-t border-line">
            {PRINCIPLES.map((p, i) => (
              <li
                key={p.title}
                data-fade={i * 0.05}
                className="grid gap-2 border-b border-line py-5 sm:grid-cols-[48px_minmax(0,220px)_1fr] sm:gap-6"
              >
                <span className="caption pt-[6px] text-amber tabular-nums">0{i + 1}</span>
                <h3 className="font-serif text-[24px] leading-[1.1]">{p.title}</h3>
                <p className="text-[13px] leading-[22.1px] text-muted">{p.copy}</p>
              </li>
            ))}
          </ol>

          <p data-fade className="mt-8 max-w-[540px] text-[13px] leading-[22.1px] text-muted">
            Product specifications, documentation and labelling requirements are discussed with each client
            according to the regulations of the destination market.
          </p>
        </div>
      </div>
    </section>
  );
}
