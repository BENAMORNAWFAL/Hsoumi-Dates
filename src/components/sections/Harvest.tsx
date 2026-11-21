"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { revealOnEnter } from "@/lib/reveal";
import { SplitLines } from "@/components/ui/SplitLines";
import { JourneyStop } from "@/components/ui/JourneyStop";
import type { Dictionary } from "@/i18n/config";

/** public/images/harvest-climbers-hd.jpg is 941 × 1672. */
const PHOTO_RATIO = 941 / 1672;

export function Harvest({ t }: { t: Dictionary["harvest"] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();
      // Copy slides in from the reading direction's far side.
      const dir = getComputedStyle(section).direction === "rtl" ? -1 : 1;

      // Desktop: the harvest photograph opens full-bleed, then steps aside for the story.
      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Settle at the photograph's own aspect ratio so the whole image shows, uncropped.
        const settledWidth = () =>
          Math.min(section.clientWidth * 0.4653, section.clientHeight * PHOTO_RATIO);
        tl.fromTo(
          q("[data-harvest-photo]"),
          { width: "100%" },
          { width: settledWidth, duration: 1, ease: "power2.inOut" },
          0,
        )
          .fromTo(q("[data-harvest-photo] [data-reveal-scale]"), { scale: 1.12 }, { scale: 1, duration: 1.2, ease: "none" }, 0)
          .fromTo(q("[data-harvest-intro]"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.35 }, 0)
          .from(q("[data-step='eyebrow']"), { autoAlpha: 0, x: 30 * dir, duration: 0.3 }, 0.6)
          .from(q("[data-line]"), { yPercent: 110, stagger: 0.08, duration: 0.45 }, 0.65)
          .from(q("[data-step='lede']"), { autoAlpha: 0, y: 30, duration: 0.35 }, 0.85)
          .from(q("[data-step='copy']"), { autoAlpha: 0, y: 30, duration: 0.35 }, 0.95)
          .fromTo(
            q("[data-step='detail']"),
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "expo.inOut" },
            1.0,
          )
          .from(q("[data-step='item']"), { autoAlpha: 0, x: 40 * dir, stagger: 0.12, duration: 0.3 }, 1.1)
          .from(q("[data-step='rule']"), { scaleX: 0, transformOrigin: dir === 1 ? "left" : "right", stagger: 0.12, duration: 0.3 }, 1.1)
          .from(q("[data-step='tagline']"), { autoAlpha: 0, duration: 0.3 }, 1.5);
      });

      mm.add(MQ.mobile, () => revealOnEnter(section));
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="expertise"
      data-nav="dark"
      data-journey-pin
      data-fp-steps="0,1"
      className="relative overflow-hidden bg-olive text-cream lg:h-[100svh] lg:min-h-[720px]"
      aria-labelledby="harvest-title"
    >
      {/* Figma 2:75 */}
      <div
        data-harvest-photo
        data-reveal-img
        className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11] lg:absolute lg:inset-y-0 lg:start-0 lg:aspect-auto lg:w-[min(46.53%,calc(max(100svh,720px)*0.5628))]"
      >
        <div data-reveal-scale className="absolute inset-0">
          <Image
            src="/images/harvest-climbers-hd.jpg"
            alt={t.alt}
            fill
            sizes="(min-width: 1024px) 100vw, 100vw"
            className="object-cover object-[50%_10%]"
          />
          {/* Journey stop: a date at the front of the bunch, for the whole scene. */}
          <JourneyStop id="cutting" frac={0} fracEnd={1} />
        </div>
        <div
          data-harvest-intro
          aria-hidden
          className="invisible absolute inset-0 hidden items-end bg-[linear-gradient(180deg,transparent_45%,rgba(31,27,21,0.55))] lg:flex"
        >
          <p className="shell eyebrow pb-[60px]">{t.intro}</p>
        </div>
      </div>

      <div className="shell relative py-20 lg:flex lg:h-full lg:items-center lg:py-0">
        <div className="lg:absolute lg:top-1/2 lg:start-[52.08%] lg:w-[42%] lg:-translate-y-1/2">
          <p data-fade data-step="eyebrow" className="eyebrow">{t.eyebrow}</p>
          <SplitLines
            id="harvest-title"
            className="t-h1 mt-8 -ms-[4px] lg:mt-[48px]"
            lines={t.title}
          />
          <p data-fade data-step="lede" className="t-lede mt-8 text-gold lg:mt-[44px]">
            {t.lede[0]}
            <br />
            {t.lede[1]}
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-[minmax(0,350px)_auto] sm:justify-between sm:gap-x-6 lg:mt-[41px]">
            <p data-fade data-step="copy" className="text-[15px] leading-[28.8px] text-sage md:text-[16px]">
              {t.copy}
            </p>
            {/* Figma 2:76 */}
            <div
              data-step="detail"
              data-reveal-img="0.2"
              className="relative aspect-[240/200] w-full max-w-[240px] overflow-hidden sm:row-span-2 sm:w-[clamp(150px,16.7vw,240px)] sm:self-start lg:mt-[27px]"
            >
              <Image
                src="/images/harvest-sunlit-dates.jpg"
                alt={t.altDetail}
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>

            <ol className="sm:col-start-1 lg:mt-[22px]">
              {t.steps.map((s, i) => (
                <li key={s} data-fade data-step="item" className="relative py-[10px] text-[13px] leading-[23.4px]">
                  <span className="inline-block w-[36px] tabular-nums">0{i + 1}</span>
                  {s}
                  <span
                    data-step="rule"
                    aria-hidden
                    className="absolute bottom-0 start-0 h-px w-full bg-cream/15"
                  />
                </li>
              ))}
            </ol>
          </div>

          <p data-fade data-step="tagline" className="caption mt-10 tracking-[2px] text-gold lg:mt-[60px]">
            {t.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
