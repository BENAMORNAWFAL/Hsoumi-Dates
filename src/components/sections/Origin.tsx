"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { parallax, revealOnEnter } from "@/lib/reveal";
import { SplitLines } from "@/components/ui/SplitLines";
import { JourneyStop } from "@/components/ui/JourneyStop";
import type { Dictionary } from "@/i18n/config";

/** 02 — About us. */
export function Origin({ t }: { t: Dictionary["about"] }) {
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
      id="about"
      data-nav="light"
      className="relative bg-cream pt-28 pb-16 text-brown md:pt-32 lg:pt-[100px] lg:pb-[48px]"
      aria-labelledby="about-title"
    >
      <div className="shell">
        <div className="grid gap-y-24 lg:grid-cols-[minmax(0,560fr)_minmax(0,129fr)_minmax(0,591fr)]">
          <figure className="relative me-[12%] lg:me-0">
            <div data-reveal-img className="relative aspect-[560/625] overflow-hidden">
              <Image
                src="/images/about-oasis-aerial.jpg"
                alt={t.altMain}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div
              data-parallax="-90"
              className="absolute top-[69%] start-[67.3%] w-[41.8%] border-[10px] border-cream"
            >
              <div className="relative aspect-[234/277] overflow-hidden">
                <Image
                  src="/images/origin-harvest-in-hand.jpg"
                  alt={t.altInset}
                  fill
                  sizes="(min-width: 1024px) 17vw, 40vw"
                  className="object-cover"
                />
                {/* Journey stop: the falling date comes to rest in the grower's hand. */}
                <JourneyStop id="harvest" />
              </div>
            </div>
          </figure>

          <div className="lg:col-start-3 lg:pt-[18px]">
            <p data-fade className="eyebrow tracking-[2px]">{t.eyebrow}</p>
            <SplitLines
              id="about-title"
              className="t-h2 mt-8 -ms-[5px] lg:mt-[50px]"
              lines={t.title}
            />
            <p data-fade className="t-lede mt-8 lg:mt-[41px]">{t.lede}</p>
            <div className="mt-8 max-w-[495px] space-y-[35px] text-[15px] leading-[28.8px] text-muted md:text-[16px] lg:mt-[36px]">
              {t.copy.map((para) => (
                <p key={para} data-fade>
                  {para}
                </p>
              ))}
            </div>
            <p data-fade className="t-lede mt-12 lg:mt-[65px]">{t.closing}</p>
          </div>
        </div>

        <div className="caption mt-24 flex flex-wrap justify-between gap-4 text-muted lg:mt-[109px]">
          <span>{t.footLeft}</span>
          <span className="tracking-normal lg:w-[300px]">{t.footRight}</span>
        </div>
      </div>
    </section>
  );
}
