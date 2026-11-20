/**
 * Geometry for the Deglet Nour scroll journey.
 *
 * One date travels the whole company process — palm, harvest, sorting,
 * quality control, selection, cleaning line and finally the export container.
 * Each stop is an empty resting place inside a real photograph, so the date
 * can arrive and leave again without revealing a duplicate.
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
};

export const JOURNEY = {
  /** The single date hanging from the bottom of the bunch in the hero photograph. */
  start: { img: { w: 1264, h: 848 }, x: 907, y: 407.5, len: 11, angle: 90 },
  /** public/images/date/*.png — 437 × 192, silhouette 425 × 180, calyx on the right. */
  sprite: { w: 437, h: 192, len: 425, ratio: 180 / 425, axis: 176.5 },
} as const;

/** Resting places, in the order the date reaches them. */
export const STOPS = {
  /** 02 About — cradled in the grower's lower hand. */
  harvest: { img: { w: 928, h: 1152 }, x: 470, y: 742, len: 118, angle: 195, plump: 0.55 },
  /** 03 Expertise — on the empty steel of the sorting table. */
  sorting: { img: { w: 1152, h: 928 }, x: 250, y: 845, len: 85, angle: 172, plump: 0.5 },
  /** 03 Expertise — on the inspection scale (soft focus in the photograph). */
  inspection: { img: { w: 1152, h: 928 }, x: 520, y: 700, len: 105, angle: 180, plump: 0.5, soften: 0.9 },
  /** 04 Products — selected, lying on the travertine beside the loose date. */
  selection: { img: { w: 1024, h: 1024 }, x: 390, y: 812, len: 122, angle: 184, plump: 0.52 },
  /** 05 Facilities — on the mesh of the cleaning line. */
  line: { img: { w: 1152, h: 928 }, x: 480, y: 640, len: 72, angle: 190, plump: 0.5 },
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
  spec: { img: Img; x: number; y: number; len: number },
  posX = 0.5,
) {
  const p = coverPoint(box.w, box.h, spec.img, spec.x, spec.y, posX);
  const len = spec.len * p.s;
  marker.style.left = `${p.x - len / 2}px`;
  marker.style.top = `${p.y - len / 2}px`;
  marker.style.width = `${len}px`;
  marker.style.height = `${len}px`;
  return { ...p, len };
}
