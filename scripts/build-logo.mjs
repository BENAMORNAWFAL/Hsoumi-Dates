/**
 * Builds the Hsoumi Dates emblem in the website palette from the client's logo
 * (design/hsoumi-logo-source.png, 1200 × 1200).
 *
 *   node scripts/build-logo.mjs
 *
 * The source stores its disc and ring as fully transparent pixels, so the disc
 * and ring are rebuilt geometrically; the palms, dune and ground are recoloured:
 *   fronds → olive (#343d2f) with cream veins · trunk & ground → brown (#30251d)
 *   dune line & frond accents → amber (#bc8951) · fruit clusters → gold (#cfab7b)
 *   disc → cream (#f3ede1) · ring → brown (#30251d)
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "design/hsoumi-logo-source.png";
const C = { cream: [243, 237, 225], brown: [48, 37, 29], amber: [188, 137, 81], gold: [207, 171, 123], olive: [52, 61, 47], oliveLight: [80, 92, 70] };
const CX = 600, CY = 600, R_IN = 571, R_OUT = 582;
/** The fruit clusters under each crown (they become dates). */
const FRUIT = [{ x: 487, y: 383, r: 50 }, { x: 797, y: 620, r: 34 }];

const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * Math.min(1, Math.max(0, t)));
const step = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const out = Buffer.alloc(W * H * 4);

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const d = Math.hypot(x + 0.5 - CX, y + 0.5 - CY);
    const o = out.subarray(i, i + 4);
    if (d > R_OUT + 1) continue; // transparent outside the emblem

    // Base: cream disc, brown ring (anti-aliased edges).
    let col = d < R_IN ? C.cream : C.brown;
    if (Math.abs(d - R_IN) < 1) col = mix(C.cream, C.brown, d - R_IN + 0.5);
    let alpha = d > R_OUT ? 1 - (d - R_OUT) : 1;

    // Artwork inside the disc.
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    // The ground line, like the ring, is stored with zero alpha: recover dark brown ink.
    const hiddenInk = data[i + 3] === 0 && r + g + b > 30 && r + g + b < 330 && r > b + 20;
    const a = hiddenInk ? 1 : data[i + 3] / 255;
    if (d < R_IN - 1 && a > 0) {
      const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      let ink;
      if (g > r + 4 && g > b + 4) {
        // Fronds: olive, with the light veins kept cream (drops the faint text across them).
        ink = L < 0.62 ? mix(C.olive, C.oliveLight, (L - 0.2) / 0.4) : C.cream;
      } else if (r - b > 80 && L > 0.38) {
        ink = mix(C.amber, C.gold, (L - 0.5) / 0.3); // dune line, accents
      } else {
        // Trunks, outlines, ground: brown → cream by lightness.
        ink = L < 0.32 ? C.brown : L > 0.78 ? C.cream : mix(mix(C.brown, C.amber, step(0.32, 0.55, L) * 0.6), C.cream, step(0.55, 0.78, L));
      }
      if (L > 0.72 && FRUIT.some((f) => Math.hypot(x - f.x, y - f.y) < f.r)) ink = mix(C.gold, C.amber, (0.95 - L) * 2);
      col = mix(col, ink, a);
    }
    o[0] = Math.round(col[0]);
    o[1] = Math.round(col[1]);
    o[2] = Math.round(col[2]);
    o[3] = Math.round(255 * Math.min(1, Math.max(0, alpha)));
  }
}

await mkdir("public/images/brand", { recursive: true });
const master = sharp(out, { raw: { width: W, height: H, channels: 4 } }).png();
await master.clone().toFile("design/hsoumi-logo.png");
await master.clone().resize(512, 512, { kernel: "lanczos3" }).toFile("public/images/brand/hsoumi-emblem.png");
await master.clone().resize(512, 512, { kernel: "lanczos3" }).toFile("src/app/icon.png");
// Apple touch icon: opaque, on cream.
await sharp(await master.clone().resize(160, 160).toBuffer())
  .extend({ top: 10, bottom: 10, left: 10, right: 10, background: { r: 243, g: 237, b: 225, alpha: 1 } })
  .flatten({ background: "#f3ede1" })
  .png()
  .toFile("src/app/apple-icon.png");
// favicon.ico with PNG-encoded 16/32/48 px images.
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => master.clone().resize(s, s, { kernel: "lanczos3" }).toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, k) => {
  const e = 6 + 16 * k;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(pngs[k].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[k].length;
});
const { writeFile } = await import("node:fs/promises");
await writeFile("src/app/favicon.ico", Buffer.concat([header, ...pngs]));
console.log("emblem written");
