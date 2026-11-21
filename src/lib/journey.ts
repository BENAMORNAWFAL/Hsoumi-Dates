/**
 * Geometry for the Deglet Nour scroll journey.
 *
 * One date travels the whole company process — palm, harvest, sorting,
 * quality control, selection, cleaning line, quality and finally the export container.
 * Each stop is a REAL date visible in a photograph: the marker is measured on that
 * date (centre, length, direction and plumpness, in image pixels), so the travelling
 * date lands exactly on it and melts into it, at any screen size and crop.
 *
 * Angles describe the date's long axis as the direction from stem (calyx) to tip,
 * in screen degrees (0° = pointing right, 90° = pointing down).
 */

export type Img = { w: number; h: number };

export type StopSpec = {
  img: Img;
  /** Resting point in image pixels. */
  x: number;
  y: number;
  /** Date length in image pixels at that spot. */
  len: number;
  angle: number;
  /** Width ÷ length of the dates in that photograph. */
  plump?: number;
  /** Extra blur (screen px) to match a shallow depth of field. */
  soften?: number;
  /** Brightness of the fruit in that photograph (1 = like the sprite). */
  tone?: number;
  /** object-position of the photograph (0–1), when it is not centred. */
  posX?: number;
  posY?: number;
};

export const JOURNEY = {
  /** The single date hanging from the bottom of the bunch in the hero photograph. */
  start: { img: { w: 1264, h: 848 }, x: 907, y: 407.5, len: 11, angle: 90 },
  /** public/images/date/*.png — 437 × 192, silhouette 425 × 180, calyx on the right. */
  sprite: { w: 437, h: 192, len: 425, ratio: 180 / 425, axis: 176.5 },
} as const;

/** Real dates the travelling date lands on, in the order it reaches them. */
const HELD_UP = { img: { w: 1280, h: 1024 }, x: 638, y: 402, len: 465, angle: 270, plump: 0.44 };

export const STOPS = {
  /** 02 About — the lowest translucent date on the strand in the grower's hands. */
  harvest: { img: { w: 928, h: 1152 }, x: 417, y: 604, len: 112, angle: 151, plump: 0.53 },
  /** 03 Expertise · collection — a date at the bottom of a bagged bunch, right of the trunk. */
  cutting: { img: { w: 941, h: 1672 }, x: 655, y: 338, len: 8, angle: 95, plump: 0.55, tone: 0.75, posY: 0.1 },
  /** 03 Expertise · sorting — the lone date at the front of the sorting table. */
  sorting: { img: { w: 1280, h: 1024 }, x: 207, y: 847, len: 236, angle: 349, plump: 0.42, tone: 0.85 },
  /** 03 Expertise · quality control — the date held up for inspection. */
  inspection: HELD_UP,
  /** 04 Products — the loose date resting on the travertine. */
  selection: { img: { w: 1024, h: 1024 }, x: 718, y: 746, len: 128, angle: 0, plump: 0.5 },
  /** 05 Facilities — the upright date on the mesh of the cleaning line. */
  line: { img: { w: 1152, h: 928 }, x: 381, y: 627, len: 80, angle: 93, plump: 0.55, tone: 0.9 },
  /** 06 Quality — the date held up for inspection. */
  quality: { ...HELD_UP, posX: 0.6 },
} satisfies Record<string, StopSpec>;

export type StopId = keyof typeof STOPS | "container";

/** Where an image-space point lands inside an `object-fit: cover` box. */
export function coverPoint(cw: number, ch: number, img: Img, px: number, py: number, posX = 0.5, posY = 0.5) {
  const s = Math.max(cw / img.w, ch / img.h);
  return { x: (cw - img.w * s) * posX + px * s, y: (ch - img.h * s) * posY + py * s, s };
}

/**
 * Sizes a marker element as a square of the date's length, centred on the date.
 * Because the marker lives inside the photograph's own (transformed) box,
 * its bounding rect reports the date's true on-screen position and size.
 */
export function placeMarker(
  marker: HTMLElement,
  box: { w: number; h: number },
  spec: { img: Img; x: number; y: number; len: number; posX?: number; posY?: number },
  posX = spec.posX ?? 0.5,
) {
  const p = coverPoint(box.w, box.h, spec.img, spec.x, spec.y, posX, spec.posY ?? 0.5);
  const len = spec.len * p.s;
  marker.style.left = `${p.x - len / 2}px`;
  marker.style.top = `${p.y - len / 2}px`;
  marker.style.width = `${len}px`;
  marker.style.height = `${len}px`;
  return { ...p, len };
}
