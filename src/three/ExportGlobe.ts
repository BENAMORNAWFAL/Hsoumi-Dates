import * as THREE from "three";

const DEG = Math.PI / 180;

/** Tunisia — where every Hsoumi Dates shipment begins. */
export const ORIGIN = { name: "Tunisia", lat: 34.0, lon: 9.5 };

/**
 * Abstract shipping lanes leaving Tunisia (bearing in degrees, length in radians).
 * They deliberately end in open space and fade out: the globe expresses reach,
 * not specific destination countries.
 */
const LANES = [
  { bearing: 305, length: 0.42 },
  { bearing: 330, length: 0.62 },
  { bearing: 352, length: 0.48 },
  { bearing: 20, length: 0.7 },
  { bearing: 48, length: 0.5 },
  { bearing: 82, length: 0.95 },
  { bearing: 108, length: 1.35 },
  { bearing: 128, length: 0.8 },
  { bearing: 272, length: 1.1 },
  { bearing: 290, length: 1.55 },
];

/** Great-circle destination from (lat, lon) along a bearing for an angular distance. */
function destination(lat: number, lon: number, bearing: number, dist: number) {
  const p1 = lat * DEG;
  const l1 = lon * DEG;
  const b = bearing * DEG;
  const p2 = Math.asin(Math.sin(p1) * Math.cos(dist) + Math.cos(p1) * Math.sin(dist) * Math.cos(b));
  const l2 = l1 + Math.atan2(Math.sin(b) * Math.sin(dist) * Math.cos(p1), Math.cos(dist) - Math.sin(p1) * Math.sin(p2));
  return { lat: p2 / DEG, lon: l2 / DEG };
}

function toVec(lat: number, lon: number, r = 1) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

/**
 * Editorial line globe: a cream graticule on olive, with abstract shipping lanes
 * drawing out from Tunisia as `progress` goes 0 → 1.
 */
export class ExportGlobe {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  private tilt = new THREE.Group();
  private spin = new THREE.Group();
  private arcs: { line: THREE.Line; count: number }[] = [];
  private pulse: THREE.Mesh;
  private halo!: THREE.Line;
  private disposables: { dispose: () => void }[] = [];
  private raf = 0;
  private running = false;
  private t0 = performance.now();
  private progress = 0;
  private baseYaw: number;

  constructor(private container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
    container.appendChild(this.renderer.domElement);

    const cream = new THREE.Color("#f3ede1");
    const gold = new THREE.Color("#e2c49b");
    const amber = new THREE.Color("#cfab7b");

    // Body: occludes the far side of the graticule.
    const bodyGeo = new THREE.SphereGeometry(0.995, 64, 48);
    const bodyMat = new THREE.MeshBasicMaterial({ color: "#2b3226" });
    this.spin.add(new THREE.Mesh(bodyGeo, bodyMat));
    this.disposables.push(bodyGeo, bodyMat);

    // Graticule.
    const gratMat = new THREE.LineBasicMaterial({ color: cream, transparent: true, opacity: 0.16 });
    this.disposables.push(gratMat);
    const addLine = (pts: THREE.Vector3[]) => {
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      this.disposables.push(g);
      this.spin.add(new THREE.Line(g, gratMat));
    };
    for (let lat = -75; lat <= 75; lat += 15) {
      const pts = [];
      for (let lon = -180; lon <= 180; lon += 3) pts.push(toVec(lat, lon));
      addLine(pts);
    }
    for (let lon = -180; lon < 180; lon += 15) {
      const pts = [];
      for (let lat = -90; lat <= 90; lat += 3) pts.push(toVec(lat, lon));
      addLine(pts);
    }

    // Origin marker + pulse.
    const dotGeo = new THREE.SphereGeometry(0.014, 12, 12);
    const originMat = new THREE.MeshBasicMaterial({ color: gold });
    this.disposables.push(dotGeo, originMat);
    const o = toVec(ORIGIN.lat, ORIGIN.lon, 1.002);
    const originDot = new THREE.Mesh(dotGeo, originMat);
    originDot.position.copy(o);
    originDot.scale.setScalar(1.8);
    this.spin.add(originDot);

    const ringGeo = new THREE.RingGeometry(0.03, 0.036, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: gold, transparent: true, side: THREE.DoubleSide });
    this.disposables.push(ringGeo, ringMat);
    this.pulse = new THREE.Mesh(ringGeo, ringMat);
    this.pulse.position.copy(o);
    this.pulse.lookAt(o.clone().multiplyScalar(2));
    this.spin.add(this.pulse);

    // Shipping lanes: amber at the origin, fading into the night side of the globe.
    const arcMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 });
    this.disposables.push(arcMat);
    const a = o.clone().normalize();
    const fadeTo = new THREE.Color("#2b3226");
    for (const lane of LANES) {
      const d = destination(ORIGIN.lat, ORIGIN.lon, lane.bearing, lane.length);
      const b = toVec(d.lat, d.lon).normalize();
      const lift = 0.05 + lane.length * 0.2;
      const N = 96;
      const pts: THREE.Vector3[] = [];
      const colors: number[] = [];
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        pts.push(slerp(a, b, t).multiplyScalar(1 + Math.sin(Math.PI * t * 0.85) * lift));
        const c = amber.clone().lerp(fadeTo, Math.max(0, (t - 0.45) / 0.55));
        colors.push(c.r, c.g, c.b);
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
      g.setDrawRange(0, 0);
      this.disposables.push(g);
      const line = new THREE.Line(g, arcMat);
      this.spin.add(line);
      this.arcs.push({ line, count: N + 1 });
    }

    // Silhouette ring.
    const haloPts = [];
    for (let i = 0; i <= 128; i++) {
      const t = (i / 128) * Math.PI * 2;
      haloPts.push(new THREE.Vector3(Math.cos(t) * 1.03, Math.sin(t) * 1.03, 0));
    }
    const haloGeo = new THREE.BufferGeometry().setFromPoints(haloPts);
    const haloMat = new THREE.LineBasicMaterial({ color: cream, transparent: true, opacity: 0.35 });
    this.disposables.push(haloGeo, haloMat);
    this.halo = new THREE.Line(haloGeo, haloMat);
    this.scene.add(this.halo);

    // Face Tunisia towards the viewer, sitting a little above centre.
    this.baseYaw = Math.atan2(o.x, o.z);
    this.spin.rotation.y = -this.baseYaw;
    this.tilt.rotation.x = ORIGIN.lat * DEG - 0.14;
    this.tilt.add(this.spin);
    this.scene.add(this.tilt);

    this.resize();
  }

  setProgress(p: number) {
    this.progress = Math.min(1, Math.max(0, p));
    if (!this.running) this.render();
  }

  resize() {
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    const aspect = w / h;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = aspect;
    const tanHalf = Math.tan((this.camera.fov / 2) * DEG);
    const byHeight = 1 / (0.34 * 2 * tanHalf);
    const byWidth = 1 / (0.42 * 2 * tanHalf * aspect);
    const dist = Math.max(byHeight, byWidth);
    this.camera.position.set(0, 0, dist);
    // Wide screens: sit the globe right of the headline.
    const halfW = dist * tanHalf * aspect;
    this.tilt.position.x = aspect > 1.2 ? Math.min(halfW * 0.24, halfW - 1.25) : 0;
    this.halo.position.x = this.tilt.position.x;
    this.camera.updateProjectionMatrix();
    if (!this.running) this.render();
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.render();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private render() {
    const t = (performance.now() - this.t0) / 1000;
    const p = this.progress;

    // Slow drift west as the routes unfurl, so the Americas come into view.
    this.spin.rotation.y = -this.baseYaw + p * 0.22 + Math.sin(t * 0.25) * 0.04;

    this.arcs.forEach(({ line, count }, i) => {
      const local = Math.min(1, Math.max(0, p * 1.7 - i * 0.045));
      line.geometry.setDrawRange(0, Math.floor(count * local));
    });

    const k = (t * 0.6) % 1;
    this.pulse.scale.setScalar(1 + k * 2.2);
    (this.pulse.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - k);

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    this.disposables.forEach((d) => d.dispose());
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

function slerp(a: THREE.Vector3, b: THREE.Vector3, t: number) {
  const omega = a.angleTo(b);
  if (omega < 1e-5) return a.clone();
  const s = Math.sin(omega);
  return a
    .clone()
    .multiplyScalar(Math.sin((1 - t) * omega) / s)
    .add(b.clone().multiplyScalar(Math.sin(t * omega) / s));
}
