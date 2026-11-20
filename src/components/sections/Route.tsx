"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "@/lib/gsap";
import type { ExportGlobe } from "@/three/ExportGlobe";

/* -------------------------------------------------------------------------- */
/*  World coordinates (SVG units). Ground at y=640, sea level at y=700.        */
/* -------------------------------------------------------------------------- */
const GROUND = 640;
const SEA = 700;
const QUAY = 4520;
const CONT = { w: 260, h: 110 };
const TRUCK0 = 720;
const TRUCK1 = 3960;
const SHIP0 = 4560;
const SHIP1 = 7400;
const SLOT = { x: 640, y: -130 }; // container slot on the ship, ship-local
const LIFT_TOP = 230;
const BOOM_Y = 150;

/** Final crate positions inside the container (container-local, top-left). */
const CRATES = [
  { x: 12, y: -55 },
  { x: 95, y: -55 },
  { x: 178, y: -55 },
  { x: 53, y: -108 },
  { x: 136, y: -108 },
];

const STEPS = [
  { title: "Packed & loaded", copy: "Packed cartons are loaded into the container at our facility.", at: 0 },
  { title: "On the road", copy: "Overland transport from our facility to the Tunisian coast.", at: 2.8 },
  { title: "At the port", copy: "The container is handed over and lifted aboard for shipment.", at: 5.2 },
  { title: "Across the sea", copy: "Sea freight to professional buyers in international markets.", at: 7.5 },
  { title: "To your market", copy: "Authentic Tunisian dates, delivered to the agreed destination.", at: 9.0 },
];
const TOTAL = 10;
/** Pin progress at which the travelling date rests on the crates, as the container doors close. */
const CRATE_REST = 2.62 / TOTAL;

export function Route() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const q = gsap.utils.selector(section);
      const svg = q("[data-route-svg]")[0] as unknown as SVGSVGElement;
      const el = (k: string) => q(`[data-r='${k}']`)[0] as unknown as SVGGElement;

      const world = el("world");
      const far = el("far");
      const truck = el("truck");
      const container = el("container");
      const ship = el("ship");
      const trolley = el("trolley");
      const cable = q("[data-r='cable']")[0] as unknown as SVGLineElement;
      const wheels = q("[data-r='wheel']") as unknown as SVGGElement[];
      const crates = q("[data-r='crate']") as unknown as SVGGElement[];
      const sun = el("sun");

      // Single source of truth for the scene; render() writes it to the SVG.
      const s = {
        cam: 690,
        truck: TRUCK0,
        cx: TRUCK0 + 6,
        cy: GROUND - 50 - CONT.h,
        ship: SHIP0,
        trolley: 4700,
        hook: BOOM_Y + 30,
        sun: 0,
      };

      const render = () => {
        const vb = svg.viewBox.baseVal;
        const viewCenter = vb.x + vb.width / 2;
        world.setAttribute("transform", `translate(${viewCenter - s.cam} 0)`);
        far.setAttribute("transform", `translate(${(viewCenter - s.cam) * 0.32} 0)`);
        truck.setAttribute("transform", `translate(${s.truck} ${GROUND})`);
        container.setAttribute("transform", `translate(${s.cx} ${s.cy + CONT.h})`);
        ship.setAttribute("transform", `translate(${s.ship} ${SEA})`);
        trolley.setAttribute("transform", `translate(${s.trolley} ${BOOM_Y})`);
        cable.setAttribute("x1", String(s.trolley));
        cable.setAttribute("x2", String(s.trolley));
        cable.setAttribute("y2", String(s.hook));
        const spin = ((s.truck - TRUCK0) / 22) * (180 / Math.PI);
        wheels.forEach((w) => w.setAttribute("transform", `rotate(${spin})`));
        sun.setAttribute("transform", `translate(0 ${s.sun * 120})`);
      };

      // Keep the scene framed for any screen shape: ground ~64% down, wider view on landscape.
      const frame = () => {
        const w = section.clientWidth;
        const h = section.clientHeight;
        const aspect = w / h;
        const vw = aspect >= 1.25 ? 1600 : aspect >= 0.9 ? 1300 : 840;
        const vh = vw / aspect;
        svg.setAttribute("viewBox", `${800 - vw / 2} ${GROUND - vh * (aspect < 0.9 ? 0.6 : 0.64)} ${vw} ${vh}`);
        render();
      };
      frame();
      window.addEventListener("resize", frame);

      // Crates start out of sight, at the packing-house door.
      const doorX = 545 - (TRUCK0 + 6);
      crates.forEach((c) => gsap.set(c, { x: doorX, y: 0, autoAlpha: 0 }));

      const mm = gsap.matchMedia();
      let globe: ExportGlobe | null = null;
      let disposed = false;
      const globeState = { p: 0 };

      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({
          defaults: { ease: "power1.inOut" },
          onUpdate: () => {
            render();
            const t = tl.time();
            const idx = STEPS.reduce((acc, st, i) => (t >= st.at - 0.05 ? i : acc), 0);
            q("[data-step-caption]").forEach((c, i) => c.classList.toggle("is-active", i === idx));
            q("[data-step-tick]").forEach((c, i) => c.classList.toggle("is-done", i <= idx));
            globe?.setProgress(globeState.p);
          },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * (window.innerWidth >= 1024 ? 5.5 : 4.5)}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1 · Loading at the packing house.
        crates.forEach((c, i) => {
          const at = 0.35 + i * 0.4;
          const { x, y } = CRATES[i];
          tl.set(c, { autoAlpha: 1 }, at)
            .to(c, { x: (doorX + x) / 2, duration: 0.25, ease: "none" }, at)
            .to(c, { y: Math.min(y, -60) - 90, duration: 0.25, ease: "power2.out" }, at)
            .to(c, { x, duration: 0.25, ease: "none" }, at + 0.25)
            .to(c, { y, duration: 0.25, ease: "power2.in" }, at + 0.25);
        });
        tl.to(q("[data-r='container-skin']"), { opacity: 1, duration: 0.35 }, 2.45)
          .fromTo(q("[data-r='door']"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 0.3 }, 2.4);

        // 2 · On the road.
        tl.to(s, { truck: TRUCK1, cx: TRUCK1 + 6, duration: 2.4, ease: "power2.inOut" }, 2.8)
          .to(s, { cam: 4250, duration: 2.4, ease: "power2.inOut" }, 2.8)
          .to(s, { sun: 0.4, duration: 4.5, ease: "none" }, 2.8);

        // 3 · At the port: the crane takes the container aboard.
        const contX1 = SHIP0 + SLOT.x;
        const contY1 = SEA + SLOT.y - CONT.h;
        tl.to(s, { trolley: TRUCK1 + 6 + CONT.w / 2, duration: 0.4 }, 5.2)
          .to(s, { hook: s.cy, duration: 0.3 }, 5.4)
          .to(s, { cy: LIFT_TOP, hook: LIFT_TOP, duration: 0.4 }, 5.7)
          .to(s, { cx: contX1, trolley: contX1 + CONT.w / 2, cam: 4700, duration: 0.8 }, 6.1)
          .to(s, { cy: contY1, hook: contY1, duration: 0.4 }, 6.9)
          .to(s, { hook: BOOM_Y + 30, duration: 0.3 }, 7.3)
          .to(s, { truck: TRUCK1 - 900, duration: 1.2, ease: "power2.in" }, 7.0);

        // 4 · Across the sea.
        tl.to(s, { ship: SHIP1, cx: contX1 + (SHIP1 - SHIP0), duration: 1.6, ease: "power2.in" }, 7.5)
          .to(s, { cam: SHIP1 + 520, duration: 1.6, ease: "power2.in" }, 7.5)
          .to(s, { sun: 1, duration: 1.6 }, 7.5);

        // 5 · To your world.
        tl.to(q("[data-route-svg]"), { autoAlpha: 0, duration: 0.5 }, 9.0)
          .fromTo(q("[data-globe]"), { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.6 }, 9.0)
          .to(globeState, { p: 1, duration: 1, ease: "none" }, 9.0)
          .fromTo(q("[data-markets]"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 9.4)
          .set({}, {}, TOTAL);

        import("@/three/ExportGlobe").then(({ ExportGlobe }) => {
          if (disposed) return;
          globe = new ExportGlobe(q("[data-globe]")[0] as HTMLElement);
          globe.setProgress(globeState.p);
          ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: () => `+=${window.innerHeight * 7.5}`,
            onToggle: (self) => (self.isActive ? globe?.start() : globe?.stop()),
          });
          if (ScrollTrigger.isInViewport(section)) globe.start();
        });

        const onResize = () => globe?.resize();
        window.addEventListener("resize", onResize);
        return () => {
          disposed = true;
          window.removeEventListener("resize", onResize);
          globe?.dispose();
          globe = null;
        };
      });

      // Reduced motion: present the loaded ship at sea, with the full caption list.
      mm.add(MQ.reduced, () => {
        crates.forEach((c, i) => gsap.set(c, { x: CRATES[i].x, y: CRATES[i].y, autoAlpha: 1 }));
        gsap.set(q("[data-r='container-skin']"), { opacity: 1 });
        Object.assign(s, { cam: 4700, truck: TRUCK1 - 900, cx: SHIP0 + SLOT.x, cy: SEA + SLOT.y - CONT.h, trolley: 4700 });
        render();
        q("[data-step-caption]").forEach((c, i) => c.classList.toggle("is-active", i === 2));
      });

      return () => window.removeEventListener("resize", frame);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="journey"
      data-nav="dark"
      data-journey-pin
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-olive text-cream"
      aria-labelledby="route-title"
    >
      <svg
        data-route-svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Illustration: crates of dates are loaded onto a truck, driven to the port, lifted onto a cargo ship and carried across the sea."
        fill="none"
        stroke="#f3ede1"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          <pattern id="waves" width="160" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20 q20 -9 40 0 t40 0 t40 0 t40 0" strokeOpacity={0.5} />
          </pattern>
        </defs>

        {/* Sky */}
        <g data-r="sun">
          <circle cx={1180} cy={330} r={78} stroke="#e2c49b" strokeOpacity={0.9} />
          <circle cx={1180} cy={330} r={110} stroke="#e2c49b" strokeOpacity={0.18} />
        </g>

        {/* Far layer — dunes, then the coast */}
        <g data-r="far" strokeOpacity={0.32}>
          <path d="M-400 560 C -200 500, 0 520, 200 560 S 600 500, 800 545 S 1200 600, 1400 540 S 1800 500, 2000 552 S 2400 590, 2600 560 C 2800 520, 3000 610, 3200 650 L 3600 690 L 7000 690" />
          <path d="M-400 600 C -100 570, 300 590, 600 600 S 1100 570, 1500 595 S 2200 605, 2700 598" strokeOpacity={0.6} />
        </g>

        <g data-r="world">
          {/* Ground & road */}
          <path d={`M-600 ${GROUND} H ${QUAY} V ${SEA + 30}`} />
          <path d={`M 1180 ${GROUND + 26} H ${QUAY - 40}`} strokeDasharray="26 22" strokeOpacity={0.45} />

          {/* Oasis palms */}
          <Palm x={60} s={1.05} />
          <Palm x={170} s={0.78} flip />
          <Palm x={1240} s={0.9} />
          <Palm x={1950} s={1.1} flip />
          <Palm x={2700} s={0.82} />
          <Palm x={3350} s={0.95} flip />

          {/* Packing house */}
          <g>
            <path d={`M260 ${GROUND} V 420 H 700 V ${GROUND}`} fill="#343d2f" />
            <path d="M236 420 L 480 352 L 724 420 Z" fill="#343d2f" />
            <path d={`M520 ${GROUND} V 540 A 60 60 0 0 1 640 540 V ${GROUND}`} />
            <rect x={300} y={480} width={70} height={56} />
            <rect x={398} y={480} width={70} height={56} strokeOpacity={0.6} />
            <text x={480} y={404} textAnchor="middle" fill="#f3ede1" stroke="none" style={{ fontFamily: "var(--font-serif)" }} fontSize={24} letterSpacing={5}>
              HSOUMI DATES
            </text>
            <text x={480} y={462} textAnchor="middle" fill="#ddcbb6" stroke="none" style={{ fontFamily: "var(--font-sans)" }} fontSize={11} letterSpacing={4}>
              COLLECTION · SORTING · PACKING
            </text>
          </g>

          {/* Port: background stacks */}
          <g strokeOpacity={0.35}>
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect key={`${r}-${c}`} x={3560 + c * 96 + r * 20} y={GROUND - 48 * (r + 1)} width={90} height={44} />
              )),
            )}
          </g>
          {/* Quay bollards */}
          <path d={`M4380 ${GROUND} v -16 h 14 v 16 M4500 ${GROUND} v -16 h 14 v 16`} />

          {/* Quay crane */}
          <g>
            <path d={`M4440 ${GROUND} L 4440 ${BOOM_Y - 40} M4500 ${GROUND} L 4500 ${BOOM_Y - 40}`} />
            <path d={`M4440 ${GROUND - 80} L 4500 ${GROUND - 160} M4500 ${GROUND - 80} L 4440 ${GROUND - 160} M4440 ${GROUND - 240} L 4500 ${GROUND - 320} M4500 ${GROUND - 240} L 4440 ${GROUND - 320}`} strokeOpacity={0.5} />
            <path d={`M3920 ${BOOM_Y} H 5560 M3920 ${BOOM_Y + 16} H 5560`} />
            <path
              d={Array.from({ length: 41 }, (_, i) => `M${3920 + i * 41} ${BOOM_Y + 16} L ${3940 + i * 41} ${BOOM_Y}`).join(" ")}
              strokeOpacity={0.45}
            />
            <path d={`M4470 ${BOOM_Y - 40} L 3920 ${BOOM_Y} M4470 ${BOOM_Y - 40} L 5560 ${BOOM_Y}`} strokeOpacity={0.6} />
            <line data-r="cable" x1={4700} y1={BOOM_Y + 24} x2={4700} y2={BOOM_Y + 30} strokeOpacity={0.9} />
            <g data-r="trolley">
              <rect x={-20} y={14} width={40} height={10} fill="#343d2f" />
            </g>
          </g>

          {/* Truck */}
          <g data-r="truck">
            <rect x={0} y={-50} width={400} height={12} fill="#343d2f" />
            <path d="M290 -50 V -150 H 345 L 388 -100 H 400 V -50 Z" fill="#343d2f" />
            <path d="M300 -140 H 338 L 374 -104 H 300 Z" strokeOpacity={0.7} />
            <path d="M392 -62 h 10" stroke="#e2c49b" />
            {[55, 110, 345].map((x) => (
              <g key={x} transform={`translate(${x} -22)`}>
                <circle r={22} fill="#343d2f" />
                <g data-r="wheel">
                  <circle r={8} />
                  <path d="M0 -22 V 22 M-22 0 H 22" strokeOpacity={0.35} />
                </g>
              </g>
            ))}
          </g>

          {/* Ship */}
          <g data-r="ship">
            <path d="M0 -70 H 1040 L 975 42 H 50 Z" fill="#343d2f" />
            <path d="M30 -20 H 1010" strokeOpacity={0.35} />
            <rect x={40} y={-250} width={130} height={180} fill="#343d2f" />
            {[-225, -195, -165, -135].map((y) => (
              <path key={y} d={`M56 ${y} H 154`} strokeOpacity={0.55} />
            ))}
            <rect x={78} y={-300} width={44} height={50} fill="#343d2f" />
            <path d="M78 -286 H 122" stroke="#bc8951" strokeWidth={4} />
            {[200, 345, 490, 635, 780].map((x) => (
              <rect key={x} x={x} y={-130} width={140} height={60} fill="#343d2f" strokeOpacity={0.75} />
            ))}
            {[200, 345, 490].map((x) => (
              <rect key={x} x={x} y={-190} width={140} height={60} fill="#343d2f" strokeOpacity={0.55} />
            ))}
          </g>

          {/* The Hsoumi Dates container and its crates */}
          <g data-r="container">
            <rect x={0} y={-CONT.h} width={CONT.w} height={CONT.h} fill="#343d2f" stroke="none" />
            {CRATES.map((_, i) => (
              <g key={i} data-r="crate">
                <rect width={70} height={50} stroke="#cfab7b" fill="#343d2f" />
                <path d="M0 0 L70 50 M70 0 L0 50" stroke="#cfab7b" strokeOpacity={0.35} />
                <text x={35} y={30} textAnchor="middle" fill="#e2c49b" stroke="none" style={{ fontFamily: "var(--font-serif)" }} fontSize={10.5} letterSpacing={1.2}>
                  HSOUMI
                </text>
              </g>
            ))}
            <g data-r="container-skin" opacity={0}>
              <rect x={0} y={-CONT.h} width={CONT.w} height={CONT.h} fill="#30251d" />
              {Array.from({ length: 12 }, (_, i) => (
                <path key={i} d={`M${16 + i * 21} ${-CONT.h + 10} V -10`} strokeOpacity={0.22} />
              ))}
              <text x={CONT.w / 2} y={-CONT.h / 2 + 10} textAnchor="middle" fill="#f3ede1" stroke="none" style={{ fontFamily: "var(--font-serif)" }} fontSize={21} letterSpacing={4}>
                HSOUMI DATES
              </text>
            </g>
            <rect x={0} y={-CONT.h} width={CONT.w} height={CONT.h} stroke="#e2c49b" />
            <path data-r="door" d={`M0 ${-CONT.h} V 0`} stroke="#e2c49b" strokeWidth={4} />
            {/* Journey stop: the date's last resting place, on top of the crates, before the doors close. */}
            <rect
              data-journey-stop="container"
              data-journey-frac={CRATE_REST}
              x={70}
              y={-133}
              width={36}
              height={36}
              fill="none"
              stroke="none"
            />
          </g>

          {/* Sea */}
          <rect x={QUAY} y={SEA + 12} width={9000} height={3000} fill="#343d2f" stroke="none" />
          <g className="wave-drift">
            <rect x={QUAY} y={SEA - 6} width={9200} height={40} fill="url(#waves)" stroke="none" />
            <rect x={QUAY + 60} y={SEA + 40} width={9200} height={40} fill="url(#waves)" stroke="none" opacity={0.5} />
            <rect x={QUAY + 20} y={SEA + 90} width={9200} height={40} fill="url(#waves)" stroke="none" opacity={0.25} />
          </g>
        </g>
      </svg>

      {/* Scrim keeps the copy legible over the line art */}
      <div
        aria-hidden
        data-route-scrim
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 0% 0%, rgba(52,61,47,0.97) 50%, rgba(52,61,47,0) 100%), linear-gradient(0deg, rgba(52,61,47,0.95) 0%, rgba(52,61,47,0) 22%)",
        }}
      />

      {/* Globe finale */}
      <div data-globe aria-hidden className="pointer-events-none invisible absolute inset-0" />

      {/* Copy overlay */}
      <div className="shell pointer-events-none relative flex h-full flex-col justify-between pt-24 pb-8 lg:pt-[120px] lg:pb-[40px]">
        <div>
          <p className="eyebrow text-parchment">07 / Export &amp; global reach&nbsp;&nbsp;—&nbsp;&nbsp;The route</p>
          <h2 id="route-title" className="sr-only">
            How an order of Hsoumi Dates travels from our facility to international markets
          </h2>
          <div className="relative mt-6 h-[150px] max-w-[620px] md:h-[170px] lg:mt-[34px]">
            {STEPS.map((st, i) => (
              <div
                key={st.title}
                data-step-caption
                className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out [&:not(.is-active)]:translate-y-4 [&:not(.is-active)]:opacity-0 ${i === 0 ? "is-active" : ""}`}
              >
                <p className="t-h2">{st.title}</p>
                <p className="mt-4 max-w-[420px] text-[14px] leading-[23.8px] text-sage md:text-[15px]">{st.copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p data-markets className="caption invisible mb-6 max-w-[520px] tracking-[2px] text-gold">
            From Tunisia&nbsp;&nbsp;·&nbsp;&nbsp;To professional buyers in international markets
          </p>
          <ol className="grid grid-cols-5 gap-2 md:gap-4" aria-label="Journey stages">
            {STEPS.map((st, i) => (
              <li
                key={st.title}
                data-step-tick
                className={`group caption border-t border-cream/20 pt-3 text-cream/45 transition-colors duration-500 [&.is-done]:border-gold [&.is-done]:text-cream ${i === 0 ? "is-done" : ""}`}
              >
                <span className="tabular-nums">0{i + 1}</span>
                <span className="ml-3 hidden md:inline">{st.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** Line-art date palm, rooted at (x, GROUND). */
function Palm({ x, s = 1, flip = false }: { x: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${GROUND}) scale(${flip ? -s : s} ${s})`}>
      <path d="M0 0 C 4 -60, 2 -120, 18 -190" strokeWidth={2.2} />
      <path d="M2 -40 h 7 M3 -80 h 7 M6 -120 h 7 M10 -155 h 7" strokeOpacity={0.4} />
      <g transform="translate(18 -190)">
        <path d="M0 0 C -30 -30, -70 -30, -105 4" />
        <path d="M0 0 C -20 -45, -60 -60, -88 -50" />
        <path d="M0 0 C 0 -40, -10 -70, -30 -86" />
        <path d="M0 0 C 20 -40, 50 -60, 80 -58" />
        <path d="M0 0 C 35 -20, 75 -15, 108 14" />
        <path d="M0 0 C 25 0, 55 20, 70 48" />
        <path d="M0 0 C -20 5, -45 25, -55 52" />
        <circle cx={-4} cy={16} r={9} stroke="#cfab7b" strokeOpacity={0.9} />
        <circle cx={8} cy={20} r={7} stroke="#cfab7b" strokeOpacity={0.7} />
      </g>
    </g>
  );
}
