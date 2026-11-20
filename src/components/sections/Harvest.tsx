"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { revealOnEnter } from "@/lib/reveal";
import { SplitLines } from "@/components/ui/SplitLines";

const STEPS = ["Collection from Tunisian producers", "Reception of harvested dates", "Selection on arrival"];

export function Harvest() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const mm = gsap.matchMedia();

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
          },
        });

        tl.fromTo(q("[data-harvest-photo]"), { width: "100%" }, { width: "46.53%", duration: 1, ease: "power2.inOut" }, 0)
          .fromTo(q("[data-harvest-photo] img"), { scale: 1.12 }, { scale: 1, duration: 1.2, ease: "none" }, 0)
          .fromTo(q("[data-harvest-intro]"), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.35 }, 0)
          .from(q("[data-step='eyebrow']"), { autoAlpha: 0, x: 30, duration: 0.3 }, 0.6)
          .from(q("[data-line]"), { yPercent: 110, stagger: 0.08, duration: 0.45 }, 0.65)
          .from(q("[data-step='lede']"), { autoAlpha: 0, y: 30, duration: 0.35 }, 0.85)
          .from(q("[data-step='copy']"), { autoAlpha: 0, y: 30, duration: 0.35 }, 0.95)
          .fromTo(
            q("[data-step='detail']"),
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "expo.inOut" },
            1.0,
          )
          .from(q("[data-step='item']"), { autoAlpha: 0, x: 40, stagger: 0.12, duration: 0.3 }, 1.1)
          .from(q("[data-step='rule']"), { scaleX: 0, transformOrigin: "left", stagger: 0.12, duration: 0.3 }, 1.1)
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
      className="relative overflow-hidden bg-olive text-cream lg:h-[100svh] lg:min-h-[720px]"
      aria-labelledby="harvest-title"
    >
      {/* Figma 2:75 */}
      <div
        data-harvest-photo
        data-reveal-img
        className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11] lg:absolute lg:inset-y-0 lg:left-0 lg:aspect-auto lg:w-[46.53%]"
      >
        <Image
          src="/images/harvest-traditional.jpg"
          alt="A harvester cutting a heavy bunch of dates from the palm"
          fill
          sizes="(min-width: 1024px) 100vw, 100vw"
          className="object-cover object-[50%_30%]"
        />
        <div
          data-harvest-intro
          aria-hidden
          className="invisible absolute inset-0 hidden items-end bg-[linear-gradient(180deg,transparent_45%,rgba(31,27,21,0.55))] lg:flex"
        >
          <p className="shell eyebrow pb-[60px]">03 / Our expertise&nbsp;&nbsp;—&nbsp;&nbsp;It starts at harvest</p>
        </div>
      </div>

      <div className="shell relative py-20 lg:flex lg:h-full lg:items-center lg:py-0">
        <div className="lg:absolute lg:top-1/2 lg:left-[52.08%] lg:w-[42%] lg:-translate-y-1/2">
          <p data-fade data-step="eyebrow" className="eyebrow">03 / Our expertise — Collection</p>
          <SplitLines
            id="harvest-title"
            className="t-h1 mt-8 -ml-[4px] lg:mt-[48px]"
            lines={["It all starts", "at the palm."]}
          />
          <p data-fade data-step="lede" className="t-lede mt-8 text-gold lg:mt-[44px]">
            Collected from Tunisian producers.
            <br />
            Selected on arrival.
          </p>

          <div className="mt-10 grid gap-10 sm:grid-cols-[minmax(0,350px)_auto] sm:justify-between sm:gap-x-6 lg:mt-[41px]">
            <p data-fade data-step="copy" className="text-[15px] leading-[28.8px] text-sage md:text-[16px]">
              At harvest time we collect dates from Tunisian producers. Each lot is received, checked and
              selected before it enters our sorting and packing process.
            </p>
            {/* Figma 2:76 */}
            <div
              data-step="detail"
              data-reveal-img="0.2"
              className="relative aspect-[240/200] w-full max-w-[240px] overflow-hidden sm:row-span-2 sm:w-[clamp(150px,16.7vw,240px)] sm:self-start lg:mt-[27px]"
            >
              <Image
                src="/images/harvest-sunlit-dates.jpg"
                alt="Ripe Deglet Nour dates on the palm"
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>

            <ol className="sm:col-start-1 lg:mt-[22px]">
              {STEPS.map((s, i) => (
                <li key={s} data-fade data-step="item" className="relative py-[10px] text-[13px] leading-[23.4px]">
                  <span className="inline-block w-[36px] tabular-nums">0{i + 1}</span>
                  {s}
                  <span
                    data-step="rule"
                    aria-hidden
                    className="absolute bottom-0 left-0 h-px w-full bg-cream/15"
                  />
                </li>
              ))}
            </ol>
          </div>

          <p data-fade data-step="tagline" className="caption mt-10 tracking-[2px] text-gold lg:mt-[60px]">
            The quality of an order starts with the harvest.
          </p>
        </div>
      </div>
    </section>
  );
}
