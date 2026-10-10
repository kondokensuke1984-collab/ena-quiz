// 3Dの島で みんなが使う道具：単位、地面の高さ、まるい地平線（どうぶつの森ふう）、トゥーンの色、りんかく線。
//
// 単位：2D の島の 10px ＝ 3D の 1。x は 2D の x、z は 2D の y（手前が +z）。
// 割合（Pos）からは x*100, y*75。

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Pos } from '../../types';
import { MAIN_GROUND } from '../../lib/island';

export const PX = 0.1;
export const fx = (p: Pos) => p.x * 100;
export const fz = (p: Pos) => p.y * 75;
export const toPos = (x: number, z: number): Pos => ({ x: x / 100, y: z / 75 });

// ── 地面 ──
export const GRASS_H = 1.2;
const G = {
  cx: MAIN_GROUND.cx * PX, cz: MAIN_GROUND.cy * PX,
  grx: MAIN_GROUND.grassRx * PX, grz: MAIN_GROUND.grassRy * PX,
  srx: MAIN_GROUND.sandRx * PX, srz: MAIN_GROUND.sandRy * PX,
};
export const GROUND = G;

/** 芝の楕円での 中心からの距離（1＝芝の ふち） */
export function grassE(x: number, z: number): number {
  return Math.hypot((x - G.cx) / G.grx, (z - G.cz) / G.grz);
}
export function sandE(x: number, z: number): number {
  return Math.hypot((x - G.cx) / G.srx, (z - G.cz) / G.srz);
}
const smooth = (a: number, b: number, t: number) => {
  const k = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return k * k * (3 - 2 * k);
};

/** 地面の高さ。芝は たいら（GRASS_H）、ふちに 小さな がけ、砂浜は 海へ ゆるく さがる */
export function groundH(x: number, z: number): number {
  const eg = grassE(x, z);
  if (eg <= 0.972) return GRASS_H;
  const es = sandE(x, z);
  const bank = 1 - smooth(0.972, 1.0, eg);        // 1 → 0
  const sandTop = 0.5 - 0.62 * smooth(0.93, 1.0, es);   // 0.5 → -0.12
  const sea = es > 1 ? -0.12 - Math.min(4, (es - 1) * 28) : 0;
  return sandTop * (1 - bank) + GRASS_H * bank + sea;
}

// ── まるい地平線：遠くほど 下に まげる（全部の材質に 入れる） ──
export const curve = { value: 0.0024 };

const CURVE_GLSL = `
  mvPosition.y -= uCurve * mvPosition.z * mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
`;
/** 主人公の 手前に ある 木や 建物は あみめに すかす（主人公が かくれないように）。
 *  x, y＝主人公の 画面の 位置（デバイスpx・下から）、z＝主人公までの 深さ、w＝すかす 半径（デバイスpx） */
export const seeThru = { value: new THREE.Vector4(-9999, -9999, 0, 0) };

export function curved<T extends THREE.Material>(m: T, see = false): T {
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uCurve = curve;
    sh.vertexShader = 'uniform float uCurve;\nvarying float vSeeDepth;\n' + sh.vertexShader.replace(
      '#include <project_vertex>',
      '#include <project_vertex>\n' + CURVE_GLSL + '  vSeeDepth = -mvPosition.z;\n',
    );
    if (see) {
      sh.uniforms.uSee = seeThru;
      sh.fragmentShader = 'uniform vec4 uSee;\nvarying float vSeeDepth;\n' + sh.fragmentShader.replace(
        'void main() {',
        `void main() {
          vec2 dd = (gl_FragCoord.xy - uSee.xy) / vec2(uSee.w * 0.8, uSee.w * 1.15);
          if (vSeeDepth < uSee.z - 2.0 && dot(dd, dd) < 1.0) {
            float k = 1.0 - dot(dd, dd);
            float g = mod(floor(gl_FragCoord.x * 0.5) + floor(gl_FragCoord.y * 0.5), 2.0);
            if (k > 0.25 || g < 1.0) discard;
          }`,
      );
    }
  };
  m.customProgramCacheKey = () => 'curved' + (see ? 'S' : '');
  return m;
}

/** 3D の点（まげる前）→ 画面の px。まげたぶんも 計算する */
const _v = new THREE.Vector3();
export function projectCurved(p: THREE.Vector3, cam: THREE.PerspectiveCamera, w: number, h: number): { x: number; y: number; z: number } {
  _v.copy(p).applyMatrix4(cam.matrixWorldInverse);
  _v.y -= curve.value * _v.z * _v.z;
  const depth = -_v.z;
  _v.applyMatrix4(cam.projectionMatrix);
  return { x: (_v.x * 0.5 + 0.5) * w, y: (-_v.y * 0.5 + 0.5) * h, z: depth };
}

// ── トゥーンの色 ──
const GRAD = (() => {
  const d = new Uint8Array([120, 190, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RedFormat);
  t.minFilter = t.magFilter = THREE.NearestFilter;
  t.needsUpdate = true;
  return t;
})();

const toonCache = new Map<string, THREE.MeshToonMaterial>();
export function toon(color: number, opts: { emissive?: number; flat?: boolean } = {}): THREE.MeshToonMaterial {
  const key = color + ':' + (opts.emissive ?? 0) + ':' + !!opts.flat;
  let m = toonCache.get(key);
  if (!m) {
    m = curved(new THREE.MeshToonMaterial({ color, gradientMap: GRAD, emissive: opts.emissive ?? 0 }), true);
    toonCache.set(key, m);
  }
  return m;
}
export function toonNew(color: number, opts: THREE.MeshToonMaterialParameters = {}, see = true): THREE.MeshToonMaterial {
  return curved(new THREE.MeshToonMaterial({ color, gradientMap: GRAD, ...opts }), see);
}

/** 窓（昼は 水色、夜は あたたかく 光る）。setNight で きりかえ */
export const windowMat = curved(new THREE.MeshToonMaterial({ color: 0xbae6fd, gradientMap: GRAD, emissive: 0xffc94d, emissiveIntensity: 0 }), true);
export const lampMat = curved(new THREE.MeshToonMaterial({ color: 0xfde68a, gradientMap: GRAD, emissive: 0xffd36b, emissiveIntensity: 0.25 }), true);

// ── りんかく線（2D の絵と同じ むらさきの線） ──
export const OUTLINE_COLOR = 0x3b1a78;
export const outlineMat = curved(new THREE.MeshBasicMaterial({ color: OUTLINE_COLOR, side: THREE.BackSide }), true);

/** mesh に りんかく線を つける。ふちの太さ t（世界の単位） */
export function outline(mesh: THREE.Mesh, t = 0.14): THREE.Mesh {
  const geo = mesh.geometry;
  if (!geo.boundingBox) geo.computeBoundingBox();
  const bb = geo.boundingBox!;
  const size = new THREE.Vector3(), c = new THREE.Vector3();
  bb.getSize(size); bb.getCenter(c);
  const o = new THREE.Mesh(geo, outlineMat);
  const s = new THREE.Vector3(1 + (2 * t) / Math.max(size.x, 0.05), 1 + (2 * t) / Math.max(size.y, 0.05), 1 + (2 * t) / Math.max(size.z, 0.05));
  o.scale.copy(s);
  o.position.set(c.x * (1 - s.x), c.y * (1 - s.y), c.z * (1 - s.z));
  o.raycast = () => {};
  mesh.add(o);
  return mesh;
}

/** よく使う形 */
export function part(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0, line: number | false = 0.14): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if (line !== false) outline(m, line);
  return m;
}
export const boxG = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);

/** 屋根（三角の 柱）。はば w・たかさ h・おくゆき d。原点は 底の まんなか */
export function gableG(w: number, h: number, d: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
  g.translate(0, 0, -d / 2);
  return g;
}

/** まるい かげ（地面に はる） */
let shadowTex: THREE.Texture | null = null;
export function blobShadowMat(): THREE.MeshBasicMaterial {
  if (!shadowTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(20,30,60,0.42)');
    gr.addColorStop(0.6, 'rgba(20,30,60,0.22)');
    gr.addColorStop(1, 'rgba(20,30,60,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    shadowTex = new THREE.CanvasTexture(c);
  }
  return curved(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
}
let _shadowMat: THREE.MeshBasicMaterial | null = null;
const shadowGeo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
export function blobShadow(rx: number, rz = rx * 0.6): THREE.Mesh {
  if (!_shadowMat) _shadowMat = blobShadowMat();
  const m = new THREE.Mesh(shadowGeo, _shadowMat);
  m.scale.set(rx * 2, 1, rz * 2);
  m.renderOrder = 1;
  m.raycast = () => {};
  m.userData.noHit = true;
  return m;
}

/** あたたかい光の ぼかし（夜の 窓・ランプ）。加算で かさねる */
let glowTex: THREE.Texture | null = null;
export function glowMat(color = 0xffd56b): THREE.MeshBasicMaterial {
  if (!glowTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,0.9)');
    gr.addColorStop(0.35, 'rgba(255,255,255,0.35)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    glowTex = new THREE.CanvasTexture(c);
  }
  return curved(new THREE.MeshBasicMaterial({ map: glowTex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
}

/** きまった 乱数（毎回 同じ 島に なるように） */
export function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 動かない 部品を 材質ごとに 1つに まとめる（描く回数を へらして 軽くする）。
 *  userData.dyn の ついた もの（まわる・ゆれる・かわる もの）と その 中身、インスタンスは そのまま */
export function bakeStatic(root: THREE.Object3D): void {
  root.updateMatrixWorld(true);
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const buckets = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const victims: THREE.Mesh[] = [];
  const m4 = new THREE.Matrix4();
  const walk = (o: THREE.Object3D) => {
    if (o.userData.dyn || !o.visible) return;
    const m = o as THREE.Mesh;
    if (m.isMesh && !(m as unknown as THREE.InstancedMesh).isInstancedMesh && !Array.isArray(m.material)) {
      let g = m.geometry.clone();
      g.applyMatrix4(m4.multiplyMatrices(inv, m.matrixWorld));
      if (g.index) g = g.toNonIndexed();
      for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv' && !(k === 'color' && (m.material as THREE.MeshBasicMaterial).vertexColors)) g.deleteAttribute(k);
      if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
      g.morphAttributes = {};
      const list = buckets.get(m.material) ?? buckets.set(m.material, []).get(m.material)!;
      list.push(g);
      victims.push(m);
    }
    o.children.forEach(walk);
  };
  root.children.forEach(walk);
  for (const v of victims) v.parent?.remove(v);
  for (const [mat, list] of buckets) {
    const merged = mergeGeometries(list, false);
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, mat);
    mesh.renderOrder = list.length && (mat as THREE.MeshBasicMaterial).transparent ? 1 : 0;
    mesh.raycast = () => {};
    root.add(mesh);
  }
}
