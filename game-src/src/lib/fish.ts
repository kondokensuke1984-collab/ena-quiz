// つり：さかなの表と、なにが かかるかの くじ。メダルは出さない（ずかんと ごほうびの家具だけ）。

import type { TimeOfDay, Weather } from './sky';

export interface Fish {
  id: string;
  name: string;
  emoji: string;
  rare: 1 | 2 | 3;       // ★の数。多いほど でにくい・タイミングが むずかしい
  min: number;           // 大きさ cm
  max: number;
  when?: 'night' | 'rain';
  season?: number;       // この月だけ
  hint: string;          // ずかんで まだ つれていないときの ヒント
}

export const FISH: Fish[] = [
  { id: 'aji',    name: 'あじ',           emoji: '🐟', rare: 1, min: 15, max: 35,  hint: 'いつでも つれるよ' },
  { id: 'kani',   name: 'かに',           emoji: '🦀', rare: 1, min: 5,  max: 20,  hint: 'いつでも つれるよ' },
  { id: 'ebi',    name: 'えび',           emoji: '🦐', rare: 1, min: 5,  max: 25,  hint: 'いつでも つれるよ' },
  { id: 'kai',    name: 'かいがら',       emoji: '🐚', rare: 1, min: 3,  max: 12,  hint: 'いつでも つれるよ' },
  { id: 'boot',   name: 'ながぐつ',       emoji: '👢', rare: 1, min: 20, max: 30,  hint: 'さかな…じゃないかも？' },
  { id: 'nemo',   name: 'クマノミ',       emoji: '🐠', rare: 2, min: 6,  max: 12,  hint: 'いつでも つれるよ' },
  { id: 'fugu',   name: 'ふぐ',           emoji: '🐡', rare: 2, min: 15, max: 40,  hint: 'いつでも つれるよ' },
  { id: 'tako',   name: 'たこ',           emoji: '🐙', rare: 2, min: 30, max: 90,  hint: 'いつでも つれるよ' },
  { id: 'ika',    name: 'いか',           emoji: '🦑', rare: 2, min: 20, max: 50,  when: 'night', hint: 'よるに つれるよ' },
  { id: 'anko',   name: 'ちょうちんあんこう', emoji: '🏮', rare: 3, min: 20, max: 60, when: 'night', hint: 'よるの ふかい うみに いるよ' },
  { id: 'namazu', name: 'なまず',         emoji: '🐟', rare: 2, min: 30, max: 80,  when: 'rain', hint: 'あめの日に つれるよ' },
  { id: 'sanma',  name: 'さんま',         emoji: '🐟', rare: 2, min: 25, max: 35,  season: 10, hint: '10月だけ つれるよ' },
  { id: 'sake',   name: 'さけ',           emoji: '🐟', rare: 2, min: 50, max: 90,  season: 11, hint: '11月だけ つれるよ' },
  { id: 'kame',   name: 'うみがめ',       emoji: '🐢', rare: 3, min: 50, max: 120, hint: 'めったに あえないよ' },
  { id: 'iruka',  name: 'いるか',         emoji: '🐬', rare: 3, min: 150, max: 300, hint: 'めったに あえないよ' },
  { id: 'same',   name: 'さめ',           emoji: '🦈', rare: 3, min: 100, max: 400, hint: 'めったに あえないよ' },
];
export const FISH_BY_ID: Record<string, Fish> = Object.fromEntries(FISH.map((f) => [f.id, f]));

/** 1日に つれる数。その日 クイズを5もん やっていたら ふえる */
export const FISH_PER_DAY = 3;
export const FISH_STUDY_BONUS = 2;

/** ずかんの ごほうび（つった しゅるいの数） */
export const FISH_REWARDS: { kinds: number; item: string }[] = [
  { kinds: 5, item: 'fn_fishsign' },
  { kinds: 10, item: 'fn_aquarium' },
];

const WEIGHT = { 1: 10, 2: 4, 3: 1.2 } as const;

export interface FishCtx { tod: TimeOfDay; weather: Weather; month: number }

/** いま つれる さかな */
export function catchable(ctx: FishCtx): Fish[] {
  return FISH.filter((f) =>
    (!f.season || f.season === ctx.month) &&
    (f.when !== 'night' || ctx.tod === 'night') &&
    (f.when !== 'rain' || ctx.weather === 'rain'));
}

/** なにが かかるか。限定の さかなは 出やすくして「いまだけ」を 楽しめるようにする */
export function rollFish(ctx: FishCtx, rnd = Math.random): { fish: Fish; cm: number } {
  const list = catchable(ctx);
  const w = list.map((f) => WEIGHT[f.rare] * (f.when || f.season ? 2 : 1));
  let r = rnd() * w.reduce((a, b) => a + b, 0);
  let fish = list[list.length - 1];
  for (let i = 0; i < list.length; i++) {
    r -= w[i];
    if (r <= 0) { fish = list[i]; break; }
  }
  const cm = Math.round(fish.min + (fish.max - fish.min) * rnd());
  return { fish, cm };
}

/** タイミングの あたり はば（0..1）。★が多いほど せまい */
export function zoneWidth(f: Fish): number {
  return f.rare === 1 ? 0.3 : f.rare === 2 ? 0.22 : 0.15;
}
