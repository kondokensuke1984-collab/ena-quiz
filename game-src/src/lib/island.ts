// 島の座標系と移動。
// 位置は 1000 x 750 の枠に対する割合で持つ（セーブもこの単位）。
// main（アンリノ島）は 2026-09-22 に土地を広げた：割合は 0..1 の外（x −0.3〜1.3、y −0.35〜1.45）まで使う。
// いまある座標は 1つも動かしていない（今の島が 大きな島の まんなかに そのまま残る）。画面は カメラで スクロールする。

import type { Pos } from '../types';
import { clamp } from './monster';

export const ISLAND_W = 1000;
export const ISLAND_H = 750;

/** main の世界の大きさ（px。1000x750 の枠の外まで ある）。カメラは この中だけ動く */
export const WORLD = { x: -300, y: -260, w: 1600, h: 1360 };
/** main の島の形（px）。砂浜・芝の楕円と、歩ける楕円 */
export const MAIN_GROUND = { cx: 500, cy: 430, sandRx: 740, sandRy: 590, grassRx: 690, grassRy: 540 };
const MAIN_WALK = { cx: 0.5, cy: 430 / 750, rx: 0.64, ry: 490 / 750 };   // 割合
let WALK: typeof MAIN_WALK | null = null;

/** 歩ける範囲（割合）。外周は海と砂浜なので少し内側に寄せる。
 *  建物を建てると島が広がる（expansion 0..2）。今の大きさが最小なので、置いた家具が外に出ることはない */
const BOUNDS_BY_EXP = [
  { minX: 0.08, maxX: 0.92, minY: 0.30, maxY: 0.88 },
  { minX: 0.06, maxX: 0.94, minY: 0.27, maxY: 0.90 },
  { minX: 0.05, maxX: 0.95, minY: 0.25, maxY: 0.91 },
];
export let BOUNDS = BOUNDS_BY_EXP[0];
export function setExpansion(level: number): void {
  BOUNDS = BOUNDS_BY_EXP[Math.max(0, Math.min(BOUNDS_BY_EXP.length - 1, level | 0))];
}
/** main の歩ける範囲（楕円を かこむ四角。置く・動かすモードの ふちどりにも使う） */
const BOUNDS_MAIN = {
  minX: MAIN_WALK.cx - MAIN_WALK.rx, maxX: MAIN_WALK.cx + MAIN_WALK.rx,
  minY: MAIN_WALK.cy - MAIN_WALK.ry, maxY: MAIN_WALK.cy + MAIN_WALK.ry,
};

/** 場所ごとの歩ける範囲。house＝部屋の ゆか、school＝きょうしつの ゆか、east＝となりの島 */
const BOUNDS_SCHOOL = { minX: 0.08, maxX: 0.92, minY: 0.58, maxY: 0.92 };
const BOUNDS_HOUSE = { minX: 0.08, maxX: 0.92, minY: 0.56, maxY: 0.92 };
const BOUNDS_EAST = { minX: 0.08, maxX: 0.9, minY: 0.3, maxY: 0.88 };
export function setArea(area: 'main' | 'east' | 'house' | 'school', _expansion?: number): void {
  WALK = area === 'main' ? MAIN_WALK : null;
  if (area === 'house') BOUNDS = BOUNDS_HOUSE;
  else if (area === 'school') BOUNDS = BOUNDS_SCHOOL;
  else if (area === 'east') BOUNDS = BOUNDS_EAST;
  else BOUNDS = BOUNDS_MAIN;   // 土地を広げたので、main は いつも いちばん広い形
}
/** いまの場所が main（広い島・カメラあり）か */
export function isWideArea(): boolean { return WALK !== null; }
export const MAIN_WALK_ELLIPSE = MAIN_WALK;

/** 行き来する場所（割合）。はいり口に近づくとボタンが出る */
export const DOORS = {
  mainToHouse: { x: 0.2, y: 0.45 },      // おうちの 戸口
  houseToMain: { x: 0.14, y: 0.6 },      // 部屋の ドア
  mainToEast: { x: 1.12, y: 0.6 },       // はしの たもと（main の右の海岸）
  eastToMain: { x: 0.09, y: 0.6 },       // はしの たもと（east の左はし）
  mainToSchool: { x: 0.64, y: 0.39 },    // がっこうの 戸口
  schoolToMain: { x: 0.86, y: 0.62 },    // きょうしつの ドア（右）
};
export const ENTRY = {
  house: { x: 0.2, y: 0.68 },
  mainFromHouse: { x: 0.2, y: 0.5 },
  east: { x: 0.14, y: 0.6 },
  mainFromEast: { x: 1.07, y: 0.6 },
  school: { x: 0.8, y: 0.7 },
  mainFromSchool: { x: 0.64, y: 0.44 },
};

/** 芝と砂浜の大きさ（段階ごと） */
export const GROUND_BY_EXP = [
  { cy: 0.62, sandRx: 0.47, sandRy: 0.40, grassRx: 0.415, grassRy: 0.335 },
  { cy: 0.615, sandRx: 0.49, sandRy: 0.425, grassRx: 0.445, grassRy: 0.365 },
  { cy: 0.61, sandRx: 0.50, sandRy: 0.44, grassRx: 0.465, grassRy: 0.385 },
];

export const PLAYER_SPEED = 0.42;   // 画面の割合 / 秒
export const MONSTER_SPEED = 0.10;
export const NEAR_DIST = 0.13;      // このくらい近づいたら話しかけられる
export const ARRIVE_DIST = 0.008;

export function clampToIsland(p: Pos): Pos {
  if (WALK) {
    // main は 楕円の中に おさえる（四角だと 角が 海に なる）
    const x = Number.isFinite(p.x) ? p.x : WALK.cx, y = Number.isFinite(p.y) ? p.y : WALK.cy;
    const dx = (x - WALK.cx) / WALK.rx, dy = (y - WALK.cy) / WALK.ry;
    const d = Math.hypot(dx, dy);
    if (d <= 1) return { x, y };
    return { x: WALK.cx + (dx / d) * WALK.rx * 0.999, y: WALK.cy + (dy / d) * WALK.ry * 0.999 };
  }
  return {
    x: clamp(p.x, BOUNDS.minX, BOUNDS.maxX),
    y: clamp(p.y, BOUNDS.minY, BOUNDS.maxY),
  };
}

export function toPx(p: Pos): { x: number; y: number } {
  return { x: p.x * ISLAND_W, y: p.y * ISLAND_H };
}

/** 縦横の比率が違うので、距離は見た目に合わせて y を縮めて測る */
export function dist(a: Pos, b: Pos): number {
  const dx = a.x - b.x;
  const dy = (a.y - b.y) * (ISLAND_H / ISLAND_W);
  return Math.hypot(dx, dy);
}

export function isNear(a: Pos, b: Pos, within = NEAR_DIST): boolean {
  return dist(a, b) <= within;
}

/** from から to へ dt 秒ぶん進む。到着していたら arrived を立てる */
export function stepToward(from: Pos, to: Pos, speed: number, dt: number): { pos: Pos; arrived: boolean } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len <= ARRIVE_DIST) return { pos: to, arrived: true };

  const move = speed * dt;
  if (move >= len) return { pos: to, arrived: true };

  return { pos: { x: from.x + (dx / len) * move, y: from.y + (dy / len) * move }, arrived: false };
}

/** 十字キーの入力ぶん動かす */
export function stepByAxis(from: Pos, ax: number, ay: number, speed: number, dt: number): Pos {
  const len = Math.hypot(ax, ay);
  if (len === 0) return from;
  const move = speed * dt;
  return clampToIsland({ x: from.x + (ax / len) * move, y: from.y + (ay / len) * move });
}

/** モンスターのうろうろ先。いまの場所の近くをランダムに選ぶ */
export function wanderTarget(from: Pos): Pos {
  const angle = Math.random() * Math.PI * 2;
  const r = 0.08 + Math.random() * 0.16;
  return clampToIsland({ x: from.x + Math.cos(angle) * r, y: from.y + Math.sin(angle) * r * 0.7 });
}

/** 奥にいるものから先に描くと、前後関係が自然に出る（当たり判定なしで奥行きが手に入る） */
export function bySortY<T extends { y: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.y - b.y);
}
