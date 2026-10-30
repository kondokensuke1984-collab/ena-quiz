import { ZONE_ORDER, firstZone, type Port } from './suisanPorts';
// モクタの ぎょこうづくり：しゅっこう（船で 海を はしって、海域ごとに 漁を する）。
// 教材（suisan.html）のとおり：沿岸＝領海12海里の中・日帰り／沖合＝経済水域200海里の中・数日／遠洋＝公海や外国の海・数か月。
// 船が 大きいほど 遠くへ 行けて、つめる 量（積み荷）も 多い。ステージを クリアすると 船が 大きくなる。
// メダルは つかわない・ふやさない。水あげ（万円）だけ ふやす。

export interface Zone {
  id: 'near' | 'eez' | 'high';
  name: string;        // 海域の名前
  gyogyo: string;      // 漁業の名前
  trip: string;        // 日帰り／数日／数か月
  x0: number; x1: number;   // 世界の 左右の はんい
  fill: string;
  needs: string | null;     // これを クリアすると 出られる ステージID
  boat: string;
  hint: string;        // まだ 出られない ときの ひとこと
  tip: string;         // つり上げた ときの まなび
  window: number;      // 「いま！」の あたり はば（0〜1）。小さいほど むずかしい
}

export const WORLD_W = 1160;
export const WORLD_H = 270;
export const PORT_X = 104;          // これより 左が 陸と 漁港

export const ZONES: Zone[] = [
  {
    id: 'near', name: '領海（12海里まで）', gyogyo: '沿岸漁業', trip: '日帰り', x0: PORT_X, x1: 420, fill: '#7dd3fc', needs: null, boat: '🚤',
    hint: '', tip: '沿岸漁業は 領海（12海里）の中で 日帰り。小さな船だから 水あげは 少ないよ。', window: 0.34,
  },
  {
    id: 'eez', name: '（排他的）経済水域（200海里まで）', gyogyo: '沖合漁業', trip: '数日', x0: 420, x1: 780, fill: '#38bdf8', needs: 'oki', boat: '🚢',
    hint: 'ステージ「沖合漁業」を クリアすると 中型船に なって 出られるよ',
    tip: '沖合漁業は 経済水域（200海里）の中で 数日。中型船で たくさん つめるよ。', window: 0.27,
  },
  {
    id: 'high', name: '公海（どの国の船も 自由）', gyogyo: '遠洋漁業', trip: '数か月', x0: 780, x1: WORLD_W, fill: '#0ea5e9', needs: 'enyo', boat: '🛳️',
    hint: 'ステージ「遠洋漁業」を クリアすると 大型船に なって 出られるよ',
    tip: '遠洋漁業は 公海や 外国の 経済水域へ 数か月。大型船で まぐろ・かつおを とるよ。', window: 0.21,
  },
];

export interface BoatSpec { emoji: string; name: string; cap: number; speed: number }
/** クリアした ステージで 船が 大きくなる */
export function boatFor(cleared: string[]): BoatSpec {
  if (cleared.includes('enyo')) return { emoji: '🛳️', name: '大型船', cap: 12, speed: 70 };
  if (cleared.includes('oki')) return { emoji: '🚢', name: '中型船', cap: 8, speed: 82 };
  return { emoji: '🚤', name: '小型船', cap: 4, speed: 96 };
}

export const zoneAt = (x: number): Zone => ZONES.find((z) => x < z.x1) ?? ZONES[ZONES.length - 1];
export const zoneOpen = (z: Zone, cleared: string[], all: boolean): boolean => all || !z.needs || cleared.includes(z.needs);

export interface Spot { id: number; x: number; y: number; left: number; zone: Zone['id'] }
export const SPOT_FISH = 3;      // 1つの 漁場で つれる 回数（とりすぎない まなび）
export const SPOT_RADIUS = 30;   // この はんいに 入ると 漁が できる

/** しゅっこうの たびに 漁場（あわの ところ）を ならべなおす。その港で 魚が とれる 海域にだけ 置く */
export function makeSpots(port: Port): Spot[] {
  const per: Record<Zone['id'], number> = { near: 4, eez: 4, high: 3 };
  const out: Spot[] = [];
  let id = 1;
  for (const z of ZONES) {
    if (!port.fish.some((f) => f.zone === z.id)) continue;
    const n = per[z.id];
    const span = z.x1 - z.x0 - 70;
    for (let i = 0; i < n; i++) {
      out.push({
        id: id++, zone: z.id, left: SPOT_FISH,
        x: z.x0 + 45 + (span * (i + 0.15 + Math.random() * 0.7)) / n,
        y: 52 + Math.random() * (WORLD_H - 110),
      });
    }
  }
  return out;
}

/** その港まで 船が 行けるか（魚が とれる いちばん 近い 海域まで、ぜんぶ 出られる ひつよう） */
export function portOpen(port: Port, cleared: string[], all: boolean): boolean {
  const idx = ZONE_ORDER.indexOf(firstZone(port));
  return ZONES.slice(0, idx + 1).every((z) => zoneOpen(z, cleared, all));
}
/** 出られない ときの ひとこと（どの ステージを クリアするか） */
export function portLockHint(port: Port, cleared: string[], all: boolean): string {
  const idx = ZONE_ORDER.indexOf(firstZone(port));
  const z = ZONES.slice(0, idx + 1).find((q) => !zoneOpen(q, cleared, all));
  return z ? z.hint : '';
}
