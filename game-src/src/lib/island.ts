// 島の座標系と移動。
// 島は論理サイズ 1000 x 750 の固定フィールド。セーブには 0..1 の割合で入れる。

import type { Pos } from '../types';
import { clamp } from './monster';

export const ISLAND_W = 1000;
export const ISLAND_H = 750;

/** 歩ける範囲（割合）。外周は海と砂浜なので少し内側に寄せる */
export const BOUNDS = { minX: 0.08, maxX: 0.92, minY: 0.30, maxY: 0.88 };

export const PLAYER_SPEED = 0.42;   // 画面の割合 / 秒
export const MONSTER_SPEED = 0.10;
export const NEAR_DIST = 0.13;      // このくらい近づいたら話しかけられる
export const ARRIVE_DIST = 0.008;

export function clampToIsland(p: Pos): Pos {
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
