"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { revealOnEnter } from "@/lib/reveal";
import { SplitLines } from "@/components/ui/SplitLines";
import { SITE } from "@/lib/site";
import type { Dictionary } from "@/i18n/config";

export function Footer({
  t,
  brand,
  nav,
}: {
  t: Dictionary["footer"];
  brand: Dictionary["brand"];
  nav: Dictionary["nav"]["links"];
}) {
  const root = useRef<HTMLElement>(null);
  const wordmark = `${brand.main} ${brand.sub}`;
  // Latin letters rise one by one; Arabic rises word by word so its letters stay joined.
  const latin = /^[\x20-\x7E]+$/.test(wordmark);
  const pieces = latin ? wordmark.split("") : wordmark.split(" ");

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
            <Image
              data-fade
              src="/images/brand/hsoumi-emblem.png"
              alt={t.emblemAlt}
              width={512}
              height={512}
              className="mb-8 h-16 w-16 lg:mb-[30px] lg:h-[72px] lg:w-[72px]"
            />
            <p data-fade className="caption tracking-[2px] text-parchment">{t.chain}</p>
            <SplitLines
              as="p"
              className="mt-6 -ms-[4px] font-serif text-[clamp(2.4rem,4.2vw,3.8rem)] leading-[1.04] lg:mt-[27px]"
              lines={t.title}
            />
          </div>

          <nav data-fade aria-label={t.navLabel} className="lg:pt-[11px]">
            <p className="text-[10px] leading-[17px] tracking-[1.5px] text-parchment uppercase">{t.explore}</p>
            <ul className="mt-[18px] grid grid-cols-2 gap-x-6 gap-y-[14px] text-[13px] leading-[22.1px] lg:grid-cols-1">
              {SITE.nav.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-gold">{nav[l.key]}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div data-fade className="lg:pt-[11px]">
            <p className="text-[10px] leading-[17px] tracking-[1.5px] text-parchment uppercase">{t.inquiries}</p>
            <ul className="mt-[18px] space-y-[14px] text-[13px] leading-[22.1px]">
              <li>
                <a href={`mailto:${SITE.contact.email}`} dir="ltr" className="transition-colors hover:text-gold">
                  {SITE.contact.email}
                </a>
              </li>
              {SITE.contact.phone && <li dir="ltr">{SITE.contact.phone}</li>}
              <li>{SITE.contact.address ?? t.country}</li>
              <li>
                <a href="#contact" className="transition-colors hover:text-gold">{t.sendInquiry}</a>
              </li>
            </ul>
          </div>
        </div>

        <p
          data-mark
          dir={latin ? "ltr" : undefined}
          aria-label={wordmark}
          className="mt-14 overflow-hidden font-serif text-[clamp(2.3rem,8.6vw,7.7rem)] leading-[1.05] tracking-[0.12em] whitespace-nowrap lg:mt-[40px] lg:-ml-[6px] rtl:pb-[0.12em] rtl:leading-[1.5] rtl:lg:ml-0"
        >
          {pieces.map((ch, i) => (
            <span key={i} aria-hidden className={latin ? "inline-block" : "inline-block pe-[0.3em]"}>
              {ch === " " ? " " : ch}
            </span>
          ))}
        </p>

        <div className="mt-3 h-px w-full bg-cream/25" />
        <div className="mt-5 flex flex-col gap-3 text-[10px] leading-[17px] text-parchment md:flex-row md:items-center md:justify-between md:gap-8 lg:mt-[20px]">
          <p>© {brand.name} {new Date().getFullYear()}</p>
          <p className="tracking-[2px] uppercase">{t.tagline}</p>
          <p>
            {t.poweredBy}{" "}
            <a
              href={SITE.author.url}
              target="_blank"
              rel="noopener"
              className="text-[11px] font-semibold tracking-[1.5px] text-gold underline decoration-gold/40 underline-offset-4 transition-colors duration-300 hover:text-cream hover:decoration-cream"
            >
              {t.author}
            </a>
          </p>
          <p>
            <a href="#top" className="hover:text-cream">{t.backToTop}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
