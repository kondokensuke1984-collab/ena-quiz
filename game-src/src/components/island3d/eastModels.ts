// となりの島（east）の たてもの 3D：やきいも やたい・もみじの あずまや・うちゅうきち・としょかん・ロケット・クリスマスツリー・ゆきの こや。
// 2D の絵（components/BuildingSVG.tsx）の 形と 色に あわせる。単位は 2D の px × 0.1。
// 足もとが 原点・うしろが -z・正面（カメラがわ）が +z。

import * as THREE from 'three';
import { toon, toonNew, part, boxG, gableG, windowMat, lampMat, blobShadow, curved } from './common';
import type { Model } from './models';

const INK = 0x4c1d95;

function win(w: number, h: number, x: number, y: number, z: number, color?: number): THREE.Group {
  const g = new THREE.Group();
  g.add(part(boxG(w + 0.4, h + 0.4, 0.2), toon(0xffffff), x, y, z));
  g.add(part(boxG(w, h, 0.3), color ? toon(color, { emissive: color }) : windowMat, x, y, z + 0.05, false));
  return g;
}

function door(w: number, h: number, z: number, color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(part(boxG(w, h, 0.3), toon(color), 0, h / 2, z));
  g.add(part(new THREE.SphereGeometry(0.18, 8, 6), toon(0xfde68a), w * 0.28, h * 0.48, z + 0.2, false));
  return g;
}

function wheelX(r: number, x: number, y: number, z: number): THREE.Mesh {
  const m = part(new THREE.CylinderGeometry(r, r, 0.8, 14), toon(0x78350f), x, y, z);
  m.rotation.z = Math.PI / 2;
  return m;
}

/** やきいも やたい（bd_imo） */
function imoCart(): Model {
  const g = new THREE.Group();
  const D = 5;
  g.add(part(boxG(8, 3.4, D), toon(0xb45309), 0, 2.7, -D / 2));
  g.add(wheelX(1.0, -4.3, 1.0, -D / 2 + 0.6));
  g.add(wheelX(1.0, 4.3, 1.0, -D / 2 + 0.6));
  g.add(part(boxG(6.8, 1.0, D - 0.6), toon(0x57534e), 0, 4.8, -D / 2));
  for (const x of [-2, -0.4, 1.2]) {
    const imo = part(new THREE.SphereGeometry(0.7, 10, 8).scale(1.2, 0.7, 0.8), toon(0x9f1239), x, 5.6, -D / 2 + 0.5, 0.06);
    g.add(imo);
  }
  for (const x of [-3.4, 3.4]) g.add(part(boxG(0.3, 3.2, 0.3), toon(0x78350f), x, 6.4, -0.3, 0.05));
  const awn = part(gableG(9.2, 1.8, D + 0.8), toon(0xf97316), 0, 8.0, -D / 2);
  g.add(awn);
  for (const x of [-3, -1, 1, 3]) g.add(part(boxG(0.7, 0.2, D + 0.9), toon(0xfff7ed), x, 8.1, -D / 2, false));
  g.add(part(new THREE.SphereGeometry(0.7, 10, 8), lampMat, 4.0, 5.8, 0.2, false));
  const steam: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 6), curved(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, depthWrite: false })));
    s.userData.noHit = true; s.userData.dyn = true;
    s.position.set(-1.6 + i * 1.6, 7, -D / 2 + 0.5);
    g.add(s); steam.push(s);
  }
  g.add(blobShadow(5.5, 3.6).translateZ(-D / 2));
  return {
    obj: g,
    glows: [{ p: new THREE.Vector3(4, 5.8, 0.4), r: 5 }],
    tick: (t) => steam.forEach((s, i) => { const k = (t * 0.5 + i / 3) % 1; s.position.y = 6.2 + k * 2.4; s.scale.setScalar(0.6 + k * 0.9); (s.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - k); }),
  };
}

/** もみじの あずまや（bd_arbor） */
function arbor(): Model {
  const g = new THREE.Group();
  const D = 7;
  g.add(part(boxG(9.2, 1.2, D), toon(0xd6d3d1), 0, 0.6, -D / 2));
  for (const x of [-3.8, 3.8]) for (const z of [-0.8, -D + 0.8]) g.add(part(new THREE.CylinderGeometry(0.4, 0.4, 5.6, 10), toon(0x92400e), x, 4.0, z));
  g.add(part(boxG(8.4, 0.4, 0.4), toon(0x92400e), 0, 5.0, -0.8));
  g.add(part(boxG(8.4, 0.4, 0.4), toon(0x92400e), 0, 5.0, -D + 0.8));
  g.add(part(gableG(12.4, 4, D + 1.4), toon(0xb91c1c), 0, 6.8, -D / 2));
  // もみじの かざり
  for (const [x, y, z, c] of [[-6.6, 9.2, -D / 2, 0xef4444], [6.6, 8.8, -D / 2, 0xf97316], [-5.4, 3.2, 0.6, 0xf59e0b], [5.8, 2.8, 0.6, 0xdc2626]] as const) {
    g.add(part(new THREE.SphereGeometry(1.5, 10, 8), toon(c), x, y, z, 0.08));
  }
  // ベンチ
  g.add(part(boxG(5.6, 0.4, 1.4), toon(0x92400e), 0, 1.9, -D / 2));
  g.add(blobShadow(7.5, 5).translateZ(-D / 2));
  return { obj: g, glows: [{ p: new THREE.Vector3(0, 4.2, 0.2), r: 5 }] };
}

/** うちゅうきち（bd_base） */
function spaceBase(): Model {
  const g = new THREE.Group();
  const W = 7.6, D = 6;
  g.add(part(boxG(W, 4.6, D), toon(0xe2e8f0), 0, 2.3, -D / 2));
  g.add(part(new THREE.SphereGeometry(W / 2, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.8, D / W), toon(0xcbd5e1), 0, 4.6, -D / 2));
  g.add(win(1.8, 1.4, -2.0, 3.2, 0.02, 0x7dd3fc));
  g.add(win(1.8, 1.4, 0.6, 3.2, 0.02, 0x7dd3fc));
  g.add(door(1.6, 2.6, 0.02, 0x475569));
  g.children[g.children.length - 1].position.x = 2.4;
  // アンテナ
  g.add(part(new THREE.CylinderGeometry(0.25, 0.25, 4.6, 8), toon(0x475569), 5.4, 2.3, -D / 2));
  const dish = new THREE.Group();
  dish.add(part(new THREE.SphereGeometry(2.0, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.4), toon(0xf8fafc), 0, 0, 0, 0.08));
  dish.add(part(new THREE.SphereGeometry(0.3, 8, 6), toon(0xef4444), 0, 1.0, 0, false));
  dish.position.set(5.4, 4.8, -D / 2);
  dish.rotation.z = -0.5;
  g.add(dish);
  g.add(blobShadow(7, 5).translateZ(-D / 2));
  return { obj: g, glows: [{ p: new THREE.Vector3(-1, 3.4, 0.4), r: 5 }, { p: new THREE.Vector3(5.4, 5.8, -D / 2), r: 3 }] };
}

/** としょかん（bd_planet） */
function library(): Model {
  const g = new THREE.Group();
  const W = 10.8, H = 5.2, D = 7;
  g.add(part(boxG(6, 0.6, 1.6), toon(0xd6d3d1), 0, 0.3, 0.8));
  g.add(part(boxG(W, H, D), toon(0xc2410c), 0, H / 2, -D / 2));
  for (const x of [-4, 4]) g.add(part(boxG(1.0, H, 1.0), toon(0xfef3c7), x, H / 2, 0.2));
  g.add(part(gableG(W + 1.6, 3.4, D + 1.2), toon(0x1e3a8a), 0, H, -D / 2));
  g.add(win(1.0, 1.6, -2.4, 3.6, 0.02));
  g.add(win(1.0, 1.6, 1.4, 3.6, 0.02));
  g.add(door(2.2, 3.0, 0.02, 0x7c2d12));
  // ひらいた 本の かんばん
  for (const s of [-1, 1]) {
    const page = part(boxG(2.2, 0.15, 1.6), toon(0xf8fafc), s * 1.15, 10.0, 0.2, 0.06);
    page.rotation.z = s * -0.18;
    g.add(page);
  }
  g.add(blobShadow(7.2, 5).translateZ(-D / 2));
  return { obj: g, glows: [{ p: new THREE.Vector3(-1.9, 4.2, 0.4), r: 4.5 }, { p: new THREE.Vector3(1.9, 4.2, 0.4), r: 4.5 }] };
}

/** ロケット（bd_rocket）：はっしゃだい つき */
function rocket(): Model {
  const g = new THREE.Group();
  g.add(part(boxG(8.8, 1.0, 6), toon(0x64748b), 0, 0.5, -3));
  const R = 1.7;
  g.add(part(new THREE.CylinderGeometry(R, R, 11, 18), toon(0xf8fafc), 0, 7.0, -3));
  g.add(part(new THREE.ConeGeometry(R, 4.6, 18), toon(0xef4444), 0, 14.8, -3));
  g.add(part(new THREE.CylinderGeometry(R + 0.02, R + 0.02, 0.8, 18), toon(0x1d4ed8), 0, 5.5, -3, false));
  g.add(part(new THREE.TorusGeometry(0.9, 0.18, 8, 16), toon(0x7dd3fc, { emissive: 0x38bdf8 }), 0, 9.8, -3 + R - 0.1));
  g.add(part(new THREE.CircleGeometry(0.9, 16), toon(0x7dd3fc, { emissive: 0x38bdf8 }), 0, 9.8, -3 + R + 0.05, false));
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const fin = part(boxG(0.4, 3.6, 2.4), toon(0xef4444), Math.cos(a) * (R + 1.0), 3.2, -3 + Math.sin(a) * (R + 1.0));
    fin.rotation.y = -a;
    g.add(fin);
  }
  g.add(part(new THREE.CylinderGeometry(0.8, 1.1, 0.8, 12), toon(0x475569), 0, 1.4, -3));
  // はっしゃとう
  for (const z of [-1, -5]) {
    g.add(part(boxG(0.4, 15, 0.4), toon(0xf59e0b), 4.2, 8.0, z, 0.05));
  }
  for (let i = 0; i < 6; i++) g.add(part(boxG(0.25, 0.25, 4.4), toon(0xf59e0b), 4.2, 2.2 + i * 2.4, -3, false));
  g.add(part(boxG(3.4, 0.4, 0.4), toon(0xf59e0b), 2.6, 12.4, -3, 0.05));
  g.add(blobShadow(5.5, 3.6).translateZ(-3));
  return { obj: g, glows: [{ p: new THREE.Vector3(0, 9.8, -1), r: 4 }] };
}

/** クリスマスツリーひろば（bd_xtree） */
function xtreePlaza(): Model {
  const g = new THREE.Group();
  g.add(part(boxG(1.4, 1.4, 1.4), toon(0x92400e), 0, 0.7, -2));
  const greens = [0x15803d, 0x16a34a, 0x22c55e];
  [[4.2, 6.2, 2.6], [3.4, 5.6, 6.0], [2.4, 4.6, 9.2]].forEach(([r, h, y], i) => g.add(part(new THREE.ConeGeometry(r, h, 12), toon(greens[i]), 0, y, -2)));
  g.add(part(new THREE.OctahedronGeometry(1.0, 0), toonNew(0xfde047, { emissive: 0xfde047, emissiveIntensity: 0.7 }), 0, 12.8, -2));
  const balls = [0xef4444, 0x3b82f6, 0xf59e0b, 0xec4899, 0xa855f7];
  for (let i = 0; i < 14; i++) {
    const a = i * 2.4, y = 2.0 + (i % 5) * 2.0, r = Math.max(0.6, 3.6 - (y - 1.5) * 0.3);
    g.add(part(new THREE.SphereGeometry(0.34, 8, 6), toonNew(balls[i % 5], { emissive: balls[i % 5], emissiveIntensity: 0.4 }), Math.cos(a) * r, y, -2 + Math.sin(a) * r, false));
  }
  // プレゼント
  for (const [x, z, w, h, c, rb] of [[-5.2, -0.6, 1.8, 1.4, 0xef4444, 0xfde047], [4.6, -0.2, 1.6, 1.1, 0x3b82f6, 0xfef3c7]] as const) {
    g.add(part(boxG(w, h, w), toon(c), x, h / 2, z));
    g.add(part(boxG(w + 0.1, 0.2, 0.3), toon(rb), x, h / 2, z, false));
    g.add(part(boxG(0.3, 0.2, w + 0.1), toon(rb), x, h + 0.05, z, false));
  }
  g.add(blobShadow(5.4, 3.6).translateZ(-2));
  return { obj: g, glows: [{ p: new THREE.Vector3(0, 12.8, -1), r: 4 }, { p: new THREE.Vector3(0, 6, 0.8), r: 6 }] };
}

/** ゆきの こや（bd_kotatsu） */
function snowHut(): Model {
  const g = new THREE.Group();
  const W = 8, H = 4, D = 6;
  g.add(part(boxG(W, H, D), toon(0xfde68a), 0, H / 2, -D / 2));
  g.add(part(gableG(W + 2, 4, D + 1.2), toon(0x92400e), 0, H, -D / 2));
  g.add(part(gableG(W + 2.3, 4.3, D + 1.5), toon(0xf8fafc), 0, H + 0.5, -D / 2));
  g.add(part(boxG(1.2, 2.2, 1.2), toon(0xb45309), 3.0, H + 3.6, -D / 2 - 1));
  g.add(part(boxG(1.8, 0.8, 1.8), toon(0xf8fafc), 3.0, H + 4.9, -D / 2 - 1));
  g.add(win(2.2, 1.8, -3.0, 2.8, 0.02, 0xfbbf24));
  g.add(door(1.8, 2.8, 0.02, 0x7c2d12));
  g.children[g.children.length - 1].position.x = 1.7;
  // ゆきだるま
  g.add(part(new THREE.SphereGeometry(1.0, 12, 10), toon(0xf8fafc), -5.4, 1.0, 0.4, 0.08));
  g.add(part(new THREE.SphereGeometry(0.7, 12, 10), toon(0xf8fafc), -5.4, 2.5, 0.4, 0.08));
  g.add(part(new THREE.ConeGeometry(0.12, 0.6, 6), toon(0xf97316), -5.4, 2.5, 1.1, false));
  g.children[g.children.length - 1].rotation.x = Math.PI / 2;
  for (const dx of [-0.25, 0.25]) g.add(part(new THREE.SphereGeometry(0.08, 6, 4), toon(INK), -5.4 + dx, 2.7, 1.05, false));
  g.add(blobShadow(6.4, 4.6).translateZ(-D / 2));
  return { obj: g, glows: [{ p: new THREE.Vector3(-3, 2.8, 0.4), r: 4.5 }, { p: new THREE.Vector3(3.0, 9.5, -D / 2 - 1), r: 2.4 }] };
}

export function eastBuildingModel(id: string): Model | null {
  switch (id) {
    case 'bd_imo': return imoCart();
    case 'bd_arbor': return arbor();
    case 'bd_base': return spaceBase();
    case 'bd_planet': return library();
    case 'bd_rocket': return rocket();
    case 'bd_xtree': return xtreePlaza();
    case 'bd_kotatsu': return snowHut();
    default: return null;
  }
}
