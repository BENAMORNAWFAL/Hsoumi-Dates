"use client";

import Image from "next/image";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { JOURNEY, placeMarker } from "@/lib/journey";

/** How long the hero holds while the camera pushes in and the date lets go (× viewport height). */
export const HERO_HOLD = 0.9;

/** Portrait screens frame the palm further right (mirrors the CSS object-position rule). */
const PORTRAIT = "(max-aspect-ratio: 9/10)";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const camera = q("[data-hero-camera]")[0] as HTMLElement;
      const marker = q("[data-journey-start]")[0] as HTMLElement;

      // Pin a marker on the one hanging date and pivot the camera around it,
      // so the push-in keeps that date exactly where the visitor first saw it.
      const layout = () => {
        const posX = window.matchMedia(PORTRAIT).matches ? 0.74 : 0.5;
        const p = placeMarker(marker, { w: section.clientWidth, h: section.clientHeight }, JOURNEY.start, posX);
        gsap.set(camera, { transformOrigin: `${p.x}px ${p.y}px` });
      };
      layout();
      window.addEventListener("resize", layout);

      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Load-in: the headline rises out of the dunes.
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from(q("[data-hero-intro]"), { scale: 1.06, duration: 2.6, ease: "power2.out" }, 0)
          .from(q("[data-line]"), { yPercent: 110, duration: 1.4, stagger: 0.1 }, 0.3)
          .from(q("[data-intro]"), { y: 20, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.7);

        // Scene 1 → 2: the hero holds, the copy clears, the camera eases in on the bunch.
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${window.innerHeight * HERO_HOLD}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onRefresh: layout,
            },
          })
          .to(q("[data-hero-copy]"), { y: -90, autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0)
          .to(q("[data-hero-foot]"), { autoAlpha: 0, duration: 0.15 }, 0)
          .to(q("[data-hero-shade]"), { opacity: 0.3, duration: 0.5 }, 0)
          .to(camera, { scale: 1.38, duration: 1, ease: "power1.inOut" }, 0)
          .to(camera, { y: () => -window.innerHeight * 0.05, duration: 0.6, ease: "power1.in" }, 0.4);
      });

      return () => window.removeEventListener("resize", layout);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      data-nav="dark"
      data-journey-hero
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-brown text-cream"
      aria-label="Hsoumi Dates — authentic Tunisian dates"
    >
      <div data-hero-camera className="absolute inset-0 will-change-transform">
        <div data-hero-intro className="absolute inset-0">
          <Image
            src="/images/hero-sahara-palm.jpg"
            alt="A lone date palm heavy with golden fruit at sunset in the Tunisian Sahara"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center [@media(max-aspect-ratio:9/10)]:object-[74%_50%]"
          />
          {/* Tracks the single date that will fall (positioned in JS). */}
          <div data-journey-start aria-hidden className="pointer-events-none absolute" />
        </div>
      </div>
      {/* Figma: left-to-right shade for legibility */}
      <div
        data-hero-shade
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(31,27,21,0.65)_0%,rgba(47,37,26,0.12)_60%,rgba(31,27,21,0.08)_100%)] max-md:bg-[linear-gradient(180deg,rgba(31,27,21,0.15)_0%,rgba(31,27,21,0.55)_55%,rgba(31,27,21,0.7)_100%)]"
      />

      <div className="shell absolute inset-x-0 bottom-[96px] md:bottom-[110px] lg:relative lg:bottom-auto lg:flex lg:h-full lg:flex-col lg:justify-center lg:pt-[100px]">
        <div data-hero-copy className="max-w-[790px]">
          <p data-intro className="eyebrow mb-6 pl-[3px] md:mb-[26px]">
            Hsoumi Dates&nbsp;&nbsp;—&nbsp;&nbsp;Tunisia
          </p>
          <h1 className="t-display">
            <span className="line-mask"><span data-line>Authentic</span></span>
            <span className="line-mask"><span data-line>Tunisian dates.</span></span>
          </h1>
          <p data-intro className="t-lede mt-6 pl-[3px] md:mt-[30px]">
            Carefully selected. Professionally packed. Worldwide export.
          </p>
          <p data-intro className="mt-4 max-w-[520px] pl-[3px] text-[15px] leading-[27.2px] md:text-[16px]">
            Collection, sorting, packaging, storage and export of Tunisian dates for professional
            buyers around the world.
          </p>
          <div data-intro className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 pl-[3px] md:mt-[44px]">
            <Button href="#expertise" variant="on-image">
              Discover our expertise
            </Button>
            <a href="#contact" className="text-[12px] leading-[20.4px] underline decoration-cream/40 underline-offset-[6px] transition-colors hover:decoration-cream">
              Contact our export team
            </a>
          </div>
        </div>
      </div>

      <div
        data-hero-foot
        className="shell caption absolute inset-x-0 bottom-[30px] flex justify-between text-cream md:bottom-[33px]"
      >
        <span data-intro className="tracking-[2px]">Scroll to explore&nbsp;&nbsp;&nbsp;&nbsp;↓</span>
        <span data-intro className="tracking-[2px] max-sm:hidden">Deglet Nour&nbsp;&nbsp;/&nbsp;&nbsp;Tunisia</span>
      </div>
    </section>
  );
}
