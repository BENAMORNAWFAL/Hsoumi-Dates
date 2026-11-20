"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SITE } from "@/lib/site";

const LINKS = SITE.nav;

type Theme = "dark" | "light";

export function Nav() {
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
              : "text-cream"
        }`}
      >
        <nav className="shell flex items-center justify-between py-5 lg:pt-[37px] lg:pb-[26px]" aria-label="Main">
          <a
            href="#top"
            className="flex items-baseline gap-[0.45em] font-serif text-[22px] leading-none tracking-[4px] whitespace-nowrap md:text-[30px] md:tracking-[6px]"
            aria-label="Hsoumi Dates — back to top"
          >
            HSOUMI
            <span className="font-sans text-[9px] tracking-[4px] md:text-[11px] md:tracking-[5px]">DATES</span>
          </a>

          <ul className="hidden items-center gap-[26px] text-[12px] leading-[20.4px] xl:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-500 hover:after:w-full">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <p className="text-[11px] leading-[18.7px] whitespace-pre" aria-label="Language">
              <span aria-current="true">EN</span>
              {"  /  "}
              <a href="#top" className="opacity-60 transition-opacity hover:opacity-100" lang="fr">
                FR
              </a>
            </p>
            <button
              type="button"
              className="eyebrow xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "Close" : "Menu"}
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
                {l.label}
              </a>
            </li>
          ))}
          <li className="caption mt-8 text-parchment">Authentic Tunisian dates. Worldwide export.</li>
        </ul>
      </div>
    </>
  );
}
