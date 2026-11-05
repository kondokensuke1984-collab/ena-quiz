// 毎日の「おねがい」ボード：その日の おねがいを 3つ。ぜんぶ かなえると プレゼント。
// 進み具合は、ほかの あそびが すでに つけている「その日の きろく」から 数える（新しく もつのは「もらったか」だけ）。
// メダルは ふやさない（アイテムだけ）。

import type { SaveV1 } from '../types';

export interface Wish {
  id: string;
  emoji: string;
  text: string;
  need: number;
  /** その日の 進み具合（need で 打ち止めに しない。かんじょうは 画面側で） */
  have(s: SaveV1, day: string): number;
  /** 今の 島で できるか（たてものが ない あそびは ださない） */
  avail(s: SaveV1): boolean;
}

export const WISHES: Wish[] = [
  {
    id: 'fish', emoji: '🎣', text: 'さかなを 2ひき つろう', need: 2,
    have: (s, d) => (s.fish.day === d ? s.fish.today : 0),
    avail: (s) => s.buildings.includes('bd_pier'),
  },
  {
    id: 'imo', emoji: '🍠', text: 'やきいもを 1こ うろう', need: 1,
    have: (s, d) => (s.imo.day === d ? s.imo.served : 0),
    avail: (s) => s.buildings.includes('bd_imo') && s.buildings.includes('bd_bridge'),
  },
  {
    id: 'arbor', emoji: '🍁', text: 'あずまやで 2かい あそぼう', need: 2,
    have: (s, d) => (s.arbor.day === d ? s.arbor.gathered + (s.arbor.rested ? 1 : 0) + (s.arbor.tea ? 1 : 0) + s.arbor.talked : 0),
    avail: (s) => s.buildings.includes('bd_arbor') && s.buildings.includes('bd_bridge'),
  },
  {
    id: 'water', emoji: '🌱', text: 'はたけに みずを あげよう', need: 1,
    have: (s, d) => s.farm.plots.filter((p) => p && p.watered === d).length,
    avail: (s) => s.farm.plots.some((p) => !!p),
  },
  {
    id: 'chat', emoji: '💬', text: 'なかまと 2にん おはなししよう', need: 2,
    have: (s, d) => (s.talk.day === d ? s.talk.talked.length : 0),
    avail: () => true,
  },
  {
    id: 'pet', emoji: '🤚', text: 'ペットを 2かい なでよう', need: 2,
    have: (s, d) => (s.monster.petDay === d ? s.monster.pats ?? 0 : 0),
    avail: (s) => !!s.monster.charKey,
  },
];

/** 日付から きまる ならびかえ（同じ日は 同じ じゅん） */
function seeded(day: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < day.length; i++) { h ^= day.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
}

/** きょうの おねがい（できる あそびの なかから 最大3つ） */
export function todaysWishes(s: SaveV1, day: string): Wish[] {
  const list = WISHES.filter((w) => w.avail(s));
  const rnd = seeded(day);
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, 3);
}

export function wishDone(s: SaveV1, day: string, w: Wish): boolean {
  return w.have(s, day) >= w.need;
}

/** ぜんぶ かなったか（おねがいが 1つも ないときは false） */
export function allDone(s: SaveV1, day: string): boolean {
  const ws = todaysWishes(s, day);
  return ws.length > 0 && ws.every((w) => wishDone(s, day, w));
}

/** 何日つづけて ぜんぶ かなえると おまけが もう1つ もらえるか */
export const STREAK_BONUS_EVERY = 3;
