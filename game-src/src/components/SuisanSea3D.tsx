// しゅっこうの 3D の海。あそびの ロジックは SuisanVoyage に あって、ここは 「見せる」だけ。
// 2D の座標（x＝よこ、y＝おく行き）を そのまま 3D の（x, z）に 置く。1 ＝ 世界の 10px。
// かるさを だいじに：ポリゴンは すくなめ・影なし・ぼかしは なし。three.js は おおきいので あとから 読みこむ（React.lazy）。

import { memo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PORT_X, WORLD_H, WORLD_W, ZONES, type Spot } from '../lib/suisanVoyage';
import { STAGE_BY_ID } from '../lib/suisan';

export interface SeaView {
  x: number; y: number; face: 1 | -1;
  spots: Spot[];
  phase: 'sail' | 'fish';
  spot: number | null;
}
export interface SeaCtl { isOpen(zoneId: string): boolean; nearId: number | null; boat: 'small' | 'mid' | 'big' }

const K = 0.1;
const SEA_X0 = -30, SEA_X1 = WORLD_W * K + 30;
const SEA_Z0 = -26, SEA_Z1 = WORLD_H * K + 26;
const ZONE_COL: Record<string, number> = { near: 0x4fc3f7, eez: 0x1e88e5, high: 0x0b4f9c };

const mat = (c: number) => new THREE.MeshLambertMaterial({ color: c, flatShading: true });

function textSprite(text: string, color = '#ffffff', size = 64): THREE.Sprite {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 128;
  const ctx = cv.getContext('2d')!;
  ctx.font = `900 ${size}px "Hiragino Sans", "Noto Sans JP", sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(8,47,73,.85)'; ctx.lineJoin = 'round';
  ctx.strokeText(text, 256, 66);
  ctx.fillStyle = color; ctx.fillText(text, 256, 66);
  const tex = new THREE.CanvasTexture(cv);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, fog: false }));
  sp.scale.set(10, 2.5, 1);
  return sp;
}

/** 立て看板：まだ 出られない 海域の 入口に ならべる（どうやれば 行けるかを 書く） */
function signBoard(title: string, l1: string, l2: string): THREE.Group {
  const cv = document.createElement('canvas');
  cv.width = 640; cv.height = 320;
  const ctx = cv.getContext('2d')!;
  const rr = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
    ctx.fill();
  };
  ctx.fillStyle = '#b45309';
  rr(8, 8, 624, 304, 36);
  ctx.fillStyle = '#fef3c7';
  rr(26, 26, 588, 268, 26);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '900 54px "Hiragino Sans", "Noto Sans JP", sans-serif';
  ctx.fillStyle = '#7c2d12'; ctx.fillText(title, 320, 82);
  ctx.font = '800 40px "Hiragino Sans", "Noto Sans JP", sans-serif';
  ctx.fillStyle = '#1e3a8a'; ctx.fillText(l1, 320, 170);
  ctx.fillStyle = '#047857'; ctx.fillText(l2, 320, 232);
  const tex = new THREE.CanvasTexture(cv);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 3.6), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, fog: false }));
  board.position.y = 4.1;
  const postM = mat(0x92400e);
  const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.2, 0.28), postM); p1.position.set(-2.4, 1.5, -0.05);
  const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 3.2, 0.28), postM); p2.position.set(2.4, 1.5, -0.05);
  const g = new THREE.Group();
  g.add(p1, p2, board);
  return g;
}

function buildBoat(kind: 'small' | 'mid' | 'big'): THREE.Group {
  const g = new THREE.Group();
  const L = kind === 'small' ? 3.4 : kind === 'mid' ? 4.6 : 6.2;
  const W = kind === 'small' ? 1.4 : kind === 'mid' ? 1.9 : 2.5;
  const hullC = kind === 'small' ? 0xffffff : kind === 'mid' ? 0x1d4ed8 : 0x475569;
  const hull = new THREE.Mesh(new THREE.BoxGeometry(L, 0.9, W), mat(hullC));
  hull.position.y = 0.35;
  const bow = new THREE.Mesh(new THREE.ConeGeometry(W / 2, 1.4, 4), mat(hullC));
  bow.rotation.z = -Math.PI / 2; bow.rotation.x = Math.PI / 4;
  bow.position.set(L / 2 + 0.55, 0.35, 0);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(L + 0.04, 0.22, W + 0.04), mat(kind === 'small' ? 0xef4444 : 0xf8fafc));
  stripe.position.y = 0.58;
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(L * 0.28, 0.9, W * 0.7), mat(0xfef3c7));
  cabin.position.set(-L * 0.12, 1.2, 0);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(L * 0.32, 0.18, W * 0.78), mat(0xdc2626));
  roof.position.set(-L * 0.12, 1.72, 0);
  g.add(hull, bow, stripe, cabin, roof);
  if (kind !== 'small') {
    const cab2 = new THREE.Mesh(new THREE.BoxGeometry(L * 0.22, 0.8, W * 0.6), mat(0xe0f2fe));
    cab2.position.set(-L * 0.12, 2.0, 0);
    const fun = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 1.0, 8), mat(0xf59e0b));
    fun.position.set(-L * 0.3, 2.0, 0);
    g.add(cab2, fun);
  }
  if (kind === 'big') {
    const crane = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 0.12), mat(0xfacc15));
    crane.position.set(L * 0.28, 1.8, 0);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.1, 0.1), mat(0xfacc15));
    arm.position.set(L * 0.28 + 0.8, 2.8, 0);
    g.add(crane, arm);
  }
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 5), mat(0x78350f));
  mast.position.set(L * 0.28, 1.5, 0);
  g.add(mast);
  g.scale.setScalar(0.95);
  return g;
}

interface SpotObj { id: number; group: THREE.Group; ring: THREE.Mesh; bubbles: THREE.Mesh[]; dots: THREE.Mesh[] }

function buildSpot(p: Spot): SpotObj {
  const group = new THREE.Group();
  group.position.set(p.x * K, 0, p.y * K);
  const ring = new THREE.Mesh(new THREE.RingGeometry(2.0, 2.7, 28), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide, fog: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.08;
  const disc = new THREE.Mesh(new THREE.CircleGeometry(2.0, 24), new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.35, side: THREE.DoubleSide, fog: false }));
  disc.rotation.x = -Math.PI / 2; disc.position.y = 0.06;
  group.add(ring, disc);
  const bubbles: THREE.Mesh[] = [];
  for (let i = 0; i < 7; i++) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.22 + (i % 3) * 0.08, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, fog: false }));
    b.userData = { a: Math.random() * 6.28, r: 0.4 + Math.random() * 1.5, ph: Math.random() };
    group.add(b); bubbles.push(b);
  }
  const dots: THREE.Mesh[] = [];
  for (let i = 0; i < p.left; i++) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), new THREE.MeshBasicMaterial({ color: 0xfbbf24, fog: false }));
    d.position.set((i - (p.left - 1) / 2) * 0.7, 2.6, 0);
    group.add(d); dots.push(d);
  }
  return { id: p.id, group, ring, bubbles, dots };
}

function SeaViewImpl({ sRef, ctl, onFail }: { sRef: React.MutableRefObject<SeaView>; ctl: React.MutableRefObject<SeaCtl>; onFail(): void }) {
  const host = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = host.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'default' });
    } catch { onFail(); return; }
    const touch = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, touch ? 1.75 : 2));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';

    const scene = new THREE.Scene();
    const skyC = new THREE.Color(0xcdeeff);
    scene.background = skyC;
    scene.fog = new THREE.Fog(skyC, 38, 92);
    const cam = new THREE.PerspectiveCamera(46, 1, 0.5, 200);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x4b79a1, 1.05));
    const sun = new THREE.DirectionalLight(0xfff4d6, 1.15);
    sun.position.set(-20, 40, 14);
    scene.add(sun);

    // ── 海（なみ） ──
    const sw = SEA_X1 - SEA_X0, sh = SEA_Z1 - SEA_Z0;
    const segX = 90, segZ = 28;
    const seaGeo = new THREE.PlaneGeometry(sw, sh, segX, segZ);
    seaGeo.rotateX(-Math.PI / 2);
    const pos = seaGeo.attributes.position as THREE.BufferAttribute;
    const base: number[] = [];
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    const tmpA = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i) + (SEA_X0 + SEA_X1) / 2;
      pos.setX(i, x);
      pos.setZ(i, pos.getZ(i) + (SEA_Z0 + SEA_Z1) / 2);
      base.push(x);
      const wx = x / K;
      const z = ZONES.find((zz) => wx < zz.x1) ?? ZONES[ZONES.length - 1];
      c.set(ZONE_COL[z.id]);
      // ざいの ならびめを なめらかに
      const nz = ZONES[ZONES.indexOf(z) + 1];
      if (nz) { const t = Math.min(1, Math.max(0, (wx - (z.x1 - 40)) / 40)); tmpA.set(ZONE_COL[nz.id]); c.lerp(tmpA, t); }
      colors.set([c.r, c.g, c.b], i * 3);
    }
    seaGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const sea = new THREE.Mesh(seaGeo, new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true }));
    scene.add(sea);

    // ── 陸と 漁港 ──
    const landW = PORT_X * K - 1.4 - SEA_X0;
    const land = new THREE.Mesh(new THREE.BoxGeometry(landW, 1.2, sh), mat(0x86c232));
    land.position.set(SEA_X0 + landW / 2, 0.1, (SEA_Z0 + SEA_Z1) / 2);
    const sand = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, sh), mat(0xf2d79b));
    sand.position.set(SEA_X0 + landW + 0.9, 0.05, (SEA_Z0 + SEA_Z1) / 2);
    scene.add(land, sand);
    const portZ = (WORLD_H / 2) * K;
    const house = new THREE.Group();
    const hb = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.6, 3.4), mat(0xfde68a));
    hb.position.y = 1.3;
    const hr = new THREE.Mesh(new THREE.ConeGeometry(3.4, 2, 4), mat(0xef4444));
    hr.position.y = 3.6; hr.rotation.y = Math.PI / 4;
    house.add(hb, hr);
    house.position.set(1.5, 0.7, portZ - 3.4);
    scene.add(house);
    const pier = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.4, 2.2), mat(0xa16207));
    pier.position.set(PORT_X * K - 3.2, 0.25, portZ);
    scene.add(pier);
    const portLabel = textSprite('漁港', '#fef9c3', 70);
    portLabel.scale.set(7, 1.75, 1); portLabel.position.set(1.5, 7, portZ - 3.4);
    scene.add(portLabel);
    for (let i = 0; i < 9; i++) {
      const t = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.28, 1.2, 6), mat(0x92400e));
      trunk.position.y = 0.6;
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.6, 7), mat(0x2f9e44));
      leaf.position.y = 2.1;
      t.add(trunk, leaf);
      t.position.set(SEA_X0 + 3 + ((i * 37) % 11) * 0.9, 0.7, SEA_Z0 + 3 + ((i * 53) % 100) / 100 * (sh - 6));
      if (Math.abs(t.position.z - portZ) > 6) scene.add(t);
    }

    // ── 海域の ふち（ブイ）と 名前 ──
    const buoyMat = mat(0xffffff), buoyRed = mat(0xef4444);
    const locks: { id: string; veil: THREE.Mesh; signs: THREE.Object3D[] }[] = [];
    ZONES.forEach((z, zi) => {
      const mid = ((z.x0 + z.x1) / 2) * K;
      const label = textSprite(z.gyogyo, '#ffffff', 74);
      label.position.set(mid, 5.2, SEA_Z0 + 8);
      scene.add(label);
      const sub = textSprite(z.trip, '#fef08a', 58);
      sub.scale.set(7, 1.75, 1); sub.position.set(mid, 3.4, SEA_Z0 + 8);
      scene.add(sub);
      if (zi < ZONES.length - 1) {
        for (let k = 0; k < 18; k++) {
          const b = new THREE.Mesh(new THREE.SphereGeometry(0.34, 8, 6), k % 2 ? buoyRed : buoyMat);
          b.position.set(z.x1 * K, 0.25, (-6 + k * ((WORLD_H * K + 12) / 17)));
          b.userData.bob = k;
          scene.add(b);
        }
      }
      // まだ 出られない 海域は くらく かぶせる
      const veil = new THREE.Mesh(
        new THREE.BoxGeometry((z.x1 - z.x0) * K, 6, sh),
        new THREE.MeshBasicMaterial({ color: 0x0f172a, transparent: true, opacity: 0.4, depthWrite: false, fog: false }));
      veil.position.set(mid, 3, (SEA_Z0 + SEA_Z1) / 2);
      scene.add(veil);
      const signs: THREE.Object3D[] = [];
      if (z.needs) {
        const st = STAGE_BY_ID[z.needs];
        for (const sz of [4.5, 13.5, 22.5]) {
          const sg = signBoard(`🔒 ${z.gyogyo}の 海`, `ステージ「${st ? st.name : z.needs}」を`, 'クリアすると 行けるよ！');
          sg.position.set(z.x0 * K + 3.2, 0.1, sz);
          scene.add(sg); signs.push(sg);
        }
      }
      locks.push({ id: z.id, veil, signs });
    });

    // ── 船 ──
    let boatKind = ctl.current.boat;
    let boat = buildBoat(boatKind);
    const boatRoot = new THREE.Group();
    boatRoot.add(boat);
    scene.add(boatRoot);
    const wake = new THREE.Mesh(new THREE.CircleGeometry(1, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, fog: false }));
    wake.rotation.x = -Math.PI / 2; wake.position.y = 0.05; wake.scale.set(3.4, 1.4, 1);
    boatRoot.add(wake);
    const hookLine = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 4, 4), new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }));
    hookLine.visible = false;
    scene.add(hookLine);

    // ── 漁場 ──
    let spotKey: Spot[] | null = null;
    let spotObjs: SpotObj[] = [];
    const syncSpots = (list: Spot[]) => {
      for (const o of spotObjs) scene.remove(o.group);
      spotObjs = list.map(buildSpot);
      for (const o of spotObjs) scene.add(o.group);
      spotKey = list;
    };

    // ── 大きさ ──
    const resize = () => {
      const w = el.clientWidth || 340, h = el.clientHeight || 270;
      renderer.setSize(w, h, false);
      cam.aspect = w / h; cam.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // ── ループ ──
    let raf = 0, t0 = performance.now();
    let heading = 0, lastX = sRef.current.x, lastZ = sRef.current.y * K;
    let camX = lastX * K, camZ = lastZ;
    const buoys: THREE.Object3D[] = [];
    scene.traverse((o) => { if (o.userData.bob !== undefined) buoys.push(o); });

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const t = (now - t0) / 1000;
      const s = sRef.current, cc = ctl.current;
      if (cc.boat !== boatKind) {
        boatRoot.remove(boat);
        boatKind = cc.boat; boat = buildBoat(boatKind); boatRoot.add(boat);
      }
      // なみ
      for (let i = 0; i < pos.count; i++) {
        const x = base[i], z = pos.getZ(i);
        pos.setY(i, Math.sin(x * 0.5 + t * 1.5) * 0.16 + Math.cos(z * 0.6 + t * 1.2) * 0.13);
      }
      pos.needsUpdate = true;
      // 船
      const bx = s.x * K, bz = s.y * K;
      const dx = bx - lastX, dz = bz - lastZ;
      if (Math.hypot(dx, dz) > 0.002) {
        const target = Math.atan2(-dz, dx);
        let d = target - heading;
        while (d > Math.PI) d -= Math.PI * 2;
        while (d < -Math.PI) d += Math.PI * 2;
        heading += d * 0.18;
      }
      lastX = bx; lastZ = bz;
      boatRoot.position.set(bx, 0.12 + Math.sin(t * 2.2) * 0.09, bz);
      boatRoot.rotation.y = heading;
      boat.rotation.z = Math.sin(t * 1.7) * 0.04;
      boat.rotation.x = Math.cos(t * 1.4) * 0.03;
      wake.position.x = -2.4;
      // 漁場
      if (spotKey !== s.spots) syncSpots(s.spots);
      hookLine.visible = false;
      for (let i = 0; i < spotObjs.length; i++) {
        const o = spotObjs[i], sp = s.spots[i];
        const open = cc.isOpen(ZONES.find((z) => sp.x < z.x1)?.id ?? 'high');
        o.group.visible = open;
        if (!open) continue;
        const empty = sp.left <= 0;
        const near = cc.nearId === sp.id || s.spot === sp.id;
        (o.ring.material as THREE.MeshBasicMaterial).opacity = empty ? 0.12 : near ? 0.95 : 0.55 + Math.sin(t * 3 + i) * 0.12;
        o.ring.scale.setScalar(near ? 1.12 + Math.sin(t * 6) * 0.05 : 1);
        (o.ring.material as THREE.MeshBasicMaterial).color.set(near ? 0xfbbf24 : 0xffffff);
        for (const b of o.bubbles) {
          b.visible = !empty;
          const u = b.userData as { a: number; r: number; ph: number };
          const k = (t * 0.45 + u.ph) % 1;
          b.position.set(Math.cos(u.a + t * 0.4) * u.r, 0.2 + k * 2.3, Math.sin(u.a + t * 0.4) * u.r);
          (b.material as THREE.MeshBasicMaterial).opacity = 0.9 * (1 - k);
        }
        o.dots.forEach((d, di) => { d.visible = di < sp.left; d.position.y = 3.0 + Math.sin(t * 2 + di) * 0.12; });
        if (s.spot === sp.id && s.phase === 'fish') {
          hookLine.visible = true;
          hookLine.position.set(sp.x * K, 1.2 + Math.sin(t * 8) * 0.2, sp.y * K);
        }
      }
      for (const b of buoys) b.position.y = 0.25 + Math.sin(t * 2 + b.userData.bob) * 0.1;
      for (const l of locks) { const open = cc.isOpen(l.id); l.veil.visible = !open; for (const sg of l.signs) sg.visible = !open; }
      // カメラ：船の 少し おく・上から（十字キーの 上＝おく）
      camX += (bx + 3 - camX) * 0.1;
      camZ += (bz - camZ) * 0.1;
      cam.position.set(camX - 1, 15, camZ + 17);
      cam.lookAt(camX + 1, 0, camZ - 2.5);
      renderer.render(scene, cam);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mm = m.material as THREE.Material | THREE.Material[] | undefined;
        (Array.isArray(mm) ? mm : mm ? [mm] : []).forEach((x) => { (x as THREE.SpriteMaterial).map?.dispose?.(); x.dispose(); });
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={host} className="mb-1.5 w-full select-none overflow-hidden rounded-2xl shadow ring-1 ring-black/10" style={{ aspectRatio: '340 / 270', background: '#cdeeff' }} />;
}

const SuisanSea3D = memo(SeaViewImpl);
export default SuisanSea3D;
