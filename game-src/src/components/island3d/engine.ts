// アンリノ島（main）の 3D 表示。three.js で 島・海・建物・木を かき、キャラは 2D の絵を 板にして 立たせる。
// - 動き（主人公・なかま・モンスターの 位置）は IslandScreen の ref を 毎フレーム 読むだけ（ゲームの決まりは 2D と同じ）。
// - 画面の タップは pick() で 島の 位置（割合）に なおして、IslandScreen の いつもの処理に わたす。
// - 地平線は まるく まげてある（common.curve）。タップの計算も まげたぶんを もどして 求める。

import * as THREE from 'three';
import type { Pos } from '../../types';
import type { TimeOfDay, Weather } from '../../lib/sky';
import { BUILDING_SPOTS } from '../BuildingSVG';
import { DOORS, SOCCER_PITCH, MAIN_WALK_ELLIPSE } from '../../lib/island';
import { FARM_BOX, FARM_POS, plotPos } from '../../lib/farm';
import { FOREST_ISLET, MOSHI_ISLET, SEASON_SPOTS } from '../IslandStage';
import {
  GRASS_H, GROUND, curve, curved, fx, fz, groundH, grassE, sandE, projectCurved, toPos, toon, toonNew, part, boxG,
  windowMat, lampMat, blobShadow, glowMat, rng, PX, outlineMat, seeThru, bakeStatic,
} from './common';
import { loadArt, signArt, emojiArt, type ArtSpec, type SpriteArt } from './sprites';
import {
  buildingModel, mailbox, chest as chestModel, forest, rock, flowers, grassTufts, pumpkin, xmasTree, kadomatsu, acorn,
  type Model, type TreeSpot,
} from './models';

export interface LiveRefs {
  playerPos: { current: Pos };
  monsterPos: { current: Pos };
  friendPos: { current: Record<string, Pos> };
  flip: { current: boolean };
  walkPhase: { current: number };
  tapTarget: { current: Pos | null };
  /** しゅじんこうの むきと あし（'side_1' など）。ActorSpec.poses の キー */
  pose?: { current: string };
}

export interface ActorSpec {
  id: string;                 // '@player' / '@monster' / なかまの id
  art: ArtSpec | null;
  /** むき・あしごとの 絵（しゅじんこう）。LiveRefs.pose で えらぶ */
  poses?: Record<string, ArtSpec>;
  label?: string;
  emote?: string;
  tapDy: number;              // タップしたとき IslandScreen に わたす 位置の ずれ（割合）
}

export interface WorldOpts {
  built: string[];
  pier: boolean;
  bridge: boolean;
  moshi: boolean;
  expansion: number;
  season: number;
  halloween: boolean;
  soccerCups: number;   // サッカーの たいかいで ゆうしょうした 数（ピッチの よこに トロフィー。3こまで）
}

export interface PlacedSpec { uid: string; x: number; y: number; art: ArtSpec; lamp: boolean }
export interface FarmSpec { i: number; wet: boolean; paddy: boolean; art: ArtSpec | null }
export interface UiState {
  bubble: { id: string; text: string; heart: boolean; key: number } | null;
  jump: { id: string; key: number } | null;
  unread: number;
  chest: boolean;
  walking: boolean;
  showWalk: boolean;
}

// 2D と 同じ 場所（割合）
export const CHEST_POS = { x: 0.30, y: 0.86 };
export const MAIL_POS = { x: 0.58, y: 0.72 };
export const PIER_X = 0.36;

const SPRITE_UNIT = 0.062;          // キャラの絵：2D の 1px → 3D
const CAM = { up: 40, back: 54, fov: 36, look: -4 };
const LEAN = 0.42;                  // かんばんの 板を カメラの ほうへ たおす（ラジアン）
const STAND = 1.2;                  // キャラの 板は まっすぐ 立てて、上から 見て ちぢむぶん たてに のばす（たおすと うしろの かべに めりこむ）

class Billboard {
  group = new THREE.Group();
  holder = new THREE.Group();
  mesh: THREE.Mesh | null = null;
  shadow: THREE.Mesh;
  key: string | null = null;
  art: SpriteArt | null = null;
  mat: THREE.MeshBasicMaterial;
  jumpAt = -1;
  constructor(public id: string, shadowR = 2.2) {
    this.mat = curved(new THREE.MeshBasicMaterial({ transparent: false, alphaTest: 0.42, side: THREE.DoubleSide }));
    this.shadow = blobShadow(shadowR, shadowR * 0.55);
    this.shadow.position.y = 0.05;
    this.holder.scale.y = STAND;
    this.group.add(this.shadow, this.holder);
  }
  setArt(spec: ArtSpec | null) {
    const key = spec?.key ?? null;
    if (key === this.key) return;
    this.key = key;
    if (!spec) { if (this.mesh) this.mesh.visible = false; return; }
    loadArt(spec).then((art) => {
      if (!art || this.key !== key) return;
      this.art = art;
      this.mat.map = art.tex;
      this.mat.needsUpdate = true;
      if (!this.mesh) {
        this.mesh = new THREE.Mesh(art.geo, this.mat);
        this.mesh.frustumCulled = false;
        this.holder.add(this.mesh);
      } else this.mesh.geometry = art.geo;
      this.mesh.visible = true;
    });
  }
  height(): number {
    return (this.art ? this.art.h * 0.9 : 6) * STAND;
  }
}

/** 地面に 置いた 絵ではない 3D の もの（建物など）を タップしたとき */
interface HitBox { box: THREE.Box3; tap: Pos }

export class IslandEngine {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(CAM.fov, 4 / 3, 1, 900);
  private hemi = new THREE.HemisphereLight(0xe0f2ff, 0x6b8f4e, 1.5);
  private sun = new THREE.DirectionalLight(0xfff4e0, 2.1);
  private seaMat: THREE.ShaderMaterial;
  private sea: THREE.Mesh;
  private groundMesh: THREE.Mesh | null = null;
  private deco = new THREE.Group();
  private buildings = new THREE.Group();
  private farm = new THREE.Group();
  private placed = new THREE.Group();
  private actors = new THREE.Group();
  private glows = new THREE.Group();
  private fx = new THREE.Group();
  private ticks = new Map<string, ((t: number, dt: number) => void)[]>();
  private nightOnly = new Map<string, THREE.Object3D[]>();
  private glowSpots = new Map<string, { p: THREE.Vector3; r: number }[]>();
  private hitBoxes = new Map<string, HitBox[]>();
  private bills = new Map<string, Billboard>();
  private actorSpecs = new Map<string, ActorSpec>();
  private placedBills = new Map<string, Billboard>();
  private spriteMats = new Set<THREE.MeshBasicMaterial>();
  private worldKey = '';
  private builtKey = '';
  private mail: ReturnType<typeof mailbox> | null = null;
  private chestM: Model | null = null;
  private walkRing: THREE.Line | null = null;
  private rain: THREE.LineSegments | null = null;
  private snow: THREE.Points | null = null;
  private tod: TimeOfDay = 'day';
  private weather: Weather = 'sunny';
  private season = 0;
  private ui: UiState = { bubble: null, jump: null, unread: 0, chest: false, walking: false, showWalk: false };
  private lastJumpKey = 0;
  private camTarget = new THREE.Vector3();
  private raf = 0;
  private t0 = performance.now();
  private last = performance.now();
  /** 重い端末で 自動で あらく する（ゆっくりな フレームが つづいたら 一段ずつ 下げる） */
  private slowT = 0;
  private sampleT = 0;
  private pixelRatio = 1;
  private w = 1;
  private h = 1;
  private ro: ResizeObserver;
  private labels = new Map<string, HTMLDivElement>();
  private bubbleEl: HTMLDivElement;
  private emoteEls = new Map<string, HTMLDivElement>();
  private mailBadge: HTMLDivElement;
  private disposed = false;
  /** 主人公が 入れない ところ（建物・木の みき）。円（世界の 単位） */
  private colliders = new Map<string, { x: number; z: number; r: number }[]>();
  private cullDirty = true;
  onFirstFrame: (() => void) | null = null;

  private canvas: HTMLCanvasElement;

  /** host の中に 描く キャンバスを つくる（こわすときは キャンバスごと すてる） */
  constructor(private host: HTMLDivElement, private overlay: HTMLDivElement, private live: LiveRefs) {
    const canvas = document.createElement('canvas');
    canvas.className = 'block h-full w-full';
    host.appendChild(canvas);
    this.canvas = canvas;
    // スマホ・iPad は 電池と 熱を 気にして ふつうの力で 描く
    const touch = window.matchMedia?.('(pointer: coarse)').matches;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: touch ? 'default' : 'high-performance' });
    // スマホ・iPad は 画面が こまかいので すこし あらく 描いて 軽くする（見た目は ほぼ かわらない）
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, touch ? 1.5 : 2);
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setClearColor(0x000000, 0);
    this.scene.fog = new THREE.Fog(0xcfeeff, 120, 260);
    this.sun.position.set(-40, 90, 70);
    this.scene.add(this.hemi, this.sun, this.sun.target);
    this.seaMat = makeSeaMat();
    // 地平線を まげるのは 頂点ごと なので、海は こまかく わけて カメラに ついていかせる
    this.sea = new THREE.Mesh(new THREE.PlaneGeometry(760, 700, 152, 140).rotateX(-Math.PI / 2), this.seaMat);
    this.sea.position.set(GROUND.cx, 0, GROUND.cz);
    this.sea.renderOrder = -1;
    this.scene.add(this.sea);
    this.buildGround(0);
    this.scene.add(this.deco, this.buildings, this.farm, this.placed, this.actors, this.glows, this.fx);

    this.bubbleEl = document.createElement('div');
    this.bubbleEl.className = 'i3d-bubble';
    this.bubbleEl.style.display = 'none';
    this.mailBadge = document.createElement('div');
    this.mailBadge.className = 'i3d-badge';
    this.mailBadge.style.display = 'none';
    overlay.append(this.bubbleEl, this.mailBadge);

    // 主人公
    const p = this.live.playerPos.current;
    this.camTarget.set(fx(p), GRASS_H, fz(p));

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    this.raf = requestAnimationFrame(this.loop);
    if (location.hostname === 'localhost') (window as unknown as { __island3d: IslandEngine }).__island3d = this;   // 確認用
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    this.renderer.dispose();
    this.renderer.forceContextLoss();   // 家に 入る・出るを くりかえしても 描画の わくが たまらないように
    this.canvas.remove();
    this.overlay.innerHTML = '';
  }

  private resize() {
    const r = this.host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    this.w = r.width; this.h = r.height;
    this.renderer.setSize(r.width, r.height, false);
    this.camera.aspect = r.width / r.height;
    this.camera.updateProjectionMatrix();
    this.overlay.style.setProperty('--k', String(r.width / 1000));
  }

  // ── 地面 ──
  private buildGround(season: number) {
    if (this.groundMesh) { this.scene.remove(this.groundMesh); this.groundMesh.geometry.dispose(); }
    const x0 = GROUND.cx - GROUND.srx - 6, x1 = GROUND.cx + GROUND.srx + 6;
    const z0 = GROUND.cz - GROUND.srz - 6, z1 = GROUND.cz + GROUND.srz + 6;
    const sx = Math.round((x1 - x0) / 0.9), sz = Math.round((z1 - z0) / 0.9);
    const geo = new THREE.PlaneGeometry(x1 - x0, z1 - z0, sx, sz).rotateX(-Math.PI / 2);
    geo.translate((x0 + x1) / 2, 0, (z0 + z1) / 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const col = new Float32Array(pos.count * 3);
    const snowy = season === 12 || season === 1 || season === 2;
    const cA = new THREE.Color(snowy ? 0xe6f0f2 : 0x6ad47f), cB = new THREE.Color(snowy ? 0xd3e6dc : 0x55c66c);
    const cEdge = new THREE.Color(snowy ? 0xc9dccf : 0x3fb45c);
    const cBank = new THREE.Color(0xc89a62), cSand = new THREE.Color(0xfde68a), cWet = new THREE.Color(0xf0c86a);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const y = groundH(x, z);
      pos.setY(i, y);
      const eg = grassE(x, z);
      if (eg <= 0.972) {
        const n = Math.sin(x * 0.19 + Math.sin(z * 0.13) * 2) * Math.cos(z * 0.21 + Math.sin(x * 0.11)) * 0.5 + 0.5;
        c.copy(cA).lerp(cB, n > 0.55 ? 1 : n < 0.42 ? 0 : (n - 0.42) / 0.13);
        if (eg > 0.9) c.lerp(cEdge, (eg - 0.9) / 0.072 * 0.6);
      } else if (y > 0.62) {
        c.copy(cBank);
      } else {
        const es = sandE(x, z);
        c.copy(cSand).lerp(cWet, Math.min(1, Math.max(0, (es - 0.94) / 0.05)));
      }
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.computeVertexNormals();
    const mat = toonNew(0xffffff, { vertexColors: true }, false);
    this.groundMesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.groundMesh);
  }

  // ── 島の かざり（季節・広さ・はし などで 作りなおす） ──
  setWorld(o: WorldOpts) {
    const key = [o.pier, o.bridge, o.moshi, o.expansion, o.season, o.halloween, Math.min(3, o.soccerCups)].join('|');
    if (key !== this.worldKey) {
      const seasonChanged = this.season !== o.season || !this.worldKey;
      this.worldKey = key;
      this.season = o.season;
      if (seasonChanged) this.buildGround(o.season);
      this.buildDeco(o);
      this.applySky();
    }
    const bkey = o.built.join(',');
    if (bkey !== this.builtKey) {
      this.builtKey = bkey;
      this.buildBuildings(o.built);
    }
  }

  private clearGroup(g: THREE.Group, owner: string) {
    g.clear();
    this.ticks.delete(owner);
    this.nightOnly.delete(owner);
    this.glowSpots.delete(owner);
    this.hitBoxes.delete(owner);
  }

  private addModel(owner: string, parent: THREE.Group, m: Model, x: number, z: number, y = groundH(x, z)) {
    m.obj.position.set(x, y, z);
    parent.add(m.obj);
    if (m.tick) (this.ticks.get(owner) ?? this.ticks.set(owner, []).get(owner)!).push(m.tick);
    if (m.nightOnly) (this.nightOnly.get(owner) ?? this.nightOnly.set(owner, []).get(owner)!).push(...m.nightOnly);
    if (m.glows) {
      const list = this.glowSpots.get(owner) ?? this.glowSpots.set(owner, []).get(owner)!;
      for (const gl of m.glows) list.push({ p: gl.p.clone().add(m.obj.position), r: gl.r });
    }
  }

  private addHit(owner: string, obj: THREE.Object3D, tap: Pos) {
    obj.updateMatrixWorld(true);
    // かげ・夜の光・りんかく線は ふくめない（まわる光の 円すいで 画面の 半分が 灯台に なってしまう）
    const box = new THREE.Box3();
    const walk = (o: THREE.Object3D) => {
      if (o.userData.noHit) return;
      const m = o as THREE.Mesh;
      if (m.isMesh && m.material !== outlineMat) {
        if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
        box.union(m.geometry.boundingBox!.clone().applyMatrix4(m.matrixWorld));
      }
      o.children.forEach(walk);
    };
    walk(obj);
    if (box.isEmpty()) return;
    (this.hitBoxes.get(owner) ?? this.hitBoxes.set(owner, []).get(owner)!).push({ box, tap });
  }

  private sprite(owner: string, art: SpriteArt, x: number, y: number, z: number, parent: THREE.Group): THREE.Mesh {
    const mat = curved(new THREE.MeshBasicMaterial({ map: art.tex, alphaTest: 0.4, side: THREE.DoubleSide }));
    this.spriteMats.add(mat);
    const m = new THREE.Mesh(art.geo, mat);
    m.position.set(x, y, z);
    m.rotation.x = -LEAN;
    parent.add(m);
    void owner;
    return m;
  }

  private buildBuildings(built: string[]) {
    this.clearGroup(this.buildings, 'bld');
    const cols: { x: number; z: number; r: number }[] = [];
    const FOOT: Record<string, [number, number, number][]> = {   // [dx, dz, r]（足もとの 点から）
      bd_house: [[0, -4, 6]], bd_light: [[0, -3, 3.6]], bd_school: [[-4, -4.5, 5], [4, -4.5, 5]],
      bd_wheel: [[0, -2, 4]], bd_observ: [[0, -4, 5.4]], bd_moon: [[0, -1.8, 4.2]],
    };
    for (const id of built) {
      const spot = BUILDING_SPOTS[id];
      if (!spot || spot.area) continue;   // となりの島の 建物は ここでは かかない
      const m = buildingModel(id);
      if (!m) continue;
      this.addModel('bld', this.buildings, m, fx(spot), fz(spot));
      // タップしたら 建物の 正面へ 歩く（足もとの 点だと 建物に めりこむ）
      const tap = id === 'bd_house' ? DOORS.mainToHouse : id === 'bd_school' ? DOORS.mainToSchool : { x: spot.x, y: spot.y + 0.05 };
      this.addHit('bld', m.obj, tap);
      bakeStatic(m.obj);
      for (const [dx, dz, r] of FOOT[id] ?? []) cols.push({ x: fx(spot) + dx, z: fz(spot) + dz, r });
    }
    this.colliders.set('bld', cols);
    this.applySky();
  }

  private buildDeco(o: WorldOpts) {
    this.clearGroup(this.deco, 'deco');
    const R = rng(20260922);
    const season = o.season;
    // よける場所（世界の 単位）
    const clear: { x: number; z: number; r: number }[] = [];
    for (const [id, s] of Object.entries(BUILDING_SPOTS)) {
      if (s.area) continue;
      const r = id === 'bd_school' ? 13 : id === 'bd_wheel' ? 10 : 9;
      clear.push({ x: fx(s), z: fz(s) - 3, r });
    }
    for (const d of Object.values(DOORS)) clear.push({ x: fx(d), z: fz(d), r: 6 });
    clear.push({ x: fx(MAIL_POS), z: fz(MAIL_POS), r: 5 }, { x: fx(CHEST_POS), z: fz(CHEST_POS), r: 5 });
    for (const [x, y] of SEASON_SPOTS) clear.push({ x: x * PX, z: y * PX, r: 4.5 });
    const P = SOCCER_PITCH;
    const inRect = (x: number, z: number, x0: number, x1: number, z0: number, z1: number, m: number) => x > x0 - m && x < x1 + m && z > z0 - m && z < z1 + m;
    const free = (x: number, z: number, r: number) => {
      if (inRect(x, z, P.x * PX, (P.x + P.w) * PX, P.y * PX, (P.y + P.h) * PX, r + 2)) return false;
      if (inRect(x, z, FARM_BOX.x0 * 100, FARM_BOX.x1 * 100, FARM_BOX.y0 * 75, FARM_BOX.y1 * 75, r + 1)) return false;
      if (Math.abs(x - PIER_X * 100) < 6 + r && z < 0) return false;       // さんばしの まえ
      if (x > 118 && Math.abs(z - 45) < 6 + r) return false;                // はしの まえ
      return clear.every((c) => Math.hypot(x - c.x, z - c.z) > c.r + r);
    };

    const trees: TreeSpot[] = [];
    const taken: { x: number; z: number; r: number }[] = [];
    const put = (t: TreeSpot, r: number) => { trees.push(t); taken.push({ x: t.x, z: t.z, r }); };
    const spaced = (x: number, z: number, r: number) => taken.every((t) => Math.hypot(x - t.x, z - t.z) > t.r + r);
    // ふちを ぐるっと
    const N = 46;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2 + 0.05;
      const k = 0.945 + (i % 3) * 0.012;
      const x = GROUND.cx + Math.cos(a) * GROUND.grx * k, z = GROUND.cz + Math.sin(a) * GROUND.grz * k;
      const south = Math.sin(a) > 0.45;
      if (!free(x, z, 3) || !spaced(x, z, 3)) continue;
      const kind = south ? 'bush' : (['round', 'pine', 'round', 'bush'] as const)[i % 4];
      put({ x, y: GRASS_H, z, kind, s: south ? 0.9 : 0.85 + R() * 0.3 }, 3.2);
    }
    // 広げた土地に ぽつぽつ
    for (let n = 0; n < 400 && trees.length < 78; n++) {
      const a = R() * Math.PI * 2, e = 0.5 + R() * 0.38;
      const x = GROUND.cx + Math.cos(a) * GROUND.grx * e, z = GROUND.cz + Math.sin(a) * GROUND.grz * e;
      if (z > 70 && Math.abs(x - 50) < 30) continue;   // 手前の まんなかは あける（主人公が かくれないように）
      if (!free(x, z, 3.5) || !spaced(x, z, 4.5)) continue;
      put({ x, y: GRASS_H, z, kind: R() < 0.55 ? 'round' : R() < 0.6 ? 'pine' : 'bush', s: 0.85 + R() * 0.35 }, 4);
    }
    // 砂浜の やしの木
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.4;
      const x = GROUND.cx + Math.cos(a) * GROUND.srx * 0.955, z = GROUND.cz + Math.sin(a) * GROUND.srz * 0.955;
      if (!free(x, z, 2) || (Math.sin(a) > 0.5 && i % 2)) continue;
      put({ x, y: groundH(x, z), z, kind: 'palm', s: 0.8 + R() * 0.25 }, 3);
    }
    // もりの こじまの 木
    const fi = { x: fx(FOREST_ISLET), z: fz(FOREST_ISLET) + 1 };
    for (const [dx, dz, s] of [[-6, 1, 0.8], [5, 2, 0.75], [-2, -2, 1.0], [3, -3, 0.95], [0, 3, 0.85], [-5, -3, 0.7]] as const) {
      trees.push({ x: fi.x + dx, y: 0.9, z: fi.z + dz, kind: 'pine', s });
    }
    this.addModel('deco', this.deco, forest(trees, season), 0, 0, 0);
    this.colliders.set('trees', trees.filter((t) => t.kind === 'round' || t.kind === 'pine').map((t) => ({ x: t.x, z: t.z, r: 1.3 * t.s })));

    // 花
    const fl: { x: number; y: number; z: number; c: number }[] = [];
    const fc = [0xf472b6, 0xfacc15, 0xa78bfa, 0xffffff, 0xfb7185];
    for (let n = 0; n < 300 && fl.length < 150; n++) {
      const a = R() * Math.PI * 2, e = Math.sqrt(R()) * 0.93;
      const x = GROUND.cx + Math.cos(a) * GROUND.grx * e, z = GROUND.cz + Math.sin(a) * GROUND.grz * e;
      if (!free(x, z, 1.5) || !spaced(x, z, 1)) continue;
      const c = fc[Math.floor(R() * fc.length)];
      for (let j = 0; j < 4; j++) fl.push({ x: x + (R() - 0.5) * 2.4, y: GRASS_H, z: z + (R() - 0.5) * 1.6, c });
    }
    if (season !== 12 && season !== 1 && season !== 2) this.deco.add(flowers(fl));
    // 草
    const tufts: { x: number; y: number; z: number; s: number }[] = [];
    for (let n = 0; n < 600 && tufts.length < 260; n++) {
      const a = R() * Math.PI * 2, e = Math.sqrt(R()) * 0.95;
      const x = GROUND.cx + Math.cos(a) * GROUND.grx * e, z = GROUND.cz + Math.sin(a) * GROUND.grz * e;
      if (!free(x, z, 0.5)) continue;
      tufts.push({ x, y: GRASS_H, z, s: 0.7 + R() * 0.5 });
    }
    this.deco.add(grassTufts(tufts, season === 12 || season === 1 || season === 2));
    // 岩
    for (let i = 0; i < 12; i++) {
      const a = R() * Math.PI * 2;
      const onSand = i % 2 === 0;
      const k = onSand ? 0.96 : 0.9;
      const x = GROUND.cx + Math.cos(a) * (onSand ? GROUND.srx : GROUND.grx) * k, z = GROUND.cz + Math.sin(a) * (onSand ? GROUND.srz : GROUND.grz) * k;
      if (!free(x, z, 2) || !spaced(x, z, 2)) continue;
      const r = rock(0.6 + R() * 0.6, onSand ? 0xd6d3d1 : 0xa8a29e);
      r.position.set(x, groundH(x, z), z);
      this.deco.add(r);
    }

    this.buildPitch(o.soccerCups);
    this.buildFarmBase();
    if (o.pier) this.buildPier();
    if (o.bridge) this.buildBridge();
    this.buildForestIslet();
    if (o.moshi) this.buildMoshi();
    if (o.expansion >= 2) this.buildSchoolIslet();
    this.buildDream();

    // ポスト・たからばこ
    this.mail = mailbox();
    this.addModel('deco', this.deco, this.mail, fx(MAIL_POS), fz(MAIL_POS));
    this.addHit('deco', this.mail.obj, { x: MAIL_POS.x, y: MAIL_POS.y - 0.05 });
    this.mail.setFlag(this.ui.unread > 0);
    this.chestM = chestModel();
    this.addModel('deco', this.deco, this.chestM, fx(CHEST_POS), fz(CHEST_POS));
    this.addHit('deco', this.chestM.obj, { x: CHEST_POS.x, y: CHEST_POS.y - 0.03 });
    const spark = this.sprite('deco', emojiArt('✨', 2.4), 2.6, 3.2, 0, this.chestM.obj as THREE.Group);
    void spark;
    this.chestM.obj.visible = this.ui.chest;

    // 季節
    const S = SEASON_SPOTS.map(([x, y]) => ({ x: x * PX, z: y * PX }));
    if (season === 10) {
      for (const s of S.slice(4)) this.addModel('deco', this.deco, pumpkin(o.halloween), s.x, s.z);
      if (o.halloween) for (const [x, y] of [[430, 330], [690, 590], [870, 470]]) this.addModel('deco', this.deco, pumpkin(true), x * PX, y * PX);
    } else if (season === 11) {
      for (const s of S.slice(0, 3)) { const a = acorn(); a.position.set(s.x, GRASS_H, s.z); this.deco.add(a); }
      const leaves: THREE.Mesh[] = [];
      const leafGeo = new THREE.CircleGeometry(0.55, 5).rotateX(-Math.PI / 2);
      for (let i = 0; i < 70; i++) {
        const a = R() * Math.PI * 2, e = Math.sqrt(R()) * 0.9;
        const x = GROUND.cx + Math.cos(a) * GROUND.grx * e, z = GROUND.cz + Math.sin(a) * GROUND.grz * e;
        const m = new THREE.Mesh(leafGeo, toon([0xdc2626, 0xf97316, 0xeab308][i % 3]));
        m.position.set(x, GRASS_H + 0.03, z);
        m.rotation.y = R() * 6;
        leaves.push(m);
      }
      this.deco.add(...leaves);
    } else if (season === 12) {
      this.addModel('deco', this.deco, xmasTree(), 86, 56);
    } else if (season === 1) {
      this.addModel('deco', this.deco, kadomatsu(), 86, 56);
    }
    bakeStatic(this.deco);
  }

  private buildPitch(cups: number) {
    const P = SOCCER_PITCH;
    const x0 = P.x * PX, z0 = P.y * PX, w = P.w * PX, d = P.h * PX;
    const c = document.createElement('canvas');
    c.width = 600; c.height = 340;
    const g = c.getContext('2d')!;
    for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#3fae5c' : '#36a052'; g.fillRect(i * 75, 0, 76, 340); }
    g.strokeStyle = '#fff'; g.lineWidth = 6;
    g.strokeRect(6, 6, 588, 328);
    g.beginPath(); g.moveTo(300, 6); g.lineTo(300, 334); g.stroke();
    g.beginPath(); g.arc(300, 170, 48, 0, Math.PI * 2); g.stroke();
    for (const s of [0, 1]) {
      const gx = s ? 594 : 6;
      g.strokeRect(s ? gx - 88 : gx, 78, 88, 184);
      g.strokeRect(s ? gx - 32 : gx, 122, 32, 96);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const field = new THREE.Mesh(new THREE.PlaneGeometry(w + 2, d + 2, 24, 14).rotateX(-Math.PI / 2), curved(new THREE.MeshToonMaterial({ map: tex })));
    field.position.set(x0 + w / 2, GRASS_H + 0.04, z0 + d / 2);
    this.deco.add(field);
    const postMat = toon(0xffffff);
    const netMat = curved(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
    for (const s of [-1, 1]) {
      const gx = s < 0 ? x0 - 0.4 : x0 + w + 0.4;
      const cz = z0 + d / 2, gw = 6, gh = 2.6, gd = 1.8;
      const goal = new THREE.Group();
      goal.position.set(gx, GRASS_H, cz);
      for (const zz of [-gw / 2, gw / 2]) goal.add(part(new THREE.CylinderGeometry(0.16, 0.16, gh, 8), postMat, 0, gh / 2, zz, 0.06));
      goal.add(part(new THREE.CylinderGeometry(0.16, 0.16, gw, 8).rotateX(Math.PI / 2), postMat, 0, gh, 0, 0.06));
      const back = new THREE.Mesh(new THREE.PlaneGeometry(gw, gh).rotateY(Math.PI / 2), netMat);
      back.position.set(s * gd, gh / 2, 0);
      const top = new THREE.Mesh(new THREE.PlaneGeometry(gd, gw).rotateX(-Math.PI / 2), netMat);
      top.position.set(s * gd / 2, gh, 0);
      goal.add(back, top);
      this.deco.add(goal);
    }
    for (const [x, z, col] of [[x0, z0, 0xfacc15], [x0 + w, z0, 0xef4444], [x0, z0 + d, 0xef4444], [x0 + w, z0 + d, 0xfacc15]] as const) {
      const f = new THREE.Group();
      f.position.set(x, GRASS_H, z);
      f.add(part(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 5), toon(0xf8fafc), 0, 1.2, 0, false));
      f.add(part(new THREE.PlaneGeometry(1.2, 0.8).translate(0.6, 0, 0), toonNew(col, { side: THREE.DoubleSide }), 0, 2.0, 0, false));
      this.deco.add(f);
    }
    const ballTex = (() => {
      const cc = document.createElement('canvas'); cc.width = 128; cc.height = 64;
      const bg = cc.getContext('2d')!; bg.fillStyle = '#fff'; bg.fillRect(0, 0, 128, 64); bg.fillStyle = '#1f2937';
      for (const [x, y] of [[20, 20], [60, 40], [100, 18], [40, 52], [84, 54], [116, 44]]) { bg.beginPath(); bg.arc(x, y, 7, 0, Math.PI * 2); bg.fill(); }
      const t = new THREE.CanvasTexture(cc); t.colorSpace = THREE.SRGBColorSpace; return t;
    })();
    const ball = part(new THREE.SphereGeometry(0.75, 16, 12), curved(new THREE.MeshToonMaterial({ map: ballTex })), x0 + w / 2 + 5.2, GRASS_H + 0.75, z0 + d / 2 + 2.2, 0.06);
    this.deco.add(ball);
    const sign = this.sprite('deco', signArt('⚽ サッカー'), x0 + 2.8, GRASS_H + 2.6, z0 - 0.8, this.deco);
    void sign;
    this.deco.add(part(new THREE.CylinderGeometry(0.14, 0.14, 3, 6), toon(0x78350f), x0 + 2.8, GRASS_H + 1.5, z0 - 0.9, false));
    // ゆうしょうの トロフィー（ひょうしょうだいの 上に 3こまで）
    const n = Math.min(3, cups);
    if (n > 0) {
      const gold = toon(0xfbbf24), dark = toon(0xd97706), navy = toon(0x1e3a8a);
      const bx = x0 + w / 2 + 4 - (n - 1) * 1.1, bz = z0 - 1.6;
      this.deco.add(part(boxG(2.2 * n + 0.8, 0.9, 2), navy, bx + (n - 1) * 1.1, GRASS_H + 0.45, bz, 0.06));
      for (let i = 0; i < n; i++) {
        const t = new THREE.Group();
        t.position.set(bx + i * 2.2, GRASS_H + 0.9, bz);
        t.scale.setScalar(1.6);
        t.add(part(boxG(0.8, 0.22, 0.8), dark, 0, 0.11, 0, 0.06));
        t.add(part(new THREE.CylinderGeometry(0.1, 0.14, 0.45, 8), gold, 0, 0.44, 0, 0.06));
        t.add(part(new THREE.CylinderGeometry(0.42, 0.16, 0.65, 12), gold, 0, 0.98, 0, 0.06));
        for (const s of [-1, 1]) t.add(part(new THREE.TorusGeometry(0.2, 0.05, 6, 12, Math.PI), dark, s * 0.42, 1.0, 0, 0.06).rotateZ(-s * Math.PI / 2));
        this.deco.add(t);
      }
    }
  }

  private buildFarmBase() {
    const x0 = FARM_BOX.x0 * 100, x1 = FARM_BOX.x1 * 100;
    const z0 = FARM_BOX.y0 * 75 + 1, z1 = FARM_BOX.y1 * 75 - 1;
    // さく
    const wood = toon(0xb45309);
    const posts: [number, number][] = [];
    for (let x = x0; x <= x1 + 0.01; x += (x1 - x0) / 8) { posts.push([x, z0]); posts.push([x, z1]); }
    for (let z = z0 + (z1 - z0) / 6; z < z1 - 0.01; z += (z1 - z0) / 6) { posts.push([x0, z]); posts.push([x1, z]); }
    for (const [x, z] of posts) {
      if (Math.abs(z - z1) < 0.01 && Math.abs(x - (x0 + x1) / 2) < 3.5) continue;   // 入口
      this.deco.add(part(boxG(0.4, 1.6, 0.4), wood, x, GRASS_H + 0.8, z, 0.06));
    }
    const rail = (ax: number, az: number, bx: number, bz: number) => {
      const len = Math.hypot(bx - ax, bz - az);
      const m = part(boxG(len, 0.22, 0.22), wood, (ax + bx) / 2, GRASS_H + 1.2, (az + bz) / 2, 0.05);
      m.rotation.y = -Math.atan2(bz - az, bx - ax);
      this.deco.add(m);
    };
    const mx = (x0 + x1) / 2;
    rail(x0, z0, x1, z0); rail(x0, z0, x0, z1); rail(x1, z0, x1, z1);
    rail(x0, z1, mx - 3.5, z1); rail(mx + 3.5, z1, x1, z1);
    const sign = this.sprite('deco', signArt('はたけ', { size: 0.8 }), x1 + 2.6, GRASS_H + 2.2, fz(FARM_POS) + 1, this.deco);
    void sign;
    this.deco.add(part(new THREE.CylinderGeometry(0.14, 0.14, 2.4, 6), toon(0x92400e), x1 + 2.6, GRASS_H + 1.2, fz(FARM_POS) + 0.9, false));
    const box = new THREE.Group();
    box.position.set(mx, GRASS_H, (z0 + z1) / 2);
    box.add(new THREE.Mesh(boxG(x1 - x0, 0.5, z1 - z0)));
    box.position.y = GRASS_H + 1;
    this.addHit('deco', box, { x: FARM_POS.x, y: FARM_POS.y });
  }

  private buildPier() {
    const x = PIER_X * 100;
    const zLand = GROUND.cz - GROUND.grz * Math.sqrt(1 - ((x - GROUND.cx) / GROUND.grx) ** 2) + 1.5;
    const zEnd = zLand - 19;
    const g = new THREE.Group();
    const deck = toon(0xb45309), dark = toon(0x78350f);
    for (let z = zLand; z > zEnd; z -= 1.3) {
      g.add(part(boxG(3.8, 0.35, 1.1), deck, x, 1.05, z, 0.05));
    }
    for (let z = zLand - 2; z > zEnd; z -= 4.5) {
      for (const s of [-1, 1]) g.add(part(new THREE.CylinderGeometry(0.28, 0.28, 3.6, 8), dark, x + s * 1.9, -0.4, z, 0.06));
    }
    this.deco.add(g);
    // ボート
    const boat = new THREE.Group();
    boat.userData.dyn = true;
    boat.position.set(x + 6.5, 0.1, zEnd + 4);
    const hull = part(new THREE.CylinderGeometry(1.8, 1.2, 1.4, 16, 1, false).scale(1, 1, 2.2), toon(0xf87171), 0, 0.3, 0, 0.1);
    boat.add(hull);
    boat.add(part(new THREE.CylinderGeometry(0.1, 0.1, 5, 6), toon(0x4c1d95), 0, 3.4, 0, false));
    const sail = new THREE.Shape(); sail.moveTo(0, 0); sail.lineTo(0, 3.4); sail.lineTo(2.4, 0); sail.closePath();
    boat.add(part(new THREE.ShapeGeometry(sail), toonNew(0xffffff, { side: THREE.DoubleSide }), 0.12, 1.6, 0, false));
    this.deco.add(boat);
    (this.ticks.get('deco') ?? this.ticks.set('deco', []).get('deco')!).push((t) => {
      boat.position.y = 0.1 + Math.sin(t * 1.6) * 0.18;
      boat.rotation.z = Math.sin(t * 1.3) * 0.05;
    });
    const hit = new THREE.Mesh(boxG(4, 2, zLand - zEnd));
    hit.position.set(x, 1.5, (zLand + zEnd) / 2 - 3);
    this.addHit('deco', hit, { x: PIER_X, y: zEnd / 75 });
  }

  private buildBridge() {
    const g = new THREE.Group();
    const deck = toon(0xb45309), dark = toon(0x92400e);
    const z = 45.1;
    for (let x = 133; x < 190; x += 1.2) g.add(part(boxG(1.0, 0.35, 3.4), deck, x, 1.0, z, 0.05));
    for (const s of [-1, 1]) {
      g.add(part(boxG(57, 0.25, 0.25), dark, 161.5, 2.0, z + s * 1.8, 0.05));
      for (let x = 134; x < 190; x += 4) g.add(part(boxG(0.3, 1.4, 0.3), dark, x, 1.5, z + s * 1.8, 0.05));
      for (let x = 140; x < 190; x += 9) g.add(part(new THREE.CylinderGeometry(0.3, 0.3, 4, 8), toon(0x78350f), x, -1, z + s * 1.8, false));
    }
    this.deco.add(g);
    this.sprite('deco', emojiArt('🌸', 3), 142, 2.2, 42.6, this.deco);
  }

  private islet(x: number, z: number, rx: number, rz: number): THREE.Group {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    const sand = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.25, 1.4, 32), toon(0xfde68a));
    sand.scale.set(rx, 1, rz); sand.position.y = -0.3;
    const grass = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.06, 0.8, 32), toon(0x4ade80));
    grass.scale.set(rx * 0.78, 1, rz * 0.72); grass.position.y = 0.5;
    g.add(sand, grass);
    return g;
  }

  private buildForestIslet() {
    const x = fx(FOREST_ISLET), z = fz(FOREST_ISLET) + 1;
    const g = this.islet(x, z, 12, 8.5);
    this.deco.add(g);
    this.sprite('deco', signArt('まよいの森', { fg: '#14532d', size: 0.8 }), x + 7, 1.6, z + 5, this.deco);
    this.deco.add(part(new THREE.CylinderGeometry(0.12, 0.12, 2, 6), toon(0x78350f), x + 7, 1.6, z + 4.9, false));
    this.sprite('deco', emojiArt('✨', 3), x - 8, 4, z - 2, this.deco);
  }

  private buildMoshi() {
    const x = fx(MOSHI_ISLET), z = fz(MOSHI_ISLET);
    const g = this.islet(0, 0, 9, 6.5);
    const float = new THREE.Group();
    float.userData.dyn = true;
    float.position.set(x, 0, z);
    float.add(g);
    // こくばん と はた
    float.add(part(boxG(5.6, 3.8, 0.4), toon(0x065f46), -1.5, 3.4, 0));
    const c = document.createElement('canvas'); c.width = 128; c.height = 80;
    const cg = c.getContext('2d')!; cg.fillStyle = '#ecfdf5'; cg.font = '900 44px sans-serif'; cg.textAlign = 'center'; cg.fillText('80%', 64, 56);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const txt = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.8), curved(new THREE.MeshBasicMaterial({ map: tex, transparent: true })));
    txt.position.set(-1.5, 3.4, 0.22);
    float.add(txt);
    for (const s of [-1, 1]) float.add(part(boxG(0.3, 1.8, 0.3), toon(0x78350f), -1.5 + s * 2.2, 1.4, 0, false));
    float.add(part(new THREE.CylinderGeometry(0.15, 0.15, 6, 6), toon(0x78350f), 3.6, 3.4, 0, false));
    float.add(part(new THREE.PlaneGeometry(3, 1.8).translate(1.5, 0, 0), toonNew(0xf43f5e, { side: THREE.DoubleSide }), 3.7, 5.6, 0, false));
    this.deco.add(float);
    this.sprite('deco', signArt('もしの しま', { size: 0.8 }), x, 0.6, z + 7, this.deco);
    (this.ticks.get('deco') ?? this.ticks.set('deco', []).get('deco')!).push((t) => { float.position.y = Math.sin(t * 1.2) * 0.35; });
  }

  private buildSchoolIslet() {
    const cx = 134, cz = -25;
    this.deco.add(this.islet(cx, cz, 8.6, 6));
    const tr = forest([{ x: cx + 1, y: 0.9, z: cz, kind: 'palm', s: 0.9 }], this.season);
    this.deco.add(tr.obj);
    const wood = toon(0xd97706);
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const x = (1 - t) * (1 - t) * 121 + 2 * (1 - t) * t * 128 + t * t * 129;
      const z = (1 - t) * (1 - t) * -4 + 2 * (1 - t) * t * -10 + t * t * -19.5;
      this.deco.add(part(boxG(2.4, 0.3, 0.9), wood, x, 0.9 - Math.sin(t * Math.PI) * -0.6, z, 0.05));
    }
  }

  private buildDream() {
    const mat = curved(new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.55, depthWrite: false }));
    const hill = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat);
    hill.scale.set(26, 9, 10);
    hill.position.set(70, -0.5, -150);
    this.deco.add(hill);
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.9, 8, 6), curved(new THREE.MeshBasicMaterial({ color: 0xfef9c3 })));
    light.position.set(70, 8, -146);
    this.deco.add(light);
  }

  // ── はたけ ──
  setFarm(list: FarmSpec[]) {
    this.farm.clear();
    for (const f of list) {
      const p = plotPos(f.i);
      const x = fx(p), z = fz(p);
      const mound = part(new THREE.CylinderGeometry(3.0, 3.3, 0.6, 20).scale(1, 1, 0.62), toon(f.wet ? 0x5a3210 : 0x92400e), x, GRASS_H + 0.3, z, 0.08);
      this.farm.add(mound);
      if (f.paddy) {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.1, 20).scale(1, 1, 0.6), toonNew(0x7dd3fc, { transparent: true, opacity: 0.85 }));
        w.position.set(x, GRASS_H + 0.62, z);
        this.farm.add(w);
      } else {
        for (const dz of [-0.6, 0.6]) this.farm.add(part(boxG(4.6, 0.18, 0.3), toon(0x78350f), x, GRASS_H + 0.62, z + dz, false));
      }
      if (f.art) {
        const b = new Billboard('farm' + f.i, 0);
        b.shadow.visible = false;
        b.setArt({ ...f.art, unit: SPRITE_UNIT * 1.15 });
        b.group.position.set(x, GRASS_H + 0.5, z + 0.3);
        this.spriteMats.add(b.mat);
        this.farm.add(b.group);
      }
    }
    this.applySky();
  }

  // ── 島に 置いた 家具 ──
  setPlaced(list: PlacedSpec[]) {
    const keep = new Set(list.map((p) => p.uid));
    for (const [uid, b] of this.placedBills) if (!keep.has(uid)) { this.placed.remove(b.group); this.placedBills.delete(uid); }
    const lamps: { p: THREE.Vector3; r: number }[] = [];
    for (const p of list) {
      let b = this.placedBills.get(p.uid);
      if (!b) {
        b = new Billboard(p.uid, 2.4);
        this.placedBills.set(p.uid, b);
        this.spriteMats.add(b.mat);
        this.placed.add(b.group);
      }
      b.setArt({ ...p.art, unit: SPRITE_UNIT });
      const x = p.x * 100, z = p.y * 75;
      b.group.position.set(x, GRASS_H, z);
      if (p.lamp) lamps.push({ p: new THREE.Vector3(x, GRASS_H + 4.5, z + 0.5), r: 4 });
    }
    this.glowSpots.set('placed', lamps);
    this.applySky();
  }

  // ── キャラ ──
  setActors(list: ActorSpec[]) {
    const keep = new Set(list.map((a) => a.id));
    for (const [id, b] of this.bills) {
      if (keep.has(id)) continue;
      this.actors.remove(b.group);
      this.bills.delete(id);
      this.spriteMats.delete(b.mat);
      this.labels.get(id)?.remove(); this.labels.delete(id);
      this.emoteEls.get(id)?.remove(); this.emoteEls.delete(id);
    }
    for (const a of list) {
      let b = this.bills.get(a.id);
      if (!b) {
        b = new Billboard(a.id, a.id === '@player' ? 1.9 : 2.3);
        this.bills.set(a.id, b);
        this.spriteMats.add(b.mat);
        this.actors.add(b.group);
      }
      b.setArt(a.art ? { ...a.art, unit: a.art.unit * SPRITE_UNIT } : null);
      // むきの 絵は さきに つくっておく（あるきだしたとき ちらつかないように）
      if (a.poses) for (const ps of Object.values(a.poses)) loadArt({ ...ps, unit: ps.unit * SPRITE_UNIT });
      this.actorSpecs.set(a.id, a);
      // 名前
      let el = this.labels.get(a.id);
      if (a.label) {
        if (!el) { el = document.createElement('div'); el.className = 'i3d-label'; this.overlay.appendChild(el); this.labels.set(a.id, el); }
        if (el.textContent !== a.label) el.textContent = a.label;
      } else if (el) { el.remove(); this.labels.delete(a.id); }
      let em = this.emoteEls.get(a.id);
      if (a.emote) {
        if (!em) { em = document.createElement('div'); em.className = 'i3d-emote'; this.overlay.appendChild(em); this.emoteEls.set(a.id, em); }
        em.textContent = a.emote;
      } else if (em) { em.remove(); this.emoteEls.delete(a.id); }
    }
    this.applySky();
  }

  setUI(u: UiState) {
    const prevBubble = this.ui.bubble?.key;
    this.ui = u;
    if (u.jump && u.jump.key !== this.lastJumpKey) {
      this.lastJumpKey = u.jump.key;
      const b = this.bills.get(u.jump.id);
      if (b) b.jumpAt = this.now();
    }
    this.mail?.setFlag(u.unread > 0);
    if (this.chestM) this.chestM.obj.visible = u.chest;
    this.mailBadge.style.display = u.unread > 0 ? '' : 'none';
    this.mailBadge.textContent = String(u.unread);
    if (u.bubble) {
      if (u.bubble.key !== prevBubble) {
        this.bubbleEl.innerHTML = '';
        const box = document.createElement('div');
        box.className = 'i3d-bubble-in bubble-pop';
        box.textContent = u.bubble.text;
        this.bubbleEl.appendChild(box);
        if (u.bubble.heart) { const h = document.createElement('i'); h.textContent = '💗'; h.className = 'i3d-heart heart-float'; this.bubbleEl.appendChild(h); }
      }
      this.bubbleEl.style.display = '';
    } else this.bubbleEl.style.display = 'none';
    this.setWalkRing(u.showWalk);
  }

  private setWalkRing(on: boolean) {
    if (on && !this.walkRing) {
      const E = MAIN_WALK_ELLIPSE;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 160; i++) {
        const a = (i / 160) * Math.PI * 2;
        pts.push(new THREE.Vector3((E.cx + Math.cos(a) * E.rx) * 100, GRASS_H + 0.15, (E.cy + Math.sin(a) * E.ry) * 75));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, curved(new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 2, gapSize: 1.6 })));
      line.computeLineDistances();
      this.walkRing = line;
      this.scene.add(line);
    } else if (!on && this.walkRing) {
      this.scene.remove(this.walkRing);
      this.walkRing = null;
    }
  }

  // ── 空・時間・天気 ──
  setSky(tod: TimeOfDay, weather: Weather) {
    this.tod = tod;
    this.weather = weather;
    this.applySky();
  }

  private applySky() {
    this.cullDirty = true;
    const night = this.tod === 'night', eve = this.tod === 'evening';
    const gray = this.weather === 'cloudy' || this.weather === 'rain';
    const dim = gray ? 0.78 : 1;
    if (night) {
      this.hemi.color.set(0x8090d0); this.hemi.groundColor.set(0x1e2a50); this.hemi.intensity = 0.95;
      this.sun.color.set(0xa8b8ff); this.sun.intensity = 0.7;
    } else if (eve) {
      this.hemi.color.set(0xffd2b0); this.hemi.groundColor.set(0x6b5a4e); this.hemi.intensity = 1.35 * dim;
      this.sun.color.set(0xffb070); this.sun.intensity = 1.7 * dim;
    } else {
      this.hemi.color.set(0xe0f2ff); this.hemi.groundColor.set(0x6b8f4e); this.hemi.intensity = 1.5 * dim;
      this.sun.color.set(0xfff4e0); this.sun.intensity = 2.1 * dim;
    }
    const fog = night ? 0x27306b : eve ? 0xf6c9a8 : gray ? 0xc9d3dd : 0xcfeeff;
    (this.scene.fog as THREE.Fog).color.set(fog);
    const tint = night ? 0x9aa6dc : eve ? 0xffe0c8 : gray ? 0xe4e8ee : 0xffffff;
    for (const m of this.spriteMats) m.color.set(tint);
    windowMat.emissiveIntensity = night ? 1.1 : eve ? 0.45 : 0;
    lampMat.emissiveIntensity = night ? 1.2 : 0.25;
    this.seaMat.uniforms.uTint.value.set(night ? 0x5b6aa8 : eve ? 0xffd9c0 : gray ? 0xd6dde6 : 0xffffff);
    this.seaMat.uniforms.uFog.value.set(fog);
    for (const list of this.nightOnly.values()) for (const o of list) {
      o.visible = night || eve;
      o.traverse((c) => {
        const mm = (c as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
        if (mm && 'opacity' in mm) mm.opacity = night ? 0.2 : 0.08;
      });
    }
    // 夜の あかり
    this.glows.clear();
    if (night || eve) {
      for (const list of this.glowSpots.values()) for (const g of list) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(g.r * 2, g.r * 2), glowMat());
        m.position.copy(g.p);
        m.rotation.x = -0.65;
        (m.material as THREE.MeshBasicMaterial).opacity = night ? 0.9 : 0.4;
        this.glows.add(m);
      }
    }
    this.setPrecip();
  }

  private setPrecip() {
    const wantRain = this.weather === 'rain';
    const winter = this.season === 12 || this.season === 1 || this.season === 2;
    const wantSnow = winter && this.weather === 'cloudy';
    if (wantRain && !this.rain) {
      const n = 500;
      const pos = new Float32Array(n * 6);
      const R = rng(7);
      for (let i = 0; i < n; i++) {
        const x = (R() - 0.5) * 120, y = R() * 50, z = (R() - 0.5) * 100;
        pos.set([x, y, z, x - 0.3, y - 2.2, z], i * 6);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      this.rain = new THREE.LineSegments(geo, curved(new THREE.LineBasicMaterial({ color: 0xbfdbfe, transparent: true, opacity: 0.7 })));
      this.rain.frustumCulled = false;
      this.fx.add(this.rain);
    } else if (!wantRain && this.rain) { this.fx.remove(this.rain); this.rain = null; }
    if (wantSnow && !this.snow) {
      const n = 600;
      const pos = new Float32Array(n * 3);
      const R = rng(9);
      for (let i = 0; i < n; i++) pos.set([(R() - 0.5) * 120, R() * 50, (R() - 0.5) * 100], i * 3);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      this.snow = new THREE.Points(geo, curved(new THREE.PointsMaterial({ color: 0xffffff, size: 0.6, transparent: true, opacity: 0.9 })));
      this.snow.frustumCulled = false;
      this.fx.add(this.snow);
    } else if (!wantSnow && this.snow) { this.fx.remove(this.snow); this.snow = null; }
  }

  // ── タップ ──
  /** 画面の 位置 → 島の 位置（割合）。空なら null。キャラ・建物の 上なら その 場所 */
  pick(clientX: number, clientY: number): Pos | null {
    const r = this.canvas.getBoundingClientRect();
    const px = clientX - r.left, py = clientY - r.top;
    // キャラ・家具・建物
    let best: { d: number; tap: Pos } | null = null;
    const tmp = new THREE.Vector3();
    for (const [id, b] of this.bills) {
      if (id === '@player' || !b.mesh?.visible || !b.art) continue;   // 自分を タップしても その場に いるだけ なので 地面あつかい
      const g = b.group.position;
      const a = projectCurved(tmp.set(g.x - b.art.w * 0.4, g.y, g.z), this.camera, this.w, this.h);
      const c = projectCurved(tmp.set(g.x + b.art.w * 0.4, g.y + b.art.h * 0.95 * STAND, g.z), this.camera, this.w, this.h);
      if (px >= Math.min(a.x, c.x) && px <= Math.max(a.x, c.x) && py >= Math.min(a.y, c.y) && py <= Math.max(a.y, c.y)) {
        const spec = this.actorSpecs.get(id);
        const base = toPos(g.x, g.z);
        const tap = { x: base.x, y: base.y + (spec?.tapDy ?? 0) };
        if (!best || a.z < best.d) best = { d: a.z, tap };
      }
    }
    if (best) return best.tap;
    for (const list of this.hitBoxes.values()) for (const hb of list) {
      if (!this.boxVisible(hb)) continue;
      const pts = boxCorners(hb.box).map((v) => projectCurved(v, this.camera, this.w, this.h));
      const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
      if (px >= Math.min(...xs) && px <= Math.max(...xs) && py >= Math.min(...ys) && py <= Math.max(...ys)) {
        const d = Math.min(...pts.map((p) => p.z));
        if (!best || d < best.d) best = { d, tap: hb.tap };
      }
    }
    if (best) return best.tap;
    const w = this.groundAt(px, py);
    return w ? toPos(w.x, w.z) : null;
  }

  private boxVisible(hb: HitBox): boolean {
    if (this.chestM && hb.tap.x === CHEST_POS.x && hb.tap.y === CHEST_POS.y - 0.03) return this.ui.chest;
    return true;
  }

  /** まげた 地面と 視線の 交わる 点（世界） */
  private groundAt(px: number, py: number): THREE.Vector3 | null {
    const ndc = new THREE.Vector3((px / this.w) * 2 - 1, -(py / this.h) * 2 + 1, 0.5);
    const dir = ndc.applyMatrix4(this.camera.projectionMatrixInverse).normalize();   // カメラから 見た 向き
    const k = curve.value;
    const W = new THREE.Vector3();
    const f = (t: number) => {
      const vx = dir.x * t, vz = dir.z * t;
      const vy = dir.y * t + k * vz * vz;   // まげる前に もどす
      W.set(vx, vy, vz).applyMatrix4(this.camera.matrixWorld);
      return W.y - Math.max(groundH(W.x, W.z), 0);
    };
    let prev = 1, fp = f(prev);
    for (let t = 2; t < 500; t += 1.5) {
      const ft = f(t);
      if (fp > 0 && ft <= 0) {
        let lo = prev, hi = t;
        for (let i = 0; i < 14; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
        f(hi);
        return W.clone();
      }
      prev = t; fp = ft;
    }
    return null;
  }

  /** 2びょう みて、半分いじょうが 30fps より おそければ 解像度を 一段 下げる（1 まで）。タブ復帰の 大きな あきは 数えない */
  private adapt(raw: number) {
    if (raw > 0.5 || this.pixelRatio <= 1) return;
    this.sampleT += raw;
    if (raw > 1 / 30) this.slowT += raw;
    if (this.sampleT < 2) return;
    if (this.slowT > this.sampleT / 2) {
      this.pixelRatio = Math.max(1, this.pixelRatio - 0.25);
      this.renderer.setPixelRatio(this.pixelRatio);
      this.resize();
    }
    this.sampleT = 0; this.slowT = 0;
  }

  private now(): number { return (performance.now() - this.t0) / 1000; }

  // ── まいフレーム ──
  private loop = (tm: number) => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const raw = (tm - this.last) / 1000;
    const dt = Math.min(0.05, raw);
    this.last = tm;
    this.adapt(raw);
    const t = this.now();

    // キャラの 位置
    const lv = this.live;
    // 主人公は 建物・木の みきを すりぬけない（おしだす）
    {
      const p = lv.playerPos.current;
      let x = fx(p), z = fz(p), moved = false;
      for (const list of this.colliders.values()) for (const c of list) {
        let dx = x - c.x, dz = z - c.z, d = Math.hypot(dx, dz);
        if (d >= c.r) continue;
        if (d < 1e-3) { dx = 0; dz = 1; d = 1; }
        x = c.x + (dx / d) * c.r; z = c.z + (dz / d) * c.r; moved = true;
      }
      if (moved) {
        lv.playerPos.current = toPos(x, z);
        // 行き先が 建物・みきの 中なら、そこへは つけないので とまる
        const tg = lv.tapTarget?.current;
        if (tg) {
          const tx = fx(tg), tz = fz(tg);
          for (const list of this.colliders.values()) for (const c of list) if (Math.hypot(tx - c.x, tz - c.z) < c.r + 0.5) lv.tapTarget.current = null;
        }
      }
    }
    for (const [id, b] of this.bills) {
      const p = id === '@player' ? lv.playerPos.current : id === '@monster' ? lv.monsterPos.current : lv.friendPos.current[id];
      if (!p) { b.group.visible = false; continue; }
      b.group.visible = true;
      let y = GRASS_H;
      let sx = 1, sy = 1;
      if (id === '@player') {
        if (this.ui.walking) {
          const ph = lv.walkPhase.current;
          y += Math.abs(Math.sin(ph)) * 0.55;
          sy = 1 + Math.sin(ph * 2) * 0.03;
        } else sy = 1 + Math.sin(t * 2.2) * 0.012;
        const pose = lv.pose?.current ?? 'down_0';
        const ps = this.actorSpecs.get('@player')?.poses?.[pose];
        if (ps) b.setArt({ ...ps, unit: ps.unit * SPRITE_UNIT });
        sx = lv.flip.current && pose.startsWith('side') ? -1 : 1;   // まえ・うしろは かがみに しない
      } else {
        sy = 1 + Math.sin(t * 2 + id.length) * 0.015;
      }
      if (b.jumpAt >= 0) {
        const u = (t - b.jumpAt) / 0.55;
        if (u >= 1) b.jumpAt = -1; else y += Math.sin(u * Math.PI) * 2.0;
      }
      b.group.position.set(fx(p), y, fz(p));
      b.shadow.position.y = GRASS_H - y + 0.05;
      b.holder.scale.set(sx, sy * STAND, 1);
    }

    // カメラ
    const pp = lv.playerPos.current;
    const tx = fx(pp), tz = fz(pp);
    const k = 1 - Math.exp(-dt * 4.5);
    this.camTarget.x += (tx - this.camTarget.x) * k;
    this.camTarget.z += (tz - this.camTarget.z) * k;
    this.camera.position.set(this.camTarget.x, GRASS_H + CAM.up, this.camTarget.z + CAM.back);
    this.camera.lookAt(this.camTarget.x, GRASS_H, this.camTarget.z + CAM.look);
    this.camera.updateMatrixWorld();
    this.sun.target.position.set(this.camTarget.x, 0, this.camTarget.z);
    this.sun.position.set(this.camTarget.x - 40, 90, this.camTarget.z + 70);

    for (const list of this.ticks.values()) for (const fn of list) fn(t, dt);
    this.seaMat.uniforms.uTime.value = t;
    this.sea.position.set(Math.round(this.camTarget.x / 5) * 5, 0, Math.round(this.camTarget.z / 5) * 5 - 180);

    // 雨・雪は カメラの まわりで
    if (this.rain) {
      this.rain.position.set(this.camTarget.x, 0, this.camTarget.z);
      const a = this.rain.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < a.count; i += 2) {
        let y = a.getY(i) - dt * 40;
        if (y < 0) y += 50;
        a.setY(i, y); a.setY(i + 1, y - 2.2);
      }
      a.needsUpdate = true;
    }
    if (this.snow) {
      this.snow.position.set(this.camTarget.x, 0, this.camTarget.z);
      const a = this.snow.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < a.count; i++) {
        let y = a.getY(i) - dt * 4;
        if (y < 0) y += 50;
        a.setY(i, y);
        a.setX(i, a.getX(i) + Math.sin(t + i) * dt * 0.6);
      }
      a.needsUpdate = true;
    }

    if (this.cullDirty) {
      // 地平線を まげているので、画面の 上に はみ出して 見える ものも ある。見えない ものを はぶく 仕組みは つかわない
      this.scene.traverse((o) => { o.frustumCulled = false; });
      this.cullDirty = false;
    }
    // 主人公の 手前を すかす
    const me = this.bills.get('@player');
    if (me) {
      const g = me.group.position;
      const s = projectCurved(new THREE.Vector3(g.x, g.y + 3.2, g.z), this.camera, this.w, this.h);
      const pr = this.renderer.getPixelRatio();
      seeThru.value.set(s.x * pr, (this.h - s.y) * pr, s.z, (this.h * 0.085) * pr);
    }
    this.renderer.render(this.scene, this.camera);
    this.updateOverlay();
    if (this.onFirstFrame) { const f = this.onFirstFrame; this.onFirstFrame = null; f(); }
  };

  private updateOverlay() {
    const v = new THREE.Vector3();
    const place = (el: HTMLElement, x: number, y: number, z: number, show = true) => {
      const s = projectCurved(v.set(x, y, z), this.camera, this.w, this.h);
      const on = show && s.z > 0 && s.x > -80 && s.x < this.w + 80 && s.y > -60 && s.y < this.h + 60;
      el.style.visibility = on ? 'visible' : 'hidden';
      if (on) el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0)`;
      return s;
    };
    const top = (b: Billboard) => {
      const h = b.height();
      return { x: b.group.position.x, y: b.group.position.y + h, z: b.group.position.z };
    };
    // なまえ：ちかくの子と かさならないように 上へ ずらし、画面の はしで きれないように よこへ ずらす。
    // 大きさを ぜんぶ 読んでから 書く（読む・書くを まぜると 毎フレーム レイアウトが はしる）
    const tags: { el: HTMLDivElement; x: number; y: number; w: number; h: number }[] = [];
    for (const [id, el] of this.labels) {
      const b = this.bills.get(id);
      if (!b || !b.group.visible) { el.style.visibility = 'hidden'; continue; }
      const p = top(b);
      const s = projectCurved(v.set(p.x, p.y + 0.4, p.z), this.camera, this.w, this.h);
      if (!(s.z > 0 && s.x > -80 && s.x < this.w + 80 && s.y > -60 && s.y < this.h + 60)) { el.style.visibility = 'hidden'; continue; }
      tags.push({ el, x: s.x, y: s.y, w: el.offsetWidth, h: el.offsetHeight });
    }
    tags.sort((a, b) => b.y - a.y);   // 手前（画面の下）の子から 場所を きめる
    const done: typeof tags = [];
    for (const t of tags) {
      t.x = Math.max(t.w / 2 + 4, Math.min(this.w - t.w / 2 - 4, t.x));
      for (let n = 0; n < 6; n++) {
        const hit = done.find((d) => Math.abs(d.x - t.x) < (d.w + t.w) / 2 && Math.abs(d.y - t.y) < (d.h + t.h) / 2);
        if (!hit) break;
        t.y = hit.y - hit.h - 1;   // ラベルは 下はしが 基準（translate -100%）
      }
      done.push(t);
      t.el.style.visibility = 'visible';
      t.el.style.transform = `translate3d(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px, 0)`;
    }
    for (const [id, el] of this.emoteEls) {
      const b = this.bills.get(id);
      if (!b) continue;
      const p = top(b);
      place(el, p.x + 2.4, p.y - 0.6, p.z);
    }
    const bub = this.ui.bubble;
    if (bub) {
      const b = this.bills.get(bub.id);
      if (b) {
        const p = top(b);
        const s = place(this.bubbleEl, p.x, p.y + 2.6, p.z);
        // 画面の はしで きれないように
        const half = this.bubbleEl.offsetWidth / 2;
        const shift = Math.max(half + 6 - s.x, Math.min(0, this.w - half - 6 - s.x));
        this.bubbleEl.style.setProperty('--shift', `${shift}px`);
      } else this.bubbleEl.style.visibility = 'hidden';
    }
    if (this.ui.unread > 0) place(this.mailBadge, fx(MAIL_POS), GRASS_H + 8.2, fz(MAIL_POS));
  }
}

function boxCorners(b: THREE.Box3): THREE.Vector3[] {
  const out: THREE.Vector3[] = [];
  for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) out.push(new THREE.Vector3(x, y, z));
  return out;
}

// ── 海（あさい所は 水色、ふちに 白い なみ） ──
function makeSeaMat(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uCurve: curve,
      uTint: { value: new THREE.Color(0xffffff) },
      uFog: { value: new THREE.Color(0xcfeeff) },
      uC: { value: new THREE.Vector2(GROUND.cx, GROUND.cz) },
      uR: { value: new THREE.Vector2(GROUND.srx, GROUND.srz) },
      uIslets: {
        value: [
          new THREE.Vector4(fx(FOREST_ISLET), fz(FOREST_ISLET) + 1, 13.5, 9.5),
          new THREE.Vector4(fx(MOSHI_ISLET), fz(MOSHI_ISLET), 10, 7.2),
          new THREE.Vector4(134, -25, 9.5, 6.8),
        ],
      },
    },
    vertexShader: `
      uniform float uCurve;
      varying vec3 vW;
      varying float vDepth;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vec4 mvPosition = viewMatrix * w;
        mvPosition.y -= uCurve * mvPosition.z * mvPosition.z;
        vDepth = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uTint;
      uniform vec3 uFog;
      uniform vec2 uC;
      uniform vec2 uR;
      uniform vec4 uIslets[3];
      varying vec3 vW;
      varying float vDepth;
      void main() {
        float es = length((vW.xz - uC) / uR);
        float e2 = es;
        for (int i = 0; i < 3; i++) {
          float ei = length((vW.xz - uIslets[i].xy) / uIslets[i].zw);
          e2 = min(e2, ei);
        }
        vec3 shallow = vec3(0.37, 0.86, 0.88);
        vec3 mid = vec3(0.16, 0.62, 0.86);
        vec3 deep = vec3(0.10, 0.40, 0.74);
        vec3 col = mix(shallow, mid, smoothstep(0.98, 1.12, e2));
        col = mix(col, deep, smoothstep(1.15, 1.9, es));
        // きらきら
        float sp = sin(vW.x * 0.35 + uTime * 0.9) * sin(vW.z * 0.42 - uTime * 0.7);
        col += vec3(0.06) * smoothstep(0.75, 1.0, sp);
        // ふちの なみ
        float wv = 0.985 + 0.01 * sin(uTime * 1.3);
        float foam = smoothstep(0.012, 0.0, abs(e2 - wv)) + 0.55 * smoothstep(0.008, 0.0, abs(e2 - wv - 0.035 - 0.012 * sin(uTime * 1.3 + 1.5)));
        col = mix(col, vec3(1.0), clamp(foam, 0.0, 1.0) * 0.85);
        col *= uTint;
        float f = smoothstep(120.0, 260.0, vDepth);
        col = mix(col, uFog, f);
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }
    `,
  });
}
