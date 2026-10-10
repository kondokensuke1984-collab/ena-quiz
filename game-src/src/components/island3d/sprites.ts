// 3Dの島に立たせる「絵の板」。いまの SVG の絵（なかま・主人公・家具・はたけの作物）を そのまま画像にして テクスチャにする。
// - 足もとの かげ（rgba(0,0,0,…) の楕円）は 3D の かげと二重になるので けしてから 画像にする。
// - 絵の 大きさは getBBox で はかり、足もと（絵の いちばん下）を 地面に そろえる。
// - 同じ絵は 1回だけ つくる（key で キャッシュ）。

import * as THREE from 'three';

export interface SpriteArt {
  tex: THREE.Texture;
  geo: THREE.PlaneGeometry;   // 原点＝足もと
  w: number;                  // 世界での はば・たかさ
  h: number;
}

export interface ArtSpec {
  key: string;
  svg: string;                 // <svg> ひとつぶんの マークアップ
  unit: number;                // SVG の 1単位 → 世界の なん単位か
  anchorX: number;             // 足もとの x（SVG の 単位）
  maxPx?: number;              // テクスチャの たかさ（px）の 上限
  /** 画像の上に かきたす（きせかえの 絵文字など）。toPx は SVG の座標 → キャンバスの px */
  extra?: (ctx: CanvasRenderingContext2D, toPx: (ux: number, uy: number) => [number, number], pxPerUnit: number) => void;
}

const cache = new Map<string, Promise<SpriteArt | null>>();
let host: HTMLDivElement | null = null;

function hostEl(): HTMLDivElement {
  if (!host) {
    host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-10000px;top:0;width:400px;height:400px;overflow:hidden;visibility:hidden;pointer-events:none';
    document.body.appendChild(host);
  }
  return host;
}

const SHADOW_RE = /<ellipse[^>]*fill="rgba\(0,\s*0,\s*0,\s*0?\.\d+\)"[^>]*\/?>(<\/ellipse>)?/g;

/** 1つ ずつ じゅんばんに つくる（はかる場所を 使いまわすので） */
let queue: Promise<unknown> = Promise.resolve();

export function loadArt(spec: ArtSpec): Promise<SpriteArt | null> {
  const ck = spec.key + '@' + spec.unit.toFixed(4);   // 同じ絵でも 大きさが ちがえば べつ
  const hit = cache.get(ck);
  if (hit) return hit;
  const p = (queue = queue.then(() => build(spec)).catch(() => null)) as Promise<SpriteArt | null>;
  cache.set(ck, p);
  return p;
}

async function build(spec: ArtSpec): Promise<SpriteArt | null> {
  const markup = spec.svg.replace(SHADOW_RE, '');
  const h = hostEl();
  h.innerHTML = markup;
  const svg = h.querySelector('svg');
  if (!svg) return null;
  let bb: DOMRect;
  try { bb = svg.getBBox(); } catch { return null; }
  if (!bb.width || !bb.height) return null;
  const inner = svg.innerHTML;
  h.innerHTML = '';

  const pad = 4;
  const halfW = Math.max(spec.anchorX - bb.x, bb.x + bb.width - spec.anchorX) + pad;
  const x0 = spec.anchorX - halfW, uw = halfW * 2;
  const feetY = bb.y + bb.height;
  const y0 = bb.y - pad, uh = feetY + pad - y0;

  const maxPx = spec.maxPx ?? 300;
  const ppu = Math.min(maxPx / uh, 1024 / uw);
  const cw = Math.max(2, Math.round(uw * ppu)), ch = Math.max(2, Math.round(uh * ppu));
  const src = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${cw}" height="${ch}" viewBox="${x0} ${y0} ${uw} ${uh}">${inner}</svg>`;
  const img = new Image();
  img.decoding = 'async';
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src);
  try { await img.decode(); } catch { return null; }

  const canvas = document.createElement('canvas');
  canvas.width = cw; canvas.height = ch;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0, cw, ch);
  spec.extra?.(ctx, (ux, uy) => [(ux - x0) * ppu, (uy - y0) * ppu], ppu);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const w = uw * spec.unit, hh = uh * spec.unit;
  const foot = pad * spec.unit;   // 足もとから 下の よはく
  const geo = new THREE.PlaneGeometry(w, hh);
  geo.translate(0, hh / 2 - foot, 0);
  return { tex, geo, w, h: hh };
}

/** かんばんの 文字（キャンバスで かく） */
export function signArt(text: string, opts: { bg?: string; fg?: string; border?: string; size?: number } = {}): SpriteArt {
  const key = 'sign:' + text + JSON.stringify(opts);
  const done = signCache.get(key);
  if (done) return done;
  const fs = 44;
  const c = document.createElement('canvas');
  const font = `900 ${fs}px "Hiragino Maru Gothic ProN", "M PLUS Rounded 1c", system-ui, sans-serif`;
  const ctx = c.getContext('2d')!;
  ctx.font = font;
  const tw = Math.ceil(ctx.measureText(text).width);
  c.width = tw + 48; c.height = fs + 36;   // 大きさを かえると 文字の 設定が もどるので、あとで もう一度 入れる
  const g = c.getContext('2d')!;
  g.font = font;
  const r = 16;
  g.fillStyle = opts.bg ?? '#fef3c7';
  g.strokeStyle = opts.border ?? '#4c1d95';
  g.lineWidth = 6;
  g.beginPath();
  g.roundRect(4, 4, c.width - 8, c.height - 8, r);
  g.fill(); g.stroke();
  g.fillStyle = opts.fg ?? '#7c2d12';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, c.width / 2, c.height / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const k = (opts.size ?? 1) * 0.045;
  const w = c.width * k, h = c.height * k;
  const geo = new THREE.PlaneGeometry(w, h);
  geo.translate(0, h / 2, 0);
  const art = { tex, geo, w, h };
  signCache.set(key, art);
  return art;
}
const signCache = new Map<string, SpriteArt>();

/** 絵文字1つの 板（✨ など） */
export function emojiArt(ch: string, size = 3): SpriteArt {
  const key = 'emoji:' + ch + size;
  const done = signCache.get(key);
  if (done) return done;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  g.font = '100px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(ch, 64, 70);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const geo = new THREE.PlaneGeometry(size, size);
  geo.translate(0, size / 2, 0);
  const art = { tex, geo, w: size, h: size };
  signCache.set(key, art);
  return art;
}
