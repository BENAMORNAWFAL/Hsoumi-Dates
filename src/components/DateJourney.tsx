"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { JOURNEY, STOPS, type StopId, type StopSpec } from "@/lib/journey";

const SPR = JOURNEY.sprite;
/** Hero: scroll distances (× viewport height) from the top of the page. */
const TREMBLE_FROM = 0.06;
const RELEASE_AT = 0.42;

/** The company process, in scroll order. */
const ORDER: StopId[] = ["harvest", "sorting", "inspection", "selection", "line", "container"];

type Grade = { bright: number; contrast: number; sat: number; blur: number };
const NATURAL: Grade = { bright: 1, contrast: 1, sat: 1, blur: 0 };
/** Match the soft, warm look of the photographs the date rests in. */
const PHOTO: Grade = { bright: 1.1, contrast: 0.86, sat: 1.1, blur: 0.25 };

type Stop = {
  id: StopId;
  el: Element;
  at: number;
  hold: number;
  angle: number;
  /** Width ÷ length scale factor relative to the sprite. */
  plump: number;
  grade: Grade;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};
const easeInOut = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);
const mixGrade = (a: Grade, b: Grade, t: number): Grade => ({
  bright: lerp(a.bright, b.bright, t),
  contrast: lerp(a.contrast, b.contrast, t),
  sat: lerp(a.sat, b.sat, t),
  blur: lerp(a.blur, b.blur, t),
});
const center = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
/** Log-space bump: from a, swelling towards `peak` mid-way, settling at b. */
const swell = (a: number, b: number, peak: number, w: number) => {
  const la = Math.log(Math.max(a, 1));
  const lb = Math.log(Math.max(b, 1));
  const c = (Math.log(Math.max(peak, a, b)) - 0.25 * (la + lb)) / 0.5;
  return Math.exp((1 - w) ** 2 * la + 2 * w * (1 - w) * c + w ** 2 * lb);
};

/** The visible marker for a stop (some stops exist in both a desktop and a mobile layout). */
function findStop(id: StopId) {
  return (
    Array.from(document.querySelectorAll(`[data-journey-stop="${id}"]`)).find((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }) ?? null
  );
}

/**
 * One Deglet Nour travels the whole Hsoumi Dates process.
 *
 * It hangs in the hero bunch, lets go, falls into the grower's hand, then moves
 * through sorting, inspection, product selection and the cleaning line before it
 * settles on the crates in the export container — the doors close, and the
 * truck and ship carry it on. Every stop is a live marker inside a real
 * photograph, so pins, parallax and responsive layouts are followed exactly.
 */
export function DateJourney() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const layer = root.current!;
    const date = layer.querySelector<HTMLElement>("[data-date]")!;
    const backlit = layer.querySelector<HTMLElement>("[data-date-backlit]")!;
    const sheen = layer.querySelector<HTMLElement>("[data-date-sheen]")!;
    const shadow = layer.querySelector<HTMLElement>("[data-date-shadow]")!;

    const hero = document.querySelector<HTMLElement>("[data-journey-hero]");
    const startEl = document.querySelector<HTMLElement>("[data-journey-start]");
    const shade = document.querySelector<HTMLElement>("[data-hero-shade]");
    if (!hero || !startEl) return;

    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      layer.style.visibility = "visible";
      const journey = { p: 0 };
      let stops: Stop[] = [];
      const ref: { master?: ScrollTrigger } = {};

      /** Resolve each stop's resting scroll position (called on every refresh). */
      const computeStops = () => {
        const vh = window.innerHeight;
        const list: Stop[] = [];
        for (const id of ORDER) {
          const el = findStop(id);
          if (!el) continue;
          const pinRoot = el.closest("[data-journey-pin]");
          const frac = el.getAttribute("data-journey-frac");
          const pinST = pinRoot
            ? ScrollTrigger.getAll().find((t) => t !== ref.master && t.pin === pinRoot)
            : undefined;
          let at: number;
          let hold: number;
          if (pinST && frac !== null) {
            const span = pinST.end - pinST.start;
            at = pinST.start + Number(frac) * span;
            hold = Math.min(Math.max(span * 0.03, 30), 110);
          } else {
            const r = el.getBoundingClientRect();
            at = r.top + window.scrollY + r.height / 2 - vh * 0.55;
            hold = vh * 0.1;
          }
          const prev = list[list.length - 1];
          const floor = prev ? prev.at + prev.hold + hold + 60 : RELEASE_AT * vh + hold + vh * 0.5;
          const spec: StopSpec | null = id === "container" ? null : STOPS[id];
          list.push({
            id,
            el,
            at: Math.max(at, floor),
            hold,
            angle: spec ? spec.angle : 180,
            plump: (spec?.plump ?? SPR.ratio) / SPR.ratio,
            grade: id === "container" ? NATURAL : { ...PHOTO, blur: PHOTO.blur + (spec?.soften ?? 0) },
          });
        }
        stops = list;
        const last = stops[stops.length - 1];
        return last ? last.at + last.hold : vh * 2;
      };

      // Master timeline: the whole journey is one scrubbed progress value.
      const heroBox = hero.parentElement?.classList.contains("pin-spacer") ? hero.parentElement : hero;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroBox,
          start: "top top",
          end: () => computeStops(),
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
      tl.to(journey, { p: 1, ease: "none", duration: 1 });
      ref.master = tl.scrollTrigger!;

      const shadeOnStart = () => {
        const mobileShade = window.matchMedia("(max-width: 767px)").matches;
        const opacity = shade ? Number(gsap.getProperty(shade, "opacity")) : 1;
        return (mobileShade ? 0.5 : 0.1) * opacity;
      };

      let last = { x: 0, y: 0 };
      let hidden = false;
      const hide = () => {
        if (!hidden) layer.style.opacity = "0";
        hidden = true;
      };

      const render = () => {
        const st = ref.master!;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const s = st.start + journey.p * (st.end - st.start);
        const t = performance.now() / 1000;
        const releasePx = RELEASE_AT * vh;

        // --- Where are we in the journey? ---------------------------------------
        const k = stops.findIndex((stop) => s < stop.at + stop.hold);
        if (k === -1) return hide();
        const stop = stops[k];
        const resting = s >= stop.at - stop.hold;
        if (hidden) layer.style.opacity = "1";
        hidden = false;

        const B = stop.el.getBoundingClientRect();
        const Bc = center(B);
        const LB = B.width;

        let P: { x: number; y: number };
        let len: number;
        let angle: number;
        let plump: number;
        let grade: Grade;
        let w = 1; // leg progress (1 = at rest)
        let fromHero = false;
        let park = 0;
        let darken = 0;
        let opacity = 1;

        if (resting) {
          P = Bc;
          len = LB;
          angle = stop.angle;
          plump = stop.plump;
          grade = stop.grade;
          // Final stop: the container doors close over it.
          if (stop.id === "container") opacity = 1 - smooth(stop.at, stop.at + stop.hold, s);
        } else {
          // Leg from the previous stop (or the palm) to this one.
          fromHero = k === 0;
          const prev = fromHero ? null : stops[k - 1];
          const departAt = prev ? prev.at + prev.hold : releasePx;
          const arriveAt = stop.at - stop.hold;
          const legPx = Math.max(1, arriveAt - departAt);

          let A: { x: number; y: number };
          let LA: number;
          let angA: number;
          let plumpA = 1;
          let gradeA = NATURAL;

          if (fromHero) {
            // --- Scenes 1–2: hanging, swaying, trembling, letting go -----------
            const detach = clamp01((s - TREMBLE_FROM * vh) / ((RELEASE_AT - TREMBLE_FROM) * vh));
            const sr = startEl.getBoundingClientRect();
            const S = center(sr);
            LA = sr.width;
            const sway = Math.sin(t * 1.4) * 2.5 + Math.sin(t * 2.3) * 1.2;
            const tremble = Math.sin(detach * Math.PI * 7) * 16 * detach * (1 - detach * 0.35);
            const wPre = s < releasePx ? 0 : (s - releasePx) / legPx;
            angA = JOURNEY.start.angle + (sway + tremble) * (1 - easeInOut(clamp01(wPre)));
            const heroTop = hero.getBoundingClientRect().top;
            const rad = (angA * Math.PI) / 180;
            // Once released it no longer belongs to the palm: it falls from where it let go.
            A = {
              x: S.x + Math.cos(rad) * (LA / 2),
              y: S.y - LA / 2 + detach * LA * 0.18 + Math.sin(rad) * (LA / 2) - Math.min(0, heroTop),
            };
            darken = shadeOnStart();
          } else {
            const ar = prev!.el.getBoundingClientRect();
            A = center(ar);
            LA = ar.width;
            angA = prev!.angle;
            plumpA = prev!.plump;
            gradeA = prev!.grade;
          }

          const tLeg = clamp01((s - departAt) / legPx);
          w = easeInOut(tLeg);

          // Path: from A to B with a gentle bow.
          const dx = Bc.x - A.x;
          const dy = Bc.y - A.y;
          const dl = Math.hypot(dx, dy) || 1;
          const bow = Math.sin(Math.PI * w) * Math.min(vw, 1000) * (fromHero ? 0.14 : 0.05);
          P = { x: lerp(A.x, Bc.x, w) + (-dy / dl) * bow, y: lerp(A.y, Bc.y, w) + (dx / dl) * bow };

          // Size: swells towards the camera mid-leg.
          const peak = fromHero
            ? Math.min(Math.max(Math.min(vw, vh) * 0.34, 120), 320)
            : Math.min(Math.max(Math.max(LA, LB) * 1.7, 40), 130);
          len = swell(LA, LB, peak, w);

          // Long legs cross whole sections: wait in the margin instead of covering the copy.
          if (!fromHero && legPx > vh * 2.2) {
            const ramp = Math.min(0.45, Math.max(0.12, (vh * 0.9) / legPx)); // ~0.9 viewport of scroll each way
            park = smooth(0, ramp, tLeg) * smooth(0, ramp, 1 - tLeg);
            const mobile = vw < 768;
            const spot = { x: vw - (mobile ? 16 : 40), y: vh * 0.52 };
            P = { x: lerp(P.x, spot.x, park), y: lerp(P.y, spot.y, park) };
            len = lerp(len, mobile ? 30 : 46, park);
          }

          const turns = legPx > vh * 0.6 ? 360 : 0;
          angle = lerp(angA, stop.angle + turns, w) + park * Math.sin(t * 0.8) * 10;
          plump = lerp(plumpA, stop.plump, smooth(0.6, 1, w));
          grade = mixGrade(mixGrade(gradeA, NATURAL, smooth(0, 0.3, w)), stop.grade, smooth(0.6, 1, w));
          darken *= 1 - smooth(0, 0.25, w);
        }

        // --- Render -------------------------------------------------------------
        const air = resting ? 0 : Math.sin(Math.PI * w) * (1 - park);
        const scale = len / SPR.len;
        const rx = air * 26;
        const ry = resting ? 0 : -Math.sin(2 * Math.PI * w) * 18 * (1 - park);

        const speed = Math.hypot(P.x - last.x, P.y - last.y);
        last = P;
        const blur = (Math.min(1.6, Math.max(0, speed - 6) * 0.05) + grade.blur) / Math.max(scale, 0.05);

        const transform = (ox: number, oy: number) =>
          `translate3d(${P.x + ox - SPR.w / 2}px, ${P.y + oy - SPR.h / 2}px, 0) rotate(${angle - SPR.axis}deg) ` +
          `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale}, ${scale * plump})`;

        date.style.transform = transform(0, 0);
        date.style.opacity = String(opacity);
        date.style.filter =
          `brightness(${((1 - darken) * grade.bright).toFixed(3)}) contrast(${grade.contrast.toFixed(3)}) ` +
          `saturate(${grade.sat.toFixed(3)}) blur(${blur.toFixed(2)}px)`;
        backlit.style.opacity = String(fromHero ? 1 - smooth(0, 0.35, w) : 0);
        sheen.style.opacity = String(0.5 * air);
        sheen.style.backgroundPosition = `${20 + w * 260}% 0`;

        // Shadow: soft and distant in flight, a tight contact shadow at rest (none while on the palm).
        const onPalm = fromHero && w < 0.05;
        const contact = (resting ? 1 : 1 - air) * (onPalm ? 0 : 1);
        shadow.style.transform = transform(lerp(len * 0.04, len * 0.1, air), lerp(len * 0.1, len * 0.26, air));
        shadow.style.opacity = String((0.3 * Math.pow(air, 1.3) + 0.28 * contact) * opacity);
        shadow.style.filter = `blur(${(len * lerp(0.05, 0.07, air)) / Math.max(scale, 0.05)}px)`;
      };

      gsap.ticker.add(render);
      render();

      return () => {
        gsap.ticker.remove(render);
        layer.style.visibility = "";
        layer.style.opacity = "";
      };
    });
  });

  const mask = {
    WebkitMaskImage: "url(/images/date/amber.png)",
    maskImage: "url(/images/date/amber.png)",
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
  } as const;

  return (
    <div ref={root} aria-hidden className="pointer-events-none invisible fixed inset-0 z-30 overflow-hidden">
      <div
        data-date-shadow
        className="absolute top-0 left-0 origin-center bg-[#2a1606] will-change-transform"
        style={{ width: SPR.w, height: SPR.h, ...mask }}
      />
      <div data-date className="absolute top-0 left-0 origin-center will-change-transform" style={{ width: SPR.w, height: SPR.h }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- transparent sprite, transformed every frame */}
        <img src="/images/date/amber.png" alt="" width={SPR.w} height={SPR.h} className="absolute inset-0 h-full w-full" draggable={false} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-date-backlit src="/images/date/backlit.png" alt="" width={SPR.w} height={SPR.h} className="absolute inset-0 h-full w-full" draggable={false} />
        <div
          data-date-sheen
          className="absolute inset-0 mix-blend-screen"
          style={{
            ...mask,
            backgroundImage:
              "linear-gradient(100deg, transparent 38%, rgba(255,232,190,0.85) 50%, transparent 62%)",
            backgroundSize: "300% 100%",
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
}
