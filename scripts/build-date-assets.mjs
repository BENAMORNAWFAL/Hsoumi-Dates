/**
 * Builds the colour-graded Deglet Nour sprites used by the scroll journey.
 *   node scripts/build-date-assets.mjs
 * Source: design/deglet-nour-source.png (transparent macro photograph).
 * Output: public/images/date/{amber,backlit}.png + printed geometry.
 */
import sharp from "sharp";

const SRC = "design/deglet-nour-source.png";

async function rgba(path) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}

/** Mean / std per channel for pixels selected by `pick(x, y, a)`. */
function stats({ data, w, h }, pick) {
  const s = [0, 0, 0], q = [0, 0, 0];
  let n = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (!pick(x, y, data[i + 3])) continue;
      for (let c = 0; c < 3; c++) { s[c] += data[i + c]; q[c] += data[i + c] ** 2; }
      n++;
    }
  const mean = s.map((v) => v / n);
  const std = q.map((v, c) => Math.sqrt(v / n - mean[c] ** 2));
  return { mean, std, n };
}

const src = await rgba(SRC);

// Silhouette bounds + principal axis.
let minX = 1e9, minY = 1e9, maxX = 0, maxY = 0, sx = 0, sy = 0, n = 0;
for (let y = 0; y < src.h; y++)
  for (let x = 0; x < src.w; x++)
    if (src.data[(y * src.w + x) * 4 + 3] > 128) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      sx += x; sy += y; n++;
    }
const cx = sx / n, cy = sy / n;
let cxx = 0, cyy = 0, cxy = 0;
for (let y = 0; y < src.h; y++)
  for (let x = 0; x < src.w; x++)
    if (src.data[(y * src.w + x) * 4 + 3] > 128) {
      cxx += (x - cx) ** 2; cyy += (y - cy) ** 2; cxy += (x - cx) * (y - cy);
    }
const axis = (0.5 * Math.atan2(2 * cxy, cxx - cyy) * 180) / Math.PI;

const pad = 6;
const crop = {
  left: Math.max(0, minX - pad),
  top: Math.max(0, minY - pad),
  width: Math.min(src.w, maxX + pad) - Math.max(0, minX - pad),
  height: Math.min(src.h, maxY + pad) - Math.max(0, minY - pad),
};
const croppedPng = await sharp(SRC).extract(crop).png().toBuffer();
const own = stats(await rgba(croppedPng), (x, y, a) => a > 200);

// Targets sampled from the real photographs on the page.
const hand = await rgba("public/images/origin-harvest-in-hand.jpg");
const handStats = stats(hand, (x, y) => {
  // Ellipse over the top-right date on the grower's strand (centre 563,455; 42°).
  const dx = x - 563, dy = y - 455, t = (42 * Math.PI) / 180;
  const u = dx * Math.cos(t) + dy * Math.sin(t), v = -dx * Math.sin(t) + dy * Math.cos(t);
  return (u / 58) ** 2 + (v / 30) ** 2 <= 1;
});
const hero = await rgba("public/images/hero-sahara-palm.jpg");
const heroStats = stats(hero, (x, y) => {
  // Lower bunch, where the fruit is lit through by the low sun.
  const i = (y * hero.w + x) * 4;
  const [r, b] = [hero.data[i], hero.data[i + 2]];
  return x > 860 && x < 950 && y > 340 && y < 405 && r > 150 && r - b > 70;
});

/** Reinhard-style transfer: match each channel's mean and spread to the target. */
async function grade(target, out, strength = 1, contrast = 1) {
  const a = [0, 1, 2].map((c) => {
    const k = (target.std[c] / own.std[c]) * contrast;
    return 1 + (k - 1) * strength;
  });
  const b = [0, 1, 2].map((c) => (target.mean[c] - own.mean[c] * a[c]) * strength);
  await sharp(croppedPng).linear(a.concat(1), b.concat(0)).png({ compressionLevel: 9 }).toFile(out);
}

await grade(handStats, "public/images/date/amber.png", 1, 1.1);
await grade(heroStats, "public/images/date/backlit.png", 1, 0.9);

console.log(JSON.stringify({
  crop, axisDeg: +axis.toFixed(1),
  aspect: +(crop.height / crop.width).toFixed(3),
  own: own.mean.map(Math.round), hand: handStats.mean.map(Math.round), hero: heroStats.mean.map(Math.round), heroN: heroStats.n,
}));
