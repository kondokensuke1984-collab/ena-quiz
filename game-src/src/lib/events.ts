// きせつの イベント。ハロウィン（10/24〜10/31）と おたんじょうび。確認用に ?halloween=1・?birthday=1（localhost だけ）で いつでも出せる。

import { eventToday } from './detective';
import { timeOfDay } from './sky';
import type { PlayerKey } from '../types';

export function isHalloween(d = new Date()): boolean {
  if (new URLSearchParams(location.search).get('halloween') === '1') return true;
  return d.getMonth() === 9 && d.getDate() >= 24;
}

/** ハロウィンの ばん（夕方と夜）。かそう・おかし・ランタンが光るのは このとき */
export function halloweenNight(d = new Date()): boolean {
  return isHalloween(d) && timeOfDay(d) !== 'day';
}

// おたんじょうび：2026-11-10 は ゆうせいの おたんじょうび。その日だけ 島が おまつりに なる（今年だけ・ケンさんの とくべつ）
const BIRTHDAY = { y: 2026, m: 11, d: 10, who: 'yusei' as PlayerKey };
export const BIRTHDAY_NAME = 'ゆうせい';
export const BIRTHDAY_GIFT = 'fn_birthday_yusei_2026';

/** ふうせんの いち（2D と 3D で おなじ。1000×750 の px） */
export const BIRTHDAY_BALLOONS_MAIN: [number, number][] = [[335, 470], [705, 470], [900, 520]];
export const BIRTHDAY_BALLOONS_EAST: [number, number][] = [[500, 300], [200, 620], [640, 640]];

export function isBirthday(d = eventToday()): boolean {
  if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).get('birthday') === '1') return true;
  return d.getFullYear() === BIRTHDAY.y && d.getMonth() + 1 === BIRTHDAY.m && d.getDate() === BIRTHDAY.d;
}

/** きょうが この子の おたんじょうびか（島の 入口と プレゼントで つかう） */
export function isBirthdayOf(player: PlayerKey | null): boolean {
  return player === BIRTHDAY.who && isBirthday();
}

const COSTUMES = ['👻', '🧙', '🦇', '🎃'];
/** キャラごとに きまった かそう（毎年おなじ） */
export function costumeOf(charKey: string): string {
  let h = 0;
  for (const c of charKey) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return COSTUMES[h % COSTUMES.length];
}
