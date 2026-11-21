"use client";

import { ScrollTrigger } from "./gsap";

/**
 * Full-page storytelling: the page moves one "screen" per gesture.
 *
 * A screen is a scroll position (a snap point). They are derived from the
 * layout on every ScrollTrigger refresh:
 *  - every section ([data-nav]) contributes its top;
 *  - pinned sections contribute one screen per step of their scene, declared as
 *    pin-progress fractions in `data-fp-steps="0.3,0.6,1"` (default: start and end);
 *  - sections taller than the viewport are read page by page;
 *  - a journey marker that no screen shows gets a screen of its own.
 *
 * The travelling date uses the same list, so it always rests exactly where the
 * page comes to rest.
 */

/** Pages through tall content advance by this share of the viewport. */
const PAGE = 0.82;
/** Snap points closer than this (× viewport) are merged. */
const MERGE = 0.12;
/** A marker counts as shown when its centre sits within this band of the viewport. */
export const SHOWN = { from: 0.14, to: 0.86 } as const;

export function pinOf(el: Element) {
  return ScrollTrigger.getAll().find((t) => t.pin === el);
}

/** Document-space top of an element (ignores any transform-free offset parents). */
function docTop(el: Element) {
  return el.getBoundingClientRect().top + window.scrollY;
}

/** Visible journey markers: zero-sized ones belong to a hidden (desktop/mobile) layout. */
function visibleMarkers() {
  return Array.from(document.querySelectorAll("[data-journey-stop]")).filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
}

export function computeSnaps(): number[] {
  const vh = window.innerHeight;
  const max = ScrollTrigger.maxScroll(window);
  const ys: number[] = [0];

  for (const section of Array.from(document.querySelectorAll<HTMLElement>("[data-nav]"))) {
    const st = pinOf(section);
    if (st) {
      const span = st.end - st.start;
      const outer = section.parentElement?.classList.contains("pin-spacer") ? section.parentElement : section;
      const top = docTop(outer);
      // A section taller than the screen is read from its top before its scene holds.
      if (st.start - top > vh * MERGE) ys.push(top);
      const steps = (section.dataset.fpSteps ?? "0,1").split(",").map(Number);
      for (const f of steps) ys.push(st.start + f * span);
      continue;
    }
    const top = docTop(section);
    const h = section.offsetHeight;
    ys.push(top);
    const extra = h - vh;
    if (extra > vh * MERGE) {
      const n = Math.ceil(extra / (vh * PAGE));
      for (let i = 1; i <= n; i++) ys.push(top + (extra * i) / n);
    }
  }
  ys.push(max);

  let snaps = tidy(ys, max, vh);

  // Every free-standing journey marker must be shown by at least one screen.
  for (const el of visibleMarkers()) {
    const pinRoot = el.closest("[data-journey-pin]");
    if (pinRoot && pinOf(pinRoot) && el.hasAttribute("data-journey-frac")) continue;
    const r = el.getBoundingClientRect();
    const cy = r.top + window.scrollY + r.height / 2;
    if (!snaps.some((y) => cy - y >= vh * SHOWN.from && cy - y <= vh * SHOWN.to)) {
      snaps = tidy([...snaps, cy - vh * 0.5], max, vh);
    }
  }
  return snaps;
}

function tidy(ys: number[], max: number, vh: number) {
  const sorted = ys.map((y) => Math.min(Math.max(0, Math.round(y)), max)).sort((a, b) => a - b);
  const out: number[] = [];
  for (const y of sorted) {
    if (!out.length || y - out[out.length - 1] > vh * MERGE) out.push(y);
    else if (y === max) out[out.length - 1] = max;
  }
  return out;
}

/** The screen that best presents a free-standing marker (centred, after `after`). */
export function snapShowing(el: Element, snaps: number[], after = -Infinity) {
  const vh = window.innerHeight;
  const r = el.getBoundingClientRect();
  const cy = r.top + window.scrollY + r.height / 2;
  let best: number | null = null;
  for (const y of snaps) {
    if (y <= after) continue;
    const rel = (cy - y) / vh;
    if (rel < SHOWN.from || rel > SHOWN.to) continue;
    if (best === null || Math.abs(rel - 0.5) < Math.abs((cy - best) / vh - 0.5)) best = y;
  }
  return best;
}

/* -------------------------------------------------------------------------- */
/*  Controller handle (set by <FullPage/>, used by in-page anchor links).      */
/* -------------------------------------------------------------------------- */

type Controller = { goTo: (y: number) => void; snaps: () => number[] };
let controller: Controller | null = null;

export const fullPage = {
  set(c: Controller | null) {
    controller = c;
  },
  get active() {
    return controller !== null;
  },
  /** Scroll to the first screen at (or just past) a document position. */
  goTo(y: number) {
    if (!controller) return false;
    const snaps = controller.snaps();
    const vh = window.innerHeight;
    const target = snaps.find((s) => s >= y - vh * 0.02) ?? snaps[snaps.length - 1];
    controller.goTo(target);
    return true;
  },
};
