"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { revealOnEnter } from "@/lib/reveal";
import { SplitLines } from "@/components/ui/SplitLines";
import { SITE } from "@/lib/site";

export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        revealOnEnter(root.current!, "top 85%");
        // The wordmark rises letter by letter as the page comes to rest.
        gsap.from("[data-mark] span", {
          yPercent: 100,
          ease: "power3.out",
          stagger: 0.04,
          scrollTrigger: { trigger: "[data-mark]", start: "top bottom", end: "bottom bottom", scrub: 1 },
        });
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} data-nav="dark" className="relative overflow-hidden bg-olive pt-16 pb-8 text-cream lg:pt-[63px] lg:pb-[24px]">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,710fr)_minmax(0,270fr)_minmax(0,300fr)] lg:gap-0">
          <div>
            <p data-fade className="caption tracking-[2px] text-parchment">Collection · Sorting · Packaging · Storage · Export</p>
            <SplitLines
              as="p"
              className="mt-6 -ml-[4px] font-serif text-[clamp(2.4rem,4.2vw,3.8rem)] leading-[1.04] lg:mt-[27px]"
              lines={["Authentic Tunisian dates,", "prepared for the world."]}
            />
          </div>

          <nav data-fade aria-label="Footer" className="lg:pt-[11px]">
            <p className="text-[10px] leading-[17px] tracking-[1.5px] text-parchment">EXPLORE</p>
            <ul className="mt-[18px] grid grid-cols-2 gap-x-6 gap-y-[14px] text-[13px] leading-[22.1px] lg:grid-cols-1">
              {SITE.nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-gold">{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div data-fade className="lg:pt-[11px]">
            <p className="text-[10px] leading-[17px] tracking-[1.5px] text-parchment">EXPORT INQUIRIES</p>
            <ul className="mt-[18px] space-y-[14px] text-[13px] leading-[22.1px]">
              <li>
                <a href={`mailto:${SITE.contact.email}`} className="transition-colors hover:text-gold">
                  {SITE.contact.email}
                </a>
              </li>
              {SITE.contact.phone && <li>{SITE.contact.phone}</li>}
              <li>{SITE.contact.address ?? SITE.contact.country}</li>
              <li>
                <a href="#contact" className="transition-colors hover:text-gold">Send an inquiry →</a>
              </li>
            </ul>
            <p className="mt-[28px] max-w-[260px] text-[9px] leading-[15.3px] text-parchment">
              Photography on this site is illustrative and does not depict Hsoumi Dates premises.
            </p>
          </div>
        </div>

        <p
          data-mark
          aria-label={SITE.wordmark}
          className="mt-14 overflow-hidden font-serif text-[clamp(2.3rem,8.6vw,7.7rem)] leading-[1.05] tracking-[0.12em] whitespace-nowrap lg:mt-[40px] lg:-ml-[6px]"
        >
          {SITE.wordmark.split("").map((ch, i) => (
            <span key={i} aria-hidden className="inline-block">
              {ch === " " ? " " : ch}
            </span>
          ))}
        </p>

        <div className="mt-3 h-px w-full bg-cream/25" />
        <div className="mt-5 flex flex-col gap-3 text-[10px] leading-[17px] text-parchment md:flex-row md:items-center lg:mt-[20px]">
          <p className="md:w-[40%]">© {SITE.name} {new Date().getFullYear()}</p>
          <p className="tracking-[2px] md:flex-1">AUTHENTIC TUNISIAN DATES</p>
          <p className="md:w-[280px]">
            <a href="#top" className="hover:text-cream">↑ Back to top</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
