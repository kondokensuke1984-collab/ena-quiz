// クイズアプリ（index.html）の「教科キャラ」の、いまの姿を読むだけのモジュール。
//
// ★'ena_island_friends_v1' は読み取り専用。書き込むのはクイズ側の publishIslandFriends() だけ。
//   クイズ側が ⭐完璧の数から Lv・★ を計算して書き出すので、島では計算し直さない。
//
// 形： { v:1, currentMonth:'202609', updatedAt, friends:[{ month, monthLabel, cat, catLabel, char, name, level, stars, fill, levelName, n, total }] }
//   currentMonth の子が「主役」、それより前（や先）の月の子は「住人」。

import { CHAR_NAMES, type CharKey } from './chars';
import { readJSON, writeJSON } from './storage';

const FRIENDS_KEY = 'ena_island_friends_v1';
/** 島側の持ち物。「前に島で見たLv」を覚えておき、育ったときに知らせる */
const SEEN_KEY = 'ena_island_friends_seen';

export interface Friend {
  id: string;        // month:cat（島の中での識別。なかよし度は char で持つ）
  month: string;
  monthLabel: string;
  cat: string;
  catLabel: string;
  char: CharKey;
  name: string;
  level: number;     // 1..6（1＝たまご）
  stars: number;
  fill: number;      // 0..1
  levelName: string;
  n: number;         // ⭐完璧の数
  total: number;     // その教科の問題数
}

const clampInt = (v: unknown, lo: number, hi: number) => {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo;
};

export interface FriendsSnapshot {
  currentMonth: string;
  friends: Friend[];
}

export function readFriends(): FriendsSnapshot {
  const raw = readJSON<unknown>(FRIENDS_KEY, null);
  if (!raw || typeof raw !== 'object') return { currentMonth: '', friends: [] };
  const r = raw as { friends?: unknown; currentMonth?: unknown; month?: unknown };
  const list = r.friends;
  // 9月だけだったころの書き出し（month が上に1つだけ）も読めるようにしておく
  const legacyMonth = typeof r.month === 'string' ? r.month : '';
  const currentMonth = typeof r.currentMonth === 'string' ? r.currentMonth : legacyMonth;
  if (!Array.isArray(list)) return { currentMonth, friends: [] };
  const out: Friend[] = [];
  for (const f of list) {
    if (!f || typeof f !== 'object') continue;
    const o = f as Record<string, unknown>;
    const char = o.char as CharKey;
    if (typeof o.cat !== 'string' || !(char in CHAR_NAMES)) continue;   // 知らないキャラは出さない
    const fill = Number(o.fill);
    const month = typeof o.month === 'string' ? o.month : legacyMonth;
    out.push({
      id: `${month}:${o.cat}`,
      month,
      monthLabel: typeof o.monthLabel === 'string' ? o.monthLabel : '',
      cat: o.cat,
      catLabel: typeof o.catLabel === 'string' ? o.catLabel : '',
      char,
      name: typeof o.name === 'string' && o.name ? o.name : CHAR_NAMES[char],
      level: clampInt(o.level, 1, 6),
      stars: clampInt(o.stars, 0, 99),
      fill: Number.isFinite(fill) ? Math.min(1, Math.max(0, fill)) : 0,
      levelName: typeof o.levelName === 'string' ? o.levelName : '',
      n: clampInt(o.n, 0, 99999),
      total: clampInt(o.total, 0, 99999),
    });
  }
  return { currentMonth, friends: out };
}

/** 住人（前の月の子）の中から、その日に島へ あそびに来る子を選ぶ。日付で決まるので1日同じ顔ぶれ */
export function visitorsFor(residents: Friend[], count: number, day: string): Friend[] {
  if (residents.length <= count) return residents;
  let h = 0;
  for (const ch of day) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const scored = residents.map((f) => {
    let x = h;
    for (const ch of f.id) x = (x * 33 + ch.charCodeAt(0)) >>> 0;
    x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0;
    return { f, x };
  });
  return scored.sort((a, b) => a.x - b.x).slice(0, count).map((s) => s.f);
}

export function isFriendsKey(key: string | null): boolean {
  return key === FRIENDS_KEY;
}

export function readSeenLevels(): Record<string, number> {
  const raw = readJSON<unknown>(SEEN_KEY, {});
  return raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, number>) : {};
}

export function writeSeenLevels(seen: Record<string, number>): void {
  writeJSON(SEEN_KEY, seen);
}
