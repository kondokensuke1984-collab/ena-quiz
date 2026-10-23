// 3Dの島の 建物・木・小物。2D の絵（BuildingSVG・IslandStage）と 同じ色・同じ形で つくる。
// 原点＝足もとの まんなか（2D の Yソートの 基準点と同じ）。正面は 手前（+z）。
// 建物の大きさは 2D の px × 0.1。

import * as THREE from 'three';
import { boxG, gableG, lampMat, part, toon, toonNew, windowMat, outline, blobShadow, curved } from './common';

export interface Model {
  obj: THREE.Object3D;
  tick?: (t: number, dt: number) => void;
  /** 夜に 光る ところ（obj の中の 位置）と 大きさ */
  glows?: { p: THREE.Vector3; r: number }[];
  /** 夜だけ 見せるもの */
  nightOnly?: THREE.Object3D[];
}

const C = {
  ink: 0x4c1d95, cream: 0xfef3c7, red: 0xf87171, redDeep: 0xef4444, door: 0xa16207, wood: 0x92400e, woodDark: 0x78350f,
  yellow: 0xfde68a, gold: 0xfcd34d, blue: 0x60a5fa, white: 0xffffff, lav: 0xe0e7ff, lav2: 0xc7d2fe, indigo: 0x6366f1,
  purple: 0xa78bfa, purple2: 0xc4b5fd, stone: 0xa8a29e,
};

function win(w: number, h: number, x: number, y: number, z: number): THREE.Group {
  const g = new THREE.Group();
  g.add(part(boxG(w + 0.4, h + 0.4, 0.2), toon(C.white), x, y, z));
  g.add(part(boxG(w, h, 0.3), windowMat, x, y, z + 0.05, false));
  g.add(part(boxG(0.14, h, 0.34), toon(C.white), x, y, z + 0.06, false));
  return g;
}

function door(w: number, h: number, z: number, color = C.door): THREE.Group {
  const g = new THREE.Group();
  g.add(part(boxG(w, h, 0.3), toon(color), 0, h / 2, z));
  g.add(part(new THREE.SphereGeometry(0.18, 8, 6), toon(C.yellow), w * 0.28, h * 0.48, z + 0.2, false));
  return g;
}

// ── 建物 ──
export function house(): Model {
  const g = new THREE.Group();
  const W = 10, H = 7, D = 8;
  g.add(part(boxG(W, H, D), toon(C.cream), 0, H / 2, -D / 2));
  // 土台
  g.add(part(boxG(W + 0.6, 0.6, D + 0.6), toon(0xd6d3d1), 0, 0.3, -D / 2));
  const roof = part(gableG(W + 2.4, 5.2, D + 1.4), toon(C.red), 0, H, -D / 2);
  g.add(roof);
  g.add(part(boxG(1.4, 3.2, 1.4), toon(0xfca5a5), 2.8, H + 3.4, -D / 2 - 1.2));
  g.add(door(2.8, 3.8, 0.02));
  g.add(win(2.2, 1.8, -3.1, 4.9, 0.02));
  g.add(win(2.2, 1.8, 3.1, 4.9, 0.02));
  // 花の プランター
  for (const x of [-3.1, 3.1]) {
    g.add(part(boxG(2.6, 0.6, 0.7), toon(C.wood), x, 3.6, 0.35));
    for (let i = 0; i < 3; i++) g.add(part(new THREE.SphereGeometry(0.32, 8, 6), toon([0xf472b6, 0xfacc15, 0xa78bfa][i]), x - 0.8 + i * 0.8, 4.05, 0.35, false));
  }
  g.add(blobShadow(7, 6).translateZ(-D / 2));
  return { obj: g, glows: [{ p: new THREE.Vector3(-3.1, 4.9, 0.6), r: 4 }, { p: new THREE.Vector3(3.1, 4.9, 0.6), r: 4 }] };
}

export function lighthouse(): Model {
  const g = new THREE.Group();
  const body = part(new THREE.CylinderGeometry(1.9, 3.0, 14, 20), toon(C.white), 0, 7, -3);
  g.add(body);
  for (const [y, h] of [[4.7, 2.5], [10, 2.2]] as const) {
    const rb = 3.0 - (y / 14) * 1.1;
    g.add(part(new THREE.CylinderGeometry(rb - (h / 14) * 1.1 + 0.05, rb + 0.05, h, 20), toon(C.redDeep), 0, y, -3, false));
  }
  // 見はらし台
  g.add(part(new THREE.CylinderGeometry(2.6, 2.6, 0.4, 20), toon(C.wood), 0, 14.2, -3));
  const lantern = part(new THREE.CylinderGeometry(1.5, 1.5, 2.2, 16), lampMat, 0, 15.5, -3);
  g.add(lantern);
  g.add(part(new THREE.ConeGeometry(2.0, 2.2, 16), toon(C.redDeep), 0, 17.7, -3));
  g.add(part(new THREE.SphereGeometry(0.35, 8, 6), toon(C.yellow), 0, 18.9, -3, false));
  g.add(door(1.6, 2.4, -0.1));
  // まわる光
  const beam = new THREE.Group();
  beam.userData.noHit = true;
  beam.userData.dyn = true;
  beam.position.set(0, 15.5, -3);
  // 先へ いくほど うすくなる 光（頂点の 色で）
  const coneGeo = new THREE.ConeGeometry(2.4, 20, 16, 4, true);
  const cp = coneGeo.attributes.position as THREE.BufferAttribute;
  const cc = new Float32Array(cp.count * 3);
  for (let i = 0; i < cp.count; i++) {
    const k = Math.max(0, Math.min(1, 0.5 - cp.getY(i) / 20));   // 先（-y）ほど 1
    const v = 1 - k * 0.92;
    cc[i * 3] = v; cc[i * 3 + 1] = v * 0.95; cc[i * 3 + 2] = v * 0.7;
  }
  coneGeo.setAttribute('color', new THREE.BufferAttribute(cc, 3));
  const beamMat = curved(new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
  const cone = new THREE.Mesh(coneGeo, beamMat);
  cone.rotation.z = Math.PI / 2;   // とがった ほうが 灯台がわ
  cone.position.x = 10;
  beam.add(cone);
  g.add(beam);
  g.add(blobShadow(4.5, 3.4).translateZ(-3));
  return {
    obj: g,
    tick: (t) => { beam.rotation.y = t * 1.5; },
    glows: [{ p: new THREE.Vector3(0, 15.5, -1), r: 6 }],
    nightOnly: [beam],
  };
}

export function school(): Model {
  const g = new THREE.Group();
  const W = 16, H = 7.2, D = 9;
  g.add(part(boxG(W + 0.6, 0.6, D + 0.6), toon(0xd6d3d1), 0, 0.3, -D / 2));
  g.add(part(boxG(W, H, D), toon(C.yellow), 0, H / 2, -D / 2));
  g.add(part(boxG(W + 0.8, 0.6, D + 0.8), toon(0xf59e0b), 0, H + 0.3, -D / 2));
  // とけいの とう
  g.add(part(boxG(5.2, 4.6, 5), toon(C.gold), 0, H + 0.6 + 2.3, -D / 2 + 0.5));
  const roof = part(new THREE.ConeGeometry(4.6, 3.2, 4), toon(C.blue), 0, H + 0.6 + 4.6 + 1.6, -D / 2 + 0.5);
  roof.rotation.y = Math.PI / 4;
  g.add(roof);
  const clock = new THREE.Group();
  clock.position.set(0, H + 0.6 + 2.3, -D / 2 + 3.05);
  clock.add(part(new THREE.CylinderGeometry(1.25, 1.25, 0.2, 24).rotateX(Math.PI / 2), toon(C.white)));
  const hand1 = part(boxG(0.16, 0.85, 0.1), toon(C.ink), 0, 0.42, 0.15, false);
  const hand2 = part(boxG(0.6, 0.16, 0.1), toon(C.ink), 0.3, 0, 0.16, false);
  clock.add(hand1, hand2);
  g.add(clock);
  for (const x of [-6.2, -3.8, 3.4, 5.8]) g.add(win(1.8, 1.8, x, 4.8, 0.02));
  g.add(door(2.6, 3.6, 0.02));
  // はた
  g.add(part(new THREE.CylinderGeometry(0.12, 0.12, 4, 6), toon(C.ink), 4, H + 0.6 + 2, -D / 2 - 1.5, false));
  const flag = part(new THREE.PlaneGeometry(2.2, 1.4).translate(1.1, 0, 0), toonNew(C.red, { side: THREE.DoubleSide }), 4.1, H + 0.6 + 3.3, -D / 2 - 1.5, false);
  flag.userData.dyn = true;
  g.add(flag);
  g.add(blobShadow(10, 7).translateZ(-D / 2));
  return {
    obj: g,
    tick: (t) => { flag.rotation.y = Math.sin(t * 2.2) * 0.35; },
    glows: [-6.2, -3.8, 3.4, 5.8].map((x) => ({ p: new THREE.Vector3(x, 4.8, 0.6), r: 3.4 })),
  };
}

export function ferrisWheel(): Model {
  const g = new THREE.Group();
  const HUB = 9.6, R = 7.4;
  const legMat = toon(C.ink);
  for (const s of [-1, 1]) {
    for (const zz of [-1.2, 1.2]) {
      const len = Math.hypot(4.6, HUB);
      const leg = part(new THREE.CylinderGeometry(0.25, 0.3, len, 8), legMat, s * 2.3, HUB / 2, zz - 2, false);
      leg.rotation.z = s * Math.atan2(4.6, HUB);
      g.add(leg);
    }
  }
  const wheel = new THREE.Group();
  wheel.userData.dyn = true;
  wheel.position.set(0, HUB, -2);
  wheel.add(new THREE.Mesh(new THREE.TorusGeometry(R, 0.28, 8, 48), toon(C.purple)));
  const cars: THREE.Object3D[] = [];
  const colors = [0xf87171, 0xfbbf24, 0x34d399, 0x60a5fa];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, R, 6), toon(C.purple2));
    sp.position.set(Math.cos(a) * R / 2, Math.sin(a) * R / 2, 0);
    sp.rotation.z = a - Math.PI / 2;
    wheel.add(sp);
    const car = new THREE.Group();
    car.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
    car.add(part(new THREE.SphereGeometry(1.0, 12, 10), toon(colors[i % 4]), 0, -0.9, 0));
    car.add(part(new THREE.CylinderGeometry(0.06, 0.06, 0.9, 4), toon(C.ink), 0, -0.2, 0, false));
    wheel.add(car);
    cars.push(car);
  }
  wheel.add(part(new THREE.SphereGeometry(0.9, 12, 10), toon(C.yellow)));
  g.add(wheel);
  g.add(blobShadow(6.5, 3.5).translateZ(-2));
  return {
    obj: g,
    tick: (t) => {
      wheel.rotation.z = t * 0.26;
      for (const c of cars) c.rotation.z = -wheel.rotation.z;
    },
    glows: [{ p: new THREE.Vector3(0, HUB, -1), r: 5 }],
  };
}

export function observatory(): Model {
  const g = new THREE.Group();
  const W = 9.6, H = 5.6, D = 8;
  g.add(part(boxG(W, H, D), toon(C.lav), 0, H / 2, -D / 2));
  const dome = part(new THREE.SphereGeometry(5.0, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), toon(C.lav2), 0, H, -D / 2);
  g.add(dome);
  g.add(part(boxG(1.4, 5.2, 4.6), toon(0x312e81), 0, H + 2.2, -D / 2 + 1.6, false));
  const scope = part(new THREE.CylinderGeometry(0.6, 0.75, 4.6, 12), toon(C.indigo), 0, H + 4.2, -D / 2 + 2.0);
  scope.rotation.x = 0.75;
  g.add(scope);
  g.add(door(2.4, 3.2, 0.02));
  for (const x of [-3, 3]) {
    g.add(part(new THREE.CylinderGeometry(0.7, 0.7, 0.3, 16).rotateX(Math.PI / 2), windowMat, x, 3.0, 0.1));
  }
  g.add(blobShadow(6.5, 5).translateZ(-D / 2));
  return { obj: g, glows: [{ p: new THREE.Vector3(-3, 3, 0.6), r: 2.6 }, { p: new THREE.Vector3(3, 3, 0.6), r: 2.6 }] };
}

export function moonStand(): Model {
  const g = new THREE.Group();
  g.add(part(boxG(8, 0.6, 3.6), toon(0xb45309), 0, 2.0, -1.8));
  for (const x of [-3.2, 3.2]) for (const z of [-3, -0.6]) g.add(part(boxG(0.4, 1.8, 0.4), toon(C.woodDark), x, 0.9, z, false));
  g.add(part(new THREE.CylinderGeometry(1.2, 1.6, 1.0, 4).rotateY(Math.PI / 4), toon(C.cream), 0, 2.8, -1.8));
  const dango = toon(0xffffff);
  const pts: [number, number, number][] = [[-0.6, 3.75, -2.2], [0.6, 3.75, -2.2], [-0.6, 3.75, -1.2], [0.6, 3.75, -1.2], [0, 4.6, -1.7]];
  for (const [x, y, z] of pts) g.add(part(new THREE.SphereGeometry(0.62, 12, 10), dango, x, y, z, 0.08));
  // すすき
  for (let i = 0; i < 4; i++) {
    const s = new THREE.Group();
    s.position.set(-4.4 - (i % 2) * 0.6, 0, -2.4 + i * 0.4);
    s.rotation.z = 0.12 - i * 0.07;
    s.add(part(new THREE.CylinderGeometry(0.06, 0.08, 7, 5), toon(0xca8a04), 0, 3.5, 0, false));
    s.add(part(new THREE.ConeGeometry(0.35, 2.2, 6), toon(0xfde68a), 0, 7.2, 0, false));
    g.add(s);
  }
  g.add(blobShadow(5, 2.6).translateZ(-1.8));
  return { obj: g };
}

export function buildingModel(id: string): Model | null {
  switch (id) {
    case 'bd_house': return house();
    case 'bd_light': return lighthouse();
    case 'bd_school': return school();
    case 'bd_wheel': return ferrisWheel();
    case 'bd_observ': return observatory();
    case 'bd_moon': return moonStand();
    default: return null;
  }
}

// ── 小物 ──
export function mailbox(): Model & { setFlag(up: boolean): void } {
  const g = new THREE.Group();
  g.userData.dyn = true;
  g.add(part(boxG(0.8, 4, 0.8), toon(C.wood), 0, 2, 0));
  g.add(part(new THREE.CapsuleGeometry(1.4, 2.0, 4, 12).rotateZ(Math.PI / 2), toon(C.redDeep), 0, 4.8, 0));
  g.add(part(boxG(1.8, 0.3, 0.2), toon(0x7f1d1d), 0, 5.1, 1.42, false));
  const flag = new THREE.Group();
  flag.position.set(2.1, 4.4, 0);
  flag.add(part(boxG(0.18, 2.4, 0.18), toon(C.ink), 0, 1.2, 0, false));
  const cloth = part(boxG(1.4, 0.9, 0.12), toon(0xfde047), 0.7, 2.0, 0);
  flag.add(cloth);
  g.add(flag);
  g.add(blobShadow(2.2, 1.4));
  return {
    obj: g,
    setFlag(up) {
      flag.rotation.z = up ? 0 : -Math.PI / 2;
      cloth.material = up ? toon(0xfde047) : toon(0x94a3b8);
    },
  };
}

/** 🗳️ いけんばこ（水いろの はこに やね） */
export function ikenBox(): Model {
  const g = new THREE.Group();
  g.add(part(boxG(0.6, 3, 0.6), toon(C.wood), 0, 1.5, 0));
  g.add(part(boxG(3.2, 2.4, 2.2), toon(0x38bdf8), 0, 4.2, 0));
  g.add(part(new THREE.ConeGeometry(2.4, 1.2, 4).rotateY(Math.PI / 4), toon(0x0369a1), 0, 6.0, 0));
  g.add(part(boxG(1.6, 0.25, 0.2), toon(0x0c4a6e), 0, 4.9, 1.12, false));
  g.add(part(boxG(0.9, 1.2, 0.1), toon(0xfde047), 0.4, 5.6, 0.2, false));
  g.add(blobShadow(2, 1.3));
  return { obj: g };
}

export function chest(): Model {
  const g = new THREE.Group();
  g.userData.dyn = true;
  const inner = new THREE.Group();
  inner.add(part(boxG(4.6, 2.8, 3), toon(0xb45309), 0, 1.4, 0));
  inner.add(part(new THREE.CylinderGeometry(1.5, 1.5, 4.6, 16, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateX(Math.PI / 2), toon(0xd97706), 0, 2.8, 0));
  inner.add(part(boxG(0.9, 1.3, 0.3), toon(0xfde047), 0, 2.7, 1.55));
  for (const x of [-1.6, 1.6]) inner.add(part(boxG(0.4, 2.9, 3.1), toon(0xfcd34d), x, 1.45, 0, false));
  g.add(inner);
  g.add(blobShadow(3, 2));
  return { obj: g, tick: (t) => { inner.position.y = Math.abs(Math.sin(t * 2.4)) * 0.35; inner.rotation.z = Math.sin(t * 2.4) * 0.05; } };
}

// ── 木（インスタンスで まとめて かく） ──
export type TreeKind = 'round' | 'pine' | 'palm' | 'bush';
export interface TreeSpot { x: number; y: number; z: number; kind: TreeKind; s: number; color?: number }

/** 季節の 葉の色 */
export function foliage(season: number, i: number): { a: number; b: number; snow: boolean } {
  if (season === 10 || season === 11) {
    const pal = [[0xf97316, 0xfb923c], [0xdc2626, 0xef4444], [0xeab308, 0xfacc15], [0x16a34a, 0x22c55e]];
    const p = pal[i % (season === 11 ? 3 : 4)];
    return { a: p[0], b: p[1], snow: false };
  }
  if (season === 3 || season === 4) {
    return i % 3 === 0 ? { a: 0xf9a8d4, b: 0xfbcfe8, snow: false } : { a: 0x22c55e, b: 0x4ade80, snow: false };
  }
  const snow = season === 12 || season === 1 || season === 2;
  return { a: 0x16a34a, b: 0x22c55e, snow };
}

export function forest(spots: TreeSpot[], season: number): Model {
  const g = new THREE.Group();
  const sway: { m: THREE.InstancedMesh; base: THREE.Matrix4[]; phase: number[] }[] = [];
  const dummy = new THREE.Object3D();
  const outlineMat = curved(new THREE.MeshBasicMaterial({ color: 0x2a1460, side: THREE.BackSide }), true);

  type Inst = { geo: THREE.BufferGeometry; mat: THREE.Material; mats: THREE.Matrix4[]; colors?: THREE.Color[]; outline?: number; sway?: boolean };
  const sets: Record<string, Inst> = {};
  const add = (name: string, geo: () => THREE.BufferGeometry, mat: () => THREE.Material, m: THREE.Matrix4, color?: number, ol?: number, sw?: boolean) => {
    const s = (sets[name] ??= { geo: geo(), mat: mat(), mats: [], colors: color !== undefined ? [] : undefined, outline: ol, sway: sw });
    s.mats.push(m);
    if (color !== undefined) s.colors!.push(new THREE.Color(color));
  };
  const M = (x: number, y: number, z: number, sx: number, sy = sx, sz = sx, ry = 0, rz = 0) => {
    dummy.position.set(x, y, z); dummy.scale.set(sx, sy, sz); dummy.rotation.set(0, ry, rz); dummy.updateMatrix();
    return dummy.matrix.clone();
  };
  const white = () => toonNew(0xffffff);

  spots.forEach((t, i) => {
    const f = foliage(season, i);
    const s = t.s;
    if (t.kind === 'round') {
      add('trunk', () => new THREE.CylinderGeometry(0.45, 0.65, 1, 8).translate(0, 0.5, 0), () => toon(C.woodDark), M(t.x, t.y, t.z, s, 3.2 * s, s), undefined, 0.12);
      add('ball', () => new THREE.IcosahedronGeometry(1, 2), white, M(t.x, t.y + 5.0 * s, t.z, 3.0 * s, 2.6 * s, 3.0 * s), t.color ?? f.a, 0.16, true);
      add('ball', () => new THREE.IcosahedronGeometry(1, 2), white, M(t.x - 1.3 * s, t.y + 4.1 * s, t.z + 0.9 * s, 2.0 * s), f.b, 0.16, true);
      add('ball', () => new THREE.IcosahedronGeometry(1, 2), white, M(t.x + 1.4 * s, t.y + 4.4 * s, t.z + 0.6 * s, 2.1 * s), f.b, 0.16, true);
      if (f.snow) add('snow', () => new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2.6), () => toon(0xf8fafc), M(t.x, t.y + 6.5 * s, t.z, 2.5 * s, 1.4 * s, 2.5 * s));
    } else if (t.kind === 'pine') {
      add('trunk', () => new THREE.CylinderGeometry(0.45, 0.65, 1, 8).translate(0, 0.5, 0), () => toon(C.woodDark), M(t.x, t.y, t.z, s * 0.9, 2.2 * s, s * 0.9), undefined, 0.12);
      for (let k = 0; k < 3; k++) {
        add('cone', () => new THREE.ConeGeometry(1, 1, 9), white, M(t.x, t.y + (3.0 + k * 2.1) * s, t.z, (2.9 - k * 0.75) * s, 3.0 * s, (2.9 - k * 0.75) * s, k * 0.6), k % 2 ? 0x166534 : 0x15803d, 0.16, true);
      }
      if (f.snow) add('snowc', () => new THREE.ConeGeometry(1, 1, 9), () => toon(0xf8fafc), M(t.x, t.y + 8.0 * s, t.z, 1.0 * s, 1.1 * s, 1.0 * s));
    } else if (t.kind === 'palm') {
      // ゆるく まがった みき
      for (let k = 0; k < 5; k++) {
        add('ptrunk', () => new THREE.CylinderGeometry(0.42, 0.52, 1.6, 8), () => toon(0xa16207), M(t.x + k * k * 0.06 * s, t.y + (0.8 + k * 1.5) * s, t.z, s, s, s, 0, -0.08 * k), undefined, 0.1);
      }
      const top = new THREE.Vector3(t.x + 1.0 * s, t.y + 7.6 * s, t.z);
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        add('leaf', () => new THREE.ConeGeometry(0.9, 5, 4).rotateZ(-Math.PI / 2).translate(2.5, 0, 0).scale(1, 0.25, 1), white,
          M(top.x, top.y, top.z, s, s, s, a, -0.35), k % 2 ? 0x22c55e : 0x16a34a, 0.1, true);
      }
      add('coco', () => new THREE.SphereGeometry(0.45, 8, 6), () => toon(0x78350f), M(top.x + 0.4 * s, top.y - 0.5 * s, top.z + 0.4 * s, s));
    } else {
      add('ball', () => new THREE.IcosahedronGeometry(1, 2), white, M(t.x, t.y + 1.2 * s, t.z, 2.2 * s, 1.7 * s, 1.8 * s), t.color ?? f.b, 0.16, true);
      add('ball', () => new THREE.IcosahedronGeometry(1, 2), white, M(t.x + 1.6 * s, t.y + 0.9 * s, t.z + 0.4 * s, 1.5 * s), f.a, 0.16, true);
      if (f.snow) add('snow', () => new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2.6), () => toon(0xf8fafc), M(t.x, t.y + 2.4 * s, t.z, 1.8 * s, 0.9 * s, 1.5 * s));
    }
  });

  for (const s of Object.values(sets)) {
    const m = new THREE.InstancedMesh(s.geo, s.mat, s.mats.length);
    s.mats.forEach((mm, i) => m.setMatrixAt(i, mm));
    if (s.colors) s.colors.forEach((c, i) => m.setColorAt(i, c));
    g.add(m);
    if (s.outline) {
      const o = new THREE.InstancedMesh(s.geo, outlineMat, s.mats.length);
      s.mats.forEach((mm, i) => {
        // 中心まわりに すこし大きく
        const pos = new THREE.Vector3(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
        mm.decompose(pos, q, sc);
        const k = (v: number) => v + s.outline! * 2;
        sc.set(k(sc.x), k(sc.y), k(sc.z));
        o.setMatrixAt(i, new THREE.Matrix4().compose(pos, q, sc));
      });
      g.add(o);
      if (s.sway) sway.push({ m: o, base: [], phase: [] });
    }
    if (s.sway) sway.push({ m, base: [], phase: [] });
  }
  for (const sw of sway) {
    for (let i = 0; i < sw.m.count; i++) {
      const mm = new THREE.Matrix4();
      sw.m.getMatrixAt(i, mm);
      sw.base.push(mm);
      const p = new THREE.Vector3().setFromMatrixPosition(mm);
      sw.phase.push(p.x * 0.13 + p.z * 0.07);
    }
  }
  // かげ
  for (const t of spots) {
    const sh = blobShadow((t.kind === 'bush' ? 2.6 : t.kind === 'palm' ? 2.4 : 3.2) * t.s, (t.kind === 'bush' ? 1.8 : 2.2) * t.s);
    sh.position.set(t.x, t.y + 0.04, t.z);
    g.add(sh);
  }
  const tmp = new THREE.Matrix4(), off = new THREE.Matrix4();
  let acc = 0;
  return {
    obj: g,
    tick: (t, dt) => {
      acc += dt;
      if (acc < 1 / 30) return;   // ゆれは 30コマで じゅうぶん
      acc = 0;
      for (const sw of sway) {
        for (let i = 0; i < sw.base.length; i++) {
          const a = Math.sin(t * 1.3 + sw.phase[i]) * 0.035;
          off.makeRotationZ(a);
          const b = sw.base[i];
          tmp.copy(b);
          // 位置は そのまま、回転だけ すこし
          const e = tmp.elements;
          const px = e[12], py = e[13], pz = e[14];
          tmp.setPosition(0, 0, 0).premultiply(off).setPosition(px + a * 2, py, pz);
          sw.m.setMatrixAt(i, tmp);
        }
        sw.m.instanceMatrix.needsUpdate = true;
      }
    },
  };
}

// ── 岩・花・草 ──
export function rock(s = 1, color = C.stone): THREE.Object3D {
  const g = new THREE.Group();
  const m = part(new THREE.DodecahedronGeometry(1.6 * s, 0), toon(color), 0, 0.7 * s, 0, 0.12);
  m.scale.set(1.3, 0.8, 1);
  m.rotation.y = s * 3;
  g.add(m);
  g.add(blobShadow(2.2 * s, 1.5 * s));
  return g;
}

export function flowers(list: { x: number; y: number; z: number; c: number }[]): THREE.Object3D {
  const g = new THREE.Group();
  const stem = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.07, 1.4, 4).translate(0, 0.7, 0), toon(0x16a34a), list.length);
  const head = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.42, 1), toonNew(0xffffff), list.length);
  const eye = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 6, 4), toon(0xfde047), list.length);
  const d = new THREE.Object3D();
  list.forEach((f, i) => {
    d.position.set(f.x, f.y, f.z); d.scale.set(1, 1, 1); d.updateMatrix();
    stem.setMatrixAt(i, d.matrix);
    d.position.y = f.y + 1.5; d.scale.set(1, 0.7, 1); d.updateMatrix();
    head.setMatrixAt(i, d.matrix);
    head.setColorAt(i, new THREE.Color(f.c));
    d.position.z = f.z + 0.3; d.position.y = f.y + 1.55; d.scale.set(1, 1, 1); d.updateMatrix();
    eye.setMatrixAt(i, d.matrix);
  });
  g.add(stem, head, eye);
  return g;
}

export function grassTufts(list: { x: number; y: number; z: number; s: number }[], snowy: boolean): THREE.Object3D {
  const geo = new THREE.ConeGeometry(0.35, 1.3, 4).translate(0, 0.6, 0);
  const m = new THREE.InstancedMesh(geo, toon(snowy ? 0x86a98f : 0x15803d), list.length * 3);
  const d = new THREE.Object3D();
  let k = 0;
  for (const t of list) {
    for (let j = 0; j < 3; j++) {
      d.position.set(t.x + (j - 1) * 0.45 * t.s, t.y, t.z + (j % 2) * 0.2);
      d.rotation.set(0, 0, (j - 1) * 0.35);
      d.scale.setScalar(t.s * (j === 1 ? 1.15 : 0.85));
      d.updateMatrix();
      m.setMatrixAt(k++, d.matrix);
    }
  }
  return m;
}

// ── 季節の かざり ──
export function pumpkin(lantern: boolean): Model {
  const g = new THREE.Group();
  const body = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const seg = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 10), toon(0xf97316));
    seg.scale.set(0.75, 0.85, 1);
    seg.position.set(Math.cos(a) * 0.75, 1.2, Math.sin(a) * 0.75);
    seg.rotation.y = -a;
    body.add(seg);
  }
  body.add(part(new THREE.CylinderGeometry(0.16, 0.24, 0.9, 6), toon(0x15803d), 0, 2.4, 0, false));
  outline(body.children[0] as THREE.Mesh, 0.1);
  g.add(body);
  let face: THREE.Mesh | null = null;
  if (lantern) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const x = c.getContext('2d')!;
    x.fillStyle = '#fde047';
    x.beginPath(); x.moveTo(30, 58); x.lineTo(44, 34); x.lineTo(58, 58); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(70, 58); x.lineTo(84, 34); x.lineTo(98, 58); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(24, 74);
    for (let i = 0; i <= 8; i++) x.lineTo(24 + i * 10, 74 + (i % 2 ? 10 : 0));
    x.quadraticCurveTo(64, 120, 24, 74); x.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    face = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), curved(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })));
    face.position.set(0, 1.2, 1.62);
    g.add(face);
  }
  g.add(blobShadow(2, 1.5));
  return { obj: g, glows: lantern ? [{ p: new THREE.Vector3(0, 1.4, 1.8), r: 3.2 }] : undefined };
}

export function xmasTree(): Model {
  const g = new THREE.Group();
  g.add(part(new THREE.CylinderGeometry(0.5, 0.6, 1.6, 8), toon(0x92400e), 0, 0.8, 0));
  for (let k = 0; k < 3; k++) g.add(part(new THREE.ConeGeometry(3.4 - k * 0.9, 3.2, 10), toon(0x16a34a), 0, 2.8 + k * 2.1, 0));
  const balls = [0xef4444, 0xfde047, 0x60a5fa, 0xf472b6];
  for (let i = 0; i < 12; i++) {
    const a = i * 2.4, y = 2.2 + (i % 4) * 1.5, r = 3.0 - (y - 2) * 0.42;
    g.add(part(new THREE.SphereGeometry(0.3, 8, 6), toonNew(balls[i % 4], { emissive: balls[i % 4], emissiveIntensity: 0.35 }), Math.cos(a) * r, y, Math.sin(a) * r, false));
  }
  g.add(part(new THREE.OctahedronGeometry(0.8, 0), toonNew(0xfde047, { emissive: 0xfde047, emissiveIntensity: 0.6 }), 0, 9.6, 0));
  g.add(blobShadow(3.6, 2.4));
  return { obj: g, glows: [{ p: new THREE.Vector3(0, 9.6, 0.5), r: 3 }, { p: new THREE.Vector3(0, 5, 2), r: 5 }] };
}

export function kadomatsu(): Model {
  const g = new THREE.Group();
  [-1.0, 0, 1.0].forEach((x, i) => {
    const h = 5.6 - i * 0.9 + (i === 1 ? 1.4 : 0);
    const bam = part(new THREE.CylinderGeometry(0.42, 0.42, h, 10), toon(0x65a30d), x, h / 2, i === 1 ? -0.4 : 0.2);
    g.add(bam);
  });
  g.add(part(new THREE.CylinderGeometry(2.0, 2.2, 1.8, 14), toon(0xd97706), 0, 0.9, 0));
  for (let i = 0; i < 5; i++) g.add(part(new THREE.ConeGeometry(0.7, 1.6, 6), toon(0x166534), Math.cos(i * 1.3) * 1.5, 2.0, Math.sin(i * 1.3) * 1.2, false));
  g.add(blobShadow(2.8, 2));
  return { obj: g };
}

export function acorn(): THREE.Object3D {
  const g = new THREE.Group();
  g.add(part(new THREE.SphereGeometry(0.7, 10, 8).scale(0.9, 1.15, 0.9), toon(0xa16207), 0, 0.8, 0, 0.08));
  g.add(part(new THREE.SphereGeometry(0.72, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), toon(0x78350f), 0, 1.15, 0, 0.08));
  return g;
}
