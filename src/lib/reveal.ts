"use client";

import { gsap } from "./gsap";

/**
 * Standard entrance choreography, scoped to a section:
 *  - [data-line]        headline lines slide up out of their masks
 *  - [data-fade]        copy fades up
 *  - [data-reveal-img]  photograph unmasks from the bottom while its image settles
 * Elements inside a pinned timeline should not use these attributes.
 */
export function revealOnEnter(scope: Element, start = "top 86%") {
  const q = gsap.utils.selector(scope);

  const lines = q("[data-line]");
  if (lines.length) {
    gsap.from(lines, {
      yPercent: 110,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.09,
      scrollTrigger: { trigger: lines[0], start, once: true },
    });
  }

  q("[data-fade]").forEach((el) => {
    gsap.from(el, {
      y: 28,
      autoAlpha: 0,
      duration: 1.1,
      ease: "power3.out",
      delay: Number((el as HTMLElement).dataset.fade || 0),
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  q("[data-reveal-img]").forEach((el) => {
    // Scale the photograph's wrapper when it carries journey markers, so they stay aligned.
    const img = el.querySelector("[data-reveal-scale]") ?? el.querySelector("img");
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      delay: Number((el as HTMLElement).dataset.revealImg || 0),
    });
    tl.fromTo(
      el,
      { clipPath: "inset(100% 0% 0% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" },
    );
    if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0.2);
  });
}

/** Gentle scroll-linked drift for photographs ([data-parallax="-80"]). */
export function parallax(scope: Element) {
  gsap.utils.selector(scope)("[data-parallax]").forEach((el) => {
    const distance = Number((el as HTMLElement).dataset.parallax || -60);
    gsap.fromTo(
      el,
      { y: -distance / 2 },
      {
        y: distance / 2,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
}
