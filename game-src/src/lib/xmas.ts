// イベント「クリスマス」：2026-12-01〜12-25。島の ツリーに かざりを ふやして、サンタを まつ。
//   ・その日 クイズを 5もん やると「かざりつけ」できる（かざり +1・1日1かい）
//   ・もっている プレゼント（なかまに あげる ものと おなじ）を サンタの ふくろに いれると かざり +1（1日2こまで）
//   ・かざりが 6で トナカイの カチューシャ、12で しょうごう
// メダルは ふやさない。

import { dateKey } from './study';
import { eventToday } from './detective';

export const XMAS_START = '2026-12-1';
export const XMAS_END = '2026-12-25';
export const XMAS_TITLE = 'クリスマス めいじん';
export const XMAS_GOAL = 12;
export const GIFT_PER_DAY = 2;

/** ごほうび（かざりの かず → もらえる もの）。さいごで しょうごう */
export const XMAS_REWARDS: { at: number; item: string }[] = [
  { at: 6, item: 'fw_xhat' },
];

/** ツリーに つく かざり（かざりの かず ぶんだけ 上から じゅんに ひょうじ） */
export const ORNAMENTS: { x: number; y: number; c: string }[] = [
  { x: 0, y: -86, c: '#fde047' }, { x: -10, y: -64, c: '#ef4444' }, { x: 11, y: -58, c: '#3b82f6' },
  { x: -20, y: -42, c: '#f59e0b' }, { x: 2, y: -40, c: '#ec4899' }, { x: 22, y: -34, c: '#ef4444' },
  { x: -28, y: -22, c: '#3b82f6' }, { x: -8, y: -20, c: '#fde047' }, { x: 14, y: -18, c: '#a855f7' },
  { x: 28, y: -14, c: '#fde047' }, { x: -18, y: -10, c: '#ef4444' }, { x: 6, y: -8, c: '#3b82f6' },
];

function parse(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function dayOnly(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function xmasActive(now = eventToday()): boolean {
  const t = dayOnly(now);
  return t >= parse(XMAS_START).getTime() && t <= parse(XMAS_END).getTime();
}

/** のこりの 日数（さいごの 日は 0） */
export function xmasDaysLeft(now = eventToday()): number {
  return Math.round((parse(XMAS_END).getTime() - dayOnly(now)) / 86400000);
}

export function xmasDay(now = eventToday()): string {
  return dateKey(now);
}
