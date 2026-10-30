import type { SuisanFish } from '../types';

// モクタの ぎょこうづくり：養殖（いけす）と 栽培（放流）の あそび。
// せいちょう g は 0〜100。時間がたつと そだち、えさで はやく そだつ。メダルは つかわない・ふやさない。

export interface Species {
  id: string; name: string; emoji: string;
  seed: number;        // 稚魚の ねだん（万円）
  sell: number;        // 大きくして うる ねだん（万円）
  place: string;       // 有名な 養殖地（suisan.html のとおり）
  release: boolean;    // 栽培漁業で 放流できるか
}

export const SPECIES: Species[] = [
  { id: 'kingyo', name: 'きんぎょ', emoji: '🐠', seed: 1, sell: 5,  place: '奈良県の 大和郡山', release: false },
  { id: 'kaki',   name: 'かき',     emoji: '🦪', seed: 2, sell: 8,  place: '広島県',           release: false },
  { id: 'hotate', name: 'ほたて',   emoji: '🐚', seed: 2, sell: 8,  place: '青森県・北海道',   release: true },
  { id: 'tai',    name: 'まだい',   emoji: '🐟', seed: 3, sell: 14, place: '愛媛県',           release: true },
];
export const SP_BY_ID: Record<string, Species> = Object.fromEntries(SPECIES.map((s) => [s.id, s]));

export const POND_MAX = 4;
export const SEA_MAX = 3;
export const MS_PER_PT = 4000;      // 1 ぶん そだつのに かかる時間（ほうっておいても 約6分で 大きくなる）
export const FEED_GAIN = 25;        // えさ1回で そだつ ぶん
export const FEED_COST = 1;         // えさ代（万円）
export const FEED_COOLDOWN = 5000;
export const SICK_DIE_MS = 90000;   // 赤潮を はらわないと 90秒で だめになる（あそんでいる間だけ）
export const SEA_MS = 240000;       // 放流してから もどってくるまで

/** いまの せいちょう（赤潮の間は とまる） */
export function gNow(f: SuisanFish, now: number): number {
  if (f.sick) return Math.min(100, f.g);
  return Math.min(100, f.g + Math.max(0, now - f.t) / MS_PER_PT);
}

/** そだち具合を 絵と ことばで */
export function growthLook(g: number): { emoji: (sp: Species) => string; label: string; size: number } {
  const size = 20 + Math.round(g * 0.26);
  if (g < 8) return { emoji: () => '🥚', label: 'たまご', size };
  if (g < 40) return { emoji: (sp) => sp.emoji, label: '稚魚', size };
  if (g < 100) return { emoji: (sp) => sp.emoji, label: 'そだちざかり', size };
  return { emoji: (sp) => sp.emoji, label: '大きくなった！', size };
}

/** 放流して もどってきた ときの 水あげ（えさ代が かからない かわりに すこし 少ない） */
export const seaValue = (sp: Species): number => Math.max(2, sp.sell - 2);

// ─────────── さかなすくい ───────────
export interface ScoopKind { id: string; name: string; emoji: string; pts: number; size: number; speed: number; weight: number; hue?: number }
export const SCOOP_KINDS: ScoopKind[] = [
  { id: 'iwashi', name: 'いわし',   emoji: '🐟', pts: 1,  size: 26, speed: 34, weight: 5 },
  { id: 'ebi',    name: 'えび',     emoji: '🦐', pts: 2,  size: 28, speed: 26, weight: 3 },
  { id: 'tai',    name: 'たい',     emoji: '🐠', pts: 3,  size: 36, speed: 22, weight: 3 },
  { id: 'maguro', name: 'まぐろ',   emoji: '🐟', pts: 6,  size: 56, speed: 50, weight: 1, hue: 200 },
  { id: 'chigyo', name: '稚魚',     emoji: '🐟', pts: -2, size: 17, speed: 18, weight: 2.4 },
];
export const SCOOP_SEC = 30;
export const SCOOP_GOLD = 40;

export function pickScoopKind(r: number): ScoopKind {
  const total = SCOOP_KINDS.reduce((a, k) => a + k.weight, 0);
  let x = r * total;
  for (const k of SCOOP_KINDS) { x -= k.weight; if (x <= 0) return k; }
  return SCOOP_KINDS[0];
}
