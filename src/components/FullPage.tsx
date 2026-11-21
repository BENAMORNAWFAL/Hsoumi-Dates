"use client";

import { useEffect } from "react";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { computeSnaps, fullPage } from "@/lib/fullpage";

/** Wheel silence (ms) that ends a gesture — swallows trackpad / wheel inertia. */
const QUIET = 180;
/** Minimum swipe distance (px) on touch screens. */
const SWIPE = 42;

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

/** Is there an inner scroll area under the pointer that can still move in this direction? */
function innerScroller(target: EventTarget | null, dy: number) {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el);
    if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1) {
      if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
    }
    el = el.parentElement;
  }
  return false;
}

const isField = (t: EventTarget | null) =>
  t instanceof Element && !!t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]');

/**
 * Cinematic full-page scrolling.
 *
 * Every wheel gesture, swipe or key press moves the page to the next (or previous)
 * screen with one eased tween; every scroll-driven scene — pinned stories and the
 * travelling date — plays along with it as one movement. The page keeps native
 * scrolling underneath, so links, forms, find-in-page and the scrollbar still work.
 * Disabled for prefers-reduced-motion (normal scrolling).
 */
export function FullPage() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const html = document.documentElement;
      let snaps = computeSnaps();
      let tween: gsap.core.Tween | null = null;
      let armed = true;
      let lastWheel = 0;

      /** The mobile menu (or a dialog) has locked the page. */
      const locked = () => html.style.overflow === "hidden";

      const goTo = (y: number) => {
        const from = window.scrollY;
        if (Math.abs(y - from) < 1) return;
        tween?.kill();
        armed = false;
        const proxy = { y: from };
        const screens = Math.abs(y - from) / window.innerHeight;
        tween = gsap.to(proxy, {
          y,
          duration: clamp(0.85 + 0.3 * screens, 1, 1.9),
          ease: "power2.inOut",
          onUpdate: () => window.scrollTo(0, proxy.y),
          onComplete: () => {
            tween = null;
          },
        });
      };

      const step = (dir: number) => {
        if (tween || !dir) return;
        const y = window.scrollY;
        const next = dir > 0 ? snaps.find((s) => s > y + 2) : [...snaps].reverse().find((s) => s < y - 2);
        if (next !== undefined) goTo(next);
      };

      // Re-measure screens whenever the layout changes; stay on the same screen.
      const onRefresh = () => {
        const old = snaps;
        snaps = computeSnaps();
        if (tween) return;
        const i = old.findIndex((s) => Math.abs(s - window.scrollY) < 2);
        if (i > -1 && old.length === snaps.length && snaps[i] !== old[i]) window.scrollTo(0, snaps[i]);
      };
      ScrollTrigger.addEventListener("refresh", onRefresh);

      /* --- Mouse wheel & trackpad --------------------------------------- */
      const onWheel = (e: WheelEvent) => {
        if (locked() || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        if (innerScroller(e.target, e.deltaY)) return;
        e.preventDefault();
        const now = performance.now();
        const gap = now - lastWheel;
        lastWheel = now;
        if (tween) return; // one gesture, one screen
        if (!armed && gap < QUIET) return; // the tail of the gesture that just moved the page
        armed = true;
        if (Math.abs(e.deltaY) < 2) return;
        step(Math.sign(e.deltaY));
      };

      /* --- Touch ---------------------------------------------------------- */
      let touch: { x: number; y: number } | null = null;
      const onTouchStart = (e: TouchEvent) => {
        touch =
          locked() || e.touches.length > 1 || isField(e.target)
            ? null
            : { x: e.touches[0].clientX, y: e.touches[0].clientY };
      };
      const onTouchMove = (e: TouchEvent) => {
        if (!touch) return;
        if (e.touches.length > 1) {
          touch = null; // pinch-zoom stays native
          return;
        }
        const dx = e.touches[0].clientX - touch.x;
        const dy = e.touches[0].clientY - touch.y;
        if (Math.abs(dy) >= Math.abs(dx) && !innerScroller(e.target, -dy) && e.cancelable) e.preventDefault();
      };
      const onTouchEnd = (e: TouchEvent) => {
        if (!touch) return;
        const p = e.changedTouches[0];
        const dx = p.clientX - touch.x;
        const dy = touch.y - p.clientY;
        touch = null;
        if (Math.abs(dy) > SWIPE && Math.abs(dy) > Math.abs(dx) && !innerScroller(e.target, dy)) step(Math.sign(dy));
      };

      /* --- Keyboard ------------------------------------------------------- */
      let tabbing = false;
      const onKey = (e: KeyboardEvent) => {
        tabbing = e.key === "Tab";
        if (locked() || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || isField(e.target)) return;
        let dir = 0;
        switch (e.key) {
          case "ArrowDown":
          case "PageDown":
            dir = 1;
            break;
          case "ArrowUp":
          case "PageUp":
            dir = -1;
            break;
          case " ":
            // Space activates buttons; leave those alone.
            if (e.target instanceof Element && e.target.closest("button, summary, [role='button']")) return;
            dir = e.shiftKey ? -1 : 1;
            break;
          case "Home":
            e.preventDefault();
            if (!tween) goTo(snaps[0]);
            return;
          case "End":
            e.preventDefault();
            if (!tween) goTo(snaps[snaps.length - 1]);
            return;
          default:
            return;
        }
        e.preventDefault();
        step(dir);
      };

      /* --- Keyboard focus: settle on the screen that shows the focused element -- */
      const onFocus = (e: FocusEvent) => {
        if (!tabbing || tween || !(e.target instanceof Element)) return;
        const el = e.target;
        requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const top = r.top + window.scrollY;
          const vh = window.innerHeight;
          const fits = snaps.filter((s) => top >= s + 70 && top + Math.min(r.height, vh * 0.5) <= s + vh - 16);
          if (!fits.length || fits.some((s) => Math.abs(s - window.scrollY) < 2)) return;
          const near = fits.reduce((a, b) => (Math.abs(b - window.scrollY) < Math.abs(a - window.scrollY) ? b : a));
          goTo(near);
        });
      };

      const nonPassive = { passive: false } as const;
      window.addEventListener("wheel", onWheel, nonPassive);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchmove", onTouchMove, nonPassive);
      window.addEventListener("touchend", onTouchEnd);
      window.addEventListener("keydown", onKey);
      document.addEventListener("focusin", onFocus);
      html.style.overscrollBehavior = "none";

      fullPage.set({ goTo, snaps: () => snaps });

      return () => {
        fullPage.set(null);
        tween?.kill();
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("keydown", onKey);
        document.removeEventListener("focusin", onFocus);
        html.style.overscrollBehavior = "";
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
