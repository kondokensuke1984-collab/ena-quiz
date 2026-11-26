// 11月の島（nov）の たてもの 3D：ずけいこうぼう・たねの けんきゅうじょ・もりづくり・ぎょこう・名探偵じむしょ。
// 2D の絵（components/BuildingSVG.tsx）の 形と 色に あわせる。単位は 2D の px × 0.1。
// 足もとが 原点・うしろが -z・正面（カメラがわ）が +z。

import * as THREE from 'three';
import { toon, toonNew, part, boxG, gableG, windowMat, blobShadow } from './common';
import type { Model } from './models';

function win(w: number, h: number, x: number, y: number, z: number, color?: number): THREE.Group {
  const g = new THREE.Group();
  g.add(part(boxG(w + 0.4, h + 0.4, 0.2), toon(0xffffff), x, y, z));
  g.add(part(boxG(w, h, 0.3), color ? toon(color, { emissive: color }) : windowMat, x, y, z + 0.05, false));
  return g;
}

function door(w: number, h: number, x: number, z: number, color: number): THREE.Group {
  const g = new THREE.Group();
  g.add(part(boxG(w, h, 0.3), toon(color), x, h / 2, z));
  g.add(part(new THREE.SphereGeometry(0.18, 8, 6), toon(0xfde68a), x + w * 0.28, h * 0.48, z + 0.2, false));
  return g;
}

/** 三角やねの こや（ずけい・たね・たんてい は おなじ かたちで 色と かんばんが ちがう） */
function gableHouse(o: { W: number; H: number; D: number; wall: number; roof: number; win?: number; door: number; roofH: number }): THREE.Group {
  const g = new THREE.Group();
  g.add(part(boxG(o.W, o.H, o.D), toon(o.wall), 0, o.H / 2, -o.D / 2));
  g.add(part(gableG(o.W + 1.6, o.roofH, o.D + 1.2), toon(o.roof), 0, o.H, -o.D / 2));
  g.add(win(2.0, 1.6, -2.6, o.H * 0.62, 0.02, o.win));
  g.add(win(2.0, 1.6, 2.6, o.H * 0.62, 0.02, o.win));
  g.add(door(1.6, o.H * 0.66, 0, 0.02, o.door));
  return g;
}

/** やねの 前に たてる かんばんの 板 */
function board(w: number, h: number, y: number, z: number): THREE.Mesh {
  return part(boxG(w, h, 0.3), toon(0xffffff), 0, y, z, 0.06);
}

/** ずけいこうぼう（bd_zukei）：むらさきの 三角やねに、さんかく・まる・おうぎ の かんばん */
function zukei(): Model {
  const D = 6;
  const g = gableHouse({ W: 10, H: 4.4, D, wall: 0xfef3c7, roof: 0x6366f1, door: 0x92400e, roofH: 4.4 });
  g.add(board(4.6, 2.4, 6.6, 0.4));
  const tri = new THREE.Shape([new THREE.Vector2(-0.7, -0.6), new THREE.Vector2(0, 0.7), new THREE.Vector2(0.7, -0.6)]);
  g.add(part(new THREE.ExtrudeGeometry(tri, { depth: 0.2, bevelEnabled: false }), toon(0xfb923c), -1.3, 6.6, 0.55, false));
  g.add(part(new THREE.CylinderGeometry(0.6, 0.6, 0.2, 18).rotateX(Math.PI / 2), toon(0x34d399), 0.1, 6.6, 0.65, false));
  g.add(part(new THREE.CylinderGeometry(0.75, 0.75, 0.2, 14, 1, false, 0, Math.PI / 2).rotateX(Math.PI / 2), toon(0xf472b6), 1.1, 6.1, 0.65, false));
  // よこに おおきな じょうぎ と コンパス
  const ruler = part(boxG(0.5, 4.2, 0.25), toon(0xfde047), -6.0, 2.4, -0.6, 0.05);
  ruler.rotation.z = 0.12;
  g.add(ruler);
  for (const s of [-1, 1]) {
    const leg = part(boxG(0.25, 3.6, 0.25), toon(0x94a3b8), 6.0 + s * 0.7, 1.9, -0.6, 0.05);
    leg.rotation.z = -s * 0.22;
    g.add(leg);
  }
  g.add(part(new THREE.SphereGeometry(0.35, 8, 6), toon(0xef4444), 6.0, 3.8, -0.6, false));
  g.add(blobShadow(6.4, 4.4).translateZ(-D / 2));
  return { obj: g, glows: [{ p: new THREE.Vector3(-2.6, 2.7, 0.4), r: 4 }, { p: new THREE.Vector3(2.6, 2.7, 0.4), r: 4 }] };
}

/** たねの けんきゅうじょ（bd_tane）：みどりの やねに ふたばの かんばん、まえに プランター */
function tane(): Model {
  const D = 6;
  const g = gableHouse({ W: 9.6, H: 4.2, D, wall: 0xecfccb, roof: 0x16a34a, door: 0x92400e, roofH: 4.0 });
  g.add(board(4.2, 2.4, 6.3, 0.4));
  g.add(part(new THREE.SphereGeometry(0.5, 10, 8).scale(1.1, 0.8, 0.5), toon(0x92400e), -0.9, 6.0, 0.6, false));
  g.add(part(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 6), toon(0x15803d), 0.7, 6.0, 0.6, false));
  for (const s of [-1, 1]) {
    const leaf = part(new THREE.SphereGeometry(0.5, 10, 8).scale(1.2, 0.5, 0.3), toon(0x4ade80), 0.7 + s * 0.55, 6.6, 0.6, false);
    leaf.rotation.z = s * 0.5;
    g.add(leaf);
  }
  // プランター（ふたばが ならぶ）
  g.add(part(boxG(3.2, 0.8, 1.0), toon(0xb45309), -4.4, 0.4, 1.0, 0.05));
  for (const x of [-5.4, -4.4, -3.4]) {
    g.add(part(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 5), toon(0x15803d), x, 1.1, 1.0, false));
    for (const s of [-1, 1]) g.add(part(new THREE.SphereGeometry(0.22, 8, 6).scale(1.3, 0.5, 0.6), toon(0x4ade80), x + s * 0.22, 1.4, 1.0, false));
  }
  g.add(blobShadow(6.2, 4.4).translateZ(-D / 2));
  return { obj: g, glows: [{ p: new THREE.Vector3(-2.6, 2.6, 0.4), r: 4 }, { p: new THREE.Vector3(2.6, 2.6, 0.4), r: 4 }] };
}

/** もりづくりの いりぐち（bd_forest）：丸太の こや と りょうがわの 木 */
function forestHut(): Model {
  const g = new THREE.Group();
  const W = 6, H = 3.6, D = 5;
  for (let i = 0; i < 6; i++) {
    const log = part(new THREE.CylinderGeometry(0.33, 0.33, W + 0.6, 10).rotateZ(Math.PI / 2), toon(i % 2 ? 0xd6a85f : 0xc79552), 0, 0.33 + i * 0.6, -0.2, 0.04);
    g.add(log);
  }
  g.add(part(boxG(W - 0.2, H, D - 0.4), toon(0xd6a85f), 0, H / 2, -D / 2));
  g.add(part(gableG(W + 1.8, 3.0, D + 1.2), toon(0x65a30d), 0, H, -D / 2));
  g.add(door(1.4, 2.6, 0, 0.15, 0x7c4a1d));
  // りょうがわの とがった 木
  for (const [x, h, c] of [[-4.6, 3.4, 0x2f6f3e], [4.6, 4.0, 0x43914f]] as const) {
    g.add(part(new THREE.CylinderGeometry(0.3, 0.4, 1.2, 8), toon(0x7c4a1d), x, 0.6, -1.5));
    g.add(part(new THREE.ConeGeometry(1.7, h, 9), toon(c), x, 1.2 + h / 2, -1.5));
    g.add(part(new THREE.ConeGeometry(1.2, h * 0.8, 9), toon(c), x, 1.2 + h * 0.95, -1.5));
  }
  g.add(blobShadow(6.6, 4.4).translateZ(-D / 2));
  return { obj: g, glows: [{ p: new THREE.Vector3(0, 2.2, 0.6), r: 4 }] };
}

/** ぎょこう（bd_port）：青い やねの そうこ・クレーン・ちいさな ふね */
function fishPort(): Model {
  const g = new THREE.Group();
  const D = 5.6;
  // そうこ（2D では 左に よっている）
  const wx = -1.9;
  g.add(part(boxG(7, 4.0, D), toon(0xbae6fd), wx, 2.0, -D / 2));
  g.add(part(gableG(7.8, 2.4, D + 1.0), toon(0x0369a1), wx, 4.0, -D / 2));
  g.add(part(boxG(2.0, 2.6, 0.3), toon(0x475569), wx - 1.5, 1.3, 0.02));
  // さかなの かんばん
  g.add(part(new THREE.SphereGeometry(1, 14, 10).scale(1.2, 0.55, 0.2), toon(0xffffff), wx + 1.4, 3.0, 0.15, 0.05));
  const tail = new THREE.Shape([new THREE.Vector2(0, 0), new THREE.Vector2(0.6, 0.45), new THREE.Vector2(0.6, -0.45)]);
  g.add(part(new THREE.ExtrudeGeometry(tail, { depth: 0.2, bevelEnabled: false }), toon(0x38bdf8), wx + 2.5, 3.0, 0.1, false));
  g.add(part(new THREE.SphereGeometry(0.12, 6, 4), toon(0x1e3a8a), wx + 0.7, 3.1, 0.35, false));
  // クレーン
  const orange = toon(0xf59e0b);
  g.add(part(boxG(0.5, 5.0, 0.5), orange, 3.0, 2.5, -1.0, 0.05));
  g.add(part(boxG(2.8, 0.5, 0.5), orange, 4.2, 5.0, -1.0, 0.05));
  g.add(part(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 4), toon(0x475569), 5.4, 4.0, -1.0, false));
  g.add(part(boxG(1.0, 0.7, 0.7), toon(0xef4444), 5.4, 2.9, -1.0, 0.05));
  // たる・あみの かご
  g.add(part(new THREE.CylinderGeometry(0.6, 0.6, 1.2, 12), toon(0x92400e), 1.4, 0.6, 1.0, 0.05));
  g.add(part(boxG(1.2, 0.8, 1.0), toon(0x60a5fa), 2.9, 0.4, 1.3, 0.05));
  g.add(blobShadow(6.8, 4.4).translateZ(-D / 2));
  return { obj: g, glows: [{ p: new THREE.Vector3(wx - 1.5, 3.0, 0.4), r: 4 }] };
}

/** 名探偵じむしょ（bd_detective）：こい むらさきの やねに 虫めがねの かんばん */
function detective(): Model {
  const D = 6;
  const g = gableHouse({ W: 9.2, H: 4.2, D, wall: 0xe9d5ff, roof: 0x4c1d95, win: 0xfde68a, door: 0x7c3aed, roofH: 4.0 });
  // 虫めがね
  const lens = new THREE.Group();
  lens.add(part(new THREE.TorusGeometry(0.9, 0.22, 8, 20), toon(0xffffff), 0, 0, 0, 0.06));
  lens.add(part(new THREE.CircleGeometry(0.85, 20), toonNew(0xbae6fd, { emissive: 0x7dd3fc, emissiveIntensity: 0.3 }), 0, 0, 0.02, false));
  const handle = part(boxG(0.3, 1.2, 0.3), toon(0x4c1d95), 0.85, -0.85, 0, 0.05);
  handle.rotation.z = 0.75;
  lens.add(handle);
  lens.position.set(0, 6.2, 0.6);
  g.add(lens);
  g.add(blobShadow(6.2, 4.4).translateZ(-D / 2));
  return { obj: g, glows: [{ p: new THREE.Vector3(-2.6, 2.6, 0.4), r: 4.5 }, { p: new THREE.Vector3(2.6, 2.6, 0.4), r: 4.5 }] };
}

export function novBuildingModel(id: string): Model | null {
  switch (id) {
    case 'bd_zukei': return zukei();
    case 'bd_tane': return tane();
    case 'bd_forest': return forestHut();
    case 'bd_port': return fishPort();
    case 'bd_detective': return detective();
    default: return null;
  }
}

/** 建物の 名前の ふだ（11月の島は ぜんぶ むりょうで、何の たてものか わかるように） */
export const NOV_LABEL: Record<string, string> = {
  bd_zukei: 'ずけい こうぼう', bd_tane: 'たねの けんきゅうじょ', bd_forest: 'もりづくり', bd_port: 'ぎょこう', bd_detective: 'めいたんてい',
};
