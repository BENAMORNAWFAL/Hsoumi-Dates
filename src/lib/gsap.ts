"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/**
 * `?capture` renders every scene in its settled, fully revealed state
 * (the reduced-motion layout) — used for design captures and print.
 */
const STATIC =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).has("capture");
const NEVER = "(max-width: 0px)";

/** Media queries shared by every scroll scene. */
export const MQ = {
  desktop: STATIC ? NEVER : "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  wide: STATIC ? NEVER : "(min-width: 1280px) and (prefers-reduced-motion: no-preference)",
  belowWide: STATIC ? NEVER : "(max-width: 1279px) and (prefers-reduced-motion: no-preference)",
  mobile: STATIC ? NEVER : "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  motion: STATIC ? NEVER : "(prefers-reduced-motion: no-preference)",
  reduced: STATIC ? "all" : "(prefers-reduced-motion: reduce)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
