"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SITE } from "@/lib/site";
import { LOCALES, LOCALE_LABELS, type Dictionary, type Locale } from "@/i18n/config";

const LINKS = SITE.nav;

type Theme = "dark" | "light";

export function Nav({ t, brand, lang }: { t: Dictionary["nav"]; brand: Dictionary["brand"]; lang: Locale }) {
  const latin = lang !== "ar";
  const ref = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useGSAP(() => {
    // Each section declares data-nav="dark|light" for the background beneath the bar.
    const triggers = gsap.utils.toArray<HTMLElement>("[data-nav]").map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: "top 40px",
        end: "bottom 40px",
        onToggle: (self) => self.isActive && setTheme(section.dataset.nav as Theme),
      }),
    );

    const dir = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setAtTop(y < 40);
        setHidden(self.direction === 1 && y > window.innerHeight * 0.6);
      },
    });

    return () => {
      triggers.forEach((t) => t.kill());
      dir.kill();
    };
  });

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const light = theme === "light";
  const solid = !atTop;

  return (
    <>
      <header
        ref={ref}
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color] duration-500 ease-out ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${
          solid
            ? light
              ? "bg-cream/85 text-brown backdrop-blur-md"
              : "bg-brown/55 text-cream backdrop-blur-md"
            : light
              ? "text-brown"
              : "text-cream [text-shadow:0_1px_10px_rgba(31,27,21,0.45)]"
        }`}
      >
        <nav className="shell flex items-center justify-between py-5 lg:pt-[37px] lg:pb-[26px]" aria-label={t.label}>
          <a href="#top" className="flex items-center gap-3 md:gap-4" aria-label={t.home}
            lang={lang}>
            <Image
              src="/images/brand/hsoumi-emblem.png"
              alt=""
              width={512}
              height={512}
              priority
              className="h-11 w-11 shrink-0 md:h-14 md:w-14"
            />
            <span
              dir={latin ? "ltr" : undefined}
              className="flex items-baseline gap-[0.45em] font-serif text-[26px] leading-none font-bold tracking-[4px] whitespace-nowrap md:text-[38px] md:tracking-[6px] rtl:text-[34px] rtl:md:text-[50px]"
            >
              {brand.main}
              {/* Latin: small spaced sans under-word. Arabic: the headline serif (Amiri), smaller than the name. */}
              <span
                className={
                  latin
                    ? "font-sans text-[11px] font-semibold tracking-[4px] md:text-[13px] md:tracking-[5px]"
                    : "font-serif text-[17px] font-bold md:text-[23px]"
                }
              >
                {brand.sub}
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-[30px] text-[15px] leading-[24px] font-medium xl:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="relative after:absolute after:-bottom-1 after:start-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-500 hover:after:w-full">
                  {t.links[l.key]}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <LangSwitch lang={lang} label={t.language} className="max-md:hidden" />
            <button
              type="button"
              className="eyebrow xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? t.close : t.menu}
            </button>
          </div>
        </nav>
        <div
          aria-hidden
          className={`shell transition-opacity duration-500 ${solid ? "opacity-0" : "opacity-100"}`}
        >
          <div className="h-px w-full bg-current opacity-30" />
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col justify-end bg-olive text-cream transition-[opacity,visibility] duration-500 xl:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="shell flex flex-col gap-3 pb-16">
          {LINKS.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block font-serif text-[clamp(2.1rem,9vw,2.75rem)] leading-[1.1] transition-transform duration-700 ease-out ${
                  open ? "translate-y-0" : "translate-y-full"
                }`}
                style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
              >
                {t.links[l.key]}
              </a>
            </li>
          ))}
          <li className="caption mt-8 text-parchment">{t.mobileTagline}</li>
          {/* Small screens: the language switch lives in the menu, the bar is too narrow for it. */}
          <li className="mt-2 md:hidden">
            <LangSwitch lang={lang} label={t.language} className="!text-[14px]" />
          </li>
        </ul>
      </div>
    </>
  );
}

/** EN / FR / عربي — full page loads, so every scroll scene restarts cleanly in the new language. */
function LangSwitch({ lang, label, className = "" }: { lang: Locale; label: string; className?: string }) {
  return (
    <p className={`text-[13px] leading-[20px] whitespace-pre ${className}`} aria-label={label}>
      {LOCALES.map((l, i) => (
        <span key={l}>
          {i > 0 && "  /  "}
          {l === lang ? (
            <span aria-current="true" lang={l}>
              {LOCALE_LABELS[l]}
            </span>
          ) : (
            <a href={`/${l}`} hrefLang={l} lang={l} className="opacity-60 transition-opacity hover:opacity-100">
              {LOCALE_LABELS[l]}
            </a>
          )}
        </span>
      ))}
    </p>
  );
}
