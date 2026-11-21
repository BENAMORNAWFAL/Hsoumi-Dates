"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { parallax, revealOnEnter } from "@/lib/reveal";
import { SplitLines } from "@/components/ui/SplitLines";
import { JourneyStop } from "@/components/ui/JourneyStop";
import type { Dictionary } from "@/i18n/config";

/** 06 — Our quality. States practices only; no certifications are claimed. */
export function Quality({ t }: { t: Dictionary["quality"] }) {
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
                src="/images/process-quality-deglet-nour-clean.jpg"
                alt={t.alt}
                fill
                sizes="(min-width: 1024px) 38vw, 90vw"
                className="object-cover object-[60%_50%]"
              />
              {/* Journey stop: the date held up for inspection. */}
              <JourneyStop id="quality" />
            </div>
          </div>
          <figcaption className="caption mt-4 flex justify-between text-muted">
            <span>{t.captionLeft}</span>
            <span>{t.illustrative}</span>
          </figcaption>
        </figure>

        <div className="lg:col-start-3">
          <p data-fade className="eyebrow">{t.eyebrow}</p>
          <SplitLines
            id="quality-title"
            className="t-h2 mt-8 -ms-[4px] lg:mt-[40px]"
            lines={t.title}
          />
          <p data-fade className="mt-8 max-w-[540px] text-[15px] leading-[28.8px] text-muted md:text-[16px]">
            {t.intro}
          </p>

          <ol className="mt-12 border-t border-line">
            {t.principles.map((p, i) => (
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
            {t.note}
          </p>
        </div>
      </div>
    </section>
  );
}
